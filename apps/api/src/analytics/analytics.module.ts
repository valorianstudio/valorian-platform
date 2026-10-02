import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsReportService } from './analytics-report.service';
import { AnalyticsService } from './analytics.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsReportService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
