import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LeadDetail } from '@/components/admin/leads/lead-detail';
import type { LeadFull } from '@/components/admin/leads/lead-detail';
import { getAdminJson, getCurrentAdmin, getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Lead' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, admin, settings] = await Promise.all([getAdminJson<LeadFull>(`/admin/leads/${encodeURIComponent(id)}`), getCurrentAdmin(), getSiteSettings()]);
  if (!lead || !admin) notFound();

  return <LeadDetail key={`${lead.status}-${lead.priority}-${lead.notes.length}-${lead.activities.length}-${lead.followUpAt}-${lead.finalProjectValue}`} lead={lead} currentAdminId={admin.id} company={settings.companyName} />;
}
