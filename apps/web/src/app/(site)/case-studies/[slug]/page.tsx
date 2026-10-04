import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyView } from '@/components/site/case-study-view';
import { buildMetadata, getCaseStudy, getSeoConfig } from '@/lib/cms';
import { getSiteSettings } from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';

// Empty list: nothing is built ahead of time, but each page is rendered on its first visit and then served from cache
// (refreshed every 60 s, or immediately when an editor saves) instead of being rendered again for every request.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCaseStudy(slug);
  if (!data) return {};
  const { study } = data;
  return buildMetadata(study, { title: study.title, description: study.shortDescription, path: `/case-studies/${slug}`, image: study.featuredImageUrl ?? study.coverImageUrl, type: 'article' });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [data, settings, seo] = await Promise.all([getCaseStudy(slug), getSiteSettings(), getSeoConfig()]);
  if (!data) notFound();
  return <CaseStudyView study={data.study} related={data.related} baseUrl={seo?.canonicalBaseUrl || SITE_URL} company={settings.companyName} />;
}
