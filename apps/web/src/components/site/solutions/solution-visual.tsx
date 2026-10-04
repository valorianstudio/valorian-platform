import { cn } from '@/lib/cn';
import { getIcon } from '@/lib/icons';
import type { PlaceholderTone, SolutionCategoryId, SolutionDemo } from '@/lib/solutions-catalog';
import { SmartImage } from '@/components/ui/smart-image';

const TONES: Record<PlaceholderTone, { stage: string; accent: string }> = {
  cream: { stage: 'bg-[linear-gradient(135deg,#fbe0c3,#f3d3b6)]', accent: 'bg-coral' },
  coral: { stage: 'bg-[linear-gradient(135deg,#ffd9c6,#ffbb98)]', accent: 'bg-slate' },
  slate: { stage: 'bg-[linear-gradient(135deg,#4a5e60,#344648)]', accent: 'bg-coral' },
  mist: { stage: 'bg-[linear-gradient(135deg,#e4eaea,#cfd8d9)]', accent: 'bg-coral' },
};

/**
 * Preview area for a solution. Renders a code-drawn mockup (no image to load) shaped like the offering: a dashboard in a
 * browser frame, a landing page, or a phone. Once `imageUrl` is set on the solution, the real screenshot replaces it.
 */
export function SolutionVisual({ solution, variant, className = 'aspect-[16/10]' }: { solution: Pick<SolutionDemo, 'title' | 'imagePlaceholder' | 'imageUrl'>; variant: SolutionCategoryId; className?: string }) {
  const tone = TONES[solution.imagePlaceholder.tone];
  const Icon = getIcon(solution.imagePlaceholder.icon);
  const dark = solution.imagePlaceholder.tone === 'slate';

  if (solution.imageUrl) {
    return (
      <div className={cn('relative overflow-hidden', tone.stage, className)}>
        <SmartImage src={solution.imageUrl} alt={`${solution.title} preview`} width={800} height={500} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" retry={false} className="img-zoom size-full object-cover object-top" />
      </div>
    );
  }

  return (
    <div aria-hidden className={cn('relative overflow-hidden', tone.stage, className)}>
      {variant === 'mobile-app' ? (
        <div className="absolute inset-y-[9%] left-1/2 w-[34%] min-w-[5.5rem] -translate-x-1/2 transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <div className="h-full rounded-[1.5rem] border-[5px] border-slate bg-slate shadow-[var(--shadow-float)]">
            <div className="flex h-full flex-col gap-2 overflow-hidden rounded-[1.1rem] bg-background p-2.5">
              <span className="mx-auto h-1 w-8 rounded-full bg-slate/25" />
              <div className="flex items-center gap-2">
                <span className={'grid size-6 place-items-center rounded-lg bg-primary text-white'}>
                  <Icon className="size-3.5" />
                </span>
                <span className="h-2 w-12 rounded-full bg-surface-strong" />
              </div>
              <div className={cn('h-14 rounded-xl', tone.accent, 'opacity-80')} />
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-2 rounded-lg border border-border bg-card p-1.5">
                  <span className="size-5 rounded-md bg-surface-strong" />
                  <span className="h-1.5 flex-1 rounded-full bg-surface-strong" />
                </div>
              ))}
              <span className="mt-auto h-6 rounded-full bg-coral" />
            </div>
          </div>
        </div>
      ) : variant === 'landing-page' ? (
        <div className="absolute inset-x-[10%] bottom-0 top-[10%] overflow-hidden rounded-t-xl border border-b-0 border-[rgb(52_70_72/0.2)] bg-card shadow-[var(--shadow-float)]">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
            <span className="size-2 rounded-full bg-[#e8a99a]" />
            <span className="size-2 rounded-full bg-[#ecd08b]" />
            <span className="size-2 rounded-full bg-[#a8c3a0]" />
          </div>
          <div className="space-y-2.5 p-4">
            <div className="flex items-center justify-between">
              <span className="h-2.5 w-14 rounded-full bg-primary/70" />
              <span className="h-2 w-20 rounded-full bg-surface-strong" />
            </div>
            <div className="space-y-1.5 pt-2">
              <span className="block h-3.5 w-4/5 rounded-full bg-primary" />
              <span className="block h-3.5 w-3/5 rounded-full bg-primary/80" />
              <span className="block h-2 w-2/3 rounded-full bg-surface-strong" />
            </div>
            <div className="flex gap-2 pt-1">
              <span className="h-6 w-20 rounded-full bg-coral" />
              <span className="h-6 w-16 rounded-full border border-border" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[0, 1, 2].map((tile) => (
                <span key={tile} className="h-10 rounded-lg bg-surface-strong" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-x-[8%] bottom-0 top-[11%] overflow-hidden rounded-t-xl border border-b-0 border-[rgb(52_70_72/0.2)] bg-card shadow-[var(--shadow-float)]">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
            <span className="size-2 rounded-full bg-[#e8a99a]" />
            <span className="size-2 rounded-full bg-[#ecd08b]" />
            <span className="size-2 rounded-full bg-[#a8c3a0]" />
            <span className="ml-2 h-3.5 flex-1 rounded-full bg-background" />
          </div>
          <div className="grid h-full grid-cols-[22%_1fr]">
            <div className="space-y-2 bg-slate p-2.5">
              <span className="block size-4 rounded bg-coral" />
              {[0, 1, 2, 3].map((row) => (
                <span key={row} className="block h-1.5 rounded-full bg-white/25" />
              ))}
            </div>
            <div className="space-y-2.5 p-3">
              <div className="flex items-center gap-2">
                <span className={'grid size-6 place-items-center rounded-md bg-primary text-white'}>
                  <Icon className="size-3.5" />
                </span>
                <span className="h-2 w-20 rounded-full bg-surface-strong" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((stat) => (
                  <span key={stat} className={cn('h-8 rounded-lg border border-border', stat === 2 ? 'bg-cream' : 'bg-background')} />
                ))}
              </div>
              <div className="flex h-12 items-end gap-1">
                {[40, 62, 48, 78, 58, 90, 70].map((height, i) => (
                  <span key={i} className={cn('flex-1 rounded-t', i === 5 ? 'bg-coral' : 'bg-primary')} style={{ height: `${height}%`, opacity: i === 5 ? 1 : 0.25 + i * 0.07 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <span className={cn('absolute left-3 top-3 grid size-8 place-items-center rounded-full backdrop-blur', dark ? 'bg-white/15 text-white' : 'bg-card/80 text-primary')}>
        <Icon className="size-4" />
      </span>
    </div>
  );
}
