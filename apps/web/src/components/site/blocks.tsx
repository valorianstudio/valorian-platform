import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { SmartImage } from '@/components/ui/smart-image';
import { isExternal } from '@/lib/cms';
import type { CtaContent, DemoCardData, FaqItem, IntroContent, ProcessStepItem, ServiceCard, TechnologyCard, ValueItem } from '@/lib/cms-types';
import { DemoCard } from './demos/demo-card';
import { JsonLd } from './seo';
import { getIcon } from '@/lib/icons';
import { mergeTechnologies } from '@/lib/tech-catalog';
import { TechShowcase } from './tech-showcase';

export function SmartLink({ href, className, children, newTab }: { href: string; className?: string; children: ReactNode; newTab?: boolean }) {
  if (isExternal(href) || newTab) {
    return (
      <a href={href} className={className} {...(newTab || /^https?:/i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

const onDarkSecondary = 'border-white/30 bg-transparent text-[#fffdfc] hover:border-white hover:bg-white/10';

/** Closing call to action on deep slate: strong contrast without any neon. */
export function CtaBand({ content }: { content: CtaContent }) {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24">
      <div data-reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate px-6 py-16 text-[#fffdfc] sm:rounded-[2.5rem] sm:px-16 sm:py-24">
        <div aria-hidden className="grain absolute inset-0 opacity-[0.06] mix-blend-screen" />
        <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-coral/90 sm:size-[26rem]" />
        <div aria-hidden className="absolute -right-10 top-24 size-56 rounded-full border border-white/25 sm:size-80" />
        <div aria-hidden className="absolute -bottom-32 left-[-4rem] size-72 rounded-full bg-white/[0.05]" />
        <div className="relative max-w-3xl">
          <h2 className="display text-balance text-4xl leading-[1.05] sm:text-6xl">{content.headline}</h2>
          {content.description && <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[#d4dcd9]">{content.description}</p>}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={content.primaryUrl} size="lg" variant="accent">
              {content.primaryLabel}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </ButtonLink>
            {content.secondaryLabel && content.secondaryUrl && (
              <ButtonLink href={content.secondaryUrl} size="lg" variant="secondary" className={onDarkSecondary}>
                {content.secondaryLabel}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Editorial services layout: the first service is featured on slate, the rest follow as light cards. */
export function ServiceGrid({ services }: { services: ServiceCard[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => {
        const Icon = getIcon(service.icon);
        const featured = index === 0 && services.length > 2;
        return (
          <li key={service.slug} data-reveal style={{ ['--i' as string]: index % 3 }} className={featured ? 'sm:col-span-2 lg:row-span-2' : undefined}>
            <Link
              href={`/services/${service.slug}`}
              className={
                featured
                  ? 'group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-slate p-8 text-[#fffdfc] shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-[3px] hover:shadow-[var(--shadow-lift)] sm:p-10'
                  : 'card-lift group flex h-full flex-col p-7'
              }
            >
              {featured && <span aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-coral/90 transition-transform duration-500 ease-out group-hover:scale-105" />}
              <span className={featured ? 'relative grid size-14 place-items-center rounded-2xl bg-[#fffdfc] text-primary' : 'grid size-11 place-items-center rounded-xl bg-accent-soft text-primary'}>
                <Icon className={featured ? 'size-6' : 'size-5'} aria-hidden />
              </span>
              <div className="relative mt-10">
                <span className={`font-mono text-xs ${featured ? 'text-coral' : 'text-muted'}`}>{String(index + 1).padStart(2, '0')}</span>
                <h3 className={`display mt-2 ${featured ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{service.title}</h3>
                <p className={`mt-3 max-w-md leading-relaxed ${featured ? 'text-[#d4dcd9]' : 'text-muted'}`}>{service.shortDescription}</p>
                <span className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${featured ? 'text-coral' : 'text-primary'}`}>
                  Learn more <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function CapabilitySection({ intro, services }: { intro: IntroContent; services: ServiceCard[] }) {
  if (services.length === 0) return null;
  return (
    <Section eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ServiceGrid services={services} />
      <div data-reveal className="mt-12">
        <ButtonLink href="/services" variant="secondary">
          All services <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}

/** Credibility as an editorial list: a statement on the left, numbered principles on the right. */
export function WhySection({ intro, values }: { intro: IntroContent; values: ValueItem[] }) {
  if (values.length === 0) return null;
  return (
    <section className="relative bg-surface py-20 sm:py-24 lg:py-32">
      <div className="mx-auto grid grid-cols-1 w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-reveal className="lg:sticky lg:top-[calc(var(--navbar-height)+2rem)] lg:self-start">
          {intro.eyebrow && (
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              <span aria-hidden className="h-px w-8 bg-accent/60" />
              {intro.eyebrow}
            </p>
          )}
          <h2 className="display text-balance text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.08]">{intro.title}</h2>
          {intro.subtitle && <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted">{intro.subtitle}</p>}
        </div>
        <ol>
          {values.map((value, index) => (
            <li key={value.id} data-reveal className="group grid grid-cols-[3.2rem_1fr] gap-4 border-t border-[rgb(52_70_72/0.2)] py-8 first:border-t-0 first:pt-0 sm:grid-cols-[4.5rem_1fr]">
              <span className="display text-3xl text-accent/70 transition-colors duration-300 group-hover:text-accent sm:text-4xl">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="display flex flex-wrap items-center gap-3 text-2xl text-primary sm:text-[1.7rem]">
                  {value.title}
                  {value.highlight && <span className="rounded-full bg-accent-soft px-3 py-0.5 font-sans text-xs font-semibold tracking-normal text-primary">{value.highlight}</span>}
                </h3>
                <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">{value.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DemoSection({ intro, demos, tone = 'default', showAll = true }: { intro: IntroContent; demos: DemoCardData[]; tone?: 'default' | 'surface'; showAll?: boolean }) {
  if (demos.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {demos.map((demo, index) => (
          <li key={demo.slug} data-reveal style={{ ['--i' as string]: index % 2 }}>
            <DemoCard demo={demo} />
          </li>
        ))}
      </ul>
      {showAll && (
        <div data-reveal className="mt-12">
          <ButtonLink href="/demos" variant="secondary">
            View all demos <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </ButtonLink>
        </div>
      )}
    </Section>
  );
}

/** Process timeline: vertical on small screens, a single horizontal line on wide screens. Steps reveal as you scroll. */
export function ProcessSection({ intro, steps, tone = 'surface' }: { intro: IntroContent; steps: ProcessStepItem[]; tone?: 'default' | 'surface' }) {
  if (steps.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ol className="grid xl:grid-flow-col xl:auto-cols-fr xl:gap-8">
        {steps.map((step, index) => (
          <li key={step.id} data-reveal style={{ ['--i' as string]: index }} className="relative flex gap-5 pb-10 last:pb-0 xl:block xl:pb-0">
            <div className="relative flex shrink-0 flex-col items-center xl:mb-7 xl:flex-row">
              <span className="relative z-10 grid size-12 place-items-center rounded-full border border-[rgb(52_70_72/0.25)] bg-card">
                <span className="display text-base text-primary">{index + 1}</span>
              </span>
              {index < steps.length - 1 && (
                <>
                  <span aria-hidden className="mt-1 w-px flex-1 bg-border xl:hidden">
                    <span className="tl-line-v block size-full bg-accent/60" />
                  </span>
                  <span aria-hidden className="ml-3 hidden h-px flex-1 bg-border xl:block">
                    <span className="tl-line block size-full bg-accent/60" />
                  </span>
                </>
              )}
            </div>
            <div className="min-w-0 pt-2 xl:pt-0">
              {step.label && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{step.label}</p>}
              <h3 className={`display ${step.label ? 'mt-1' : ''} text-xl text-primary`}>{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function TechList({ technologies }: { technologies: TechnologyCard[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <li key={tech.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-primary transition-colors duration-200 hover:border-border-strong">
          {tech.logoUrl && /^https?:/i.test(tech.logoUrl) && (
            <SmartImage src={tech.logoUrl} alt="" width={16} height={16} sizes="16px" className="size-4 object-contain" />
          )}
          {tech.name}
        </li>
      ))}
    </ul>
  );
}

/** Technology ecosystem: searchable, filterable cards with a plain-language explanation for every tool. */
export function TechSection({ intro, technologies }: { intro: IntroContent; technologies: TechnologyCard[] }) {
  return (
    <Section id="technology" tone="surface" eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <TechShowcase technologies={mergeTechnologies(technologies)} />
    </Section>
  );
}

export function FaqSection({ faqs, title = 'Frequently asked questions' }: { faqs: FaqItem[]; title?: string }) {
  if (faqs.length === 0) return null;
  return (
    <Section eyebrow="FAQ" title={title}>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }} />
      <div className="max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {faqs.map((faq) => (
          <details key={faq.id} className="group px-5 py-1 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 font-semibold text-primary transition-colors [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown className="size-4 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" aria-hidden />
            </summary>
            <p className="whitespace-pre-line pb-4 leading-relaxed text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-primary">
            <Check className="size-3" aria-hidden />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
