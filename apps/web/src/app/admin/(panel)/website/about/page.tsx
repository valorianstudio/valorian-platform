import type { Metadata } from 'next';
import { PageEditor } from '@/components/admin/cms/page-editor';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminPage } from '@/lib/server-api';

export const metadata: Metadata = { title: 'About page' };

export default async function Page() {
  const page = await getAdminPage('about');

  return (
    <>
      <PageHeader title="About page" description="Company story, mission, values and philosophy." />
      {page ? <PageEditor pageKey="about" page={page} /> : <ErrorState title="Could not load the About page" description="Reload the page to try again." />}
    </>
  );
}
