import type { Metadata } from 'next';
import { CaseStudyEditor } from '@/components/admin/content/case-study-editor';
import { loadCaseLookups } from '@/components/admin/content/lookups';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'New case study' };

export default async function Page() {
  return (
    <>
      <PageHeader title="New case study" description="Start with the basics. Add the story, results and media after creating the draft." />
      <CaseStudyEditor study={null} lookups={await loadCaseLookups()} />
    </>
  );
}
