import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { isProduction } from '../config/env';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AllowWhilePasswordPending, AnyAdmin } from './permissions.decorator';
import { SESSION_COOKIE } from './session.constants';

class TwoFactorLoginDto {
  @IsString() @IsNotEmpty() @MaxLength(600) challenge: string;
  @IsString() @IsNotEmpty() @MaxLength(32) code: string;
}
class CodeDto {
  @IsString() @IsNotEmpty() @MaxLength(32) code: string;
}
class DisableTwoFactorDto {
  @IsString() @IsNotEmpty() @MaxLength(128) password: string;
  @IsString() @IsNotEmpty() @MaxLength(32) code: string;
}

/** What the browser may know about the signed-in admin. */
export function publicProfile({ tokenVersion: _tokenVersion, ...profile }: AdminProfile) {
  return profile;
}

const meta = (request: FastifyRequest) => ({ ip: request.ip, userAgent: request.headers['user-agent'] });

export function setSessionCookie(reply: FastifyReply, token: string, maxAgeSeconds: number): void {
  void reply.setCookie(SESSION_COOKIE, token, { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/', maxAge: maxAgeSeconds });
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const result = await this.auth.login(dto, meta(request));
    if (result.kind === 'two-factor') return { requiresTwoFactor: true, challenge: result.challenge };
    setSessionCookie(reply, result.token, result.maxAgeSeconds);
    return publicProfile(result.user);
  }

  @Post('login/2fa')
  @HttpCode(200)
  async loginWithCode(@Body() dto: TwoFactorLoginDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const result = await this.auth.loginWithCode(dto.challenge, dto.code, meta(request));
    if (result.kind !== 'session') return { requiresTwoFactor: true };
    setSessionCookie(reply, result.token, result.maxAgeSeconds);
    return publicProfile(result.user);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    await this.auth.logout((request as FastifyRequest & { cookies: Record<string, string | undefined> }).cookies[SESSION_COOKIE], meta(request));
    void reply.clearCookie(SESSION_COOKIE, { path: '/' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @AnyAdmin()
  @AllowWhilePasswordPending()
  me(@CurrentUser() user: AdminProfile) {
    return publicProfile(user);
  }

  @Post('2fa/setup')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @AnyAdmin()
  setup(@CurrentUser() user: AdminProfile) {
    return this.auth.startTwoFactorSetup(user.id);
  }

  @Post('2fa/enable')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @AnyAdmin()
  enable(@CurrentUser() user: AdminProfile, @Body() dto: CodeDto, @Req() request: FastifyRequest) {
    return this.auth.enableTwoFactor(user.id, dto.code, meta(request));
  }

  @Post('2fa/disable')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @AnyAdmin()
  async disable(@CurrentUser() user: AdminProfile, @Body() dto: DisableTwoFactorDto, @Req() request: FastifyRequest): Promise<void> {
    await this.auth.disableTwoFactor(user.id, dto.password, dto.code, meta(request));
  }
}
