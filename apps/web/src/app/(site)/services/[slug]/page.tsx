import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { CheckList, CtaBand, FaqSection, ProcessSection, ServiceGrid, TechList } from '@/components/site/blocks';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { buildMetadata, getService } from '@/lib/cms';
import { getIcon } from '@/lib/icons';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getService(slug);
  if (!data) return {};
  const { service } = data;
  return buildMetadata(service, { title: service.title, description: service.shortDescription, path: `/services/${slug}` });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getService(slug);
  if (!data) notFound();
  const { service, steps, faqs, related, cta } = data;
  const Icon = getIcon(service.icon);
  const ctaLabel = service.ctaLabel ?? cta?.label ?? 'Start a Project';
  const ctaUrl = service.ctaUrl ?? cta?.url ?? '/contact';

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(50%_80%_at_50%_0%,var(--primary-soft),transparent)]" />
        <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
            <span aria-hidden> / </span>
            <span className="text-foreground">{service.title}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div className="min-w-0">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="size-7" aria-hidden />
              </span>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{service.heroTitle || service.title}</h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg text-muted sm:text-xl">{service.heroSubtitle || service.shortDescription}</p>
              <div className="mt-8">
                <ButtonLink href={ctaUrl} size="lg">
                  {ctaLabel} <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
            {service.benefits.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-sm font-medium text-muted">What you get</h2>
                <CheckList items={service.benefits} />
              </Card>
            )}
          </div>
        </div>
      </section>

      <Section eyebrow="Overview" title={`About ${service.title}`}>
        <p className="max-w-3xl whitespace-pre-line text-pretty text-lg text-muted">{service.description}</p>
      </Section>

      {service.features.length > 0 && (
        <Section tone="surface" eyebrow="Capabilities" title="What’s included">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature) => (
              <li key={feature.title}>
                <Card className="h-full p-6">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted">{feature.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {service.technologies.length > 0 && (
        <Section eyebrow="Technology" title="Tools we use for this">
          <TechList technologies={service.technologies} />
        </Section>
      )}

      {service.industries.length > 0 && (
        <Section eyebrow="Industries" title="Where this applies">
          <ul className="flex flex-wrap gap-2.5">
            {service.industries.map((industry) => (
              <li key={industry.slug}>
                <Link href={`/solutions/${industry.slug}`} className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary">
                  {industry.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ProcessSection intro={{ eyebrow: 'How we work', title: 'Our process' }} steps={steps} />
      <FaqSection faqs={faqs} />

      {related.length > 0 && (
        <Section eyebrow="More services" title="Explore related services">
          <ServiceGrid services={related} />
        </Section>
      )}

      <CtaBand content={{ headline: `Ready to talk about ${service.title.toLowerCase()}?`, description: 'Tell us about your project and we’ll come back with a clear plan.', primaryLabel: ctaLabel, primaryUrl: ctaUrl }} />
    </>
  );
}
