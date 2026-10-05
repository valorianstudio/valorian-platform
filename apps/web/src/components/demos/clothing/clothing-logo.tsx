import { CLOTHING_BRAND } from '@/data/clothing/landing';
import { cn } from '@/lib/cn';

/** The fictional MAISON VALE wordmark: spaced capitals with a gold rule, used by the landing page, store, admin and app. */
export function ClothingLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  const name = compact ? 'MV' : CLOTHING_BRAND.name;
  return (
    <span className={cn('inline-flex flex-col leading-none', className)}>
      <span className={cn('font-semibold tracking-[0.28em]', compact ? 'text-sm' : 'text-[15px]', tone === 'dark' ? 'text-white' : 'text-[color:var(--demo-accent)]')}>{name}</span>
      {!compact && <span aria-hidden className="mt-1.5 h-px w-full bg-[var(--demo-good)]" />}
    </span>
  );
}
