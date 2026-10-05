import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Building blocks for the screens inside a MobileFrame: header, scrolling body, card and bottom navigation. Colours follow the
 * --demo-* CSS variables of the demo that uses them (header colour: --demo-header, accent: --demo-accent).
 */

export function AppHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 bg-[var(--demo-header,#0f172a)] px-4 pb-4 pt-2 text-white">
      <div className="min-w-0">
        {subtitle && <p className="truncate text-[11px] text-white/70">{subtitle}</p>}
        <h3 className="truncate text-base font-semibold">{title}</h3>
      </div>
      {right}
    </header>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3.5">{children}</div>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-xl border border-slate-200 bg-white p-3', className)}>{children}</div>;
}

export function BottomNav<T extends string>({ items, value, onChange, label }: { items: { id: T; label: string; icon: LucideIcon; badge?: number }[]; value: T; onChange: (id: T) => void; label: string }) {
  return (
    <nav aria-label={label} className="flex shrink-0 border-t border-slate-200 bg-white px-1 pb-3 pt-1.5">
      {items.map(({ id, label: text, icon: Icon, badge }) => (
        <button
          key={id}
          type="button"
          aria-current={id === value ? 'page' : undefined}
          onClick={() => onChange(id)}
          className={cn('flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1 text-[10px] font-medium focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]', id === value ? 'text-[color:var(--demo-accent,#2563eb)]' : 'text-slate-500')}
        >
          <span className="relative">
            <Icon className="size-[18px]" aria-hidden />
            {badge ? <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-[var(--demo-nav-active,#2563eb)] px-1 text-[9px] font-semibold leading-4 text-white">{badge}</span> : null}
          </span>
          <span className="truncate">{text}</span>
        </button>
      ))}
    </nav>
  );
}
