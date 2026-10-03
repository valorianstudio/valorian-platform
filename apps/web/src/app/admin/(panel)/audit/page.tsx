import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDateTime, titleCase } from '@/components/admin/team/shared';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Audit log' };

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';
const KEYS = ['q', 'user', 'action', 'module', 'entityType', 'from', 'to'] as const;
const ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'ARCHIVE', 'RESTORE', 'PUBLISH', 'UNPUBLISH', 'LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'ROLE_CHANGE', 'PASSWORD_CHANGE', 'STATUS_CHANGE', 'PRICE_CHANGE', 'SETTINGS_CHANGE'];

interface Entry {
  id: string;
  adminName: string;
  action: string;
  module: string;
  entityType: string | null;
  entityLabel: string | null;
  summary: string;
  createdAt: string;
}

const tone = (action: string) => (action === 'DELETE' || action === 'LOGIN_FAILED' ? 'danger' : action === 'CREATE' || action === 'PUBLISH' ? 'accent' : 'neutral');

export default async function AuditPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const values = Object.fromEntries(KEYS.map((key) => [key, first(params[key])])) as Record<(typeof KEYS)[number], string>;
  const query = new URLSearchParams();
  for (const key of KEYS) if (values[key]) query.set(key, values[key]);
  const apiQuery = new URLSearchParams(query);
  const page = first(params.page);
  if (page) apiQuery.set('page', page);

  const [data, filters] = await Promise.all([
    getAdminJson<{ items: Entry[]; total: number; page: number; pageSize: number }>(`/admin/audit?${apiQuery}`),
    getAdminJson<{ users: { id: string; name: string }[]; modules: string[]; entityTypes: string[] }>('/admin/audit/filters'),
  ]);
  if (!data || !filters) return <ErrorState title="Could not load the audit log" description="Reload the page to try again." />;
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));
  const hrefFor = (p: number) => {
    const next = new URLSearchParams(query);
    if (p > 1) next.set('page', String(p));
    return `/admin/audit${next.size ? `?${next}` : ''}`;
  };

  return (
    <>
      <PageHeader title="Audit log" description="A permanent record of who changed what. Entries cannot be edited or deleted." />

      <form method="get" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input name="q" defaultValue={values.q} placeholder="Search summary, entity or person" aria-label="Search" className="lg:col-span-2" />
        <Select name="user" defaultValue={values.user} aria-label="User">
          <option value="">All users</option>
          {filters.users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
        <Select name="action" defaultValue={values.action} aria-label="Action">
          <option value="">All actions</option>
          {ACTIONS.map((action) => (
            <option key={action} value={action}>
              {titleCase(action)}
            </option>
          ))}
        </Select>
        <Select name="module" defaultValue={values.module} aria-label="Module">
          <option value="">All modules</option>
          {filters.modules.map((module) => (
            <option key={module} value={module}>
              {titleCase(module)}
            </option>
          ))}
        </Select>
        <Select name="entityType" defaultValue={values.entityType} aria-label="Entity">
          <option value="">All entities</option>
          {filters.entityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <Input name="from" type="date" defaultValue={values.from} aria-label="From date" />
        <Input name="to" type="date" defaultValue={values.to} aria-label="To date" />
        <Button type="submit" variant="secondary" className="sm:col-span-2 lg:col-span-4 lg:justify-self-start">
          Apply filters
        </Button>
      </form>

      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {data.total} {data.total === 1 ? 'entry' : 'entries'}
        {query.size > 0 && (
          <>
            {' · '}
            <Link href="/admin/audit" className="text-primary">
              Clear filters
            </Link>
          </>
        )}
      </p>

      {data.items.length === 0 ? (
        <EmptyState title="No entries" description={query.size ? 'Try different filters.' : 'Activity will appear here as your team works.'} />
      ) : (
        <ul className="space-y-2">
          {data.items.map((entry) => (
            <li key={entry.id}>
              <Card className="transition-colors hover:border-primary/40">
                <Link href={`/admin/audit/${entry.id}`} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{entry.summary}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {entry.adminName} · {titleCase(entry.module)}
                      {entry.entityLabel ? ` · ${entry.entityLabel}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
                    <Badge tone={tone(entry.action)}>{titleCase(entry.action)}</Badge>
                    <time dateTime={entry.createdAt}>{formatDateTime(entry.createdAt)}</time>
                  </div>
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
