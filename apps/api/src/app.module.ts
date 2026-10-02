import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { DemosModule } from './demos/demos.module';
import { StorageModule } from './storage/storage.module';
import { CmsModule } from './cms/cms.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';

@Module({
  imports: [PrismaModule, AdminUsersModule, AuthModule, SiteSettingsModule, CmsModule, StorageModule, DemosModule],
  controllers: [HealthController],
})
export class AppModule {}
