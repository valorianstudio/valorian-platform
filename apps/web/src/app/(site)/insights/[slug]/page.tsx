import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleView } from '@/components/site/article-view';
import { buildMetadata, getInsight, getSeoConfig } from '@/lib/cms';
import { getSiteSettings } from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';

// Empty list: nothing is built ahead of time, but each page is rendered on its first visit and then served from cache
// (refreshed every 60 s, or immediately when an editor saves) instead of being rendered again for every request.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getInsight(slug);
  if (!data) return {};
  const { article } = data;
  return buildMetadata(article, { title: article.title, description: article.excerpt, path: `/insights/${slug}`, image: article.featuredImageUrl, type: 'article' });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [data, settings, seo] = await Promise.all([getInsight(slug), getSiteSettings(), getSeoConfig()]);
  if (!data) notFound();
  return <ArticleView article={data.article} related={data.related} baseUrl={seo?.canonicalBaseUrl || SITE_URL} company={settings.companyName} />;
}
