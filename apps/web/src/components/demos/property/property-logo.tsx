import { Building2 } from 'lucide-react';
import { PROPERTY_BRAND } from '@/data/property/landing';
import { cn } from '@/lib/cn';

/** The fictional KEYSTONE mark: a navy tile with a building, used by the landing page, dashboard and mobile app. */
export function PropertyLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-xl', tone === 'dark' ? 'bg-[var(--demo-gold)] text-[color:var(--demo-header)]' : 'bg-[var(--demo-accent)] text-white')}>
        <Building2 className="size-[17px]" strokeWidth={2.25} />
      </span>
      {!compact && <span className={cn('text-[16px] font-bold tracking-[0.12em]', tone === 'dark' ? 'text-white' : 'text-[color:var(--demo-accent)]')}>{PROPERTY_BRAND.name}</span>}
    </span>
  );
}
