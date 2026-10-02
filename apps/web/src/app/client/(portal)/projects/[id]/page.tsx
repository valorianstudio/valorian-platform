import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Download, FileText } from 'lucide-react';
import { MessageThread } from '@/components/portal/message-thread';
import { RequestForm } from '@/components/portal/request-form';
import { MilestoneTimeline, ProgressBar, StatusBadge } from '@/components/portal/widgets';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { formatDate, formatDateTime, formatSize, label, REQUEST_TYPE_LABEL } from '@/lib/portal';
import type { PortalFile, PortalMessage, PortalMilestone, PortalProject, PortalRequest } from '@/lib/portal';
import { getAdminJson, getCurrentClient } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Project' };

type Detail = PortalProject & {
  milestones: PortalMilestone[];
  updates: { id: string; title: string; content: string; createdAt: string; createdByName: string }[];
  files: PortalFile[];
  requests: PortalRequest[];
};

export default async function ClientProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, project, messages] = await Promise.all([getCurrentClient(), getAdminJson<Detail>(`/client/projects/${encodeURIComponent(id)}`), getAdminJson<PortalMessage[]>(`/client/projects/${encodeURIComponent(id)}/messages`)]);
  if (!client || !project) notFound();
  const isOwner = client.role === 'OWNER';

  return (
    <>
      <Link href="/client/projects" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Projects
      </Link>
      <div className="mb-8">
        <p className="font-mono text-xs text-muted">{project.projectCode}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
      </div>

      <Tabs
        items={[
          {
            id: 'overview',
            label: 'Overview',
            content: (
              <>
                <Card className="p-5 sm:p-6">
                  <ProgressBar value={project.progressPercentage} />
                  {project.description && <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-muted">{project.description}</p>}
                  <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                    {[
                      ['Start date', formatDate(project.startDate)],
                      ['Estimated finish', formatDate(project.estimatedEndDate)],
                      ['Completed', formatDate(project.actualEndDate)],
                    ].map(([name, value]) => (
                      <div key={name}>
                        <dt className="text-muted">{name}</dt>
                        <dd className="mt-0.5 font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
                <Card className="p-5 sm:p-6">
                  <h2 className="mb-3 font-semibold">Technology</h2>
                  {project.technologies.length === 0 ? (
                    <p className="text-sm text-muted">Technology details will be shared soon.</p>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <li key={tech}>
                          <Badge>{tech}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
                <Card className="p-5 sm:p-6">
                  <h2 className="mb-4 font-semibold">Milestones</h2>
                  <MilestoneTimeline milestones={project.milestones} />
                </Card>
              </>
            ),
          },
          {
            id: 'updates',
            label: `Updates (${project.updates.length})`,
            content:
              project.updates.length === 0 ? (
                <Card className="p-6 text-sm text-muted">No updates have been shared yet.</Card>
              ) : (
                <ul className="space-y-3">
                  {project.updates.map((update) => (
                    <li key={update.id}>
                      <Card className="p-5">
                        <h3 className="font-medium">{update.title}</h3>
                        <p className="mt-0.5 text-xs text-muted">
                          {update.createdByName} · {formatDateTime(update.createdAt)}
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{update.content}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              ),
          },
          {
            id: 'files',
            label: `Files (${project.files.length})`,
            content:
              project.files.length === 0 ? (
                <Card className="p-6 text-sm text-muted">No shared files available.</Card>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.files.map((file) => (
                    <li key={file.id}>
                      <Card className="flex items-center gap-3 p-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                          <FileText className="size-5" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted">
                            {label(file.category)} · {formatSize(file.size)} · {formatDate(file.createdAt)}
                          </p>
                        </div>
                        <a href={`/api/client/files/${file.id}/download`} aria-label={`Download ${file.name}`} className="grid size-10 shrink-0 place-items-center rounded-lg hover:bg-surface-strong">
                          <Download className="size-4" aria-hidden />
                        </a>
                      </Card>
                    </li>
                  ))}
                </ul>
              ),
          },
          {
            id: 'messages',
            label: 'Messages',
            content: (
              <Card className="p-4 sm:p-5">
                <MessageThread messages={messages ?? []} endpoint={`/client/projects/${project.id}/messages`} viewer="CLIENT" />
              </Card>
            ),
          },
          {
            id: 'requests',
            label: `Requests (${project.requests.length})`,
            content: (
              <>
                {isOwner ? (
                  <Card className="p-5 sm:p-6">
                    <h2 className="mb-4 font-semibold">New request</h2>
                    <RequestForm projectId={project.id} />
                  </Card>
                ) : (
                  <Card className="p-5 text-sm text-muted">Only your company owner can submit new requests. You can message the team from the Messages tab.</Card>
                )}
                {project.requests.length > 0 && (
                  <ul className="space-y-3">
                    {project.requests.map((request) => (
                      <li key={request.id}>
                        <Card className="p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium">{request.title}</h3>
                            <Badge tone={request.status === 'RESOLVED' || request.status === 'CLOSED' ? 'accent' : 'primary'}>{label(request.status)}</Badge>
                            <Badge>{REQUEST_TYPE_LABEL[request.type]}</Badge>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{request.description}</p>
                          <p className="mt-2 text-xs text-muted">Sent {formatDateTime(request.createdAt)}</p>
                        </Card>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ),
          },
        ]}
      />
    </>
  );
}
