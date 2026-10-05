import { HeartPulse } from 'lucide-react';
import { CLINIC_BRAND } from '@/data/clinic/landing';
import { cn } from '@/lib/cn';

/** The fictional ClinicOS mark: a medical-blue tile with a heartbeat, used by the landing page, dashboard and mobile app. */
export function ClinicLogo({ tone = 'light', compact = false, className }: { tone?: 'light' | 'dark'; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-lg', tone === 'dark' ? 'bg-white text-clinic' : 'bg-clinic text-white')}>
        <HeartPulse className="size-[18px]" />
      </span>
      {!compact && <span className={cn('text-[17px] font-semibold tracking-tight', tone === 'dark' ? 'text-white' : 'text-clinic-ink')}>{CLINIC_BRAND.name}</span>}
    </span>
  );
}
