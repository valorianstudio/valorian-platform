import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DemoEditor } from '@/components/admin/demos/demo-editor';
import { loadDemoLookups } from '@/components/admin/demos/lookups';
import type { DemoFull } from '@/components/admin/demos/types';
import { PageHeader } from '@/components/ui/page-header';
import { unwrap } from '@/lib/api-response';
import { authedFetch } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Edit demo' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [response, lookups] = await Promise.all([authedFetch(`/admin/demos/${encodeURIComponent(id)}`), loadDemoLookups()]);
  if (!response?.ok) notFound();
  const demo = unwrap(await response.json()) as DemoFull;

  return (
    <>
      <PageHeader title={demo.name} description="Edit this demo. Each tab saves independently." />
      <DemoEditor demo={demo} lookups={lookups} />
    </>
  );
}
