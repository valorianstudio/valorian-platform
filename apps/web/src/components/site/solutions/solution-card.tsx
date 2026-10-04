import Link from 'next/link';
import { ArrowRight, Check, Clock, Globe, Rocket, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import { DEMO_STATUS_LABEL, demoHref } from '@/lib/solutions-catalog';
import type { SolutionCategoryId, SolutionDemo, SolutionPlatform } from '@/lib/solutions-catalog';
import { SolutionVisual } from './solution-visual';

const PLATFORM_ICON = { Website: Globe, 'Mobile App': Smartphone, 'Landing Page': Rocket } as const;

export function PlatformChips({ platforms }: { platforms: SolutionPlatform[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Available as">
      {platforms.map((platform) => {
        const Icon = PLATFORM_ICON[platform];
        return (
          <li key={platform} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-primary">
            <Icon className="size-3.5 text-accent" aria-hidden /> {platform}
          </li>
        );
      })}
    </ul>
  );
}

export function StatusBadge({ status }: { status: SolutionDemo['demoStatus'] }) {
  return (
    <Badge tone={status === 'available' ? 'accent' : 'neutral'} className="normal-case">
      {status !== 'available' && <Clock className="size-3" aria-hidden />}
      {DEMO_STATUS_LABEL[status]}
    </Badge>
  );
}

/** One solution as seen through one category (landing page, full-stack website or mobile app). */
export function SolutionCard({ solution, variant }: { solution: SolutionDemo; variant: SolutionCategoryId }) {
  const platformLabel = variant === 'landing-page' ? 'Landing Page' : variant === 'mobile-app' ? 'Mobile App' : 'Website';
  const ready = solution.demoStatus === 'available';
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden">
      <SolutionVisual solution={solution} variant={variant} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{solution.industry}</span>
          <span className="ml-auto">
            <StatusBadge status={solution.demoStatus} />
          </span>
        </div>
        <h3 className="display mt-3 text-xl text-primary sm:text-2xl">
          {/* The whole card is the link target, via the stretched ::after, so the card stays one tab stop. */}
          <Link href={demoHref(solution)} className="after:absolute after:inset-0 after:content-['']">
            {solution.title}
            <span className="sr-only"> {platformLabel} demo</span>
          </Link>
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{solution.description}</p>

        <ul className="mt-4 space-y-1.5" aria-label="Key features">
          {solution.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex gap-2.5 text-sm text-primary">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technology stack">
          {solution.technologies.slice(0, 5).map((tech) => (
            <li key={tech} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-5">
          <PlatformChips platforms={solution.platforms} />
          <span aria-hidden className={cn('inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors duration-200', ready ? 'bg-primary text-primary-foreground group-hover:bg-[#415558]' : 'border border-[rgb(52_70_72/0.25)] text-primary group-hover:border-primary')}>
            View Demo <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
