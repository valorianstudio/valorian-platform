import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SeoController } from '../seo/seo.controller';
import { AdminArticlesController } from './admin-articles.controller';
import { AdminCaseStudiesController } from './admin-case-studies.controller';
import { PublicEditorialController } from './public-editorial.controller';

@Module({
  imports: [AuthModule],
  controllers: [AdminCaseStudiesController, AdminArticlesController, PublicEditorialController, SeoController],
})
export class ContentModule {}
