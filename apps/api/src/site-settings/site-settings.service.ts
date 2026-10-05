import { Injectable } from "@nestjs/common";
import { SiteSetting } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateSiteSettingsDto } from "./dto/update-site-settings.dto";

const SETTINGS_ID = "site";

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<SiteSetting> {
    return this.prisma.siteSetting.upsert({
      where: { id: SETTINGS_ID },
      update: {},
      create: {
        id: SETTINGS_ID,
        brandName: "Valorian",
        companyName: "Valorian Studio",
        tagline: "Software Engineering & Digital Product Studio",
        description:
          "We design and engineer custom software, web applications, SaaS platforms, mobile apps and AI-powered solutions.",
        primaryEmail: "hello@valorianstudio.com",
      },
    });
  }

  async update(dto: UpdateSiteSettingsDto): Promise<SiteSetting> {
    await this.get();
    return this.prisma.siteSetting.update({
      where: { id: SETTINGS_ID },
      data: dto,
    });
  }

  async updateFooter(copyrightText: string | null): Promise<SiteSetting> {
    await this.get();
    return this.prisma.siteSetting.update({
      where: { id: SETTINGS_ID },
      data: { copyrightText },
    });
  }
}
