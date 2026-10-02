import type { MetadataRoute } from 'next';
import { getSlugs } from '@/lib/cms';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getSlugs();
  const entries = [
    ...(slugs?.services ?? []).map((item) => ({ path: `/services/${item.slug}`, updatedAt: item.updatedAt })),
    ...(slugs?.solutions ?? []).map((item) => ({ path: `/solutions/${item.slug}`, updatedAt: item.updatedAt })),
    ...(slugs?.demos ?? []).map((item) => ({ path: `/demos/${item.slug}`, updatedAt: item.updatedAt })),
  ];

  return [
    ...PUBLIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route === '/' ? '' : route}`,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.7,
    })),
    ...entries.map((item) => ({ url: `${SITE_URL}${item.path}`, lastModified: new Date(item.updatedAt), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
