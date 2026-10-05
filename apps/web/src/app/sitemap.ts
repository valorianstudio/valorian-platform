import type { MetadataRoute } from 'next';
import { getSeoConfig, getSlugs } from '@/lib/cms';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site';
import { DEMOS, DEMO_SLUGS } from '@/data/demos';
import { CLINIC_EXPERIENCES } from '@/data/clinic/meta';
import { CLOTHING_EXPERIENCES } from '@/data/clothing/meta';
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
  const dynamicRoutes = [
    ...(slugs?.services ?? []).map((item) => ({ path: `/services/${item.slug}`, updatedAt: item.updatedAt })),
    ...DEMO_SLUGS.filter((slug) => !(slugs?.demos ?? []).some((demo) => demo.slug === slug)).map((slug) => ({ path: `/demos/${slug}`, updatedAt: SOLUTIONS_UPDATED })),
    ...(slugs?.solutions ?? []).map((item) => ({ path: `/solutions/${item.slug}`, updatedAt: item.updatedAt })),
    ...(slugs?.demos ?? []).filter((item) => !aliases.has(item.slug)).map((item) => ({ path: `/demos/${item.slug}`, updatedAt: item.updatedAt })),
    ...[...SCHOOL_EXPERIENCES, ...CLINIC_EXPERIENCES, ...RESTAURANT_EXPERIENCES, ...GYM_EXPERIENCES, ...COURSE_EXPERIENCES, ...CLOTHING_EXPERIENCES, ...HOTEL_EXPERIENCES].map((experience) => ({ path: experience.href, updatedAt: SOLUTIONS_UPDATED })),
    ...(slugs?.caseStudies ?? []).map((item) => ({ path: `/case-studies/${item.slug}`, updatedAt: item.updatedAt })),
    ...(slugs?.articles ?? []).map((item) => ({ path: `/insights/${item.slug}`, updatedAt: item.updatedAt })),
  ];
  const hasCaseStudies = (slugs?.caseStudies.length ?? 0) > 0;
  const hasArticles = (slugs?.articles.length ?? 0) > 0;

  return [
    ...PUBLIC_ROUTES.filter((route) => (route !== '/case-studies' || hasCaseStudies) && (route !== '/insights' || hasArticles)).map((route) => ({
      url: `${base}${route === '/' ? '' : route}`,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.7,
    })),
    ...dynamicRoutes.map((item) => ({ url: `${base}${item.path}`, lastModified: new Date(item.updatedAt), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
