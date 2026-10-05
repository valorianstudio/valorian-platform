import { Dumbbell } from 'lucide-react';
import { GYM_BRAND } from '@/data/gym/landing';
import { cn } from '@/lib/cn';

/** The fictional FORGE mark: a blue tile with a dumbbell, used by the landing page, dashboard and mobile app. */
export function GymLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-lg', tone === 'dark' ? 'bg-white text-gym' : 'bg-gym-blue text-white')}>
        <Dumbbell className="size-[17px]" />
      </span>
      {!compact && <span className={cn('text-[17px] font-bold tracking-tight', tone === 'dark' ? 'text-white' : 'text-gym')}>{GYM_BRAND.name}</span>}
    </span>
  );
}
