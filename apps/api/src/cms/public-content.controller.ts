import { applyDecorators, Controller, Get, Header, NotFoundException, Param } from '@nestjs/common';
import { PageKey, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const published = { status: 'PUBLISHED' } as const;
const byOrder = [{ displayOrder: 'asc' }, { createdAt: 'asc' }] satisfies Prisma.ServiceOrderByWithRelationInput[];

const seoSelect = { metaTitle: true, metaDescription: true, ogImageUrl: true, canonicalUrl: true, noindex: true } as const;
const serviceCard = { slug: true, title: true, shortDescription: true, icon: true, featured: true } as const;
const technologyCard = { id: true, slug: true, name: true, category: true, logoUrl: true, websiteUrl: true } as const;
const activeTech = { active: true } as const;

const CachedGet = (path: string) => applyDecorators(Get(path), Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=300'));

@Controller('content')
export class PublicContentController {
  constructor(private readonly prisma: PrismaService) {}

  private async page(key: PageKey) {
    const page = await this.prisma.page.findUnique({
      where: { key },
      select: { ...seoSelect, sections: { where: { enabled: true }, orderBy: { displayOrder: 'asc' }, select: { key: true, content: true } } },
    });
    return {
      seo: page ? { metaTitle: page.metaTitle, metaDescription: page.metaDescription, ogImageUrl: page.ogImageUrl, canonicalUrl: page.canonicalUrl, noindex: page.noindex } : null,
      sections: page?.sections ?? [],
    };
  }

  private cta(key: string) {
    return this.prisma.cta.findFirst({ where: { key, active: true }, select: { label: true, url: true, description: true } });
  }

  private steps() {
    return this.prisma.processStep.findMany({ where: { active: true }, orderBy: byOrder, select: { id: true, title: true, label: true, description: true } });
  }

  private faqs(limit: number) {
    return this.prisma.faq.findMany({
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
    const [page, services, values, steps, technologies, work] = await Promise.all([
      this.page('HOME'),
      this.prisma.service.findMany({ where: { ...published, featured: true }, orderBy: byOrder, take: 9, select: serviceCard }),
      this.prisma.valueProp.findMany({ where: { active: true }, orderBy: byOrder, select: { id: true, title: true, description: true, icon: true, highlight: true } }),
      this.steps(),
      this.prisma.technology.findMany({ where: { ...activeTech, featured: true }, orderBy: byOrder, take: 24, select: technologyCard }),
      this.prisma.featuredWork.findMany({
        where: { active: true, featured: true },
        orderBy: byOrder,
        take: 6,
        select: { id: true, title: true, description: true, category: true, imageUrl: true, badge: true, ctaUrl: true },
      }),
    ]);
    return { ...page, services, values, steps, technologies, work };
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
      this.prisma.service.findMany({ where: published, orderBy: byOrder, select: { ...serviceCard, technologies: { where: activeTech, select: { id: true, name: true } } } }),
      this.steps(),
      this.faqs(6),
    ]);
    return { ...page, services, steps, faqs };
  }

  @CachedGet('services/:slug')
  async service(@Param('slug') slug: string) {
    const service = await this.prisma.service.findFirst({
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
      },
    });
    if (!service) throw new NotFoundException();
    const [steps, faqs, related, cta] = await Promise.all([
      this.steps(),
      this.faqs(4),
      this.prisma.service.findMany({ where: { ...published, slug: { not: slug } }, orderBy: byOrder, take: 3, select: serviceCard }),
      this.cta('start-project'),
    ]);
    return { service, steps, faqs, related, cta };
  }

  @CachedGet('solutions')
  async solutions() {
    const [page, solutions] = await Promise.all([
      this.page('SOLUTIONS'),
      this.prisma.industry.findMany({
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
      },
    });
    if (!solution) throw new NotFoundException();
    return { solution, cta: await this.cta('start-project') };
  }

  @CachedGet('slugs')
  async slugs() {
    const [services, solutions] = await Promise.all([
      this.prisma.service.findMany({ where: { ...published, noindex: false }, select: { slug: true, updatedAt: true } }),
      this.prisma.industry.findMany({ where: { ...published, noindex: false }, select: { slug: true, updatedAt: true } }),
    ]);
    return { services, solutions };
  }
}
