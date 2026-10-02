import type { MetadataRoute } from 'next';
import { getSeoConfig } from '@/lib/cms';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoConfig();
  const base = seo?.canonicalBaseUrl || SITE_URL;
  if (seo?.allowIndexing === false) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: ['/', '/api/media/'], disallow: ['/admin', '/client', '/api/'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
