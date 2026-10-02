import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { can } from '@/lib/permissions';
import { LeadDetail } from '@/components/admin/leads/lead-detail';
import type { LeadFull } from '@/components/admin/leads/lead-detail';
import { getAdminJson, getCurrentAdmin, getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Lead' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, admin, settings] = await Promise.all([getAdminJson<LeadFull>(`/admin/leads/${encodeURIComponent(id)}`), getCurrentAdmin(), getSiteSettings()]);
  if (!lead || !admin) notFound();

  const linked = lead.status === 'WON' && can(admin.permissions, 'projects.view') ? await getAdminJson<{ id: string | null; projectCode?: string }>(`/admin/projects/by-lead/${encodeURIComponent(id)}`) : null;
  const canCreate = lead.status === 'WON' && !linked?.id && can(admin.permissions, 'projects.manage');

  return (
    <>
      {linked?.id && (
        <p className="mb-4 rounded-lg border border-border bg-background px-4 py-3 text-sm">
          Client project <Link href={`/admin/projects/${linked.id}`} className="font-medium text-primary">{linked.projectCode}</Link> was created from this lead.
        </p>
      )}
      {canCreate && (
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm">
          <span className="font-medium text-accent">Won. Ready to onboard this client?</span>
          {can(admin.permissions, 'clients.manage') && <Link href={`/admin/clients?fromLead=${encodeURIComponent(id)}`} className="font-medium text-primary">1. Create client</Link>}
          <Link href={`/admin/projects/new?lead=${encodeURIComponent(id)}`} className="font-medium text-primary">2. Create project</Link>
        </div>
      )}
      <LeadDetailView lead={lead} adminId={admin.id} company={settings.companyName} />
    </>
  );
}

function LeadDetailView({ lead, adminId, company }: { lead: LeadFull; adminId: string; company: string }) {
  return <LeadDetail key={`${lead.status}-${lead.priority}-${lead.notes.length}-${lead.activities.length}-${lead.followUpAt}-${lead.finalProjectValue}`} lead={lead} currentAdminId={adminId} company={company} />;
}
