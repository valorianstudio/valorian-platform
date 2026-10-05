import type { MetadataRoute } from 'next';
import { getSeoConfig, getSlugs } from '@/lib/cms';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site';
import { DEMOS, SHOWCASE_DEMOS } from '@/data/demos';
import { CLINIC_EXPERIENCES } from '@/data/clinic/meta';
import { CLOTHING_EXPERIENCES } from '@/data/clothing/meta';
import { DELIVERY_EXPERIENCES } from '@/data/delivery/meta';
import { PETSHOP_EXPERIENCES } from '@/data/petshop/meta';
import { PHARMACY_EXPERIENCES } from '@/data/pharmacy/meta';
import { PROPERTY_EXPERIENCES } from '@/data/property/meta';
import { HOTEL_EXPERIENCES } from '@/data/hotel/meta';
import { COURSE_EXPERIENCES } from '@/data/course/meta';
import { GYM_EXPERIENCES } from '@/data/gym/meta';
import { RESTAURANT_EXPERIENCES } from '@/data/restaurant/meta';
import { SCHOOL_EXPERIENCES } from '@/data/school/meta';

/** Demos in data/demos.ts live in code, so their last-modified date is that of the last edit to the file rather than "now". */
const SOLUTIONS_UPDATED = '2026-10-04T00:00:00.000Z';

// Built once an hour instead of on every crawler hit.
export const revalidate = 3600;

/** Old demo slugs that redirect to a catalog demo: they must not be listed as pages of their own. */
const aliases = new Set(DEMOS.flatMap((demo) => demo.aliases ?? []));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, seo] = await Promise.all([getSlugs(), getSeoConfig()]);
  if (seo?.allowIndexing === false) return [];
  const base = seo?.canonicalBaseUrl || SITE_URL;
  // Priorities follow how much each page sells: services first, then demos and solutions, then case studies and articles.
  const dynamicRoutes: { path: string; updatedAt: string; priority: number }[] = [
    ...(slugs?.services ?? []).map((item) => ({ path: `/services/${item.slug}`, updatedAt: item.updatedAt, priority: 0.9 })),
    ...SHOWCASE_DEMOS.map((demo) => demo.slug).filter((slug) => !(slugs?.demos ?? []).some((demo) => demo.slug === slug)).map((slug) => ({ path: `/demos/${slug}`, updatedAt: SOLUTIONS_UPDATED, priority: 0.7 })),
    ...(slugs?.solutions ?? []).map((item) => ({ path: `/solutions/${item.slug}`, updatedAt: item.updatedAt, priority: 0.7 })),
    ...(slugs?.demos ?? []).filter((item) => !aliases.has(item.slug)).map((item) => ({ path: `/demos/${item.slug}`, updatedAt: item.updatedAt, priority: 0.7 })),
    ...[...SCHOOL_EXPERIENCES, ...CLINIC_EXPERIENCES, ...RESTAURANT_EXPERIENCES, ...GYM_EXPERIENCES, ...COURSE_EXPERIENCES, ...CLOTHING_EXPERIENCES, ...HOTEL_EXPERIENCES, ...DELIVERY_EXPERIENCES, ...PETSHOP_EXPERIENCES, ...PHARMACY_EXPERIENCES, ...PROPERTY_EXPERIENCES].map((experience) => ({ path: experience.href, updatedAt: SOLUTIONS_UPDATED, priority: 0.7 })),
    ...(slugs?.caseStudies ?? []).map((item) => ({ path: `/case-studies/${item.slug}`, updatedAt: item.updatedAt, priority: 0.7 })),
    ...(slugs?.articles ?? []).map((item) => ({ path: `/insights/${item.slug}`, updatedAt: item.updatedAt, priority: 0.6 })),
  ];
  const hasCaseStudies = (slugs?.caseStudies.length ?? 0) > 0;
  const hasArticles = (slugs?.articles.length ?? 0) > 0;
  const staticPriority: Record<string, number> = { '/services': 0.9, '/solutions': 0.8, '/demos': 0.8, '/estimate': 0.7, '/case-studies': 0.7, '/insights': 0.6, '/about': 0.6, '/contact': 0.6, '/privacy': 0.3, '/terms': 0.3 };
  const now = new Date();

  return [
    ...PUBLIC_ROUTES.filter((route) => (route !== '/case-studies' || hasCaseStudies) && (route !== '/insights' || hasArticles)).map((route) => ({
      url: `${base}${route === '/' ? '' : route}`,
      lastModified: now,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : (staticPriority[route] ?? 0.5),
    })),
    ...dynamicRoutes.map((item) => ({ url: `${base}${item.path}`, lastModified: new Date(item.updatedAt), changeFrequency: 'monthly' as const, priority: item.priority })),
  ];
}
