import Link from 'next/link';
import { ArrowRight, Clock, Globe, Rocket, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/ui/smart-image';
import { cn } from '@/lib/cn';
import { getIcon } from '@/lib/icons';
import { DEMOS, DEMO_STATUS_LABEL, demoAvailability } from '@/data/demos';
import type { Demo, DemoPlatform, PlaceholderTone } from '@/data/demos';
import type { DemoCardData } from '@/lib/cms-types';

const STAGE: Record<PlaceholderTone, string> = {
  cream: 'bg-[linear-gradient(135deg,#fbe0c3,#f3d3b6)]',
  coral: 'bg-[linear-gradient(135deg,#ffd9c6,#ffbb98)]',
  slate: 'bg-[linear-gradient(135deg,#4a5e60,#344648)]',
  mist: 'bg-[linear-gradient(135deg,#e4eaea,#cfd8d9)]',
};

const WINDOW = 'absolute inset-x-[9%] bottom-0 top-[11%] overflow-hidden rounded-t-xl border border-b-0 border-[rgb(52_70_72/0.2)] bg-card shadow-[var(--shadow-float)]';
const DOTS = 'block size-2 rounded-full bg-[#e8a99a] shadow-[12px_0_#ecd08b,24px_0_#a8c3a0]';

/**
 * Preview area for a demo. With a real screenshot it shows that; until then a small code-drawn mockup (about twenty elements,
 * no image request): a dashboard window, with a phone in front of it when the demo also ships as a mobile app.
 */
export function DemoVisual({ demo, className = 'aspect-[16/10]', phoneImage }: { demo: Pick<Demo, 'title' | 'image' | 'placeholder'> & { platforms?: DemoPlatform[] }; className?: string; phoneImage?: string }) {
  const Icon = getIcon(demo.placeholder.icon);
  const dark = demo.placeholder.tone === 'slate';
  const phone = demo.platforms?.includes('Mobile App');

  return (
    <div className={cn('relative overflow-hidden', STAGE[demo.placeholder.tone], className)}>
      <div className={WINDOW}>
        <div className="flex h-7 items-center border-b border-border bg-surface px-3">
          <span aria-hidden className={DOTS} />
        </div>
        {demo.image ? (
          <SmartImage src={demo.image} alt={`${demo.title} dashboard preview`} width={800} height={500} sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw" retry={false} className="img-zoom size-full object-cover object-top" />
        ) : (
          <div aria-hidden className="grid h-full grid-cols-[22%_1fr]">
            <span className="bg-slate" />
            <div className="space-y-2.5 p-3">
              <span className="block h-2.5 w-24 rounded-full bg-surface-strong" />
              <span className="block h-7 rounded-lg border border-border bg-cream" />
              <span className="block h-12 rounded-lg bg-[linear-gradient(90deg,var(--primary)_0_12%,transparent_12%_16%,var(--blue-gray)_16%_28%,transparent_28%_32%,var(--primary)_32%_46%,transparent_46%_50%,var(--coral)_50%_62%,transparent_62%_66%,var(--blue-gray)_66%_80%,transparent_80%)] opacity-70" />
            </div>
          </div>
        )}
      </div>
      {phoneImage ? (
        <div className="absolute -bottom-3 right-[5%] w-[22%] min-w-[4.5rem] rounded-[1.1rem] border-4 border-slate bg-slate shadow-[var(--shadow-float)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <SmartImage src={phoneImage} alt={`${demo.title} mobile screenshot`} width={240} height={480} sizes="120px" retry={false} className="aspect-[9/18] w-full rounded-[0.8rem] object-cover object-top" />
        </div>
      ) : (
        phone && (
          <div aria-hidden className="absolute -bottom-4 right-[6%] h-[62%] w-[22%] min-w-[4rem] rounded-[1.1rem] border-4 border-slate bg-background p-1.5 shadow-[var(--shadow-float)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
            <span className="block h-6 rounded-md bg-coral/80" />
            <span className="mt-1.5 block h-3 rounded bg-surface-strong" />
            <span className="mt-1 block h-3 rounded bg-surface-strong" />
          </div>
        )
      )}
      <span aria-hidden className={cn('absolute left-3 top-3 grid size-8 place-items-center rounded-full backdrop-blur', dark ? 'bg-white/15 text-white' : 'bg-card/80 text-primary')}>
        <Icon className="size-4" />
      </span>
    </div>
  );
}

const PLATFORM_ICON = { Website: Globe, 'Mobile App': Smartphone, 'Landing Page': Rocket } as const;

/**
 * The platforms a demo ships as. When `links` has an entry for a platform, its chip links straight to that interactive experience
 * (it sits above the card's stretched link, so the rest of the card still opens the demo's overview).
 */
export function PlatformChips({ platforms, links }: { platforms: DemoPlatform[]; links?: Demo['experiences'] }) {
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Available as">
      {platforms.map((platform) => {
        const Icon = PLATFORM_ICON[platform];
        const href = links?.[platform];
        const body = (
          <>
            <Icon className="size-3.5 text-accent" aria-hidden /> {platform}
          </>
        );
        return (
          <li key={platform}>
            {href ? (
              <Link href={href} className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {body}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-primary">{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** The three ways into a demo, as buttons. Only the experiences the demo really has are shown. */
export function PlatformButtons({ demo }: { demo: Demo }) {
  const a = demoAvailability(demo);
  const versions = [
    { href: a.routes.landingPage, label: 'View Landing Page', Icon: Rocket },
    { href: a.routes.website, label: 'View Website', Icon: Globe },
    { href: a.routes.mobileApp, label: 'View App', Icon: Smartphone },
  ].filter((version): version is { href: string; label: string; Icon: typeof Rocket } => Boolean(version.href));

  if (versions.length === 0) return null;
  return (
    <div className="mt-auto pt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Available versions</p>
      <ul className="mt-2.5 flex flex-wrap gap-2" aria-label="Available versions">
        {versions.map(({ href, label, Icon }) => (
          <li key={label}>
            <Link href={href} className="relative z-10 inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-primary-soft px-3 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatusBadge({ status }: { status: Demo['status'] }) {
  return (
    <Badge tone={status === 'available' ? 'accent' : 'neutral'} className="normal-case">
      {status !== 'available' && <Clock className="size-3" aria-hidden />}
      {DEMO_STATUS_LABEL[status]}
    </Badge>
  );
}

const PLATFORM_LABEL = { WEBSITE: 'Website', MOBILE: 'Mobile App' } as const;

/**
 * Demos that come from the CMS (related demos on case studies, industries and demo pages) are drawn by the same card.
 * When the CMS slug exists in data/demos.ts that entry is used, so a demo never looks different in two places.
 */
export function demoFromApi(item: DemoCardData): Demo {
  const known = DEMOS.find((demo) => demo.slug === item.slug || demo.aliases?.includes(item.slug));
  if (known) return known;
  return {
    slug: item.slug,
    title: item.name,
    category: 'full-stack',
    offerings: ['full-stack'],
    industry: item.industry?.name ?? item.category?.name ?? 'Software',
    description: item.shortDescription,
    features: [],
    technologies: [...new Set(item.platforms.flatMap((platform) => platform.technologies?.map((tech) => tech.name) ?? []))].slice(0, 5),
    platforms: [...new Set(item.platforms.map((platform) => PLATFORM_LABEL[platform.type]))],
    image: item.thumbnailUrl ?? item.coverImageUrl ?? undefined,
    placeholder: { icon: 'layers', tone: 'cream' },
    status: 'available',
  };
}

/**
 * The one demo card: a preview, the sector, the title, a short description and clear buttons for the versions the demo offers.
 * The whole card opens the demo's overview; the version buttons sit above that link and open each experience directly.
 */
export function DemoCard({ demo }: { demo: Demo }) {
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden">
      <DemoVisual demo={demo} phoneImage={demo.phoneImage} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{demo.sector ?? demo.industry}</span>
          {demo.status !== 'available' && <span className="ml-auto"><StatusBadge status={demo.status} /></span>}
        </div>
        <h3 className="display mt-3 text-xl text-primary sm:text-2xl">
          <Link href={`/demos/${demo.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {demo.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">{demo.description}</p>
        <PlatformButtons demo={demo} />
        <span aria-hidden className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          View full demo <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
