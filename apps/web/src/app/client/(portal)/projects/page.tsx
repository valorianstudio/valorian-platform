import type { Metadata } from 'next';
import Link from 'next/link';
import { ProgressBar, StatusBadge } from '@/components/portal/widgets';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { formatDate } from '@/lib/portal';
import type { PortalProject } from '@/lib/portal';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Projects' };

export default async function ClientProjects() {
  const projects = await getAdminJson<PortalProject[]>('/client/projects');
  if (!projects) return <ErrorState title="Could not load your projects" description="Reload the page to try again." />;

  return (
    <>
      <PageHeader title="Projects" description="All projects Valorian is delivering for your company." />
      {projects.length === 0 ? (
        <EmptyState title="No active projects yet." description="When your project starts, it will appear here." />
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/client/projects/${project.id}`} className="block rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/40">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted">{project.projectCode}</p>
                    <h2 className="mt-0.5 text-base font-semibold">{project.name}</h2>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <ProgressBar value={project.progressPercentage} className="mt-4" />
                <p className="mt-3 text-sm text-muted">
                  Started {formatDate(project.startDate)} · Estimated finish {formatDate(project.estimatedEndDate)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
