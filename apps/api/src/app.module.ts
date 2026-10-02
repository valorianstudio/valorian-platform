import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';

@Module({
  imports: [PrismaModule, AdminUsersModule, AuthModule, SiteSettingsModule],
  controllers: [HealthController],
})
export class AppModule {}
