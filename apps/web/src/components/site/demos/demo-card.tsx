import Link from 'next/link';
import { ArrowRight, Globe, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { DemoCardData } from '@/lib/cms-types';

export const DEMO_LABELS: Record<DemoCardData['statusLabel'], string> = {
  INTERACTIVE_CONCEPT: 'Interactive concept',
  PROTOTYPE: 'Prototype',
  DEMO_PRODUCT: 'Demo product',
  PRODUCTION_EXAMPLE: 'Production example',
};

export function PlatformIndicators({ platforms }: { platforms: DemoCardData['platforms'] }) {
  const types = new Set(platforms.map((p) => p.type));
  return (
    <ul className="flex items-center gap-1.5 text-muted" aria-label="Available platforms">
      {types.has('WEBSITE') && (
        <li className="inline-flex items-center gap-1 rounded-md bg-surface-strong px-2 py-1 text-xs font-medium">
          <Globe className="size-3.5" aria-hidden /> Web
        </li>
      )}
      {types.has('MOBILE') && (
        <li className="inline-flex items-center gap-1 rounded-md bg-surface-strong px-2 py-1 text-xs font-medium">
          <Smartphone className="size-3.5" aria-hidden /> Mobile
        </li>
      )}
    </ul>
  );
}

export function DemoVisual({ demo, className = 'h-44' }: { demo: Pick<DemoCardData, 'slug' | 'name' | 'thumbnailUrl' | 'coverImageUrl'>; className?: string }) {
  const image = demo.thumbnailUrl ?? demo.coverImageUrl;
  const tone = demo.slug.length % 2 === 0;
  return (
    <div aria-hidden={image ? undefined : true} className={`relative overflow-hidden border-b border-border ${tone ? 'bg-primary-soft' : 'bg-accent-soft'} ${className}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" decoding="async" width={640} height={352} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
      ) : (
        <div className="absolute inset-x-6 top-6 bottom-0 space-y-3 rounded-t-xl border border-b-0 border-border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className={`grid size-7 place-items-center rounded-md text-xs font-semibold text-primary-foreground ${tone ? 'bg-primary' : 'bg-accent'}`}>{demo.name.charAt(0)}</span>
            <span className="h-2.5 w-24 rounded bg-surface-strong" />
          </div>
          <div className="flex items-end gap-1.5">
            {[40, 65, 50, 80, 60, 90, 70].map((height, i) => (
              <span key={i} className={`w-full rounded-sm ${tone ? 'bg-primary' : 'bg-accent'}`} style={{ height: `${height * 0.55}px`, opacity: 0.3 + i * 0.1 }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DemoCard({ demo, priority = false }: { demo: DemoCardData; priority?: boolean }) {
  return (
    <Link
      href={`/demos/${demo.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <DemoVisual demo={demo} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {demo.industry && <Badge tone="primary">{demo.industry.name}</Badge>}
          {demo.badge && <Badge>{demo.badge}</Badge>}
          {demo.featured && priority && <Badge tone="accent">Featured</Badge>}
        </div>
        <h3 className="mt-3 text-lg font-semibold">{demo.name}</h3>
        <p className="mt-2 flex-1 text-muted">{demo.shortDescription}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <PlatformIndicators platforms={demo.platforms} />
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View demo <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
