import { applyDecorators, Controller, Get, Header, NotFoundException, Param, Query } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { demoCardSelect, demoOrder, publicDemoWhere } from './demo-queries';

const CachedGet = (path: string) => applyDecorators(Get(path), Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=300'));
const PAGE_SIZE = 12;
const itemOrder = [{ displayOrder: 'asc' }, { id: 'asc' }] satisfies Prisma.DemoFeatureOrderByWithRelationInput[];

interface ListQuery {
  q?: string;
  category?: string;
  industry?: string;
  platform?: string;
  page?: string;
}

@Controller('content/demos')
export class PublicDemosController {
  constructor(private readonly prisma: PrismaService) {}

  @CachedGet('')
  async list(@Query() query: ListQuery) {
    const q = query.q?.trim().slice(0, 80);
    const and: Prisma.DemoWhereInput[] = [];
    if (query.platform === 'website' || query.platform === 'both') and.push({ platforms: { some: { type: 'WEBSITE', enabled: true } } });
    if (query.platform === 'mobile' || query.platform === 'both') and.push({ platforms: { some: { type: 'MOBILE', enabled: true } } });

    const where: Prisma.DemoWhereInput = {
      ...publicDemoWhere,
      ...(query.category ? { category: { slug: query.category, active: true } } : {}),
      ...(query.industry ? { industry: { slug: query.industry } } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { shortDescription: { contains: q, mode: 'insensitive' } }] } : {}),
      ...(and.length ? { AND: and } : {}),
    };
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const filtered = Boolean(q || query.category || query.industry || query.platform);

    const [items, total, categories, industries, featured] = await Promise.all([
      this.prisma.demo.findMany({ where, orderBy: demoOrder, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: demoCardSelect }),
      this.prisma.demo.count({ where }),
      this.prisma.demoCategory.findMany({
        where: { active: true, demos: { some: publicDemoWhere } },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        select: { name: true, slug: true },
      }),
      this.prisma.industry.findMany({
        where: { status: 'PUBLISHED', demos: { some: publicDemoWhere } },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        select: { name: true, slug: true },
      }),
      !filtered && page === 1
        ? this.prisma.demo.findMany({ where: { ...publicDemoWhere, featured: true }, orderBy: demoOrder, take: 3, select: demoCardSelect })
        : Promise.resolve([]),
    ]);
    return { items, total, page, pageSize: PAGE_SIZE, categories, industries, featured };
  }

  @CachedGet(':slug')
  async detail(@Param('slug') slug: string) {
    const demo = await this.prisma.demo.findFirst({
      where: { slug, ...publicDemoWhere },
      select: {
        ...demoCardSelect,
        fullDescription: true,
        problem: true,
        solution: true,
        targetUsers: true,
        targetBusinesses: true,
        outcomes: true,
        highlight: true,
        ctaLabel: true,
        ctaUrl: true,
        publishedAt: true,
        metaTitle: true,
        metaDescription: true,
        ogImageUrl: true,
        canonicalUrl: true,
        noindex: true,
        platforms: {
          where: { enabled: true },
          select: {
            type: true,
            title: true,
            description: true,
            demoUrl: true,
            videoUrl: true,
            ctaLabel: true,
            ctaUrl: true,
            android: true,
            ios: true,
            playStoreUrl: true,
            appStoreUrl: true,
            technologies: { where: { active: true }, orderBy: [{ displayOrder: 'asc' }], select: { id: true, name: true, category: true, logoUrl: true } },
          },
        },
        features: { where: { active: true }, orderBy: itemOrder, select: { id: true, platform: true, title: true, description: true, icon: true, featured: true } },
        modules: { where: { active: true }, orderBy: itemOrder, select: { id: true, platform: true, title: true, description: true, icon: true } },
        screenshots: { where: { active: true }, orderBy: itemOrder, select: { id: true, platform: true, kind: true, url: true, altText: true, caption: true, featured: true } },
        points: { where: { active: true }, orderBy: itemOrder, select: { id: true, type: true, title: true, description: true } },
        related: { where: publicDemoWhere, orderBy: demoOrder, take: 3, select: demoCardSelect },
      },
    });
    if (!demo) throw new NotFoundException();
    return demo;
  }
}
