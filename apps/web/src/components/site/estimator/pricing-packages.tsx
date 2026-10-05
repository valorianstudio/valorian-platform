import { ArrowRight, Building2, Check, Rocket, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/cn';

/**
 * Three packages for choosing a starting point. They describe the kind of work, not fixed prices: "Starting from" leads to the calculator
 * below, and the enterprise tier is always a custom quotation. The calculator stays the source of the exact range.
 */
const PACKAGES: { name: string; audience: string; examples: string[]; price: string; icon: LucideIcon; featured?: boolean }[] = [
  { name: 'Starter Solution', audience: 'For small businesses and startups', examples: ['Landing pages', 'Business websites', 'Basic systems'], price: 'Starting from', icon: Rocket },
  { name: 'Business Solution', audience: 'For growing businesses', examples: ['Custom websites', 'Dashboards', 'Management systems'], price: 'Starting from', icon: Building2, featured: true },
  { name: 'Enterprise Solution', audience: 'For large organizations', examples: ['SaaS platforms', 'Custom applications', 'Complex systems'], price: 'Custom quotation', icon: Sparkles },
];

export function PricingPackages() {
  return (
    <section aria-labelledby="packages-heading" className="scroll-mt-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Pricing packages</p>
        <h2 id="packages-heading" className="display mt-2 text-2xl text-primary sm:text-3xl">Choose the right starting point</h2>
        <p className="mt-2 text-muted">Flexible pricing available based on business requirements.</p>
      </div>
      <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PACKAGES.map(({ name, audience, examples, price, icon: Icon, featured }) => (
          <li key={name} className={cn('relative flex flex-col rounded-2xl border p-6 sm:p-7', featured ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-lift)]' : 'border-border bg-card')}>
            {featured && <span className="absolute -top-3 left-6 rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">Most chosen</span>}
            <span className={cn('grid size-11 place-items-center rounded-xl', featured ? 'bg-white/15' : 'bg-primary-soft text-primary')}>
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="display mt-5 text-xl">{name}</h3>
            <p className={cn('mt-1 text-sm', featured ? 'text-white/75' : 'text-muted')}>{audience}</p>
            <p className={cn('mt-5 text-sm font-semibold uppercase tracking-[0.12em]', featured ? 'text-white/70' : 'text-muted')}>{price}</p>
            <p className="display mt-1 text-lg">{price === 'Starting from' ? 'Calculate your range below' : 'Tailored to your scope'}</p>
            <ul className="mt-5 space-y-2.5">
              {examples.map((example) => (
                <li key={example} className="flex items-center gap-2.5 text-sm">
                  <Check className={cn('size-4 shrink-0', featured ? 'text-white' : 'text-accent')} aria-hidden />
                  {example}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-7">
              {price === 'Starting from' ? (
                <ButtonLink href="#estimator" variant={featured ? 'accent' : 'secondary'} className="w-full justify-center">
                  Estimate this package <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              ) : (
                <ButtonLink href="/contact" variant="secondary" className="w-full justify-center">
                  Request a quotation <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const STEPS = [
  { title: 'Project discussion', text: 'We learn your goals, users and must-have features.' },
  { title: 'Design approval', text: 'You approve screens and scope before any build starts.' },
  { title: 'Development begins', text: 'Work is delivered in visible stages, with a review at each one.' },
];

const SPLIT = [
  { label: 'Project start', percent: 40, note: 'When the project is confirmed' },
  { label: 'Development progress', percent: 30, note: 'At the agreed build milestone' },
  { label: 'Final delivery', percent: 30, note: 'When the product is handed over' },
];

/** The payment process: three steps and the 40/30/30 split, so the cost structure is clear before a conversation starts. */
export function PaymentProcess() {
  return (
    <section aria-labelledby="payment-heading" className="scroll-mt-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Simple payment process</p>
        <h2 id="payment-heading" className="display mt-2 text-2xl text-primary sm:text-3xl">Clear steps, clear payments</h2>
      </div>
      <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
            <span className="display grid size-10 shrink-0 place-items-center rounded-full bg-primary text-base text-primary-foreground">{index + 1}</span>
            <div>
              <h3 className="font-semibold text-primary">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Payment structure</p>
        <div role="img" aria-label="Payments split 40 percent at project start, 30 percent at development progress and 30 percent at final delivery" className="mt-4 flex h-4 overflow-hidden rounded-full bg-surface-strong">
          {SPLIT.map((part, index) => (
            <span key={part.label} style={{ width: `${part.percent}%` }} className={cn(index === 0 ? 'bg-primary' : index === 1 ? 'bg-accent' : 'bg-coral')} />
          ))}
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SPLIT.map((part, index) => (
            <li key={part.label}>
              <p className="display text-3xl text-primary">{part.percent}%</p>
              <p className="mt-1 text-sm font-semibold text-primary">{part.label}</p>
              <p className="text-xs text-muted">{part.note}</p>
              <span aria-hidden className={cn('mt-3 block h-1 w-10 rounded-full', index === 0 ? 'bg-primary' : index === 1 ? 'bg-accent' : 'bg-coral')} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
