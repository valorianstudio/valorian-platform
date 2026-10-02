import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminInquiriesController } from './admin-inquiries.controller';
import { AdminLeadsController } from './admin-leads.controller';
import { LeadsService } from './leads.service';
import { PublicLeadsController } from './public-leads.controller';

@Module({
  imports: [AuthModule],
  controllers: [PublicLeadsController, AdminLeadsController, AdminInquiriesController],
  providers: [LeadsService],
})
export class LeadsModule {}
