import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { isExternal } from '@/lib/cms';
import type { CtaContent, DemoCardData, FaqItem, IntroContent, ProcessStepItem, ServiceCard, TechnologyCard, ValueItem } from '@/lib/cms-types';
import { DemoCard } from './demos/demo-card';
import { getIcon } from '@/lib/icons';

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

function ctaButton(href: string, label: string, variant: 'primary' | 'secondary', inverse = false) {
  const className = inverse && variant === 'primary' ? 'bg-background text-foreground hover:bg-background' : undefined;
  return (
    <ButtonLink href={href} size="lg" variant={variant} className={className}>
      {label}
      {variant === 'primary' && <ArrowRight className="size-4" aria-hidden />}
    </ButtonLink>
  );
}

export function CtaBand({ content }: { content: CtaContent }) {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-center text-background sm:px-12 sm:py-20">
        <div aria-hidden className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{content.headline}</h2>
          {content.description && <p className="mx-auto mt-4 max-w-xl text-pretty text-lg opacity-75">{content.description}</p>}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {ctaButton(content.primaryUrl, content.primaryLabel, 'primary', true)}
            {content.secondaryLabel && content.secondaryUrl && (
              <ButtonLink href={content.secondaryUrl} size="lg" variant="ghost" className="text-background hover:bg-background/10">
                {content.secondaryLabel}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceGrid({ services }: { services: ServiceCard[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = getIcon(service.icon);
        return (
          <li key={service.slug}>
            <Link
              href={`/services/${service.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 flex-1 text-muted">{service.shortDescription}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
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
      <div className="mt-10">
        <ButtonLink href="/services" variant="secondary">
          All services <ArrowUpRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}

export function WhySection({ intro, values }: { intro: IntroContent; values: ValueItem[] }) {
  if (values.length === 0) return null;
  return (
    <Section tone="surface" eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => {
          const Icon = getIcon(value.icon);
          return (
            <li key={value.id} className="border-t border-border pt-5">
              <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 flex flex-wrap items-center gap-2 text-lg font-semibold">
                {value.title}
                {value.highlight && <Badge tone="accent">{value.highlight}</Badge>}
              </h3>
              <p className="mt-2 text-muted">{value.description}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function DemoSection({ intro, demos, tone = 'default', showAll = true }: { intro: IntroContent; demos: DemoCardData[]; tone?: 'default' | 'surface'; showAll?: boolean }) {
  if (demos.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <li key={demo.slug}>
            <DemoCard demo={demo} />
          </li>
        ))}
      </ul>
      {showAll && (
        <div className="mt-10">
          <ButtonLink href="/demos" variant="secondary">
            View all demos <ArrowUpRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      )}
    </Section>
  );
}

export function ProcessSection({ intro, steps, tone = 'surface' }: { intro: IntroContent; steps: ProcessStepItem[]; tone?: 'default' | 'surface' }) {
  if (steps.length === 0) return null;
  return (
    <Section tone={tone} eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
        {steps.map((step, index) => (
          <li key={step.id}>
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background font-mono text-sm font-medium text-primary">{index + 1}</span>
              <span aria-hidden className="hidden h-px flex-1 bg-border xl:block" />
            </div>
            {step.label && <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">{step.label}</p>}
            <h3 className={`${step.label ? 'mt-1' : 'mt-4'} text-lg font-semibold`}>{step.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function TechList({ technologies }: { technologies: TechnologyCard[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {technologies.map((tech) => (
        <li key={tech.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-sm font-medium">
          {tech.logoUrl && /^https?:/i.test(tech.logoUrl) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tech.logoUrl} alt="" width={16} height={16} loading="lazy" className="size-4 object-contain" />
          )}
          {tech.name}
        </li>
      ))}
    </ul>
  );
}

const CATEGORY_LABEL: Record<string, string> = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  INFRASTRUCTURE: 'Infrastructure',
  MOBILE: 'Mobile',
  AI: 'AI',
  DEVOPS: 'DevOps',
};

export function TechSection({ intro, technologies }: { intro: IntroContent; technologies: TechnologyCard[] }) {
  if (technologies.length === 0) return null;
  const groups = Object.entries(Object.groupBy(technologies, (tech) => tech.category));
  return (
    <Section tone="surface" eyebrow={intro.eyebrow ?? undefined} title={intro.title} description={intro.subtitle ?? undefined}>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-3 text-sm font-medium text-muted">{CATEGORY_LABEL[category] ?? category}</h3>
            <TechList technologies={items ?? []} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FaqSection({ faqs, title = 'Frequently asked questions' }: { faqs: FaqItem[]; title?: string }) {
  if (faqs.length === 0) return null;
  return (
    <Section eyebrow="FAQ" title={title}>
      <div className="max-w-3xl divide-y divide-border rounded-2xl border border-border">
        {faqs.map((faq) => (
          <details key={faq.id} className="group px-5 py-1 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 font-medium [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="whitespace-pre-line pb-4 text-muted">{faq.answer}</p>
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
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Check className="size-3" aria-hidden />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
