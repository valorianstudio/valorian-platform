import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { CAPABILITIES, PRINCIPLES, PROCESS_STEPS, SAMPLE_DEMOS } from '@/lib/content';
import type { DemoPreview } from '@/lib/content';

export function CapabilityPreview() {
  return (
    <Section eyebrow="What we build" title="Software for every stage of your business" description="From first release to platform scale, one team covering product, design and engineering.">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map(({ title, description, Icon }) => (
          <li key={title}>
            <Card className="group h-full p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-muted">{description}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function WhyValorian({ companyName }: { companyName: string }) {
  return (
    <Section tone="surface" eyebrow={`Why ${companyName}`} title="Engineering rigor, with product sense">
      <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map((principle, index) => (
          <li key={principle.title} className="border-t border-border pt-5">
            <p className="font-mono text-sm text-accent">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-3 text-lg font-semibold">{principle.title}</h3>
            <p className="mt-2 text-muted">{principle.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function DemoCard({ demo }: { demo: DemoPreview }) {
  return (
    <Card className="group h-full overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div aria-hidden className={`relative h-40 overflow-hidden border-b border-border ${demo.accent === 'accent' ? 'bg-accent-soft' : 'bg-primary-soft'}`}>
        <div className="absolute inset-x-6 top-6 space-y-2.5 rounded-t-xl border border-b-0 border-border bg-background p-4 shadow-sm">
          <div className="h-2.5 w-1/3 rounded bg-surface-strong" />
          <div className="flex items-end gap-1.5">
            {[40, 65, 50, 80, 60, 90].map((height, i) => (
              <span key={i} className={`w-full rounded-sm ${demo.accent === 'accent' ? 'bg-accent' : 'bg-primary'}`} style={{ height: `${height * 0.6}px`, opacity: 0.35 + i * 0.12 }} />
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <Badge tone={demo.accent}>{demo.category}</Badge>
        <h3 className="mt-3 text-lg font-semibold">{demo.title}</h3>
        <p className="mt-2 text-muted">{demo.summary}</p>
      </div>
    </Card>
  );
}

export function DemoPreviewSection({ demos = SAMPLE_DEMOS }: { demos?: DemoPreview[] }) {
  return (
    <Section
      eyebrow="Selected work"
      title="Product experiences that speak for themselves"
      description="A preview of the kind of products we deliver. Interactive live demos are coming soon."
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {demos.map((demo) => (
          <li key={demo.slug}>
            <DemoCard demo={demo} />
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <ButtonLink href="/demos" variant="secondary">
          View all demos <ArrowUpRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}

export function ProcessPreview() {
  return (
    <Section tone="surface" eyebrow="How we work" title="A clear path from idea to scale">
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {PROCESS_STEPS.map((step, index) => (
          <li key={step.title} className="relative">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full border border-border bg-background font-mono text-sm font-medium text-primary">{index + 1}</span>
              {index < PROCESS_STEPS.length - 1 && <span aria-hidden className="hidden h-px flex-1 bg-border lg:block" />}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function FinalCta({ companyName }: { companyName: string }) {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-center text-background sm:px-12 sm:py-20">
        <div aria-hidden className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Have a product in mind? Let&rsquo;s build it properly.</h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg opacity-75">
            Tell {companyName} about your project and we&rsquo;ll come back with a clear, honest plan.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/contact" size="lg" className="bg-background text-foreground hover:bg-background">
              Start a Project <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
