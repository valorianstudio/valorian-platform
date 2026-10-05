import { UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_BRAND } from '@/data/restaurant/landing';
import { cn } from '@/lib/cn';

/** The fictional TableFlow mark: a charcoal tile with a gold cutlery icon, used by the landing page, dashboard and mobile app. */
export function RestaurantLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-lg', tone === 'dark' ? 'bg-gold text-white' : 'bg-resto text-amber-400')}>
        <UtensilsCrossed className="size-[17px]" />
      </span>
      {!compact && <span className={cn('text-[17px] font-semibold tracking-tight', tone === 'dark' ? 'text-white' : 'text-resto')}>{RESTAURANT_BRAND.name}</span>}
    </span>
  );
}
