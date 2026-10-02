import { Body, Controller, Get, Header, Patch, Put, UseGuards } from '@nestjs/common';
import { SiteSetting } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { z } from 'zod';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';

const footerSchema = z.object({
  copyrightText: z
    .string()
    .trim()
    .max(200)
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});

@Controller()
export class SiteSettingsController {
  constructor(private readonly settings: SiteSettingsService) {}

  @Get('settings')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=300')
  getPublic(): Promise<SiteSetting> {
    return this.settings.get();
  }

  @Get('admin/settings')
  @UseGuards(JwtAuthGuard)
  @Header('Cache-Control', 'no-store')
  getAdmin(): Promise<SiteSetting> {
    return this.settings.get();
  }

  @Put('admin/settings')
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateSiteSettingsDto): Promise<SiteSetting> {
    return this.settings.update(dto);
  }

  @Patch('admin/settings/footer')
  @UseGuards(JwtAuthGuard)
  updateFooter(@Body(new ZodBodyPipe(footerSchema)) body: { copyrightText: string | null }): Promise<SiteSetting> {
    return this.settings.updateFooter(body.copyrightText);
  }
}
