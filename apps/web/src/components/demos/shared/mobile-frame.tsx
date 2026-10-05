import { BatteryFull, SignalHigh, Wifi } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A modern phone frame. The screen is a positioned flex column below a status bar, so any screen content can be dropped in
 * and will scroll or fill on its own. Width follows the container (up to 19rem) and the height keeps a phone aspect ratio,
 * so it fits every viewport from 320 px up without overflow.
 */
export function MobileFrame({ children, label, tone = 'dark', className }: { children: ReactNode; label: string; tone?: 'dark' | 'light'; className?: string }) {
  const ink = tone === 'light' ? 'text-white' : 'text-slate-900';
  return (
    <div role="group" aria-label={label} className={cn('relative mx-auto aspect-[9/18.5] w-full max-w-[19rem] rounded-[2.6rem] bg-slate-900 p-[9px] shadow-[0_40px_70px_-30px_rgb(15_23_42/0.55),0_12px_24px_-12px_rgb(15_23_42/0.35)] ring-1 ring-slate-700', className)}>
      <div className="relative size-full overflow-hidden rounded-[2.05rem] bg-white">
        <div aria-hidden className="absolute left-1/2 top-2 z-20 h-[1.15rem] w-20 -translate-x-1/2 rounded-full bg-slate-900" />
        <div aria-hidden className={cn('absolute inset-x-0 top-0 z-10 flex h-9 items-end justify-between px-6 pb-1 text-[11px] font-semibold tabular-nums', ink)}>
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <SignalHigh className="size-3" />
            <Wifi className="size-3" />
            <BatteryFull className="size-3.5" />
          </span>
        </div>
        <div className="absolute inset-0 flex flex-col pt-9">{children}</div>
      </div>
    </div>
  );
}
