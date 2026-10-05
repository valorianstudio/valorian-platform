'use client';

import { Check, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { cn } from '@/lib/cn';

/** Small interactive building blocks for the school website demo (client side). */

const AVATAR_TONES = ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-800', 'bg-amber-100 text-amber-800', 'bg-slate-200 text-slate-700', 'bg-sky-100 text-sky-800'];

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .replace(/^(Dr|Mr|Ms)\.?\s+/, '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  const tone = AVATAR_TONES[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_TONES.length];
  return (
    <span aria-hidden className={cn('grid shrink-0 place-items-center rounded-full font-semibold', tone, size === 'sm' ? 'size-7 text-[11px]' : size === 'lg' ? 'size-16 text-xl' : 'size-9 text-xs')}>
      {initials}
    </span>
  );
}

const BADGE_TONES = {
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-rose-50 text-rose-800 ring-rose-200',
  blue: 'bg-blue-50 text-blue-800 ring-blue-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
} as const;

export function Pill({ tone = 'slate', children }: { tone?: keyof typeof BADGE_TONES; children: ReactNode }) {
  return <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', BADGE_TONES[tone])}>{children}</span>;
}

export function statusTone(status: string): keyof typeof BADGE_TONES {
  if (['Present', 'Paid', 'Published', 'In class'].includes(status)) return 'green';
  if (['Late', 'Due', 'Marking', 'Free'].includes(status)) return 'amber';
  if (['Absent', 'Overdue', 'On leave'].includes(status)) return 'red';
  return 'blue';
}

/** Closes a popover on outside click or Escape. */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, open, close]);
}

/** A button that opens a small listbox. Closes on selection, outside click and Escape. */
export function SelectMenu<T extends string>({ label, value, options, onChange, icon: Icon, className, align = 'left' }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void; icon?: LucideIcon; className?: string; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${value}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        {Icon && <Icon className="size-4 shrink-0 text-slate-500" aria-hidden />}
        <span className="min-w-0 flex-1 truncate text-left">{value}</span>
        <ChevronDown className={cn('size-4 shrink-0 text-slate-400 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <ul id={listId} role="listbox" aria-label={label} className={cn('demo-rise absolute top-10 z-30 max-h-64 min-w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl', align === 'right' ? 'right-0' : 'left-0')}>
          {options.map((option) => (
            <li key={option} role="option" aria-selected={option === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-6 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
              >
                {option}
                {option === value && <Check className="size-4 text-blue-600" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Tabs with proper roles and arrow-key navigation. The caller renders the active panel. */
export function Tabs<T extends string>({ tabs, value, onChange, label, className }: { tabs: readonly { id: T; label: string; count?: number }[]; value: T; onChange: (id: T) => void; label: string; className?: string }) {
  const baseId = useId();
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    onChange(next.id);
    document.getElementById(`${baseId}-${next.id}`)?.focus();
  }
  return (
    <div role="tablist" aria-label={label} className={cn('inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1', className)}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          id={`${baseId}-${tab.id}`}
          role="tab"
          type="button"
          aria-selected={tab.id === value}
          tabIndex={tab.id === value ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => onKeyDown(event, index)}
          className={cn('shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600', tab.id === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900')}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-1.5 text-xs text-slate-500">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function PageHeading({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function ProgressBar({ value, tone = 'blue' }: { value: number; tone?: 'blue' | 'emerald' }) {
  return (
    <div role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div className={cn('h-full rounded-full', tone === 'blue' ? 'bg-blue-600' : 'bg-emerald-500')} style={{ width: `${value}%` }} />
    </div>
  );
}
