import { Body, Controller, Get, Header, HttpCode, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { PublicCacheInterceptor } from '../common/public-cache.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { calculateSchema, estimatorSettingsSchema } from './estimator-schemas';
import type { CalculateInput } from './estimator-schemas';
import { EstimatorService } from './estimator.service';

@Controller()
export class EstimatorController {
  constructor(
    private readonly estimator: EstimatorService,
    private readonly prisma: PrismaService,
  ) {}

  @UseInterceptors(PublicCacheInterceptor)
  @Get('estimator/config')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=120')
  config(@Query() query: { demo?: string; type?: string; industry?: string }) {
    return this.estimator.config({ demo: query.demo?.slice(0, 80), type: query.type?.slice(0, 80), industry: query.industry?.slice(0, 80) });
  }

  @Post('estimator/calculate')
  @HttpCode(200)
  calculate(@Body(new ZodBodyPipe(calculateSchema)) body: CalculateInput) {
    return this.estimator.calculate(body);
  }

  @Get('admin/estimator/settings')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('estimator.view')
  @Header('Cache-Control', 'no-store')
  settings() {
    return this.estimator.getSettings();
  }

  @Put('admin/estimator/settings')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('pricing.manage')
  async updateSettings(@Body(new ZodBodyPipe(estimatorSettingsSchema)) body: ReturnType<typeof estimatorSettingsSchema.parse>) {
    await this.estimator.getSettings();
    return this.prisma.estimatorSettings.update({ where: { id: 'estimator' }, data: body });
  }
}
