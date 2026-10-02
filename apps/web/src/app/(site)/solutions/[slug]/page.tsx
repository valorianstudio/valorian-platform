import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { CheckList, CtaBand, DemoSection, ServiceGrid, TechList } from '@/components/site/blocks';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { buildMetadata, getSolution } from '@/lib/cms';
import { getIcon } from '@/lib/icons';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSolution(slug);
  if (!data) return {};
  return buildMetadata(data.solution, { title: data.solution.name, description: data.solution.shortDescription, path: `/solutions/${slug}` });
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getSolution(slug);
  if (!data) notFound();
  const { solution, cta } = data;
  const Icon = getIcon(solution.icon);
  const ctaLabel = solution.ctaLabel ?? cta?.label ?? 'Start a Project';
  const ctaUrl = solution.ctaUrl ?? cta?.url ?? '/contact';

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(50%_80%_at_50%_0%,var(--accent-soft),transparent)]" />
        <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
            <Link href="/solutions" className="hover:text-foreground">
              Solutions
            </Link>
            <span aria-hidden> / </span>
            <span className="text-foreground">{solution.name}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="min-w-0">
              <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
                <Icon className="size-7" aria-hidden />
              </span>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{solution.name}</h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg text-muted sm:text-xl">{solution.shortDescription}</p>
              <div className="mt-8">
                <ButtonLink href={ctaUrl} size="lg">
                  {ctaLabel} <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
            {solution.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={solution.coverImageUrl} alt="" width={720} height={480} fetchPriority="high" className="w-full rounded-2xl border border-border object-cover" />
            )}
          </div>
        </div>
      </section>

      <Section eyebrow="Overview" title={`Software for ${solution.name.toLowerCase()}`}>
        <p className="max-w-3xl whitespace-pre-line text-pretty text-lg text-muted">{solution.overview}</p>
      </Section>

      {solution.problems.length > 0 && (
        <Section tone="surface" eyebrow="The challenge" title="Problems we solve">
          <ul className="grid gap-4 md:grid-cols-3">
            {solution.problems.map((problem) => (
              <li key={problem}>
                <Card className="flex h-full gap-3 p-5">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
                  <p>{problem}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section eyebrow="Our approach" title="How we help">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <p className="whitespace-pre-line text-pretty text-lg text-muted">{solution.approach}</p>
          {solution.benefits.length > 0 && (
            <Card className="h-fit p-6">
              <h3 className="mb-4 text-sm font-medium text-muted">Benefits</h3>
              <CheckList items={solution.benefits} />
            </Card>
          )}
        </div>
      </Section>

      <DemoSection intro={{ eyebrow: 'Demos', title: `${solution.name} demos`, subtitle: 'Explore concepts and prototypes for this industry.' }} demos={solution.demos} tone="surface" showAll={false} />

      {solution.services.length > 0 && (
        <Section eyebrow="Related services" title="How we deliver it">
          <ServiceGrid services={solution.services} />
        </Section>
      )}

      {solution.technologies.length > 0 && (
        <Section eyebrow="Technology" title="Suggested stack">
          <TechList technologies={solution.technologies} />
        </Section>
      )}

      <CtaBand content={{ headline: `Building for ${solution.name.toLowerCase()}?`, description: 'Tell us about your project and we’ll come back with a clear plan.', primaryLabel: ctaLabel, primaryUrl: ctaUrl }} />
    </>
  );
}
