import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentList } from '@/components/admin/content/content-list';
import { getAdminList } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Insights' };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const categories = await getAdminList<{ id: string; name: string }>('article-categories');
  return (
    <ContentList
      title="Insights"
      description="Articles published at /insights. Drafts and scheduled articles are never shown publicly."
      resource="articles"
      adminPath="insights"
      publicPath="insights"
      singular="article"
      searchParams={await searchParams}
      filter={{ name: 'category', label: 'Category', options: categories.map((c) => ({ value: c.id, label: c.name })) }}
      meta={(row) => [(row.category as { name: string } | null)?.name ?? 'Uncategorised', row.authorName as string | null, row.readingTime ? `${row.readingTime} min read` : null].filter(Boolean).join(' · ')}
      extraActions={
        <Link href="/admin/insight-categories" className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-strong">
          Categories
        </Link>
      }
    />
  );
}
