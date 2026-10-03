import Image from 'next/image';
import { cn } from '@/lib/cn';
import { Skeleton } from './skeleton';

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role={label ? 'status' : undefined} aria-label={label} className="inline-flex">
      <span aria-hidden className={cn('size-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary', className)} />
    </span>
  );
}

/** Full-area loader with the logo, used while a route's data is on its way. */
export function PageLoader({ message = 'Loading…' }: { message?: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[60vh] place-items-center px-5">
      <div className="flex flex-col items-center gap-6">
        <Image src="/branding/valorian-logo.png" alt="Valorian Studio" width={1190} height={321} sizes="180px" className="h-auto w-44 animate-pulse-soft" />
        <div className="h-1 w-40 overflow-hidden rounded-full bg-surface-strong">
          <div className="h-full w-1/3 animate-loading-bar rounded-full bg-coral" />
        </div>
        <p className="text-sm text-muted">{message}</p>
      </div>
    </div>
  );
}

/** Placeholder for a grid of cards (demos, articles, case studies). Same footprint as the real content, so nothing jumps. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading content" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Placeholder for a page: hero block followed by a card grid. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading page">
      <div className="mx-auto w-full max-w-7xl space-y-5 px-5 pb-12 pt-16 sm:px-8 sm:pt-24">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>
      <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        <CardGridSkeleton count={3} />
      </div>
    </div>
  );
}
