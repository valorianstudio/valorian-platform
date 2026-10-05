import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Tiny dependency-free charts for demo dashboards: plain divs and SVG, no chart library, no client JavaScript.
 * Each draws from dummy data, animates with transform only, and exposes the data as text for screen readers.
 */

type Datum = { label: string; value: number };

export function BarChart({ data, label, max, unit = '', className, barClassName = 'bg-[var(--demo-accent,#2563eb)]', highlight = -1 }: { data: Datum[]; label: string; max?: number; unit?: string; className?: string; barClassName?: string; highlight?: number }) {
  const top = max ?? Math.max(...data.map((d) => d.value));
  return (
    <div role="img" aria-label={`${label}: ${data.map((d) => `${d.label} ${d.value}${unit}`).join(', ')}`} className={cn('flex h-40 items-end gap-2 sm:gap-3', className)}>
      {data.map((d, i) => (
        <div key={d.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[11px] font-medium tabular-nums text-slate-500">
            {d.value}
            {unit}
          </span>
          <div className="flex w-full flex-1 items-end">
            <div className={cn('demo-grow w-full rounded-t-md', i === highlight ? 'bg-[var(--demo-good,#10b981)]' : barClassName)} style={{ height: `${(d.value / top) * 100}%`, ['--i' as string]: i }} />
          </div>
          <span className="text-[11px] text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Smooth line with a soft fill. Values are scaled between `min` and `max`. */
export function AreaChart({ data, label, min = 0, max, className }: { data: Datum[]; label: string; min?: number; max?: number; className?: string }) {
  const W = 300;
  const H = 120;
  const top = max ?? Math.max(...data.map((d) => d.value));
  const points = data.map((d, i) => ({ x: (i / (data.length - 1)) * W, y: H - 8 - ((d.value - min) / (top - min)) * (H - 24) }));
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;
  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`} className="h-auto w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="demo-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--demo-accent, #2563eb)' }} stopOpacity="0.22" />
            <stop offset="1" style={{ stopColor: 'var(--demo-accent, #2563eb)' }} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#e2e8f0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill="url(#demo-area)" />
        <path d={line} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--demo-accent, #2563eb)' }} />
      </svg>
      <figcaption className="mt-2 flex justify-between text-[11px] text-slate-500">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </figcaption>
    </figure>
  );
}

const TONE = { emerald: 'var(--demo-good, #10b981)', blue: 'var(--demo-accent, #2563eb)', amber: '#f59e0b', slate: '#cbd5e1' } as const;

export function Donut({ segments, label, size = 132, children }: { segments: { label: string; value: number; tone: keyof typeof TONE }[]; label: string; size?: number; children?: ReactNode }) {
  const R = 40;
  const C = 2 * Math.PI * R;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" role="img" aria-label={`${label}: ${segments.map((s) => `${s.label} ${s.value}%`).join(', ')}`} className="size-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        {segments.map((s) => {
          const length = (s.value / total) * C;
          const circle = <circle key={s.label} cx="50" cy="50" r={R} fill="none" stroke={TONE[s.tone]} strokeWidth="12" strokeDasharray={`${Math.max(length - 1.5, 0)} ${C}`} strokeDashoffset={-offset} />;
          offset += length;
          return circle;
        })}
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center text-center">{children}</div>}
    </div>
  );
}

/** A single progress ring, for attendance and score percentages. */
export function Ring({ value, size = 64, stroke = 8, label, className }: { value: number; size?: number; stroke?: number; label: string; className?: string }) {
  const R = 50 - stroke / 2;
  const C = 2 * Math.PI * R;
  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value}%`} className="size-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle cx="50" cy="50" r={R} fill="none" style={{ stroke: 'var(--demo-good, #10b981)' }} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(value / 100) * C} ${C}`} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold tabular-nums text-slate-900">{Math.round(value)}%</span>
    </div>
  );
}
