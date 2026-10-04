import type { MetadataRoute } from 'next';
import { getSeoConfig, getSlugs } from '@/lib/cms';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site';
import { SOLUTION_SLUGS } from '@/lib/solutions-catalog';

/** Catalog pages live in code, so their last-modified date is the date of the catalog's last edit rather than "now". */
const SOLUTIONS_UPDATED = '2026-10-04T00:00:00.000Z';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, seo] = await Promise.all([getSlugs(), getSeoConfig()]);
  if (seo?.allowIndexing === false) return [];
  const base = seo?.canonicalBaseUrl || SITE_URL;
  const dynamicRoutes = [
    ...(slugs?.services ?? []).map((item) => ({ path: `/services/${item.slug}`, updatedAt: item.updatedAt })),
    ...SOLUTION_SLUGS.filter((slug) => !(slugs?.demos ?? []).some((demo) => demo.slug === slug)).map((slug) => ({ path: `/demos/${slug}`, updatedAt: SOLUTIONS_UPDATED })),
    ...(slugs?.solutions ?? []).map((item) => ({ path: `/solutions/${item.slug}`, updatedAt: item.updatedAt })),
    ...(slugs?.demos ?? []).map((item) => ({ path: `/demos/${item.slug}`, updatedAt: item.updatedAt })),
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
