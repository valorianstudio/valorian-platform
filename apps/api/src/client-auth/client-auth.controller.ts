import { Body, Controller, Get, HttpCode, Patch, Post, Res, UseGuards } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { isProduction } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';
import { CLIENT_COOKIE, CLIENT_SESSION_SECONDS, ClientAuthService, ClientPrincipal } from './client-auth.service';
import { AllowClientPasswordPending, ClientGuard, CurrentClient } from './client.guard';

const loginSchema = z.object({ email: z.string().trim().toLowerCase().email().max(160), password: z.string().min(1).max(128) });
const passwordSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: z.string().min(1).max(128) });
const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(30).nullable().optional(),
  company: z
    .object({
      contactPhone: z.string().trim().max(30).nullable().optional(),
      website: z.string().trim().max(200).refine((v) => v === '' || /^https?:\/\//i.test(v), 'must start with http:// or https://').nullable().optional(),
      industry: z.string().trim().max(80).nullable().optional(),
    })
    .optional(),
});
const forgotSchema = z.object({ email: z.string().trim().max(160) });

const publicClient = ({ tokenVersion: _tv, ...client }: ClientPrincipal) => client;

function setCookie(reply: FastifyReply, token: string): void {
  void reply.setCookie(CLIENT_COOKIE, token, { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/', maxAge: CLIENT_SESSION_SECONDS });
}

@Controller('client-auth')
export class ClientAuthController {
  constructor(
    private readonly auth: ClientAuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body(new ZodBodyPipe(loginSchema)) body: z.infer<typeof loginSchema>, @Res({ passthrough: true }) reply: FastifyReply) {
    const { token, principal } = await this.auth.login(body.email, body.password);
    setCookie(reply, token);
    return publicClient(principal);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) reply: FastifyReply): void {
    void reply.clearCookie(CLIENT_COOKIE, { path: '/' });
  }

  /** Placeholder until email delivery exists: always answers the same way so accounts cannot be probed. */
  @Post('forgot-password')
  @HttpCode(202)
  forgot(@Body(new ZodBodyPipe(forgotSchema)) _body: z.infer<typeof forgotSchema>) {
    return { message: 'If an account exists for that email, your Valorian contact will help you regain access.' };
  }

  @Get('me')
  @UseGuards(ClientGuard)
  @AllowClientPasswordPending()
  async me(@CurrentClient() client: ClientPrincipal) {
    const org = await this.prisma.clientOrganization.findUnique({ where: { id: client.organizationId }, select: { companyName: true, industry: true, website: true, contactEmail: true, contactPhone: true, logo: true } });
    return { ...publicClient(client), company: org };
  }

  @Post('password')
  @HttpCode(200)
  @UseGuards(ClientGuard)
  @AllowClientPasswordPending()
  async password(@CurrentClient() client: ClientPrincipal, @Body(new ZodBodyPipe(passwordSchema)) body: z.infer<typeof passwordSchema>, @Res({ passthrough: true }) reply: FastifyReply) {
    setCookie(reply, await this.auth.changePassword(client, body.currentPassword, body.newPassword));
    return { ok: true };
  }

  /** Clients may edit their own contact details and (as owner) basic company details. Nothing else. */
  @Patch('profile')
  @UseGuards(ClientGuard)
  async profile(@CurrentClient() client: ClientPrincipal, @Body(new ZodBodyPipe(profileSchema)) body: z.infer<typeof profileSchema>) {
    await this.prisma.clientUser.update({ where: { id: client.id }, data: { name: body.name, phone: body.phone || null } });
    if (body.company && client.role === 'OWNER') {
      const { contactPhone, website, industry } = body.company;
      await this.prisma.clientOrganization.update({
        where: { id: client.organizationId },
        data: { ...(contactPhone !== undefined ? { contactPhone: contactPhone || null } : {}), ...(website !== undefined ? { website: website || null } : {}), ...(industry !== undefined ? { industry: industry || null } : {}) },
      });
    }
    return { ok: true };
  }
}
