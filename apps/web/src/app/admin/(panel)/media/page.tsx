import type { Metadata } from 'next';
import { MediaLibrary } from '@/components/admin/media/media-library';
import type { MediaPage } from '@/components/admin/media/media-picker';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Media' };

export default async function Page() {
  const data = await getAdminJson<MediaPage>('/admin/media');

  return (
    <>
      <PageHeader title="Media library" description="Images shared across pages, demos, case studies, testimonials and articles." />
      {data ? <MediaLibrary initial={data} /> : <ErrorState title="Could not load media" description="Reload the page to try again." />}
    </>
  );
}
