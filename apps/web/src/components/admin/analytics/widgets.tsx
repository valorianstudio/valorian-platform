import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';

export const SYMBOLS: Record<string, string> = { BDT: '৳', USD: '$' };
export const formatNumber = (value: number) => value.toLocaleString('en-US');
export const formatPercent = (value: number | null) => (value === null ? '—' : `${value}%`);
export const formatMoney = (amount: number, currency: string | null) => `${currency ? (SYMBOLS[currency] ?? `${currency} `) : ''}${formatNumber(amount)}`;

export function Money({ values, empty = '—' }: { values: { currency: string | null; total: number }[]; empty?: string }) {
  const filled = values.filter((v) => v.total > 0);
  if (filled.length === 0) return <>{empty}</>;
  return <>{filled.map((v) => formatMoney(v.total, v.currency)).join(' · ')}</>;
}

/** Percent change vs the previous period. Hidden when there is no baseline to compare with. */
export function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return <span className="text-xs text-muted">No previous data</span>;
  const change = Math.round(((current - previous) / previous) * 100);
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', change > 0 ? 'text-accent' : change < 0 ? 'text-danger' : 'text-muted')}>
      <Icon className="size-3.5" aria-hidden />
      {change > 0 ? '+' : ''}
      {change}% <span className="font-normal text-muted">vs previous period</span>
    </span>
  );
}

export function StatCard({ label, value, hint, children }: { label: string; value: ReactNode; hint?: string; children?: ReactNode }) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 break-words text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">{value}</p>
      {children && <div className="mt-1.5">{children}</div>}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </Card>
  );
}

export function Panel({ title, description, children, className }: { title: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <Card className={cn('p-4 sm:p-5', className)}>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </Card>
  );
}

export function Empty({ children = 'No data in this period.' }: { children?: ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted">{children}</p>;
}

export interface BarItem {
  label: string;
  value: number;
  detail?: string;
}

/** Horizontal bars. Values are printed next to each bar, so colour is never the only signal. */
export function BarList({ items, tone = 'primary', format = formatNumber }: { items: BarItem[]; tone?: 'primary' | 'accent'; format?: (value: number) => string }) {
  if (items.length === 0) return <Empty />;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate" title={item.label}>{item.label}</span>
            <span className="shrink-0 font-medium tabular-nums">
              {format(item.value)}
              {item.detail && <span className="ml-1.5 font-normal text-muted">{item.detail}</span>}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-strong" aria-hidden>
            <div className={cn('h-full rounded-full', tone === 'accent' ? 'bg-accent' : 'bg-primary')} style={{ width: `${Math.max(2, (item.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export interface FunnelStage {
  label: string;
  count: number;
  fromPrevious: number | null;
  fromStart: number | null;
}

export function Funnel({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map((s) => s.count), 1);
  return (
    <ol className="space-y-3">
      {stages.map((stage, index) => (
        <li key={stage.label}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
            <span>
              <span className="mr-2 font-mono text-xs text-muted">{index + 1}</span>
              {stage.label}
            </span>
            <span className="font-medium tabular-nums">
              {formatNumber(stage.count)}
              {stage.fromPrevious !== null && <span className="ml-2 font-normal text-muted">{stage.fromPrevious}% of previous step</span>}
            </span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-md bg-surface-strong" aria-hidden>
            <div className="h-full rounded-md bg-primary" style={{ width: `${Math.max(1.5, (stage.count / max) * 100)}%`, opacity: 1 - index * 0.14 }} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface TrendPoint {
  date: string;
  visitors: number;
  pageViews: number;
}

/** Dependency-free responsive SVG trend chart with a data table for assistive technology. */
export function TrendChart({ points }: { points: TrendPoint[] }) {
  const width = 640;
  const height = 200;
  const pad = { top: 12, right: 8, bottom: 22, left: 8 };
  const max = Math.max(...points.flatMap((p) => [p.pageViews, p.visitors]), 1);
  const x = (i: number) => pad.left + (points.length <= 1 ? 0 : (i / (points.length - 1)) * (width - pad.left - pad.right));
  const y = (v: number) => pad.top + (1 - v / max) * (height - pad.top - pad.bottom);
  const line = (key: 'visitors' | 'pageViews') => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ');
  const area = `${line('pageViews')} L${x(points.length - 1).toFixed(1)} ${height - pad.bottom} L${x(0).toFixed(1)} ${height - pad.bottom} Z`;
  const totalViews = points.reduce((s, p) => s + p.pageViews, 0);
  const totalVisitors = points.reduce((s, p) => s + p.visitors, 0);

  return (
    <figure>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Daily visitors and page views. ${formatNumber(totalVisitors)} visitors and ${formatNumber(totalViews)} page views in total.`} className="h-auto w-full">
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1={pad.left} x2={width - pad.right} y1={pad.top + t * (height - pad.top - pad.bottom)} y2={pad.top + t * (height - pad.top - pad.bottom)} stroke="var(--border)" strokeDasharray="3 4" />
        ))}
        <path d={area} fill="var(--primary)" opacity="0.1" />
        <path d={line('pageViews')} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={line('visitors')} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="6 4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <text x={pad.left} y={height - 4} fontSize="11" fill="var(--muted)">{points[0]?.date}</text>
        <text x={width - pad.right} y={height - 4} fontSize="11" fill="var(--muted)" textAnchor="end">{points.at(-1)?.date}</text>
        <text x={width - pad.right} y={pad.top + 9} fontSize="11" fill="var(--muted)" textAnchor="end">peak {formatNumber(max)}</text>
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-5 bg-primary" aria-hidden /> Page views</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-accent" aria-hidden /> Unique sessions</span>
      </figcaption>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer rounded text-muted hover:text-foreground">View data table</summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-surface text-muted">
              <tr><th className="px-3 py-2 font-medium">Date</th><th className="px-3 py-2 font-medium">Sessions</th><th className="px-3 py-2 font-medium">Page views</th></tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.date} className="border-t border-border"><td className="px-3 py-1.5">{p.date}</td><td className="px-3 py-1.5 tabular-nums">{p.visitors}</td><td className="px-3 py-1.5 tabular-nums">{p.pageViews}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  align?: 'right';
}

/** Table that scrolls horizontally only on narrow screens. */
export function DataTable<T>({ columns, rows, rowKey }: { columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string }) {
  if (rows.length === 0) return <Empty />;
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col" className={cn('pb-2 pr-3 font-medium', c.align === 'right' && 'text-right')}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-border">
              {columns.map((c) => (
                <td key={c.header} className={cn('py-2 pr-3 align-top', c.align === 'right' && 'text-right tabular-nums')}>{c.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
