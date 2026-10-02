import type { Metadata } from 'next';
import { PageEditor } from '@/components/admin/cms/page-editor';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminPage } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Homepage' };

export default async function Page() {
  const page = await getAdminPage('home');

  return (
    <>
      <PageHeader title="Homepage" description="Edit, hide and reorder homepage sections." />
      {page ? <PageEditor pageKey="home" page={page} /> : <ErrorState title="Could not load the homepage" description="Reload the page to try again." />}
    </>
  );
}
