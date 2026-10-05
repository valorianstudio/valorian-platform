import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SCHOOL_BRAND } from '@/data/school/landing';

/** The fictional EduCore mark: a navy tile with a cap, used by the landing page, website and mobile demos. */
export function SchoolLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-lg', tone === 'dark' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white')}>
        <GraduationCap className="size-[18px]" />
      </span>
      {!compact && <span className={cn('text-[17px] font-semibold tracking-tight', tone === 'dark' ? 'text-white' : 'text-slate-900')}>{SCHOOL_BRAND.name}</span>}
    </span>
  );
}
