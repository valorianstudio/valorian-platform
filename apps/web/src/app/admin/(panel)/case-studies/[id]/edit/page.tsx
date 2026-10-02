import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyEditor } from '@/components/admin/content/case-study-editor';
import type { CaseStudyFull } from '@/components/admin/content/case-study-editor';
import { loadCaseLookups } from '@/components/admin/content/lookups';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Edit case study' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [study, lookups] = await Promise.all([getAdminJson<CaseStudyFull>(`/admin/case-studies/${encodeURIComponent(id)}`), loadCaseLookups()]);
  if (!study) notFound();
  return (
    <>
      <PageHeader title={study.title} description="Each tab saves independently." />
      <CaseStudyEditor study={study} lookups={lookups} />
    </>
  );
}
