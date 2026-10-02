import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import type { EstimatorCurrency, EstimatorSettings, FeaturePlatform, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CalculateInput } from './estimator-schemas';

type Platform = FeaturePlatform;
interface Priced {
  websitePrice: number | null;
  mobilePrice: number | null;
  bothPrice: number | null;
}

const order = [{ displayOrder: 'asc' }, { name: 'asc' }] satisfies Prisma.EstimatorFeatureOrderByWithRelationInput[];

/** Price of one priced item for a platform. Null when the item is unavailable there. */
export function priceFor(item: Priced, platform: Platform, bothDiscountPercent: number): number | null {
  const { websitePrice: web, mobilePrice: mobile, bothPrice: both } = item;
  if (platform === 'WEBSITE') return web;
  if (platform === 'MOBILE') return mobile;
  if (both !== null) return both;
  if (web !== null && mobile !== null) return Math.round((web + mobile) * (1 - bothDiscountPercent / 100));
  return web ?? mobile;
}

export function availablePlatforms(item: Priced): Exclude<Platform, 'BOTH'>[] {
  const out: Exclude<Platform, 'BOTH'>[] = [];
  if (item.websitePrice !== null || item.bothPrice !== null) out.push('WEBSITE');
  if (item.mobilePrice !== null || item.bothPrice !== null) out.push('MOBILE');
  return out;
}

@Injectable()
export class EstimatorService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<EstimatorSettings> {
    return this.prisma.estimatorSettings.upsert({ where: { id: 'estimator' }, update: {}, create: { id: 'estimator' } });
  }

  async config(query: { demo?: string; type?: string; industry?: string }) {
    const settings = await this.getSettings();
    const [types, industries, categories, features, integrations, complexities, rules, demo] = await Promise.all([
      this.prisma.estimatorProjectType.findMany({ where: { active: true }, orderBy: order, select: { slug: true, name: true, description: true, platform: true } }),
      this.prisma.industry.findMany({ where: { status: 'PUBLISHED' }, orderBy: [{ displayOrder: 'asc' }], select: { slug: true, name: true, icon: true } }),
      this.prisma.estimatorCategory.findMany({ where: { active: true }, orderBy: order, select: { id: true, name: true } }),
      this.prisma.estimatorFeature.findMany({
        where: { active: true },
        orderBy: order,
        select: { id: true, name: true, description: true, categoryId: true, required: true, recommended: true, websitePrice: true, mobilePrice: true, bothPrice: true, industries: { select: { slug: true } } },
      }),
      this.prisma.estimatorIntegration.findMany({ where: { active: true }, orderBy: order, select: { id: true, name: true, description: true, websitePrice: true, mobilePrice: true, bothPrice: true } }),
      this.prisma.estimatorComplexity.findMany({ where: { active: true }, orderBy: order, select: { slug: true, name: true, description: true } }),
      this.prisma.estimatorPricingRule.findMany({ where: { active: true }, orderBy: [{ displayOrder: 'asc' }, { label: 'asc' }], select: { kind: true, key: true, label: true, description: true } }),
      query.demo
        ? this.prisma.demo.findFirst({
            where: { slug: query.demo, status: 'PUBLISHED', active: true },
            select: { slug: true, name: true, industry: { select: { slug: true } }, platforms: { where: { enabled: true }, select: { type: true } }, estimatorFeatures: { where: { active: true }, select: { id: true } } },
          })
        : Promise.resolve(null),
    ]);

    const demoPlatforms = new Set(demo?.platforms.map((p) => p.type));
    const demoType = !demo ? undefined : demoPlatforms.size > 1 ? 'BOTH' : demoPlatforms.has('MOBILE') ? 'MOBILE' : 'WEBSITE';
    const presetType = types.find((t) => t.slug === query.type) ?? (demoType ? types.find((t) => t.platform === demoType) : undefined);

    return {
      currency: settings.currency,
      disclaimer: settings.disclaimer,
      enabled: settings.enabled,
      projectTypes: types,
      industries,
      categories,
      features: features.map(({ websitePrice, mobilePrice, bothPrice, industries: linked, ...feature }) => ({
        ...feature,
        platforms: availablePlatforms({ websitePrice, mobilePrice, bothPrice }),
        industries: linked.map((i) => i.slug),
      })),
      integrations: integrations.map(({ websitePrice, mobilePrice, bothPrice, ...item }) => ({ ...item, platforms: availablePlatforms({ websitePrice, mobilePrice, bothPrice }) })),
      complexities,
      scales: rules.filter((r) => r.kind === 'SCALE'),
      urgencies: rules.filter((r) => r.kind === 'URGENCY'),
      preset: {
        demo: demo ? { slug: demo.slug, name: demo.name } : null,
        projectType: presetType?.slug ?? null,
        industry: demo?.industry?.slug ?? query.industry ?? null,
        featureIds: demo?.estimatorFeatures.map((f) => f.id) ?? [],
      },
    };
  }

  async calculate(input: CalculateInput) {
    const settings = await this.getSettings();
    if (!settings.enabled) throw new UnprocessableEntityException('The estimator is currently unavailable.');

    const [type, complexity, scale, urgency] = await Promise.all([
      this.prisma.estimatorProjectType.findFirst({ where: { slug: input.projectType, active: true } }),
      this.prisma.estimatorComplexity.findFirst({ where: { slug: input.complexity, active: true } }),
      this.prisma.estimatorPricingRule.findFirst({ where: { kind: 'SCALE', key: input.scale, active: true } }),
      this.prisma.estimatorPricingRule.findFirst({ where: { kind: 'URGENCY', key: input.urgency, active: true } }),
    ]);
    if (!type) throw new NotFoundException('Unknown project type.');
    if (!complexity || !scale || !urgency) throw new UnprocessableEntityException('Choose a valid complexity, scale and timeline.');

    const platform = type.platform;
    const [features, integrations] = await Promise.all([
      this.prisma.estimatorFeature.findMany({
        where: { active: true, OR: [{ id: { in: input.featureIds } }, { required: true }] },
        orderBy: order,
        include: { category: { select: { name: true } } },
      }),
      this.prisma.estimatorIntegration.findMany({ where: { active: true, id: { in: input.integrationIds } }, orderBy: order }),
    ]);

    const priced = <T extends Priced>(items: T[]) =>
      items.flatMap((item) => {
        const value = priceFor(item, platform, settings.bothDiscountPercent);
        return value === null ? [] : [{ item, value }];
      });
    const featureLines = priced(features);
    const integrationLines = priced(integrations);

    const featureTotal = featureLines.reduce((sum, line) => sum + line.value, 0);
    const integrationTotal = integrationLines.reduce((sum, line) => sum + line.value, 0);
    const subtotal = type.basePrice + featureTotal + integrationTotal;
    const total = subtotal * complexity.multiplier * scale.multiplier * urgency.multiplier;

    const step = settings.roundingStep;
    const min = Math.floor((total * (1 - settings.rangeLowPercent / 100)) / step) * step;
    const max = Math.ceil((total * (1 + settings.rangeHighPercent / 100)) / step) * step;

    const effortDays = featureLines.reduce((sum, line) => sum + line.item.effortDays, 0);
    const weeks = (type.baseWeeks + effortDays / 5) * complexity.timelineFactor * scale.timelineFactor * urgency.timelineFactor;
    const weeksMin = Math.max(1, Math.ceil(weeks * 0.8));
    const weeksMax = Math.max(weeksMin + 1, Math.ceil(weeks * 1.3));

    const submission = await this.prisma.estimatorSubmission.create({
      data: {
        projectTypeSlug: type.slug,
        projectTypeName: type.name,
        demoSlug: input.demo ?? null,
        industrySlug: input.industry ?? null,
        platform,
        featureIds: featureLines.map((l) => l.item.id),
        integrationIds: integrationLines.map((l) => l.item.id),
        complexity: complexity.name,
        scale: scale.label,
        urgency: urgency.label,
        currency: settings.currency,
        minAmount: min,
        maxAmount: max,
        weeksMin,
        weeksMax,
        breakdown: {
          snapshot: {
            projectType: { name: type.name, basePrice: type.basePrice },
            features: featureLines.map((l) => ({ id: l.item.id, name: l.item.name, category: l.item.category?.name ?? null, price: l.value })),
            integrations: integrationLines.map((l) => ({ id: l.item.id, name: l.item.name, price: l.value })),
            complexity: { name: complexity.name, multiplier: complexity.multiplier },
            scale: { label: scale.label, multiplier: scale.multiplier },
            urgency: { label: urgency.label, multiplier: urgency.multiplier },
            range: { lowPercent: settings.rangeLowPercent, highPercent: settings.rangeHighPercent, step },
          },
          base: type.basePrice,
          features: featureTotal,
          integrations: integrationTotal,
          subtotal,
          multipliers: { complexity: complexity.multiplier, scale: scale.multiplier, urgency: urgency.multiplier },
          total: Math.round(total),
        },
      },
      select: { id: true },
    });

    return {
      id: submission.id,
      currency: settings.currency as EstimatorCurrency,
      disclaimer: settings.disclaimer,
      min,
      max,
      weeks: { min: weeksMin, max: weeksMax },
      projectType: type.name,
      platform,
      features: featureLines.map((l) => ({ id: l.item.id, name: l.item.name, category: l.item.category?.name ?? null, required: l.item.required })),
      integrations: integrationLines.map((l) => ({ id: l.item.id, name: l.item.name })),
      complexity: complexity.name,
      scale: scale.label,
      urgency: urgency.label,
    };
  }
}
