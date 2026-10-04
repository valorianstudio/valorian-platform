import { applyDecorators, Controller, Get, Header, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { PublicCacheInterceptor } from '../common/public-cache.interceptor';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { demoCardSelect, demoOrder, publicDemoWhere } from './demo-queries';

const CachedGet = (path: string) => applyDecorators(Get(path), Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=300'));
const itemOrder = [{ displayOrder: 'asc' }, { id: 'asc' }] satisfies Prisma.DemoFeatureOrderByWithRelationInput[];

@UseInterceptors(PublicCacheInterceptor)
@Controller('content/demos')
export class PublicDemosController {
  constructor(private readonly prisma: PrismaService) {}

  @CachedGet(':slug')
  async detail(@Param('slug') slug: string) {
    const demo = await this.prisma.demo.findFirst({
      // One SQL statement with joins instead of one query per relation: this endpoint loads 8 relations, and every extra
      // query is another round trip to the database.
      relationLoadStrategy: 'join',
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
