import { Body, Controller, Get, Header, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { seoSettingsSchema } from '../content/content-schemas';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class SeoController {
  constructor(private readonly prisma: PrismaService) {}

  private get() {
    return this.prisma.seoSettings.upsert({ where: { id: 'seo' }, update: {}, create: { id: 'seo' } });
  }

  @Get('seo/config')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  async config() {
    const { id: _id, updatedAt: _updatedAt, ...settings } = await this.get();
    return settings;
  }

  @Get('admin/seo')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('seo.view')
  admin() {
    return this.get();
  }

  @Put('admin/seo')
  @UseGuards(JwtAuthGuard)
  @RequirePermission('seo.manage')
  async update(@Body(new ZodBodyPipe(seoSettingsSchema)) body: ReturnType<typeof seoSettingsSchema.parse>) {
    await this.get();
    return this.prisma.seoSettings.update({ where: { id: 'seo' }, data: body });
  }
}
