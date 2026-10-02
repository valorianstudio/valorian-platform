import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Settings2 } from 'lucide-react';
import { LeadRowCard } from '@/components/admin/leads/lead-row';
import { LEAD_FILTER_KEYS, LeadFilters } from '@/components/admin/leads/lead-filters';
import { STATUS_LABEL } from '@/components/admin/leads/shared';
import type { LeadRow, LeadStats } from '@/components/admin/leads/shared';
import { ButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { getAdminDemos, getAdminJson, getAdminList } from '@/lib/server-api';
import type { LeadStatus } from '@/lib/types';

export const metadata: Metadata = { title: 'Leads' };

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';
const CARDS: LeadStatus[] = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of LEAD_FILTER_KEYS) {
    const value = first(params[key]);
    if (value) query.set(key, value);
  }
  const queryString = query.toString();
  const hrefFor = (overrides: Record<string, string>) => {
    const next = new URLSearchParams(query);
    for (const [key, value] of Object.entries(overrides)) value ? next.set(key, value) : next.delete(key);
    return `/admin/leads${next.size ? `?${next}` : ''}`;
  };

  const [data, stats, demos, services] = await Promise.all([
    getAdminJson<{ items: LeadRow[]; total: number; page: number; pageSize: number }>(`/admin/leads?${queryString}`),
    getAdminJson<LeadStats>('/admin/leads/stats'),
    getAdminDemos<{ id: string; name: string }>(),
    getAdminList<{ id: string; title: string }>('services'),
  ]);
  if (!data) return <ErrorState title="Could not load leads" description="Reload the page to try again." />;
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <>
      <PageHeader
        title="Leads"
        description="Project requests from the website, estimator, demos and services."
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/admin/leads/settings" variant="secondary" size="sm">
              <Settings2 className="size-4" aria-hidden /> Settings
            </ButtonLink>
            <a href={`/api/admin/leads/export${queryString ? `?${queryString}` : ''}`} download className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-strong">
              <Download className="size-4" aria-hidden /> Export CSV
            </a>
          </div>
        }
      />

      {stats && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CARDS.map((status) => (
              <Link key={status} href={hrefFor({ status, page: '' })} className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40">
                <p className="text-sm text-muted">{STATUS_LABEL[status]}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{stats.byStatus[status] ?? 0}</p>
              </Link>
            ))}
          </div>
          <div className="mb-6 flex flex-wrap gap-2 text-sm">
            {([['overdue', 'Overdue follow-ups', stats.followUps.overdue], ['today', 'Due today', stats.followUps.today], ['upcoming', 'Upcoming', stats.followUps.upcoming]] as const).map(([key, label, count]) => (
              <Link key={key} href={hrefFor({ followUp: key, page: '' })} className={`rounded-full border px-3 py-1 ${key === 'overdue' && count > 0 ? 'border-danger/40 bg-danger-soft text-danger' : 'border-border text-muted hover:text-foreground'}`}>
                {label}: <strong className="tabular-nums">{count}</strong>
              </Link>
            ))}
          </div>
        </>
      )}

      <LeadFilters values={Object.fromEntries(LEAD_FILTER_KEYS.map((key) => [key, first(params[key])]))} demos={demos} services={services} />

      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {data.total} {data.total === 1 ? 'lead' : 'leads'}
        {query.size > 0 && (
          <>
            {' · '}
            <Link href="/admin/leads" className="text-primary">Clear filters</Link>
          </>
        )}
      </p>

      {data.items.length === 0 ? (
        <EmptyState title={query.size ? 'No leads match' : 'No leads yet'} description={query.size ? 'Try different filters.' : 'Leads from the contact form, estimator, demos and services will appear here.'} />
      ) : (
        <ul className="space-y-3">
          {data.items.map((lead) => (
            <li key={lead.id}>
              <LeadRowCard lead={lead} />
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">Page {data.page} of {pageCount}</span>
          <div className="flex gap-2">
            {data.page > 1 && <ButtonLink href={hrefFor({ page: String(data.page - 1) })} variant="secondary" size="sm">Previous</ButtonLink>}
            {data.page < pageCount && <ButtonLink href={hrefFor({ page: String(data.page + 1) })} variant="secondary" size="sm">Next</ButtonLink>}
          </div>
        </nav>
      )}
    </>
  );
}
