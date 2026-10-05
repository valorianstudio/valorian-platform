import { HOTEL_BRAND } from '@/data/hotel/landing';
import { cn } from '@/lib/cn';

/** The fictional AZURE mark: a navy tile with a gold arch, used by the landing page, dashboard and mobile app. */
export function HotelLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-md border', tone === 'dark' ? 'border-[color:var(--demo-gold)] text-[color:var(--demo-gold)]' : 'border-[#0f172a] bg-[#0f172a] text-[color:var(--demo-gold)]')}>
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 20V11a8 8 0 0 1 16 0v9" /><path d="M9 20v-5h6v5" /></svg>
      </span>
      {!compact && <span className={cn('text-[15px] font-semibold tracking-[0.3em]', tone === 'dark' ? 'text-white' : 'text-[color:var(--demo-accent)]')}>{HOTEL_BRAND.name}</span>}
    </span>
  );
}
