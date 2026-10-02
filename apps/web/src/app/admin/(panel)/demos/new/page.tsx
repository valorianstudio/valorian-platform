import type { Metadata } from 'next';
import { DemoEditor } from '@/components/admin/demos/demo-editor';
import { loadDemoLookups } from '@/components/admin/demos/lookups';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'New demo' };

export default async function Page() {
  const lookups = await loadDemoLookups();

  return (
    <>
      <PageHeader title="New demo" description="Start with the basics. Platforms, features and screenshots unlock after it is created." />
      <DemoEditor demo={null} lookups={lookups} />
    </>
  );
}
