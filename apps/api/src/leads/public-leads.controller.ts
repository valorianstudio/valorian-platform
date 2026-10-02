import { Body, Controller, Get, Header, HttpCode, Post } from '@nestjs/common';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { AnalyticsService } from '../analytics/analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { publicInquirySchema, publicLeadSchema } from './lead-schemas';
import type { PublicInquiryInput, PublicLeadInput } from './lead-schemas';
import { LeadsService } from './leads.service';

@Controller()
export class PublicLeadsController {
  constructor(
    private readonly leads: LeadsService,
    private readonly prisma: PrismaService,
    private readonly analytics: AnalyticsService,
  ) {}

  @Get('leads/config')
  @Header('Cache-Control', 'public, max-age=60')
  async config() {
    const settings = await this.leads.getSettings();
    return { responseNote: settings.responseNote };
  }

  @Post('leads')
  @HttpCode(201)
  async createLead(@Body(new ZodBodyPipe(publicLeadSchema)) body: PublicLeadInput) {
    // Honeypot: bots fill hidden fields. Pretend success without storing anything.
    if (body.website) return { reference: 'VAL-0000-0000' };
    return this.leads.createFromPublic(body);
  }

  @Post('inquiries')
  @HttpCode(201)
  async createInquiry(@Body(new ZodBodyPipe(publicInquirySchema)) body: PublicInquiryInput) {
    if (body.website) return { ok: true };
    const duplicate = await this.prisma.contactInquiry.findFirst({
      where: { email: body.email, message: body.message, createdAt: { gt: new Date(Date.now() - 10 * 60_000) } },
      select: { id: true },
    });
    if (!duplicate) {
      await this.prisma.contactInquiry.create({
        data: {
          type: body.type,
          name: body.name,
          email: body.email,
          phone: body.phone ?? body.whatsapp,
          companyName: body.companyName,
          country: body.country,
          message: body.message,
          preferredContact: body.preferredContact,
          sourceUrl: body.sourceUrl,
        },
      });
    }
    if (!duplicate) void this.analytics.record({ type: 'CONTACT_FORM_SUBMIT', sessionId: body.sessionId, path: body.sourceUrl, metadata: { cta: body.type.toLowerCase() } });
    return { ok: true };
  }
}
