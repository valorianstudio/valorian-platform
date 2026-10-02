import type { Metadata } from 'next';
import { DemoManager } from '@/components/admin/demos/demo-manager';
import type { DemoRow, NamedRef } from '@/components/admin/demos/types';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminDemos, getAdminList } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Demos' };

export default async function Page() {
  const [demos, categories, industries] = await Promise.all([
    getAdminDemos<DemoRow>(),
    getAdminList<NamedRef>('demo-categories'),
    getAdminList<{ id: string; name: string }>('solutions'),
  ]);

  return (
    <>
      <PageHeader title="Demos" description="Manage the demo showcase. Only published, active demos appear publicly." />
      <DemoManager initial={demos} categories={categories} industries={industries} />
    </>
  );
}
