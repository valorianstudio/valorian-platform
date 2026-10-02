import { Body, ConflictException, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContentStatus, Prisma } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { slugify } from '../cms/resources';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { articleCreateSchema, articleUpdateSchema } from './content-schemas';

type Input = Record<string, unknown> & { slug?: string; tags?: string[]; serviceIds?: string[]; industryIds?: string[]; status?: ContentStatus; publishedAt?: Date | null; content?: string };

const PAGE_SIZE = 15;
const listSelect = {
  id: true,
  slug: true,
  title: true,
  status: true,
  featured: true,
  publishedAt: true,
  updatedAt: true,
  authorName: true,
  readingTime: true,
  category: { select: { name: true } },
} satisfies Prisma.ArticleSelect;

export const readingTimeFor = (content: string) => Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

@Controller('admin/articles')
@UseGuards(JwtAuthGuard)
export class AdminArticlesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @RequirePermission('insights.view')
  async list(@Query() query: { q?: string; status?: string; category?: string; featured?: string; sort?: string; page?: string }) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim();
    const where: Prisma.ArticleWhereInput = {
      ...(query.status && Object.hasOwn(ContentStatus, query.status) ? { status: query.status as ContentStatus } : {}),
      ...(query.category ? { categoryId: query.category } : {}),
      ...(query.featured === '1' ? { featured: true } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { excerpt: { contains: q, mode: 'insensitive' } }, { slug: { contains: q, mode: 'insensitive' } }] } : {}),
    };
    const orderBy: Prisma.ArticleOrderByWithRelationInput[] = query.sort === 'title' ? [{ title: 'asc' }] : query.sort === 'published' ? [{ publishedAt: { sort: 'desc', nulls: 'last' } }] : [{ updatedAt: 'desc' }];
    const [items, total] = await Promise.all([
      this.prisma.article.findMany({ where, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: listSelect }),
      this.prisma.article.count({ where }),
    ]);
    return { items, total, page, pageSize: PAGE_SIZE };
  }

  @Get(':id')
  @RequirePermission('insights.view')
  async get(@Param('id') id: string) {
    const row = await this.prisma.article.findUnique({
      where: { id },
      include: { tags: { select: { name: true } }, services: { select: { id: true } }, industries: { select: { id: true } }, category: { select: { id: true, name: true, slug: true } } },
    });
    if (!row) throw new NotFoundException();
    const { tags, services, industries, ...rest } = row;
    return { ...rest, tags: tags.map((t) => t.name), serviceIds: services.map((s) => s.id), industryIds: industries.map((i) => i.id) };
  }

  @Post()
  @RequirePermission('insights.manage')
  async create(@Body(new ZodBodyPipe(articleCreateSchema)) body: Input, @CurrentUser() user: AdminProfile) {
    const { tags, serviceIds, industryIds, slug, ...data } = body;
    if (slug && (await this.prisma.article.findUnique({ where: { slug }, select: { id: true } }))) throw new ConflictException('That slug is already in use.');
    const finalSlug = slug ?? (await this.uniqueSlug(slugify(String(data.title))));
    const row = await this.prisma.article.create({
      data: {
        ...(data as Prisma.ArticleUncheckedCreateInput),
        slug: finalSlug,
        authorName: (data.authorName as string | null | undefined) ?? user.name,
        readingTime: readingTimeFor(String(data.content)),
        publishedAt: data.status === 'PUBLISHED' ? (data.publishedAt ?? new Date()) : (data.publishedAt ?? null),
        tags: { connect: await this.tagIds(tags ?? []) },
        services: { connect: await this.existing(this.prisma.service, serviceIds) },
        industries: { connect: await this.existing(this.prisma.industry, industryIds) },
      },
      select: { id: true, slug: true },
    });
    return row;
  }

  @Patch(':id')
  @RequirePermission('insights.manage')
  async update(@Param('id') id: string, @Body(new ZodBodyPipe(articleUpdateSchema)) body: Input) {
    const current = await this.prisma.article.findUnique({ where: { id }, select: { status: true, publishedAt: true } });
    if (!current) throw new NotFoundException();
    const { tags, serviceIds, industryIds, ...data } = body;
    if (data.slug === undefined) delete data.slug;
    const status = data.status ?? current.status;
    if (status === 'PUBLISHED' && data.publishedAt === undefined && !current.publishedAt) data.publishedAt = new Date();
    if (status === 'PUBLISHED' && data.publishedAt === null) data.publishedAt = current.publishedAt ?? new Date();
    try {
      await this.prisma.article.update({
        where: { id },
        data: {
          ...(data as Prisma.ArticleUncheckedUpdateInput),
          ...(typeof data.content === 'string' ? { readingTime: readingTimeFor(data.content) } : {}),
          ...(tags ? { tags: { set: await this.tagIds(tags) } } : {}),
          ...(serviceIds ? { services: { set: await this.existing(this.prisma.service, serviceIds) } } : {}),
          ...(industryIds ? { industries: { set: await this.existing(this.prisma.industry, industryIds) } } : {}),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('That slug is already in use.');
      throw error;
    }
    return { ok: true };
  }

  @Delete(':id')
  @RequirePermission('insights.manage')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.article.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new NotFoundException();
      throw error;
    }
  }

  private async tagIds(names: string[]) {
    const unique = [...new Map(names.map((name) => [slugify(name), name.trim()])).entries()];
    const tags = await Promise.all(
      unique.map(([slug, name]) => this.prisma.articleTag.upsert({ where: { slug }, update: {}, create: { slug, name }, select: { id: true } }).catch(() => this.prisma.articleTag.findFirstOrThrow({ where: { OR: [{ slug }, { name }] }, select: { id: true } }))),
    );
    return tags;
  }

  private async existing(delegate: { findMany(args: { where: { id: { in: string[] } }; select: { id: true } }): Promise<{ id: string }[]> }, ids: string[] | undefined) {
    return ids?.length ? delegate.findMany({ where: { id: { in: ids } }, select: { id: true } }) : [];
  }

  private async uniqueSlug(base: string): Promise<string> {
    let candidate = base;
    for (let n = 2; await this.prisma.article.findUnique({ where: { slug: candidate }, select: { id: true } }); n += 1) candidate = `${base}-${n}`;
    return candidate;
  }
}
