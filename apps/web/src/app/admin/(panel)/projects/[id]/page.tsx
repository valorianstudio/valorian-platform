import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { ArchiveButton, FilesPanel, MilestonesPanel, RequestsPanel, UpdatesPanel } from '@/components/admin/portal/project-panels';
import { ProjectForm } from '@/components/admin/portal/project-form';
import type { ProjectFormValues } from '@/components/admin/portal/project-form';
import { MessageThread } from '@/components/portal/message-thread';
import { StatusBadge } from '@/components/portal/widgets';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { can } from '@/lib/permissions';
import type { FileCategory, PortalMessage, PortalMilestone, RequestStatus, RequestType } from '@/lib/portal';
import { getAdminJson, getCurrentAdmin } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Project' };

type Detail = ProjectFormValues & {
  id: string;
  projectCode: string;
  archivedAt: string | null;
  organization: { id: string; companyName: string };
  lead: { id: string; referenceCode: string; name: string } | null;
  originalEstimateMin: number | null;
  originalEstimateMax: number | null;
  estimateCurrency: string | null;
  milestones: PortalMilestone[];
  updates: { id: string; title: string; content: string; visibleToClient: boolean; createdByName: string; createdAt: string }[];
  files: { id: string; name: string; fileType: string; size: number; category: FileCategory; uploadedByName: string; visibleToClient: boolean; createdAt: string }[];
  messages: PortalMessage[];
  requests: { id: string; title: string; description: string; type: RequestType; priority: string; status: RequestStatus; createdAt: string; createdBy: { name: string } | null }[];
};

export default async function AdminProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [admin, project] = await Promise.all([getCurrentAdmin(), getAdminJson<Detail>(`/admin/projects/${encodeURIComponent(id)}`)]);
  if (!admin || !project) notFound();
  const canManage = can(admin.permissions, 'projects.manage');
  const openRequests = project.requests.filter((r) => r.status === 'OPEN' || r.status === 'REVIEWING').length;

  return (
    <>
      <Link href="/admin/projects" className="mb-3 inline-flex items-center gap-1 py-2 text-sm text-muted transition-colors hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Projects
      </Link>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted">{project.projectCode}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{project.name}</h1>
            <StatusBadge status={project.status} />
            {project.archivedAt && <Badge tone="danger">Archived</Badge>}
          </div>
          <p className="mt-1.5 text-muted">
            <Link href={`/admin/clients/${project.organization.id}`} className="hover:text-foreground">
              {project.organization.companyName}
            </Link>
            {project.lead && (
              <>
                {' · '}
                <Link href={`/admin/leads/${project.lead.id}`} className="hover:text-foreground">
                  Lead {project.lead.referenceCode}
                </Link>
              </>
            )}
          </p>
        </div>
        {canManage && <ArchiveButton projectId={project.id} archived={Boolean(project.archivedAt)} />}
      </div>

      <Tabs
        items={[
          {
            id: 'details',
            label: 'Details',
            content: (
              <>
                <ProjectForm key={`${project.status}-${project.progressPercentage}-${project.name}`} initial={project} clients={[project.organization]} canManage={canManage} />
                {project.originalEstimateMin !== null && (
                  <Card className="p-5 text-sm">
                    <p className="font-medium">Original estimate (from lead)</p>
                    <p className="mt-1 text-muted">
                      {project.originalEstimateMin.toLocaleString()} – {project.originalEstimateMax?.toLocaleString()} {project.estimateCurrency}
                    </p>
                  </Card>
                )}
              </>
            ),
          },
          { id: 'milestones', label: `Milestones (${project.milestones.length})`, content: <MilestonesPanel projectId={project.id} milestones={project.milestones} canManage={canManage} /> },
          { id: 'updates', label: `Updates (${project.updates.length})`, content: <UpdatesPanel projectId={project.id} updates={project.updates} canManage={canManage} /> },
          { id: 'files', label: `Files (${project.files.length})`, content: <FilesPanel projectId={project.id} files={project.files} canManage={canManage} /> },
          {
            id: 'messages',
            label: `Messages (${project.messages.length})`,
            content: (
              <Card className="p-4 sm:p-5">
                <MessageThread messages={project.messages} endpoint={`/admin/projects/${project.id}/messages`} viewer="TEAM" allowInternal emptyText="No messages yet." />
              </Card>
            ),
          },
          { id: 'requests', label: `Requests${openRequests ? ` (${openRequests} open)` : ''}`, content: <RequestsPanel projectId={project.id} requests={project.requests} canManage={canManage} /> },
        ]}
      />
    </>
  );
}
