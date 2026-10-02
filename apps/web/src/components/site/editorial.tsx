import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock, Quote, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { SmartImage } from '@/components/ui/smart-image';
import type { ArticleCard, CaseCard, IntroContent, TestimonialItem } from '@/lib/cms-types';

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
export const formatPublished = (value: string | null) => (value ? dateFormat.format(new Date(value)) : '');

function Cover({ src, alt, slug }: { src: string | null; alt: string; slug: string }) {
  const tone = slug.length % 2 === 0;
  return (
    <div className={`relative aspect-[16/9] overflow-hidden border-b border-border ${tone ? 'bg-primary-soft' : 'bg-accent-soft'}`}>
      {src ? (
        <SmartImage src={src} alt={alt} width={640} height={360} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
      ) : (
        <span aria-hidden className={`absolute inset-0 grid place-items-center text-5xl font-semibold ${tone ? 'text-primary/30' : 'text-accent/30'}`}>
          {alt.charAt(0)}
        </span>
      )}
    </div>
  );
}

export function CaseCardView({ item }: { item: CaseCard }) {
  return (
    <Link href={`/case-studies/${item.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <Cover src={item.coverImageUrl} alt={item.title} slug={item.slug} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {item.industry && <Badge tone="primary">{item.industry.name}</Badge>}
          {item.clientName && <span className="text-sm text-muted">{item.clientName}</span>}
        </div>
        <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
        <p className="mt-2 flex-1 text-muted">{item.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Read case study <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ArticleCardView({ item }: { item: ArticleCard }) {
  return (
    <Link href={`/insights/${item.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <Cover src={item.featuredImageUrl} alt={item.featuredImageAlt ?? item.title} slug={item.slug} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {item.category && <Badge tone="primary">{item.category.name}</Badge>}
          {item.publishedAt && <time dateTime={item.publishedAt}>{formatPublished(item.publishedAt)}</time>}
        </div>
        <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
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

export function CaseStudiesSection({ intro, items, tone = 'default' }: { intro: IntroContent; items: CaseCard[]; tone?: 'default' | 'surface' }) {
  if (items.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <CaseCardView item={item} />
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <ButtonLink href="/case-studies" variant="secondary">
          All case studies <ArrowUpRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}

export function InsightsSection({ intro, items, tone = 'default' }: { intro: IntroContent; items: ArticleCard[]; tone?: 'default' | 'surface' }) {
  if (items.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <ArticleCardView item={item} />
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <ButtonLink href="/insights" variant="secondary">
          All insights <ArrowUpRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}

export function TestimonialsSection({ intro, items, tone = 'surface' }: { intro?: IntroContent; items: TestimonialItem[]; tone?: 'default' | 'surface' }) {
  if (items.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro?.eyebrow ?? 'Client feedback'} title={intro?.title ?? 'What clients say'} description={intro?.subtitle ?? undefined}>
      <ul className={`grid gap-6 ${items.length === 1 ? 'max-w-3xl' : items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {items.map((item) => (
          <li key={item.id}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
              <Quote className="size-6 text-primary/40" aria-hidden />
              {item.rating !== null && (
                <p className="mt-3 flex gap-0.5" role="img" aria-label={`${item.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`size-4 ${i < (item.rating ?? 0) ? 'fill-current text-primary' : 'text-border'}`} aria-hidden />
                  ))}
                </p>
              )}
              <blockquote className="mt-3 flex-1 text-pretty text-lg">{item.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                {item.imageUrl ? (
                  <SmartImage src={item.imageUrl} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                ) : (
                  <span aria-hidden className="grid size-11 place-items-center rounded-full bg-primary-soft font-semibold text-primary">
                    {item.clientName.charAt(0)}
                  </span>
                )}
                <span className="min-w-0 text-sm">
                  <span className="block font-medium">{item.clientName}</span>
                  <span className="block text-muted">{[item.position, item.companyName].filter(Boolean).join(', ')}</span>
                </span>
                {item.companyLogoUrl && <SmartImage src={item.companyLogoUrl} alt={item.companyName ?? ''} width={80} height={32} className="ml-auto h-8 w-auto max-w-20 object-contain opacity-80" />}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
