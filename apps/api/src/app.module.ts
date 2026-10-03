import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { SecurityModule } from './audit/security.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ContentModule } from './content/content.module';
import { LeadsModule } from './leads/leads.module';
import { EstimatorModule } from './estimator/estimator.module';
import { DemosModule } from './demos/demos.module';
import { StorageModule } from './storage/storage.module';
import { CmsModule } from './cms/cms.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { HealthController } from './health/health.controller';
import { MailModule } from './mail/mail.module';
import { PortalModule } from './portal/portal.module';
import { PrismaModule } from './prisma/prisma.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';

@Module({
  imports: [PrismaModule, AdminUsersModule, AuthModule, SiteSettingsModule, CmsModule, StorageModule, DemosModule, EstimatorModule, LeadsModule, ContentModule, AnalyticsModule, SecurityModule, PortalModule, MailModule],
  controllers: [AppController, HealthController],
})
export class AppModule {}
