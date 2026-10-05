import { Cross } from 'lucide-react';
import { PHARMACY_BRAND } from '@/data/pharmacy/landing';
import { cn } from '@/lib/cn';

/** The fictional CLEARWELL mark: a blue tile with a cross, used by the landing page, dashboard and mobile app. */
export function PharmacyLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-xl', tone === 'dark' ? 'bg-[var(--demo-cyan)] text-[color:var(--demo-header)]' : 'bg-[var(--demo-accent)] text-white')}>
        <Cross className="size-[17px]" strokeWidth={2.5} />
      </span>
      {!compact && <span className={cn('text-[16px] font-bold tracking-tight', tone === 'dark' ? 'text-white' : 'text-[color:var(--demo-accent)]')}>{PHARMACY_BRAND.name}</span>}
    </span>
  );
}
