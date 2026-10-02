import { Body, Controller, Get, NotFoundException, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { inquiryUpdateSchema } from './lead-schemas';

@Controller('admin/inquiries')
@UseGuards(JwtAuthGuard)
export class AdminInquiriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @RequirePermission('inquiries.view')
  async list(@Query('archived') archived?: string) {
    const [items, unread] = await Promise.all([
      this.prisma.contactInquiry.findMany({ where: { archivedAt: archived === '1' ? { not: null } : null }, orderBy: { createdAt: 'desc' }, take: 500 }),
      this.prisma.contactInquiry.count({ where: { archivedAt: null, isRead: false } }),
    ]);
    return { items, unread };
  }

  @Patch(':id')
  @RequirePermission('inquiries.manage')
  async update(@Param('id') id: string, @Body(new ZodBodyPipe(inquiryUpdateSchema)) body: ReturnType<typeof inquiryUpdateSchema.parse>) {
    const { archived, ...data } = body;
    try {
      return await this.prisma.contactInquiry.update({
        where: { id },
        data: { ...data, ...(archived === undefined ? {} : { archivedAt: archived ? new Date() : null }) },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new NotFoundException('Inquiry not found.');
      throw error;
    }
  }
}
