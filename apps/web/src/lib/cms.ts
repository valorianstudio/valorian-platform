import 'server-only';
import { cache } from 'react';
import type { Metadata } from 'next';
import type {
  AboutData,
  ArticleDetail,
  ArticleListData,
  CaseDetail,
  CaseListData,
  SeoConfig,
  EstimatorConfig,
  DemoDetail,
  DemoListData,
  HomeData,
  NavigationData,
  SectionRow,
  Seo,
  ServiceDetailData,
  ServicesData,
  SolutionDetailData,
  SolutionsData,
} from './cms-types';
import { unwrap } from './api-response';
import { CMS_TAG } from './server-api';
import { SITE_URL } from './site';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

async function fetchContent<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}/api/content/${path}`, { next: { revalidate: 60, tags: [CMS_TAG] } });
    return response.ok ? (unwrap(await response.json()) as T) : null;
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
type SlugList = { slug: string; updatedAt: string }[];
export const getSlugs = cache(() => fetchContent<{ services: SlugList; solutions: SlugList; demos: SlugList; caseStudies: SlugList; articles: SlugList }>('slugs'));
export const getDemoList = cache((query: string) => fetchContent<DemoListData>(`demos${query ? `?${query}` : ''}`));
export const getEstimatorConfig = cache((query: string) => fetchContent<EstimatorConfig>(`../estimator/config${query ? `?${query}` : ''}`));
export const getLeadConfig = cache(() => fetchContent<{ responseNote: string | null }>('../leads/config'));
export const getCaseStudies = cache((query: string) => fetchContent<CaseListData>(`case-studies${query ? `?${query}` : ''}`));
export const getCaseStudy = cache((slug: string) => fetchContent<{ study: CaseDetail; related: CaseListData['items'] }>(`case-studies/${encodeURIComponent(slug)}`));
export const getInsights = cache((query: string) => fetchContent<ArticleListData>(`insights${query ? `?${query}` : ''}`));
export const getInsight = cache((slug: string) => fetchContent<{ article: ArticleDetail; related: ArticleListData['items'] }>(`insights/${encodeURIComponent(slug)}`));
export const getPageSeo = cache(async (key: string): Promise<Seo | null> => (await fetchContent<Record<string, Seo>>('page-seo'))?.[key] ?? null);
export const getSeoConfig = cache(() => fetchContent<SeoConfig>('../seo/config'));
export const getAnalyticsConfig = cache(async () => (await fetchContent<{ enabled: boolean }>('../analytics/config')) ?? { enabled: false });
export const getDemo = cache((slug: string) => fetchContent<DemoDetail>(`demos/${encodeURIComponent(slug)}`));

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

export async function buildMetadata(
  seo: Seo | null | undefined,
  fallback: { title: string; description: string; path: string; image?: string | null; type?: 'website' | 'article' },
): Promise<Metadata> {
  const config = await getSeoConfig();
  const base = config?.canonicalBaseUrl || SITE_URL;
  const title = seo?.metaTitle || (fallback.path === '/' ? config?.defaultTitle : null) || fallback.title;
  const description = seo?.metaDescription || config?.defaultDescription || fallback.description;
  const canonical = seo?.canonicalUrl || fallback.path;
  const image = seo?.ogImageUrl || fallback.image || config?.defaultOgImageUrl || undefined;
  const hidden = seo?.noindex || config?.allowIndexing === false;
  return {
    title: fallback.path === '/' ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: hidden ? { index: false, follow: false } : undefined,
    openGraph: {
      type: fallback.type ?? 'website',
      title,
      description,
      url: `${base}${fallback.path === '/' ? '' : fallback.path}`,
      siteName: config?.siteName ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', site: config?.twitterHandle ? `@${config.twitterHandle}` : undefined, title, description, images: image ? [image] : undefined },
  };
}

export function isExternal(url: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(url);
}
