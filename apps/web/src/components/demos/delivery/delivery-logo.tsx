import { Bike } from 'lucide-react';
import { DELIVERY_BRAND } from '@/data/delivery/landing';
import { cn } from '@/lib/cn';

/** The fictional SWIFTWHEEL mark: a blue tile with a delivery bike, used by the landing page, dashboard and mobile app. */
export function DeliveryLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-lg', tone === 'dark' ? 'bg-[var(--demo-orange)] text-white' : 'bg-[var(--demo-accent)] text-white')}>
        <Bike className="size-[17px]" />
      </span>
      {!compact && <span className={cn('text-[16px] font-bold tracking-tight', tone === 'dark' ? 'text-white' : 'text-slate-900')}>{DELIVERY_BRAND.name}</span>}
    </span>
  );
}
