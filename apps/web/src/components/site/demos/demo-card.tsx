import Link from 'next/link';
import { ArrowRight, Globe, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/ui/smart-image';
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
    <ul className="flex items-center gap-1.5 text-primary" aria-label="Available platforms">
      {types.has('WEBSITE') && (
        <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold">
          <Globe className="size-3.5 text-accent" aria-hidden /> Web
        </li>
      )}
      {types.has('MOBILE') && (
        <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold">
          <Smartphone className="size-3.5 text-accent" aria-hidden /> Mobile
        </li>
      )}
    </ul>
  );
}

/** Product preview: the web screenshot in a browser frame, with a phone overlapping when a mobile screen exists. */
export function DemoVisual({ demo, className = 'aspect-[16/10]' }: { demo: Pick<DemoCardData, 'slug' | 'name' | 'thumbnailUrl' | 'coverImageUrl'> & { screenshots?: { url: string }[] }; className?: string }) {
  const image = demo.thumbnailUrl ?? demo.coverImageUrl;
  const phone = demo.screenshots?.[0]?.url;
  const warm = demo.slug.length % 2 === 0;
  return (
    <div aria-hidden={image ? undefined : true} className={`relative overflow-hidden ${warm ? 'bg-[linear-gradient(135deg,#fbe0c3,#f3d3b6)]' : 'bg-[linear-gradient(135deg,#dfe5e5,#cfd8d9)]'} ${className}`}>
      <div className="absolute inset-x-[8%] bottom-0 top-[11%] overflow-hidden rounded-t-xl border border-b-0 border-[rgb(52_70_72/0.2)] bg-card shadow-[var(--shadow-float)]">
        <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
          <span className="size-2 rounded-full bg-[#e8a99a]" />
          <span className="size-2 rounded-full bg-[#ecd08b]" />
          <span className="size-2 rounded-full bg-[#a8c3a0]" />
          <span className="ml-2 h-3.5 flex-1 rounded-full bg-background" />
        </div>
        {image ? (
          <SmartImage src={image} alt={`${demo.name} screenshot`} width={800} height={500} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" retry={false} className="img-zoom size-full object-cover object-top" />
        ) : (
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">{demo.name.charAt(0)}</span>
              <span className="h-2.5 w-24 rounded-full bg-surface-strong" />
            </div>
            <div className="flex h-20 items-end gap-1.5">
              {[40, 65, 50, 80, 60, 90, 70].map((height, i) => (
                <span key={i} className={`flex-1 rounded-t ${i === 5 ? 'bg-coral' : 'bg-primary'}`} style={{ height: `${height}%`, opacity: i === 5 ? 1 : 0.25 + i * 0.07 }} />
              ))}
            </div>
          </div>
        )}
      </div>
      {phone && (
        <div className="absolute -bottom-3 right-[5%] w-[22%] min-w-[4.5rem] rounded-[1.1rem] border-[4px] border-slate bg-slate shadow-[var(--shadow-float)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <SmartImage src={phone} alt={`${demo.name} mobile screenshot`} width={240} height={480} sizes="120px" retry={false} className="aspect-[9/18] w-full rounded-[0.8rem] object-cover object-top" />
        </div>
      )}
    </div>
  );
}

export function DemoCard({ demo, priority = false }: { demo: DemoCardData; priority?: boolean }) {
  const stack = [...new Set(demo.platforms.flatMap((p) => p.technologies?.map((t) => t.name) ?? []))].slice(0, 5);
  const label = demo.category ?? demo.industry;
  return (
    <Link href={`/demos/${demo.slug}`} className="card-lift group flex h-full flex-col overflow-hidden">
      <DemoVisual demo={demo} />
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          {label && <span>{label.name}</span>}
          {demo.industry && demo.category && demo.industry.name !== demo.category.name && <span className="text-muted">/ {demo.industry.name}</span>}
          {demo.badge && <Badge className="ml-auto normal-case tracking-normal">{demo.badge}</Badge>}
          {demo.featured && priority && <Badge tone="accent" className="normal-case tracking-normal">Featured</Badge>}
        </div>
        <h3 className="display mt-3 text-2xl text-primary">{demo.name}</h3>
        <p className="mt-2.5 flex-1 leading-relaxed text-muted">{demo.shortDescription}</p>
        {stack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technology stack">
            {stack.map((name) => (
              <li key={name} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                {name}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
          <PlatformIndicators platforms={demo.platforms} />
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            View demo <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
