import { Body, Controller, Get, Header, Put, UseGuards } from '@nestjs/common';
import { SiteSetting } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';

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
}
