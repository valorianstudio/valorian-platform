import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { SmartImage } from '@/components/ui/smart-image';
import type { ArticleCard, CaseCard, IntroContent, TestimonialItem } from '@/lib/cms-types';

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
export const formatPublished = (value: string | null) => (value ? dateFormat.format(new Date(value)) : '');

function Cover({ src, alt, slug, className = 'aspect-[16/10]' }: { src: string | null; alt: string; slug: string; className?: string }) {
  const warm = slug.length % 2 === 0;
  return (
    <div className={`relative overflow-hidden ${warm ? 'bg-[linear-gradient(135deg,#fbe0c3,#f3d3b6)]' : 'bg-[linear-gradient(135deg,#dfe5e5,#cfd8d9)]'} ${className}`}>
      {src ? (
        <SmartImage src={src} alt={alt} width={800} height={500} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="img-zoom size-full object-cover" />
      ) : (
        <span aria-hidden className="display absolute inset-0 grid place-items-center text-6xl text-primary/25">
          {alt.charAt(0)}
        </span>
      )}
    </div>
  );
}

export function CaseCardView({ item }: { item: CaseCard }) {
  return (
    <Link href={`/case-studies/${item.slug}`} className="card-lift group flex h-full flex-col overflow-hidden">
      <Cover src={item.coverImageUrl} alt={item.title} slug={item.slug} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          {item.industry && <span>{item.industry.name}</span>}
          {item.clientName && <span className="font-medium normal-case tracking-normal text-muted">{item.clientName}</span>}
        </div>
        <h3 className="display mt-3 text-xl text-primary">{item.title}</h3>
        <p className="mt-2 flex-1 text-muted">{item.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read case study <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ArticleCardView({ item }: { item: ArticleCard }) {
  return (
    <Link href={`/insights/${item.slug}`} className="card-lift group flex h-full flex-col overflow-hidden">
      <Cover src={item.featuredImageUrl} alt={item.featuredImageAlt ?? item.title} slug={item.slug} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          {item.category && <span className="font-semibold uppercase tracking-[0.12em] text-accent">{item.category.name}</span>}
          {item.publishedAt && <time dateTime={item.publishedAt}>{formatPublished(item.publishedAt)}</time>}
        </div>
        <h3 className="display mt-3 text-xl text-primary">{item.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-muted">{item.excerpt}</p>
        {item.readingTime && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
            <Clock className="size-3.5" aria-hidden /> {item.readingTime} min read
          </p>
        )}
      </div>
    </Link>
  );
}

function Outcome({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{label}</dt>
      <dd className="mt-1 line-clamp-4 leading-relaxed text-muted">{children}</dd>
    </div>
  );
}

/** Large image-led case study row; layout alternates left and right. Challenge, solution and outcome appear only when recorded. */
function FeatureCase({ item, flip }: { item: CaseCard; flip: boolean }) {
  const result = item.results?.[0];
  return (
    <Link href={`/case-studies/${item.slug}`} className="card-lift group grid grid-cols-1 overflow-hidden lg:grid-cols-2">
      <div className={`relative min-h-64 overflow-hidden ${flip ? 'lg:order-2' : ''}`}>
        <Cover src={item.coverImageUrl} alt={item.title} slug={item.slug} className="absolute inset-0 size-full" />
        {item.industry && <Badge className="absolute left-4 top-4 bg-card/90 text-primary backdrop-blur-sm">{item.industry.name}</Badge>}
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        {item.clientName && <p className="text-sm font-medium text-muted">{item.clientName}</p>}
        <h3 className="display mt-2 text-3xl leading-tight text-primary">{item.title}</h3>
        <dl className="mt-6 space-y-4">
          <Outcome label="Challenge">{item.challenge || item.shortDescription}</Outcome>
          {item.solution && <Outcome label="Solution">{item.solution}</Outcome>}
          {result && <Outcome label="Outcome">{`${result.value} ${result.label}`}</Outcome>}
        </dl>
        {item.technologies && item.technologies.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technology">
            {item.technologies.map((tech) => (
              <li key={tech.name} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                {tech.name}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read case study <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function CaseStudiesSection({ intro, items, tone = 'default' }: { intro: IntroContent; items: CaseCard[]; tone?: 'default' | 'surface' }) {
  if (items.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ul className="space-y-6 lg:space-y-8">
        {items.slice(0, 3).map((item, index) => (
          <li key={item.slug} data-reveal>
            <FeatureCase item={item} flip={index % 2 === 1} />
          </li>
        ))}
      </ul>
      <div data-reveal className="mt-12">
        <ButtonLink href="/case-studies" variant="secondary">
          All case studies <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}

export function InsightsSection({ intro, items, tone = 'default' }: { intro: IntroContent; items: ArticleCard[]; tone?: 'default' | 'surface' }) {
  if (items.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.slug} data-reveal style={{ ['--i' as string]: index % 3 }}>
            <ArticleCardView item={item} />
          </li>
        ))}
      </ul>
      <div data-reveal className="mt-12">
        <ButtonLink href="/insights" variant="secondary">
          All insights <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}

function Author({ item }: { item: TestimonialItem }) {
  return (
    <figcaption className="mt-8 flex items-center gap-4">
      {item.imageUrl ? (
        <SmartImage src={item.imageUrl} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
      ) : (
        <span aria-hidden className="display grid size-12 place-items-center rounded-full bg-cream text-lg text-primary">
          {item.clientName.charAt(0)}
        </span>
      )}
      <span className="min-w-0 text-sm">
        <span className="block font-semibold text-primary">{item.clientName}</span>
        <span className="block text-muted">{[item.position, item.companyName].filter(Boolean).join(', ')}</span>
      </span>
      {item.companyLogoUrl && <SmartImage src={item.companyLogoUrl} alt={item.companyName ?? ''} width={80} height={32} className="ml-auto h-8 w-auto max-w-20 object-contain opacity-80" />}
    </figcaption>
  );
}

/** Quiet, quote-led layout: one large statement, any others set smaller beside it. Hidden when there are none. */
export function TestimonialsSection({ intro, items, tone = 'surface' }: { intro?: IntroContent; items: TestimonialItem[]; tone?: 'default' | 'surface' }) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  return (
    <Section tone={tone} eyebrow={intro?.eyebrow ?? 'Client feedback'} title={intro?.title ?? 'What clients say'} description={intro?.subtitle ?? undefined}>
      <div className={rest.length > 0 ? 'grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16' : 'max-w-4xl'}>
        <figure data-reveal>
          <span aria-hidden className="display block h-12 text-7xl leading-none text-coral">“</span>
          <blockquote className="display text-pretty text-2xl leading-snug text-primary sm:text-4xl sm:leading-[1.2]">{lead.quote}</blockquote>
          <Author item={lead} />
        </figure>
        {rest.length > 0 && (
          <ul className="space-y-6">
            {rest.slice(0, 3).map((item, index) => (
              <li key={item.id} data-reveal style={{ ['--i' as string]: index + 1 }}>
                <figure className="rounded-2xl border border-border bg-card p-6">
                  <blockquote className="text-pretty leading-relaxed text-primary">“{item.quote}”</blockquote>
                  <Author item={item} />
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
