import type { Metadata } from 'next';
import { ArticleEditor } from '@/components/admin/content/article-editor';
import { loadArticleLookups } from '@/components/admin/content/lookups';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'New article' };

export default async function Page() {
  return (
    <>
      <PageHeader title="New article" description="Write in Markdown. You can add images from the media library." />
      <ArticleEditor article={null} lookups={await loadArticleLookups()} />
    </>
  );
}
