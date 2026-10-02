import { applyDecorators, Controller, Get, Header, NotFoundException, Param, Query } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { demoCardSelect, demoOrder, publicDemoWhere } from '../demos/demo-queries';
import { PrismaService } from '../prisma/prisma.service';

const CachedGet = (path: string) => applyDecorators(Get(path), Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=300'));

/** Published and not scheduled for the future. */
export const publishedNow = () => ({ status: 'PUBLISHED' as const, OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] });

export const testimonialSelect = { id: true, clientName: true, companyName: true, position: true, quote: true, imageUrl: true, companyLogoUrl: true, rating: true, verified: true } satisfies Prisma.TestimonialSelect;
export const caseCardSelect = {
  slug: true,
  title: true,
  shortDescription: true,
  coverImageUrl: true,
  clientName: true,
  featured: true,
  publishedAt: true,
  industry: { select: { name: true, slug: true } },
} satisfies Prisma.CaseStudySelect;
export const articleCardSelect = {
  slug: true,
  title: true,
  excerpt: true,
  featuredImageUrl: true,
  featuredImageAlt: true,
  authorName: true,
  publishedAt: true,
  readingTime: true,
  featured: true,
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ArticleSelect;
const seoSelect = { metaTitle: true, metaDescription: true, ogImageUrl: true, canonicalUrl: true, noindex: true } as const;
const cardOrder = [{ publishedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }] satisfies Prisma.ArticleOrderByWithRelationInput[];

@Controller('content')
export class PublicEditorialController {
  constructor(private readonly prisma: PrismaService) {}

  /* ---------- case studies ---------- */

  @CachedGet('case-studies')
  async caseStudies(@Query() query: { industry?: string; service?: string; page?: string }) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const where: Prisma.CaseStudyWhereInput = {
      AND: [publishedNow(), query.industry ? { industry: { slug: query.industry } } : {}, query.service ? { services: { some: { slug: query.service } } } : {}],
    };
    const [items, total, industries] = await Promise.all([
      this.prisma.caseStudy.findMany({ where, orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }, ...cardOrder], skip: (page - 1) * 9, take: 9, select: caseCardSelect }),
      this.prisma.caseStudy.count({ where }),
      this.prisma.industry.findMany({ where: { status: 'PUBLISHED', caseStudies: { some: publishedNow() } }, orderBy: { displayOrder: 'asc' }, select: { name: true, slug: true } }),
    ]);
    return { items, total, page, pageSize: 9, industries };
  }

  @CachedGet('case-studies/:slug')
  async caseStudy(@Param('slug') slug: string) {
    const study = await this.prisma.caseStudy.findFirst({
      where: { AND: [{ slug }, publishedNow()] },
      select: {
        ...caseCardSelect,
        fullOverview: true,
        clientLogoUrl: true,
        projectType: true,
        challenge: true,
        solution: true,
        approach: true,
        keyFeatures: true,
        results: true,
        featuredImageUrl: true,
        videoUrl: true,
        ctaLabel: true,
        ctaUrl: true,
        updatedAt: true,
        ...seoSelect,
        services: { where: { status: 'PUBLISHED' }, orderBy: { displayOrder: 'asc' }, select: { slug: true, title: true, shortDescription: true, icon: true, featured: true } },
        technologies: { where: { active: true }, orderBy: { displayOrder: 'asc' }, select: { id: true, slug: true, name: true, category: true, logoUrl: true, websiteUrl: true } },
        demos: { where: publicDemoWhere, orderBy: demoOrder, take: 3, select: demoCardSelect },
        media: { where: { active: true }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }], select: { id: true, kind: true, url: true, altText: true, caption: true, featured: true } },
        testimonials: { where: { active: true }, orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }], take: 3, select: testimonialSelect },
      },
    });
    if (!study) throw new NotFoundException();
    const related = await this.prisma.caseStudy.findMany({
      where: { AND: [publishedNow(), { slug: { not: slug } }, study.industry ? { industry: { slug: study.industry.slug } } : {}] },
      orderBy: cardOrder,
      take: 3,
      select: caseCardSelect,
    });
    return { study, related };
  }

  /* ---------- insights ---------- */

  @CachedGet('insights')
  async insights(@Query() query: { q?: string; category?: string; tag?: string; page?: string }) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim().slice(0, 80);
    const filtered = Boolean(q || query.category || query.tag);
    const where: Prisma.ArticleWhereInput = {
      AND: [
        publishedNow(),
        query.category ? { category: { slug: query.category } } : {},
        query.tag ? { tags: { some: { slug: query.tag } } } : {},
        q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { excerpt: { contains: q, mode: 'insensitive' } }] } : {},
      ],
    };
    const [items, total, categories, featured] = await Promise.all([
      this.prisma.article.findMany({ where, orderBy: cardOrder, skip: (page - 1) * 9, take: 9, select: articleCardSelect }),
      this.prisma.article.count({ where }),
      this.prisma.articleCategory.findMany({ where: { active: true, articles: { some: publishedNow() } }, orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }], select: { name: true, slug: true } }),
      !filtered && page === 1 ? this.prisma.article.findFirst({ where: { AND: [publishedNow(), { featured: true }] }, orderBy: cardOrder, select: articleCardSelect }) : Promise.resolve(null),
    ]);
    return { items, total, page, pageSize: 9, categories, featured };
  }

  @CachedGet('insights/:slug')
  async insight(@Param('slug') slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { AND: [{ slug }, publishedNow()] },
      select: {
        ...articleCardSelect,
        content: true,
        authorAvatarUrl: true,
        authorBio: true,
        updatedAt: true,
        ...seoSelect,
        tags: { select: { name: true, slug: true } },
        services: { where: { status: 'PUBLISHED' }, select: { slug: true, title: true } },
      },
    });
    if (!article) throw new NotFoundException();
    const related = await this.prisma.article.findMany({
      where: { AND: [publishedNow(), { slug: { not: slug } }, article.category ? { category: { slug: article.category.slug } } : {}] },
      orderBy: cardOrder,
      take: 3,
      select: articleCardSelect,
    });
    return { article, related };
  }

  /* ---------- seo ---------- */

  @CachedGet('page-seo')
  async pageSeo() {
    const pages = await this.prisma.page.findMany({ select: { key: true, ...seoSelect } });
    return Object.fromEntries(pages.map(({ key, ...seo }) => [key, seo]));
  }
}
