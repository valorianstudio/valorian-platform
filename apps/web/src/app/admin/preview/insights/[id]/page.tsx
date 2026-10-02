import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ArticleView } from '@/components/site/article-view';
import { PreviewBanner } from '@/components/site/preview-banner';
import type { ArticleDetail } from '@/lib/cms-types';
import { getAdminJson, getCurrentAdmin, getSiteSettings } from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = { title: 'Article preview', robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await getCurrentAdmin())) redirect('/admin/login');
  const [raw, settings] = await Promise.all([getAdminJson<Record<string, unknown> & { tags: string[] }>(`/admin/articles/${encodeURIComponent(id)}`), getSiteSettings()]);
  if (!raw) notFound();
  const article = {
    ...raw,
    tags: raw.tags.map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') })),
    services: [],
    category: (raw.category as ArticleDetail['category']) ?? null,
  } as unknown as ArticleDetail;

  return (
    <>
      <PreviewBanner status={String(raw.status)} editHref={`/admin/insights/${id}/edit`} />
      <ArticleView article={article} related={[]} baseUrl={SITE_URL} company={settings.companyName} preview />
    </>
  );
}
