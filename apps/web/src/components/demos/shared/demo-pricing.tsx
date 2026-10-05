import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SectionTitle } from './section-title';

export interface PricingPlan {
  name: string;
  monthly: number | null;
  annual: number | null;
  blurb: string;
  featured?: boolean;
  features: string[];
  cta: string;
}

const BTN = 'mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg px-6 text-[15px] font-semibold transition-[filter,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]';

/**
 * Pricing cards with a monthly / annual switch for a demo landing page. Server component with no JavaScript: the switch is a native
 * radio group and the prices change through CSS (`group-has-[...]`). Colours follow the demo's --demo-accent variable.
 */
export function DemoPricing({ plans, title, description, headingId, headingClassName }: { plans: PricingPlan[]; title: string; description: string; headingId: string; headingClassName?: string }) {
  return (
    <div className="group/billing">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
        <SectionTitle id={headingId} eyebrow="Pricing" title={title} description={description} headingClassName={headingClassName} />
        <fieldset className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 p-1">
          <legend className="sr-only">Billing period</legend>
          {[
            ['monthly', 'Monthly'],
            ['annual', 'Annual (save 20%)'],
          ].map(([value, text]) => (
            <label key={value} className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors has-checked:bg-white has-checked:text-slate-900 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
              <input type="radio" name={`${headingId}-billing`} value={value} defaultChecked={value === 'monthly'} className="sr-only" />
              {text}
            </label>
          ))}
        </fieldset>
      </div>
      <ul className="mt-12 grid gap-4 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <li key={plan.name} data-reveal style={{ ['--i' as string]: i }} className={cn('relative flex flex-col rounded-2xl border bg-white p-6 sm:p-8', plan.featured ? 'border-[color:var(--demo-accent,#2563eb)] shadow-[0_24px_50px_-28px_rgb(15_23_42/0.45)] ring-1 ring-[color:var(--demo-accent,#2563eb)]' : 'border-slate-200')}>
            {plan.featured && <span className="absolute -top-3 left-6 rounded-full bg-[var(--demo-accent,#2563eb)] px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
            <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{plan.blurb}</p>
            <p className="mt-6 flex items-baseline gap-1">
              {plan.monthly ? (
                <>
                  <span className="text-4xl font-semibold tracking-tight text-slate-900 tabular-nums group-has-[input[value=annual]:checked]/billing:hidden">${plan.monthly}</span>
                  <span className="hidden text-4xl font-semibold tracking-tight text-slate-900 tabular-nums group-has-[input[value=annual]:checked]/billing:inline">${plan.annual}</span>
                  <span className="text-sm text-slate-500">/ month</span>
                </>
              ) : (
                <span className="text-4xl font-semibold tracking-tight text-slate-900">Custom</span>
              )}
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--demo-good,#10b981)]" aria-hidden /> {feature}
                </li>
              ))}
            </ul>
            <a href="#contact" className={cn(BTN, plan.featured ? 'bg-[var(--demo-accent,#2563eb)] text-white hover:brightness-110' : 'border border-slate-300 text-slate-900 hover:border-slate-900')}>
              {plan.cta}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
