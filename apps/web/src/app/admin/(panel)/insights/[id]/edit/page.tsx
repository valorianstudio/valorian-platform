import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/content/article-editor';
import type { ArticleFull } from '@/components/admin/content/article-editor';
import { loadArticleLookups } from '@/components/admin/content/lookups';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Edit article' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, lookups] = await Promise.all([getAdminJson<ArticleFull>(`/admin/articles/${encodeURIComponent(id)}`), loadArticleLookups()]);
  if (!article) notFound();
  return (
    <>
      <PageHeader title={article.title} description="Each tab saves independently." />
      <ArticleEditor article={article} lookups={lookups} />
    </>
  );
}
