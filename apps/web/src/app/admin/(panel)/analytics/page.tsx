import type { Metadata } from 'next';
import Link from 'next/link';
import { Settings2 } from 'lucide-react';
import { AcquisitionSection, ContentSection, EstimatorSection, OverviewSection, SalesSection } from '@/components/admin/analytics/sections';
import type { AcquisitionData, ContentData, EstimatorData, OverviewData, SalesData } from '@/components/admin/analytics/types';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { cn } from '@/lib/cn';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Analytics' };

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'acquisition', label: 'Acquisition' },
  { key: 'content', label: 'Content' },
  { key: 'estimator', label: 'Estimator' },
  { key: 'sales', label: 'Sales' },
] as const;
const RANGES = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: 'year', label: 'This year' },
] as const;

const dateFmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const tab = TABS.find((t) => t.key === first(params.tab))?.key ?? 'overview';
  const range = first(params.range);
  const from = first(params.from);
  const to = first(params.to);
  const query = new URLSearchParams();
  if (range) query.set('range', range);
  if (range === 'custom') {
    if (from) query.set('from', from);
    if (to) query.set('to', to);
  }
  const href = (overrides: Record<string, string>) => {
    const next = new URLSearchParams(query);
    next.set('tab', tab);
    for (const [key, value] of Object.entries(overrides)) value ? next.set(key, value) : next.delete(key);
    return `/admin/analytics?${next}`;
  };

  const data = await getAdminJson<OverviewData & AcquisitionData & ContentData & EstimatorData & SalesData>(`/admin/analytics/${tab}?${query}`);
  const active = data?.range;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="First-party, privacy-friendly traffic and sales insight. “Unique sessions” are anonymous browsing sessions, not individual people."
        actions={
          <ButtonLink href="/admin/analytics/settings" variant="secondary" size="sm">
            <Settings2 className="size-4" aria-hidden /> Settings
          </ButtonLink>
        }
      />

      <nav aria-label="Analytics sections" className="-mx-1 mb-5 flex gap-1 overflow-x-auto border-b border-border px-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={href({ tab: t.key })}
            aria-current={tab === t.key ? 'page' : undefined}
            className={cn('relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors', tab === t.key ? 'text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-primary' : 'text-muted hover:text-foreground')}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Date range" className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <Link
              key={r.key}
              href={href({ range: r.key, from: '', to: '' })}
              aria-current={active?.key === r.key ? 'true' : undefined}
              className={cn('rounded-full border px-3.5 py-1.5 text-sm transition-colors', active?.key === r.key ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:text-foreground')}
            >
              {r.label}
            </Link>
          ))}
        </div>
        <form method="get" action="/admin/analytics" className="flex flex-wrap items-end gap-2" aria-label="Custom date range">
          <input type="hidden" name="tab" value={tab} />
          <input type="hidden" name="range" value="custom" />
          <label className="text-xs text-muted">
            From
            <Input name="from" type="date" defaultValue={from} required className="mt-1 h-10 w-40" />
          </label>
          <label className="text-xs text-muted">
            To
            <Input name="to" type="date" defaultValue={to} required className="mt-1 h-10 w-40" />
          </label>
          <Button type="submit" variant="secondary">Apply</Button>
        </form>
      </div>
      {active && (
        <p className="mb-5 text-sm text-muted">
          {dateFmt.format(new Date(active.from))} – {dateFmt.format(new Date(new Date(active.to).getTime() - 1))} · compared with the previous {Math.round((new Date(active.to).getTime() - new Date(active.from).getTime()) / 86_400_000)} days
        </p>
      )}

      {!data ? (
        <ErrorState title="Could not load analytics" description="Reload the page to try again." />
      ) : tab === 'overview' ? (
        <OverviewSection data={data} />
      ) : tab === 'acquisition' ? (
        <AcquisitionSection data={data} />
      ) : tab === 'content' ? (
        <ContentSection data={data} />
      ) : tab === 'estimator' ? (
        <EstimatorSection data={data} />
      ) : (
        <SalesSection data={data} />
      )}
    </>
  );
}
