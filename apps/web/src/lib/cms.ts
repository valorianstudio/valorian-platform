import 'server-only';
import { cache } from 'react';
import type { Metadata } from 'next';
import type {
  AboutData,
  HomeData,
  NavigationData,
  SectionRow,
  Seo,
  ServiceDetailData,
  ServicesData,
  SolutionDetailData,
  SolutionsData,
} from './cms-types';
import { CMS_TAG } from './server-api';
import { SITE_URL } from './site';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

async function fetchContent<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}/api/content/${path}`, { next: { revalidate: 60, tags: [CMS_TAG] } });
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}

export const getHome = cache(() => fetchContent<HomeData>('home'));
export const getAbout = cache(() => fetchContent<AboutData>('about'));
export const getServices = cache(() => fetchContent<ServicesData>('services'));
export const getService = cache((slug: string) => fetchContent<ServiceDetailData>(`services/${encodeURIComponent(slug)}`));
export const getSolutions = cache(() => fetchContent<SolutionsData>('solutions'));
export const getSolution = cache((slug: string) => fetchContent<SolutionDetailData>(`solutions/${encodeURIComponent(slug)}`));
export const getSlugs = cache(() => fetchContent<{ services: { slug: string; updatedAt: string }[]; solutions: { slug: string; updatedAt: string }[] }>('slugs'));

const FALLBACK_NAV: NavigationData = {
  items: [
    { id: 'home', label: 'Home', url: '/', location: 'HEADER', openInNewTab: false },
    { id: 'services', label: 'Services', url: '/services', location: 'HEADER', openInNewTab: false },
    { id: 'solutions', label: 'Solutions', url: '/solutions', location: 'HEADER', openInNewTab: false },
    { id: 'about', label: 'About', url: '/about', location: 'HEADER', openInNewTab: false },
    { id: 'contact', label: 'Contact', url: '/contact', location: 'HEADER', openInNewTab: false },
  ],
  cta: { label: 'Start a Project', url: '/contact', description: null },
};

export const getNavigation = cache(async () => (await fetchContent<NavigationData>('navigation')) ?? FALLBACK_NAV);

export function findSection<C>(sections: SectionRow[] | undefined, key: string): C | null {
  return (sections?.find((section) => section.key === key)?.content as C | undefined) ?? null;
}

export function buildMetadata(seo: Seo | null | undefined, fallback: { title: string; description: string; path: string }): Metadata {
  const title = seo?.metaTitle || fallback.title;
  const description = seo?.metaDescription || fallback.description;
  const canonical = seo?.canonicalUrl || fallback.path;
  return {
    title: fallback.path === '/' && seo?.metaTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${fallback.path}`,
      images: seo?.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
    },
  };
}

export function isExternal(url: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(url);
}
