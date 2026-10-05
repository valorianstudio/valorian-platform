import { PawPrint } from 'lucide-react';
import { PETSHOP_BRAND } from '@/data/petshop/landing';
import { cn } from '@/lib/cn';

/** The fictional PAWSOME mark: a green tile with a paw print, used by the landing page, dashboard and mobile app. */
export function PetshopLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-xl', tone === 'dark' ? 'bg-[var(--demo-orange)] text-white' : 'bg-[var(--demo-accent)] text-white')}>
        <PawPrint className="size-[17px]" />
      </span>
      {!compact && <span className={cn('text-[16px] font-bold tracking-tight', tone === 'dark' ? 'text-white' : 'text-[color:var(--demo-accent)]')}>{PETSHOP_BRAND.name}</span>}
    </span>
  );
}
