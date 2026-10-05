import { GraduationCap } from 'lucide-react';
import { COURSE_BRAND } from '@/data/course/landing';
import { cn } from '@/lib/cn';

/** The fictional Learnova mark: an indigo tile with a graduation cap, used by the landing page, dashboard and mobile app. */
export function CourseLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-lg', tone === 'dark' ? 'bg-white text-course' : 'bg-course text-white')}>
        <GraduationCap className="size-[18px]" />
      </span>
      {!compact && <span className={cn('text-[17px] font-semibold tracking-tight', tone === 'dark' ? 'text-white' : 'text-course')}>{COURSE_BRAND.name}</span>}
    </span>
  );
}
