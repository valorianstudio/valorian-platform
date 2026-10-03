import { ArrowRight, Play } from 'lucide-react';
import { CheckList, CtaBand, DemoSection, ServiceGrid, TechList } from '@/components/site/blocks';
import { LazyGallery as Gallery } from '@/components/site/lazy';
import { CaseCardView, TestimonialsSection } from '@/components/site/editorial';
import { Breadcrumbs, JsonLd } from '@/components/site/seo';
import { LazyShareButtons as ShareButtons } from '@/components/site/lazy';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { SmartImage } from '@/components/ui/smart-image';
import type { CaseCard, CaseDetail } from '@/lib/cms-types';

interface Props {
  study: CaseDetail;
  related: CaseCard[];
  baseUrl: string;
  company: string;
  preview?: boolean;
}

export function CaseStudyView({ study, related, baseUrl, company, preview }: Props) {
  const ctaUrl = study.ctaUrl && study.ctaUrl !== '/contact' ? study.ctaUrl : '/contact';
  const ctaLabel = study.ctaLabel ?? 'Start a Project';
  const desktop = study.media.filter((m) => m.kind !== 'MOBILE');
  const mobile = study.media.filter((m) => m.kind === 'MOBILE');
  const url = `${baseUrl}/case-studies/${study.slug}`;
  const hero = study.featuredImageUrl ?? study.coverImageUrl;
  const sections = [
    ['The challenge', study.challenge],
    ['Our solution', study.solution],
    ['Process & approach', study.approach],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <>
      {!preview && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: study.title,
            description: study.shortDescription,
            datePublished: study.publishedAt ?? undefined,
            dateModified: study.updatedAt,
            image: hero ? [hero.startsWith('/') ? `${baseUrl}${hero}` : hero] : undefined,
            author: { '@type': 'Organization', name: company },
            publisher: { '@type': 'Organization', name: company },
            mainEntityOfPage: url,
          }}
        />
      )}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(50%_80%_at_50%_0%,var(--primary-soft),transparent)]" />
        <div className="mx-auto grid grid-cols-1 w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="min-w-0">
            <Breadcrumbs items={[{ name: 'Case studies', href: '/case-studies' }, { name: study.title }]} base={baseUrl} />
            <div className="flex flex-wrap items-center gap-2">
              {study.industry && <Badge tone="primary">{study.industry.name}</Badge>}
              {study.projectType && <Badge>{study.projectType}</Badge>}
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{study.title}</h1>
            <p className="mt-4 max-w-xl text-pretty text-lg text-muted sm:text-xl">{study.shortDescription}</p>
            {(study.clientName || study.clientLogoUrl) && (
              <p className="mt-6 flex items-center gap-3 text-sm text-muted">
                {study.clientLogoUrl && <SmartImage src={study.clientLogoUrl} alt={study.clientName ?? ''} width={96} height={36} className="h-9 w-auto max-w-28 object-contain" />}
                {study.clientName && <span>Client: <strong className="text-foreground">{study.clientName}</strong></span>}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={ctaUrl} size="lg">
                {ctaLabel} <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              {study.videoUrl && (
                <ButtonLink href={study.videoUrl} size="lg" variant="secondary" target="_blank" rel="noopener noreferrer">
                  <Play className="size-4" aria-hidden /> Watch video
                </ButtonLink>
              )}
            </div>
          </div>
          {hero && (
            <div className="overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/5">
              <SmartImage src={hero} alt={`${study.title} preview`} width={960} height={600} sizes="(min-width: 1024px) 50vw, 100vw" priority className="aspect-[16/10] w-full object-cover" />
            </div>
          )}
        </div>
      </section>

      {(study.services.length > 0 || study.technologies.length > 0) && (
        <section className="border-b border-border bg-surface">
          <dl className="mx-auto grid grid-cols-1 w-full max-w-7xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-2">
            {study.services.length > 0 && (
              <div>
                <dt className="mb-2 text-sm text-muted">Services</dt>
                <dd className="flex flex-wrap gap-2">
                  {study.services.map((s) => (
                    <Badge key={s.slug}>{s.title}</Badge>
                  ))}
                </dd>
              </div>
            )}
            {study.technologies.length > 0 && (
              <div>
                <dt className="mb-2 text-sm text-muted">Technology</dt>
                <dd>
                  <TechList technologies={study.technologies} />
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {study.fullOverview && (
        <Section eyebrow="Overview" title="The project">
          <p className="max-w-3xl whitespace-pre-line text-pretty text-lg text-muted">{study.fullOverview}</p>
        </Section>
      )}

      {sections.length > 0 && (
        <Section tone="surface">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {sections.map(([title, text]) => (
              <Card key={title} className="p-6">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-3 whitespace-pre-line text-muted">{text}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {study.keyFeatures.length > 0 && (
        <Section eyebrow="Delivered" title="Key features">
          <div className="max-w-3xl">
            <CheckList items={study.keyFeatures} />
          </div>
        </Section>
      )}

      {study.results.length > 0 && (
        <Section tone="surface" eyebrow="Outcomes" title="Results">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {study.results.map((result) => (
              <div key={result.label} className="border-t border-border pt-4">
                <dd className="text-4xl font-semibold tracking-tight text-primary">{result.value}</dd>
                <dt className="mt-1 font-medium">{result.label}</dt>
                {result.description && <p className="mt-1 text-sm text-muted">{result.description}</p>}
              </div>
            ))}
          </dl>
        </Section>
      )}

      {(desktop.length > 0 || mobile.length > 0) && (
        <Section eyebrow="Gallery" title="The product">
          <div className="space-y-12">
            {desktop.length > 0 && <Gallery shots={desktop} variant="web" />}
            {mobile.length > 0 && <Gallery shots={mobile} variant="phone" />}
          </div>
        </Section>
      )}

      <TestimonialsSection items={study.testimonials} />
      <DemoSection intro={{ eyebrow: 'Related demos', title: 'Explore similar solutions' }} demos={study.demos} showAll={false} />

      {study.services.length > 0 && (
        <Section eyebrow="Services" title="How we delivered it">
          <ServiceGrid services={study.services} />
        </Section>
      )}

      {related.length > 0 && (
        <Section tone="surface" eyebrow="More work" title="Related case studies">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <CaseCardView item={item} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="mx-auto w-full max-w-7xl px-5 pt-10 sm:px-8">
        <ShareButtons title={study.title} url={url} />
      </div>
      <CtaBand content={{ headline: 'Have a similar challenge?', description: 'Tell us about your project and we will come back with a clear plan.', primaryLabel: ctaLabel, primaryUrl: ctaUrl }} />
    </>
  );
}
