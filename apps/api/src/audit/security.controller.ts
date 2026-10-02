import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequireSuper } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { SecuritySettingsService } from '../rbac/security-settings.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuditService, diffSnapshots } from './audit.service';

const schema = z.object({
  sessionHours: z.number().int().min(1).max(720),
  minPasswordLength: z.number().int().min(8).max(64),
  maxFailedLogins: z.number().int().min(3).max(20),
  lockoutMinutes: z.number().int().min(1).max(1440),
  auditRetentionDays: z.number().int().min(30).max(3650),
  confirmPassword: z.string().max(128),
});

@Controller('admin/security')
@UseGuards(JwtAuthGuard)
@RequireSuper()
export class SecurityController {
  constructor(
    private readonly settings: SecuritySettingsService,
    private readonly prisma: PrismaService,
    private readonly users: AdminUsersService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  async get() {
    const { id: _id, updatedAt: _updatedAt, ...settings } = await this.settings.get();
    return settings;
  }

  @Put()
  async update(@CurrentUser() actor: AdminProfile, @Body(new ZodBodyPipe(schema)) body: z.infer<typeof schema>, @Req() request: FastifyRequest) {
    const { confirmPassword, ...data } = body;
    if (!(await this.users.verifyPassword(actor.id, confirmPassword))) throw new UnauthorizedException('Confirm your password to change security settings.');
    const { id: _id, updatedAt: _updatedAt, ...before } = await this.settings.get();
    await this.prisma.securitySettings.update({ where: { id: 'security' }, data });
    this.settings.invalidate();
    const changes = diffSnapshots(before, data);
    if (Object.keys(changes).length > 0) {
      await this.audit.log({ actor: { id: actor.id, name: actor.name, email: actor.email }, action: 'SETTINGS_CHANGE', module: 'security', entityType: 'SecuritySettings', entityId: 'security', entityLabel: 'Security settings', summary: `Updated security settings (${Object.keys(changes).join(', ')})`, changes, meta: { ip: request.ip, userAgent: request.headers['user-agent'] } });
    }
    return data;
  }
}
