import { applyDecorators, Controller, Get, Header, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { PublicCacheInterceptor } from '../common/public-cache.interceptor';
import { PageKey, Prisma } from '@prisma/client';
import { demoCardSelect, demoOrder, publicDemoWhere } from '../demos/demo-queries';
import { PrismaService } from '../prisma/prisma.service';
import { articleCardSelect, caseCardSelect, publishedNow, testimonialSelect } from '../content/public-editorial.controller';

const published = { status: 'PUBLISHED' } as const;
const byOrder = [{ displayOrder: 'asc' }, { createdAt: 'asc' }] satisfies Prisma.ServiceOrderByWithRelationInput[];

const seoSelect = { metaTitle: true, metaDescription: true, ogImageUrl: true, canonicalUrl: true, noindex: true } as const;
const serviceCard = { slug: true, title: true, shortDescription: true, icon: true, featured: true } as const;
const technologyCard = { id: true, slug: true, name: true, category: true, logoUrl: true, websiteUrl: true } as const;
const activeTech = { active: true } as const;

const CachedGet = (path: string) => applyDecorators(Get(path), Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=300'));

@UseInterceptors(PublicCacheInterceptor)
@Controller('content')
export class PublicContentController {
  constructor(private readonly prisma: PrismaService) {}

  private async page(key: PageKey) {
    const page = await this.prisma.page.findUnique({
      relationLoadStrategy: 'join',
      where: { key },
      select: { ...seoSelect, sections: { where: { enabled: true }, orderBy: { displayOrder: 'asc' }, select: { key: true, content: true } } },
    });
    return {
      seo: page ? { metaTitle: page.metaTitle, metaDescription: page.metaDescription, ogImageUrl: page.ogImageUrl, canonicalUrl: page.canonicalUrl, noindex: page.noindex } : null,
      sections: page?.sections ?? [],
    };
  }

  private cta(key: string) {
    return this.prisma.cta.findFirst({ relationLoadStrategy: 'join', where: { key, active: true }, select: { label: true, url: true, description: true } });
  }

  private steps() {
    return this.prisma.processStep.findMany({ relationLoadStrategy: 'join', where: { active: true }, orderBy: byOrder, select: { id: true, title: true, label: true, description: true } });
  }

  private faqs(limit: number) {
    return this.prisma.faq.findMany({
      relationLoadStrategy: 'join',
      where: { active: true },
      orderBy: [{ featured: 'desc' }, ...byOrder],
      take: limit,
      select: { id: true, question: true, answer: true, category: true },
    });
  }

  @CachedGet('navigation')
  async navigation() {
    const [items, cta] = await Promise.all([
      this.prisma.navigationItem.findMany({
        relationLoadStrategy: 'join',
        where: { enabled: true },
        orderBy: byOrder,
        select: { id: true, label: true, url: true, location: true, openInNewTab: true },
      }),
      this.cta('start-project'),
    ]);
    return { items, cta };
  }

  @CachedGet('home')
  async home() {
    // Demos and the technology showcase are static content in the website (data/demos.ts, data/technologies.ts), so they are not queried here.
    const [page, services, values, steps, caseStudies, testimonials, articles] = await Promise.all([
      this.page('HOME'),
      this.prisma.service.findMany({ relationLoadStrategy: 'join', where: { ...published, featured: true }, orderBy: byOrder, take: 9, select: serviceCard }),
      this.prisma.valueProp.findMany({ relationLoadStrategy: 'join', where: { active: true }, orderBy: byOrder, select: { id: true, title: true, description: true, icon: true, highlight: true } }),
      this.steps(),
      this.prisma.caseStudy.findMany({ relationLoadStrategy: 'join', where: { AND: [publishedNow(), { featured: true }] }, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }], take: 3, select: caseCardSelect }),
      this.prisma.testimonial.findMany({ relationLoadStrategy: 'join', where: { active: true, featured: true }, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }], take: 3, select: testimonialSelect }),
      this.prisma.article.findMany({ relationLoadStrategy: 'join', where: publishedNow(), orderBy: [{ featured: 'desc' }, { publishedAt: { sort: 'desc', nulls: 'last' } }], take: 3, select: articleCardSelect }),
    ]);
    return { ...page, services, values, steps, caseStudies, testimonials, articles };
  }

  @CachedGet('about')
  async about() {
    const [page, faqs] = await Promise.all([this.page('ABOUT'), this.faqs(6)]);
    return { ...page, faqs };
  }

  @CachedGet('services')
  async services() {
    const [page, services, steps, faqs] = await Promise.all([
      this.page('SERVICES'),
      this.prisma.service.findMany({ relationLoadStrategy: 'join', where: published, orderBy: byOrder, select: { ...serviceCard, technologies: { where: activeTech, select: { id: true, name: true } } } }),
      this.steps(),
      this.faqs(6),
    ]);
    return { ...page, services, steps, faqs };
  }

  @CachedGet('services/:slug')
  async service(@Param('slug') slug: string) {
    const service = await this.prisma.service.findFirst({
      relationLoadStrategy: 'join',
      where: { slug, ...published },
      select: {
        ...serviceCard,
        description: true,
        heroTitle: true,
        heroSubtitle: true,
        features: true,
        benefits: true,
        ctaLabel: true,
        ctaUrl: true,
        ...seoSelect,
        technologies: { where: activeTech, orderBy: byOrder, select: technologyCard },
        industries: { where: published, orderBy: byOrder, select: { slug: true, name: true } },
        estimatorType: { select: { slug: true } },
      },
    });
    if (!service) throw new NotFoundException();
    const [steps, faqs, related, cta, caseStudies, testimonials, articles] = await Promise.all([
      this.steps(),
      this.faqs(4),
      this.prisma.service.findMany({ relationLoadStrategy: 'join', where: { ...published, slug: { not: slug } }, orderBy: byOrder, take: 3, select: serviceCard }),
      this.cta('start-project'),
      this.prisma.caseStudy.findMany({ relationLoadStrategy: 'join', where: { AND: [publishedNow(), { services: { some: { slug } } }] }, orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }], take: 3, select: caseCardSelect }),
      this.prisma.testimonial.findMany({ relationLoadStrategy: 'join', where: { active: true, service: { slug } }, orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }], take: 3, select: testimonialSelect }),
      this.prisma.article.findMany({ relationLoadStrategy: 'join', where: { AND: [publishedNow(), { services: { some: { slug } } }] }, orderBy: [{ publishedAt: { sort: 'desc', nulls: 'last' } }], take: 3, select: articleCardSelect }),
    ]);
    return { service, steps, faqs, related, cta, caseStudies, testimonials, articles };
  }

  @CachedGet('solutions')
  async solutions() {
    const [page, solutions] = await Promise.all([
      this.page('SOLUTIONS'),
      this.prisma.industry.findMany({
        relationLoadStrategy: 'join',
        where: published,
        orderBy: byOrder,
        select: { slug: true, name: true, shortDescription: true, icon: true, featured: true, coverImageUrl: true },
      }),
    ]);
    return { ...page, solutions };
  }

  @CachedGet('solutions/:slug')
  async solution(@Param('slug') slug: string) {
    const solution = await this.prisma.industry.findFirst({
      relationLoadStrategy: 'join',
      where: { slug, ...published },
      select: {
        slug: true,
        name: true,
        shortDescription: true,
        overview: true,
        icon: true,
        problems: true,
        approach: true,
        benefits: true,
        ctaLabel: true,
        ctaUrl: true,
        coverImageUrl: true,
        ...seoSelect,
        technologies: { where: activeTech, orderBy: byOrder, select: technologyCard },
        services: { where: published, orderBy: byOrder, select: serviceCard },
        demos: { where: publicDemoWhere, orderBy: demoOrder, take: 6, select: demoCardSelect },
      },
    });
    if (!solution) throw new NotFoundException();
    const [caseStudies, articles] = await Promise.all([
      this.prisma.caseStudy.findMany({ relationLoadStrategy: 'join', where: { AND: [publishedNow(), { industry: { slug } }] }, orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }], take: 3, select: caseCardSelect }),
      this.prisma.article.findMany({ relationLoadStrategy: 'join', where: { AND: [publishedNow(), { industries: { some: { slug } } }] }, orderBy: [{ publishedAt: { sort: 'desc', nulls: 'last' } }], take: 3, select: articleCardSelect }),
    ]);
    return { solution, cta: await this.cta('start-project'), caseStudies, articles };
  }

  @CachedGet('slugs')
  async slugs() {
    const [services, solutions, demos, caseStudies, articles] = await Promise.all([
      this.prisma.service.findMany({ relationLoadStrategy: 'join', where: { ...published, noindex: false }, select: { slug: true, updatedAt: true } }),
      this.prisma.industry.findMany({ relationLoadStrategy: 'join', where: { ...published, noindex: false }, select: { slug: true, updatedAt: true } }),
      this.prisma.demo.findMany({ where: { ...publicDemoWhere, noindex: false }, select: { slug: true, updatedAt: true } }),
      this.prisma.caseStudy.findMany({ relationLoadStrategy: 'join', where: { AND: [publishedNow(), { noindex: false }] }, select: { slug: true, updatedAt: true } }),
      this.prisma.article.findMany({ relationLoadStrategy: 'join', where: { AND: [publishedNow(), { noindex: false }] }, select: { slug: true, updatedAt: true } }),
    ]);
    return { services, solutions, demos, caseStudies, articles };
  }
}
