import { Body, Controller, HttpCode, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { ChangePasswordDto, UpdateProfileDto } from '../admin-users/dto/profile.dto';
import { AuditService } from '../audit/audit.service';
import { AuthService } from './auth.service';
import { publicProfile, setSessionCookie } from './auth.controller';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AllowWhilePasswordPending, AnyAdmin } from './permissions.decorator';

@Controller('admin/profile')
@UseGuards(JwtAuthGuard)
export class AdminProfileController {
  constructor(
    private readonly users: AdminUsersService,
    private readonly auth: AuthService,
    private readonly audit: AuditService,
  ) {}

  @Patch()
  @AnyAdmin()
  async update(@CurrentUser() user: AdminProfile, @Body() dto: UpdateProfileDto, @Req() request: FastifyRequest) {
    const updated = await this.users.updateProfile(user.id, dto);
    const changed = [user.name !== dto.name && 'name', user.email !== dto.email && 'email'].filter(Boolean);
    if (changed.length > 0) {
      await this.audit.log({
        actor: { id: user.id, name: updated.name, email: updated.email },
        action: 'UPDATE',
        module: 'users',
        entityType: 'AdminUser',
        entityId: user.id,
        entityLabel: updated.email,
        summary: `Updated own profile (${changed.join(', ')})`,
        changes: { ...(user.name !== dto.name ? { name: { before: user.name, after: dto.name } } : {}), ...(user.email !== dto.email ? { email: { before: user.email, after: dto.email } } : {}) },
        meta: { ip: request.ip, userAgent: request.headers['user-agent'] },
      });
    }
    return publicProfile(updated);
  }

  @Post('password')
  @HttpCode(204)
  @AnyAdmin()
  @AllowWhilePasswordPending()
  async changePassword(@CurrentUser() user: AdminProfile, @Body() dto: ChangePasswordDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    const { tokenVersion } = await this.users.changePassword(user.id, dto);
    // Other sessions are now invalid; keep this one signed in with a fresh token.
    const { token, maxAgeSeconds } = await this.auth.signSession(user.id, tokenVersion);
    setSessionCookie(reply, token, maxAgeSeconds);
    await this.audit.log({
      actor: { id: user.id, name: user.name, email: user.email },
      action: 'PASSWORD_CHANGE',
      module: 'users',
      entityType: 'AdminUser',
      entityId: user.id,
      entityLabel: user.email,
      summary: 'Changed own password',
      meta: { ip: request.ip, userAgent: request.headers['user-agent'] },
    });
  }
}
