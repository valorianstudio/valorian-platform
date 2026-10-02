import { Global, Module, OnModuleInit } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { ensureRbac } from '../rbac/bootstrap';
import { SecuritySettingsService } from '../rbac/security-settings.service';
import { RolesController } from '../roles/roles.controller';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { AuditController } from './audit.controller';
import { AuditInterceptor } from './audit.interceptor';
import { AuditService } from './audit.service';
import { SecurityController } from './security.controller';

/** RBAC, audit log and security settings. Global so any module can log or read security policy. */
@Global()
@Module({
  imports: [AuthModule],
  controllers: [AuditController, SecurityController, UsersController, RolesController],
  providers: [SecuritySettingsService, AuditService, UsersService, { provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
  exports: [SecuritySettingsService, AuditService],
})
export class SecurityModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  /** Makes upgrades safe: permissions and roles exist and legacy admins keep Super Admin access, even before seeding. */
  async onModuleInit(): Promise<void> {
    await ensureRbac(this.prisma);
  }
}
