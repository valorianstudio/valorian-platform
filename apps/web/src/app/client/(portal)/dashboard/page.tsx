import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, MessageSquare, Megaphone } from 'lucide-react';
import { ProgressBar, StatusBadge } from '@/components/portal/widgets';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { formatDate, formatDateTime, formatSize, label } from '@/lib/portal';
import type { PortalFile, PortalProject, ProjectStatus } from '@/lib/portal';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Dashboard' };

interface Dashboard {
  companyName: string;
  projects: (PortalProject & { nextMilestone: { title: string; status: string; dueDate: string | null } | null; unreadMessages: number })[];
  recentUpdates: { id: string; title: string; content: string; createdAt: string; project: { id: string; name: string } }[];
  recentFiles: (PortalFile & { project: { id: string; name: string } })[];
  latestMessages: { id: string; senderType: 'CLIENT' | 'TEAM'; senderName: string; message: string; createdAt: string; project: { id: string; name: string } }[];
  pending: { unreadMessages: number; openRequests: number; delayedMilestones: number };
}

const ACTIVE = new Set<ProjectStatus>(['DISCOVERY', 'DESIGN', 'DEVELOPMENT', 'TESTING', 'REVIEW', 'DEPLOYMENT']);

export default async function ClientDashboard() {
  const data = await getAdminJson<Dashboard>('/client/dashboard');
  if (!data) return <ErrorState title="Could not load your dashboard" description="Reload the page to try again." />;
  const active = data.projects.filter((p) => ACTIVE.has(p.status));
  const others = data.projects.filter((p) => !ACTIVE.has(p.status));
  const pending = data.pending;

  return (
    <>
      <PageHeader title={`Welcome, ${data.companyName}`} description="Everything about your projects with Valorian, in one place." />

      {data.projects.length === 0 ? (
        <EmptyState title="No active projects yet." description="When your project starts, you will see its progress, files and updates here." />
      ) : (
        <>
          <section aria-labelledby="projects-heading">
            <h2 id="projects-heading" className="mb-3 text-lg font-semibold">
              Your projects
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[...active, ...others].map((project) => (
                <Link key={project.id} href={`/client/projects/${project.id}`} className="block rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted">{project.projectCode}</p>
                      <h3 className="mt-0.5 truncate text-base font-semibold">{project.name}</h3>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                  <ProgressBar value={project.progressPercentage} className="mt-4" />
                  <p className="mt-3 text-sm text-muted">{project.nextMilestone ? `Next: ${project.nextMilestone.title}${project.nextMilestone.dueDate ? ` · ${formatDate(project.nextMilestone.dueDate)}` : ''}` : project.status === 'COMPLETED' ? 'All milestones complete' : 'No upcoming milestone'}</p>
                  {project.unreadMessages > 0 && <Badge tone="primary" className="mt-3">{project.unreadMessages} new {project.unreadMessages === 1 ? 'message' : 'messages'}</Badge>}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Pending actions">
            {[
              ['Unread messages', pending.unreadMessages, false],
              ['Open requests', pending.openRequests, false],
              ['Delayed milestones', pending.delayedMilestones, true],
            ].map(([name, count, warn]) => (
              <Card key={name as string} className="p-4">
                <p className="text-sm text-muted">{name}</p>
                <p className={`mt-1 text-2xl font-semibold tabular-nums ${warn && (count as number) > 0 ? 'text-danger' : ''}`}>{count as number}</p>
              </Card>
            ))}
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="mb-4 flex items-center gap-2 font-semibold">
                <Megaphone className="size-4 text-primary" aria-hidden /> Recent updates
              </h2>
              {data.recentUpdates.length === 0 ? (
                <p className="text-sm text-muted">No updates yet.</p>
              ) : (
                <ul className="space-y-4">
                  {data.recentUpdates.map((update) => (
                    <li key={update.id}>
                      <Link href={`/client/projects/${update.project.id}`} className="font-medium hover:text-primary">
                        {update.title}
                      </Link>
                      <p className="line-clamp-2 text-sm text-muted">{update.content}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {update.project.name} · {formatDateTime(update.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 flex items-center gap-2 font-semibold">
                <MessageSquare className="size-4 text-primary" aria-hidden /> Latest messages
              </h2>
              {data.latestMessages.length === 0 ? (
                <p className="text-sm text-muted">No messages yet.</p>
              ) : (
                <ul className="space-y-4">
                  {data.latestMessages.map((m) => (
                    <li key={m.id}>
                      <p className="text-sm">
                        <span className="font-medium">{m.senderType === 'TEAM' ? `${m.senderName} (Valorian)` : m.senderName}</span>
                      </p>
                      <p className="line-clamp-2 text-sm text-muted">{m.message}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {m.project.name} · {formatDateTime(m.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-5 lg:col-span-2">
              <h2 className="mb-4 flex items-center gap-2 font-semibold">
                <FileText className="size-4 text-primary" aria-hidden /> Recent files
              </h2>
              {data.recentFiles.length === 0 ? (
                <p className="text-sm text-muted">No shared files available.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {data.recentFiles.map((file) => (
                    <li key={file.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <a href={`/api/client/files/${file.id}/download`} className="block truncate text-sm font-medium hover:text-primary">
                          {file.name}
                        </a>
                        <p className="text-xs text-muted">
                          {label(file.category)} · {formatSize(file.size)} · {file.project.name}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-muted" aria-hidden />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
