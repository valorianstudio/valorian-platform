import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminCmsController } from './admin-cms.controller';
import { AdminPagesController } from './admin-pages.controller';
import { PublicContentController } from './public-content.controller';

@Module({
  imports: [AuthModule],
  controllers: [AdminCmsController, AdminPagesController, PublicContentController],
})
export class CmsModule {}
