import { BadRequestException, Body, Controller, Get, HttpCode, NotFoundException, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { PageKey, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { pageSeoSchema, reorderSchema, sectionSchemas, sectionUpdateSchema } from './schemas';
import { ZodBodyPipe } from './zod-body.pipe';

@Controller('admin/pages')
@UseGuards(JwtAuthGuard)
export class AdminPagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':key')
  async get(@Param('key') rawKey: string) {
    const key = this.pageKey(rawKey);
    const page = await this.prisma.page.upsert({
      where: { key },
      update: {},
      create: { key },
      include: { sections: { orderBy: { displayOrder: 'asc' } } },
    });
    return page;
  }

  @Patch(':key')
  update(@Param('key') rawKey: string, @Body(new ZodBodyPipe(pageSeoSchema)) body: Prisma.PageUpdateInput) {
    const key = this.pageKey(rawKey);
    return this.prisma.page.update({ where: { key }, data: body });
  }

  @Patch(':key/sections/:section')
  async updateSection(
    @Param('key') rawKey: string,
    @Param('section') section: string,
    @Body(new ZodBodyPipe(sectionUpdateSchema)) body: { enabled?: boolean; content?: Record<string, unknown> },
  ) {
    const key = this.pageKey(rawKey);
    const schema = sectionSchemas[`${key}:${section}`];
    if (!schema) throw new NotFoundException('Unknown section.');

    const data: Prisma.PageSectionUpdateInput = { enabled: body.enabled };
    if (body.content) data.content = new ZodBodyPipe(schema).transform(body.content) as Prisma.InputJsonObject;

    try {
      return await this.prisma.pageSection.update({ where: { pageKey_key: { pageKey: key, key: section } }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new NotFoundException('Section not found.');
      throw error;
    }
  }

  @Put(':key/order')
  @HttpCode(204)
  async reorder(@Param('key') rawKey: string, @Body(new ZodBodyPipe(reorderSchema)) body: { ids: string[] }): Promise<void> {
    const pageKey = this.pageKey(rawKey);
    await this.prisma.$transaction(
      body.ids.map((key, index) => this.prisma.pageSection.update({ where: { pageKey_key: { pageKey, key } }, data: { displayOrder: index } })),
    );
  }

  private pageKey(raw: string): PageKey {
    const key = raw.toUpperCase();
    if (!(key in PageKey)) throw new BadRequestException('Unknown page.');
    return key as PageKey;
  }
}
