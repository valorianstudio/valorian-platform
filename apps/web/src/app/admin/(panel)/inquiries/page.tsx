import type { Metadata } from 'next';
import Link from 'next/link';
import { InquiryManager } from '@/components/admin/leads/inquiry-manager';
import type { InquiryRow } from '@/components/admin/leads/inquiry-manager';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Inquiries' };

export default async function Page({ searchParams }: { searchParams: Promise<{ archived?: string }> }) {
  const { archived } = await searchParams;
  const archivedView = archived === '1';
  const data = await getAdminJson<{ items: InquiryRow[]; unread: number }>(`/admin/inquiries${archivedView ? '?archived=1' : ''}`);

  return (
    <>
      <PageHeader
        title="Inquiries"
        description="General, partnership and support messages. Project requests are in Leads."
        actions={
          <Link href={archivedView ? '/admin/inquiries' : '/admin/inquiries?archived=1'} className="text-sm font-medium text-primary">
            {archivedView ? 'Back to inbox' : 'View archived'}
          </Link>
        }
      />
      {data ? <InquiryManager key={archivedView ? 'archived' : 'inbox'} initial={data.items} archivedView={archivedView} /> : <ErrorState title="Could not load inquiries" description="Reload the page to try again." />}
    </>
  );
}
