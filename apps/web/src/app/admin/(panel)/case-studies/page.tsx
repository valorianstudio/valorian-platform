import type { Metadata } from 'next';
import { ContentList } from '@/components/admin/content/content-list';
import { getAdminList } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Case studies' };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const industries = await getAdminList<{ id: string; name: string }>('solutions');
  return (
    <ContentList
      title="Case studies"
      description="Write-ups of real, approved client projects. Drafts are never shown publicly."
      resource="case-studies"
      adminPath="case-studies"
      publicPath="case-studies"
      singular="case study"
      searchParams={await searchParams}
      filter={{ name: 'industry', label: 'Industry', options: industries.map((i) => ({ value: i.id, label: i.name })) }}
      meta={(row) => [row.clientName as string | null, (row.industry as { name: string } | null)?.name].filter(Boolean).join(' · ') || 'No client or industry yet'}
    />
  );
}
