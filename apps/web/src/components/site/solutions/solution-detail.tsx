import { ArrowRight, Calculator, Check, Clock } from 'lucide-react';
import { CtaBand } from '@/components/site/blocks';
import { JsonLd, Breadcrumbs } from '@/components/site/seo';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { SITE_URL } from '@/lib/site';
import { SOLUTION_CATEGORIES, DEMO_STATUS_LABEL, SOLUTIONS, demoHref } from '@/lib/solutions-catalog';
import type { SolutionCategoryId, SolutionDemo } from '@/lib/solutions-catalog';
import { PlatformChips, SolutionCard } from './solution-card';
import { SolutionVisual } from './solution-visual';

const OFFERING_COPY: Record<SolutionCategoryId, { title: string; text: string }> = {
  'landing-page': { title: 'Landing page', text: 'A fast, conversion-focused page that presents the product and turns campaign traffic into enquiries.' },
  'full-stack': { title: 'Full stack website', text: 'The complete web platform: dashboards, user roles, database and integrations behind one login.' },
  'mobile-app': { title: 'Mobile app', text: 'An Android and iOS app for customers or staff, sharing the same data as the website.' },
};

/** Page for a catalog solution that does not have a managed interactive demo yet: a clear, honest placeholder with the full story. */
export function SolutionDetail({ solution }: { solution: SolutionDemo }) {
  const ready = solution.demoStatus === 'available' && (solution.demoSlug || solution.demoUrl);
  const related = SOLUTIONS.filter((item) => item.slug !== solution.slug && (item.industry === solution.industry || item.category === solution.category)).slice(0, 3);
  const primary = solution.offerings[0];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: solution.title,
          description: solution.description,
          serviceType: solution.industry,
          provider: { '@type': 'Organization', name: 'Valorian Studio', url: SITE_URL },
          url: `${SITE_URL}/demos/${solution.slug}`,
        }}
      />
      <section className="relative isolate -mt-(--navbar-height) overflow-hidden bg-[radial-gradient(60%_70%_at_90%_0%,rgb(251_224_195/0.85),transparent)]">
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: solution.title }]} />
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">{solution.industry}</Badge>
              <Badge tone={ready ? 'accent' : 'neutral'}>
                {!ready && <Clock className="size-3" aria-hidden />}
                {DEMO_STATUS_LABEL[solution.demoStatus]}
              </Badge>
            </div>
            <h1 className="display mt-6 text-balance text-4xl leading-[1.05] text-primary sm:text-6xl">{solution.title}</h1>
            <p className="mt-4 max-w-xl text-pretty text-lg text-muted sm:text-xl">{solution.description}</p>
            <div className="mt-6">
              <PlatformChips platforms={solution.platforms} />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {ready && (
                <ButtonLink href={demoHref(solution)} size="lg">
                  Open the interactive demo <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              )}
              <ButtonLink href={`/contact?demo=${solution.slug}`} size="lg" variant={ready ? 'secondary' : 'primary'}>
                {ready ? 'Discuss this solution' : 'Request early access'} {!ready && <ArrowRight className="size-4" aria-hidden />}
              </ButtonLink>
              <ButtonLink href="/estimate" size="lg" variant="secondary">
                <Calculator className="size-4" aria-hidden /> Estimate This Project
              </ButtonLink>
            </div>
          </div>
          <SolutionVisual solution={solution} variant={primary} className="aspect-[16/11] w-full rounded-[1.75rem] shadow-[var(--shadow-lift)]" />
        </div>
      </section>

      {!ready && (
        <section aria-label="Demo status" className="border-b border-border bg-surface">
          <p className="mx-auto flex w-full max-w-7xl items-start gap-3 px-5 py-4 text-sm text-muted sm:px-8">
            <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            <span>
              The interactive demo for this solution is {solution.demoStatus === 'in-development' ? 'in development' : 'coming soon'}. This page describes what we would build; ask us for a walkthrough in the meantime.
            </span>
          </p>
        </section>
      )}

      <Section eyebrow="What you get" title="Key features">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {solution.features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Check className="size-3" aria-hidden />
                </span>
                <span className="font-medium text-primary">{feature}</span>
              </li>
            ))}
          </ul>
          <Card className="self-start p-6">
            <h3 className="text-sm font-semibold text-muted">Technology stack</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {solution.technologies.map((tech) => (
                <li key={tech} className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
                  {tech}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section tone="surface" eyebrow="Available as" title="Choose the format that fits">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {solution.offerings.map((offering) => {
            const info = SOLUTION_CATEGORIES.find((item) => item.id === offering);
            return (
              <li key={offering}>
                <Card className="h-full p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{info?.short}</p>
                  <h3 className="display mt-2 text-xl text-primary">{OFFERING_COPY[offering].title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{OFFERING_COPY[offering].text}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      {related.length > 0 && (
        <Section eyebrow="Explore more" title="Related solutions">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <SolutionCard solution={item} variant={item.category} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand content={{ headline: `Need a ${solution.title.toLowerCase()}?`, description: 'Tell us about your business and we will shape this solution around how you work.', primaryLabel: 'Start a Project', primaryUrl: `/contact?demo=${solution.slug}` }} />
    </>
  );
}
