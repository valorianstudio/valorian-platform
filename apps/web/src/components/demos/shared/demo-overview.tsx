import Link from 'next/link';
import { ArrowRight, Calculator, Check, Globe, Rocket, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import { CtaBand } from '@/components/site/blocks';
import { Breadcrumbs, JsonLd } from '@/components/site/seo';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import type { Demo } from '@/data/demos';
import { SITE_URL } from '@/lib/site';

const ICONS = { 'landing-page': Rocket, website: Globe, 'mobile-app': Smartphone } as const;

export interface DemoOverviewConfig {
  slug: string;
  title: string;
  basePath: string;
  experiences: { key: keyof typeof ICONS; label: string; href: string; title: string; description: string; highlights: string[] }[];
}

/**
 * The overview page of an interactive demo: hero, the three experiences (landing page, website, mobile app), what a project
 * includes and a call to action. All content is static (data/demos.ts plus the demo's own data), so it makes no API call and ships
 * no client JavaScript of its own. `bar` is the demo's experience bar, `visual` the hero artwork.
 */
export function DemoOverview({ demo, config, bar, visual, sectionTitle, closing, disclaimer }: { demo: Demo; config: DemoOverviewConfig; bar: ReactNode; visual: ReactNode; sectionTitle: string; closing: { headline: string; description: string }; disclaimer: string }) {
  const website = config.experiences.find((experience) => experience.key === 'website') ?? config.experiences[0];
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${config.title} Demo`,
          description: demo.description,
          url: `${SITE_URL}${config.basePath}`,
          provider: { '@type': 'Organization', name: 'Valorian Studio', url: SITE_URL },
          hasPart: config.experiences.map((experience) => ({ '@type': 'WebPage', name: experience.title, url: `${SITE_URL}${experience.href}` })),
        }}
      />
      {bar}

      <section className="relative isolate overflow-x-clip bg-[radial-gradient(60%_70%_at_90%_0%,rgb(251_224_195/0.85),transparent)]">
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-5 pb-16 pt-10 sm:px-8 sm:pb-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: config.title }]} />
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">{demo.industry}</Badge>
              <Badge tone="accent">Interactive demo</Badge>
            </div>
            <h1 className="display mt-6 text-balance text-4xl leading-[1.05] text-primary sm:text-6xl">{config.title}</h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">{demo.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={website.href} size="lg">
                Explore the website <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href={`/contact?demo=${config.slug}`} size="lg" variant="secondary">
                Order a system like this
              </ButtonLink>
              <ButtonLink href={`/estimate?demo=${config.slug}`} size="lg" variant="ghost">
                <Calculator className="size-4" aria-hidden /> Estimate this project
              </ButtonLink>
            </div>
          </div>
          {visual}
        </div>
      </section>

      <Section id="experiences" eyebrow="Three experiences" title="One product, designed three ways" description="Every project can include a marketing landing page, a full web platform and a mobile app. Open each one and use it like a real product.">
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {config.experiences.map((experience, index) => {
            const Icon = ICONS[experience.key];
            return (
              <li key={experience.key} data-reveal style={{ ['--i' as string]: index }}>
                <article className="card-lift group relative flex h-full flex-col p-6 sm:p-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-accent">{experience.label} showcase</p>
                  <h2 className="display mt-2 text-2xl text-primary">
                    <Link href={experience.href} className="after:absolute after:inset-0 after:content-['']">
                      {experience.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{experience.description}</p>
                  <ul className="mt-5 space-y-2" aria-label="Highlights">
                    {experience.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-primary">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {item}
                      </li>
                    ))}
                  </ul>
                  <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-semibold text-primary">
                    Open {experience.label.toLowerCase()} demo <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </article>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="surface" eyebrow="What a project includes" title={sectionTitle}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {demo.features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Check className="size-3" aria-hidden />
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div>
            <h3 className="text-sm font-medium text-muted">Technology</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {demo.technologies.map((tech) => (
                <li key={tech} className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
                  {tech}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">{disclaimer}</p>
          </div>
        </div>
      </Section>

      <CtaBand content={{ ...closing, primaryLabel: 'Start a project', primaryUrl: `/contact?demo=${config.slug}` }} />
    </>
  );
}
