import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { ClientEditor, ClientUsers } from '@/components/admin/portal/client-detail';
import type { OrgData, OrgUser } from '@/components/admin/portal/client-detail';
import { StatusBadge, ProgressBar } from '@/components/portal/widgets';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { formatDateTime, label } from '@/lib/portal';
import type { ProjectStatus } from '@/lib/portal';
import { can } from '@/lib/permissions';
import { getAdminJson, getCurrentAdmin } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Client' };

type Detail = OrgData & {
  users: OrgUser[];
  projects: { id: string; projectCode: string; name: string; status: ProjectStatus; progressPercentage: number }[];
  activity: { id: string; action: string; summary: string; adminName: string; createdAt: string }[];
};

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [admin, org] = await Promise.all([getCurrentAdmin(), getAdminJson<Detail>(`/admin/clients/${encodeURIComponent(id)}`)]);
  if (!admin || !org) notFound();
  const canManage = can(admin.permissions, 'clients.manage');

  return (
    <>
      <Link href="/admin/clients" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Clients
      </Link>
      <PageHeader
        title={org.companyName}
        description={org.contactEmail}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={org.active ? 'accent' : 'danger'}>{org.active ? 'Active' : 'Inactive'}</Badge>
            {can(admin.permissions, 'projects.manage') && org.active && (
              <ButtonLink href={`/admin/projects/new?client=${org.id}`} size="sm">
                New project
              </ButtonLink>
            )}
          </div>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <ClientEditor org={org} canManage={canManage} />
          <ClientUsers orgId={org.id} users={org.users} canManage={canManage} />
        </div>
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-3 font-semibold">Projects</h2>
            {org.projects.length === 0 ? (
              <p className="text-sm text-muted">No projects yet.</p>
            ) : (
              <ul className="space-y-4">
                {org.projects.map((project) => (
                  <li key={project.id}>
                    <Link href={`/admin/projects/${project.id}`} className="block hover:text-primary">
                      <p className="flex items-center justify-between gap-2 text-sm font-medium">
                        <span className="truncate">{project.name}</span>
                        <StatusBadge status={project.status} />
                      </p>
                      <p className="font-mono text-xs text-muted">{project.projectCode}</p>
                      <ProgressBar value={project.progressPercentage} className="mt-2" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 font-semibold">Recent activity</h2>
            {org.activity.length === 0 ? (
              <p className="text-sm text-muted">No activity yet.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {org.activity.map((entry) => (
                  <li key={entry.id}>
                    <p>{entry.summary}</p>
                    <p className="text-xs text-muted">
                      {entry.adminName} · {label(entry.action)} · {formatDateTime(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
