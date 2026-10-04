import { Body, Controller, Get, Header, HttpCode, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { PublicCacheInterceptor } from '../common/public-cache.interceptor';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequireAnyPermission, RequirePermission } from '../auth/permissions.decorator';
import { SESSION_COOKIE } from '../auth/session.constants';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { analyticsSettingsSchema, collectSchema } from './analytics-schemas';
import type { CollectInput } from './analytics-schemas';
import { AnalyticsReportService } from './analytics-report.service';
import type { RangeQuery } from './analytics-report.service';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly reports: AnalyticsReportService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /* ---------- public ---------- */

  @UseInterceptors(PublicCacheInterceptor)
  @Get('analytics/config')
  @Header('Cache-Control', 'public, max-age=60')
  async config() {
    const settings = await this.analytics.getSettings();
    return { enabled: settings.enabled };
  }

  @Post('analytics/collect')
  @HttpCode(204)
  async collect(@Body(new ZodBodyPipe(collectSchema)) body: CollectInput, @Req() request: FastifyRequest): Promise<void> {
    if (this.analytics.isBot(request.headers['user-agent'])) return;
    const settings = await this.analytics.getSettings();
    if (settings.excludeAdmin && (await this.isAdmin(request))) return;
    await this.analytics.collect(body);
  }

  private async isAdmin(request: FastifyRequest): Promise<boolean> {
    const token = (request as FastifyRequest & { cookies?: Record<string, string | undefined> }).cookies?.[SESSION_COOKIE];
    if (!token) return false;
    try {
      await this.jwt.verifyAsync(token);
      return true;
    } catch {
      return false;
    }
  }

  /* ---------- admin ---------- */

  @Get('admin/analytics/summary')
  @UseGuards(JwtAuthGuard)
  @RequireAnyPermission('analytics.view', 'leads.view', 'dashboard.view')
  summary() {
    return this.reports.summary();
  }

  @Get('admin/analytics/overview')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('analytics.view')
  async overview(@Query() query: RangeQuery) {
    return this.reports.overview(await this.reports.resolveRange(query));
  }

  @Get('admin/analytics/acquisition')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('analytics.view')
  async acquisition(@Query() query: RangeQuery) {
    return this.reports.acquisition(await this.reports.resolveRange(query));
  }

  @Get('admin/analytics/content')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('analytics.view')
  async content(@Query() query: RangeQuery) {
    return this.reports.content(await this.reports.resolveRange(query));
  }

  @Get('admin/analytics/estimator')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('analytics.view')
  async estimator(@Query() query: RangeQuery) {
    return this.reports.estimator(await this.reports.resolveRange(query));
  }

  @Get('admin/analytics/sales')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('analytics.view')
  async sales(@Query() query: RangeQuery) {
    return this.reports.sales(await this.reports.resolveRange(query));
  }

  @Get('admin/analytics/settings')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('analytics.view')
  settings() {
    return this.analytics.getSettings();
  }

  @Put('admin/analytics/settings')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('settings.manage')
  async updateSettings(@Body(new ZodBodyPipe(analyticsSettingsSchema)) body: ReturnType<typeof analyticsSettingsSchema.parse>) {
    await this.analytics.getSettings();
    return this.prisma.analyticsSettings.update({ where: { id: 'analytics' }, data: body });
  }
}
