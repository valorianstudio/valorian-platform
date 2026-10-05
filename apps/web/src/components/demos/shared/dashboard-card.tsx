import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const TONES = {
  blue: 'bg-[var(--demo-accent-soft,#eff6ff)] text-[color:var(--demo-accent,#2563eb)]',
  emerald: 'bg-[var(--demo-good-soft,#ecfdf5)] text-[color:var(--demo-good-ink,#047857)]',
  amber: 'bg-amber-50 text-amber-700',
  slate: 'bg-slate-100 text-slate-700',
} as const;

/** A KPI tile: icon, label, big number and an optional trend. `index` staggers the entrance. */
export function DashboardCard({ label, value, delta, icon: Icon, tone = 'blue', index = 0, className }: { label: string; value: string; delta?: { value: string; up: boolean }; icon: LucideIcon; tone?: keyof typeof TONES; index?: number; className?: string }) {
  return (
    <div className={cn('demo-rise rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04)]', className)} style={{ ['--i' as string]: index }}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', TONES[tone])}>
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
      {delta && (
        <p className={cn('mt-1 inline-flex items-center gap-1 text-xs font-medium', delta.up ? 'text-[color:var(--demo-good-ink,#047857)]' : 'text-amber-700')}>
          {delta.up ? <TrendingUp className="size-3.5" aria-hidden /> : <TrendingDown className="size-3.5" aria-hidden />}
          {delta.value}
        </p>
      )}
    </div>
  );
}

/** A titled white card for charts, tables and lists inside dashboards. */
export function Panel({ title, action, children, className, index = 0 }: { title?: string; action?: ReactNode; children: ReactNode; className?: string; index?: number }) {
  return (
    <section className={cn('demo-rise rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-5', className)} style={{ ['--i' as string]: index }}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
