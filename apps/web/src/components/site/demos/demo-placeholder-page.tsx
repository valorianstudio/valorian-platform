import { ArrowRight, Calculator, Check, Clock } from 'lucide-react';
import { CtaBand } from '@/components/site/blocks';
import { Breadcrumbs, JsonLd } from '@/components/site/seo';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { DEMOS, DEMO_CATEGORIES, DEMO_STATUS_LABEL } from '@/data/demos';
import type { Demo, DemoCategoryId } from '@/data/demos';
import { SITE_URL } from '@/lib/site';
import { DemoCard, DemoVisual, PlatformChips } from './demo-card';

const FORMAT_COPY: Record<DemoCategoryId, string> = {
  'landing-page': 'A fast, conversion-focused page that presents the product and turns campaign traffic into enquiries.',
  'full-stack': 'The complete web platform: dashboards, user roles, database and integrations behind one login.',
  'mobile-app': 'An Android and iOS app for customers or staff, sharing the same data as the website.',
};

/** Detail page for a demo that has no interactive prototype yet: the entry in data/demos.ts, told honestly. Rendered at /demos/<slug>. */
export function DemoPlaceholderPage({ demo }: { demo: Demo }) {
  const related = DEMOS.filter((item) => item.slug !== demo.slug && (item.industry === demo.industry || item.category === demo.category)).slice(0, 3);
  const soon = demo.status === 'in-development' ? 'in development' : 'coming soon';

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: demo.title,
          description: demo.description,
          serviceType: demo.industry,
          provider: { '@type': 'Organization', name: 'Valorian Studio', url: SITE_URL },
          url: `${SITE_URL}/demos/${demo.slug}`,
        }}
      />
      <section className="relative isolate -mt-(--navbar-height) overflow-hidden bg-[radial-gradient(60%_70%_at_90%_0%,rgb(251_224_195/0.85),transparent)]">
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: demo.title }]} />
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">{demo.industry}</Badge>
              <Badge>
                <Clock className="size-3" aria-hidden />
                {DEMO_STATUS_LABEL[demo.status]}
              </Badge>
            </div>
            <h1 className="display mt-6 text-balance text-4xl leading-[1.05] text-primary sm:text-6xl">{demo.title}</h1>
            <p className="mt-4 max-w-xl text-pretty text-lg text-muted sm:text-xl">{demo.description}</p>
            <div className="mt-6">
              <PlatformChips platforms={demo.platforms} />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={`/contact?demo=${demo.slug}`} size="lg">
                Request early access <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/estimate" size="lg" variant="secondary">
                <Calculator className="size-4" aria-hidden /> Estimate This Project
              </ButtonLink>
            </div>
          </div>
          <DemoVisual demo={demo} className="aspect-[16/11] w-full rounded-[1.75rem] shadow-[var(--shadow-lift)]" />
        </div>
      </section>

      <section aria-label="Demo status" className="border-b border-border bg-surface">
        <p className="mx-auto flex w-full max-w-7xl items-start gap-3 px-5 py-4 text-sm text-muted sm:px-8">
          <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>The interactive demo for this solution is {soon}. This page describes what we would build; ask us for a walkthrough in the meantime.</span>
        </p>
      </section>

      <Section eyebrow="What you get" title="Key features">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {demo.features.map((feature) => (
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
              {demo.technologies.map((tech) => (
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
          {demo.offerings.map((offering) => {
            const category = DEMO_CATEGORIES.find((item) => item.id === offering);
            return (
              <li key={offering}>
                <Card className="h-full p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{category?.short}</p>
                  <h3 className="display mt-2 text-xl text-primary">{category?.platform}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{FORMAT_COPY[offering]}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      {related.length > 0 && (
        <Section eyebrow="Explore more" title="Related demos">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <DemoCard demo={item} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand content={{ headline: `Need a ${demo.title.toLowerCase()}?`, description: 'Tell us about your business and we will shape this solution around how you work.', primaryLabel: 'Start a Project', primaryUrl: `/contact?demo=${demo.slug}` }} />
    </>
  );
}
