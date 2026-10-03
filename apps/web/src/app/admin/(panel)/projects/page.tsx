import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ProgressBar, StatusBadge } from '@/components/portal/widgets';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { PROJECT_STATUSES, formatDate, label } from '@/lib/portal';
import type { ProjectStatus } from '@/lib/portal';
import { can } from '@/lib/permissions';
import { getAdminJson, getCurrentAdmin } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Projects' };

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

interface Row {
  id: string;
  projectCode: string;
  name: string;
  status: ProjectStatus;
  progressPercentage: number;
  estimatedEndDate: string | null;
  organization: { id: string; companyName: string };
  openRequests: number;
  unreadMessages: number;
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const admin = await getCurrentAdmin();
  const values = { q: first(params.q), status: first(params.status), client: first(params.client), archived: first(params.archived) };
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value) query.set(key, value);
  const apiQuery = new URLSearchParams(query);
  if (first(params.page)) apiQuery.set('page', first(params.page));

  const [data, clients] = await Promise.all([
    getAdminJson<{ items: Row[]; total: number; page: number; pageSize: number }>(`/admin/projects?${apiQuery}`),
    getAdminJson<{ id: string; companyName: string }[]>('/admin/clients/options'),
  ]);
  if (!data) return <ErrorState title="Could not load projects" description="Reload the page to try again." />;
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));
  const hrefFor = (p: number) => {
    const next = new URLSearchParams(query);
    if (p > 1) next.set('page', String(p));
    return `/admin/projects${next.size ? `?${next}` : ''}`;
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Client projects visible in the client portal."
        actions={
          can(admin?.permissions, 'projects.manage') ? (
            <ButtonLink href="/admin/projects/new">
              <Plus className="size-4" aria-hidden /> New project
            </ButtonLink>
          ) : undefined
        }
      />

      <form method="get" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_11rem_12rem_9rem_auto]">
        <Input name="q" defaultValue={values.q} placeholder="Search project, code or client" aria-label="Search projects" />
        <Select name="status" defaultValue={values.status} aria-label="Status">
          <option value="">Any status</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </Select>
        <Select name="client" defaultValue={values.client} aria-label="Client">
          <option value="">All clients</option>
          {(clients ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.companyName}
            </option>
          ))}
        </Select>
        <Select name="archived" defaultValue={values.archived} aria-label="Archive">
          <option value="">Active</option>
          <option value="true">Archived</option>
        </Select>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {data.total} {data.total === 1 ? 'project' : 'projects'}
        {query.size > 0 && (
          <>
            {' · '}
            <Link href="/admin/projects" className="text-primary">
              Clear filters
            </Link>
          </>
        )}
      </p>

      {data.items.length === 0 ? (
        <EmptyState title="No projects found" description="Create a project for a client to share progress in the portal." />
      ) : (
        <ul className="space-y-3">
          {data.items.map((project) => (
            <li key={project.id}>
              <Card className="transition-colors hover:border-primary/40">
                <Link href={`/admin/projects/${project.id}`} className="block p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted">{project.projectCode}</p>
                      <p className="truncate font-medium">{project.name}</p>
                      <p className="text-sm text-muted">{project.organization.companyName}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={project.status} />
                      {project.unreadMessages > 0 && <Badge tone="primary">{project.unreadMessages} unread</Badge>}
                      {project.openRequests > 0 && <Badge tone="danger">{project.openRequests} open requests</Badge>}
                    </div>
                  </div>
                  <ProgressBar value={project.progressPercentage} className="mt-3" />
                  <p className="mt-2 text-xs text-muted">Estimated finish {formatDate(project.estimatedEndDate)}</p>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">
            Page {data.page} of {pageCount}
          </span>
          <div className="flex gap-2">
            {data.page > 1 && (
              <ButtonLink href={hrefFor(data.page - 1)} variant="secondary" size="sm">
                Previous
              </ButtonLink>
            )}
            {data.page < pageCount && (
              <ButtonLink href={hrefFor(data.page + 1)} variant="secondary" size="sm">
                Next
              </ButtonLink>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
