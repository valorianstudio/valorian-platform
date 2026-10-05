import { ArrowRight, Check, ChevronDown, Quote, ShieldCheck, Star } from 'lucide-react';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { FAQS, FEATURES, FOOTER_LINKS, LANDING_NAV, PRICING, SCHOOL_BRAND, STATS, TESTIMONIALS, WHY } from '@/data/school/landing';
import { cn } from '@/lib/cn';
import { DashboardPreview } from './dashboard-preview';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { FeatureCard } from './feature-card';
import { SchoolLogo } from './school-logo';

const SECTION = 'scroll-mt-28 py-20 sm:py-24';
/** Inner column shared by every section, with the same gutters as the navbar and hero so edges line up. */
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'School name', placeholder: 'Northfield Academy' },
  emailPlaceholder: 'jordan@school.edu',
  topics: [
    { value: 'demo', label: 'Book a product demo' },
    { value: 'admission', label: 'Ask about admissions' },
    { value: 'pricing', label: 'Discuss pricing' },
  ],
  messagePlaceholder: 'Tell us about your school and what you need.',
  submitLabel: 'Request demo',
};
const BTN = 'inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';

/**
 * The marketing site of the fictional EduCore product. A Server Component end to end: every section is static HTML, the pricing
 * toggle and FAQ use native inputs and <details>, and the only client code is the small enquiry form.
 */
export function SchoolLandingPage() {
  return (
    <div id="top" className="bg-white text-slate-900">
      <DemoNavbar brand={<SchoolLogo />} links={LANDING_NAV} cta={{ label: 'Request demo', href: '#contact' }} />

      {/* Hero */}
      <section aria-labelledby="school-hero" className="relative overflow-x-clip bg-[radial-gradient(60%_70%_at_85%_0%,#eff6ff,transparent)]">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pb-28 lg:pt-24">
          <div className="min-w-0">
            <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="size-3.5" aria-hidden /> Trusted by 100+ schools
            </p>
            <h1 id="school-hero" className="demo-rise mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 [--i:1] sm:text-5xl lg:text-[3.5rem]">
              Empowering Schools With Smarter Digital Management
            </h1>
            <p className="demo-rise mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">A complete school management platform connecting administrators, teachers, students, and parents.</p>
            <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
              <a href="#contact" className={cn(BTN, 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600')}>
                Request Demo <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#features" className={cn(BTN, 'border border-slate-300 bg-white text-slate-900 hover:border-slate-900 focus-visible:outline-slate-900')}>
                Explore Features
              </a>
            </div>
            <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">
              {['No setup fees', 'Data migration included', 'Mobile apps for everyone'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <DashboardPreview />
        </div>
      </section>

      {/* Features */}
      <section id="features" aria-labelledby="school-features" className={cn(SECTION, 'bg-slate-50')}>
        <div className={COL}>
          <div data-reveal>
            <SectionTitle id="school-features" eyebrow="Features" title="Everything your school runs on, in one place" description="Eight connected modules replace spreadsheets, paper registers and scattered messaging apps." />
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section id="why" aria-labelledby="school-why" className={SECTION}>
        <div className={cn(COL, 'grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center')}>
          <div data-reveal>
            <SectionTitle id="school-why" eyebrow="Why choose us" title="Software that understands schools" description="Designed with principals, teachers and parents, so it fits the way you already work." />
            <a href="#contact" className={cn(BTN, 'mt-8 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900')}>
              Talk to our team
            </a>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {WHY.map((item, i) => (
              <li key={item.title} data-reveal style={{ ['--i' as string]: i }} className="rounded-2xl border border-slate-200 p-6">
                <span className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <Check className="size-4" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Statistics */}
      <section id="results" aria-label="Results in numbers" className="scroll-mt-28 bg-slate-900 py-16 sm:py-20">
        <dl className={cn(COL, 'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4')}>
          {STATS.map((stat, i) => (
            <div key={stat.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col lg:border-l lg:border-white/15 lg:pl-8 first:lg:border-l-0 first:lg:pl-0">
              <dt className="order-2 mt-2 text-sm text-slate-300">{stat.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white tabular-nums sm:text-5xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Testimonials */}
      <section aria-labelledby="school-testimonials" className={cn(SECTION, 'bg-slate-50')}>
        <div className={COL}>
          <div data-reveal>
            <SectionTitle id="school-testimonials" eyebrow="Testimonials" title="Loved by the people who use it every day" />
          </div>
          <ul className="mt-12 grid gap-4 lg:grid-cols-3">
            {TESTIMONIALS.map((item, i) => (
              <li key={item.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex gap-0.5 text-amber-400" role="img" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
                <Quote className="mt-5 size-6 text-blue-200" aria-hidden />
                <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{item.quote}</blockquote>
                <footer className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <span aria-hidden className="grid size-10 place-items-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                    {item.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.role}, {item.school}
                    </p>
                  </div>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" aria-labelledby="school-pricing" className={SECTION}>
        <div className={cn(COL, 'group/billing')}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
            <SectionTitle id="school-pricing" eyebrow="Pricing" title="Simple pricing that grows with your school" description="Every plan includes onboarding, data migration and training." />
            <fieldset className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 p-1">
              <legend className="sr-only">Billing period</legend>
              {[
                ['monthly', 'Monthly'],
                ['annual', 'Annual (save 20%)'],
              ].map(([value, text]) => (
                <label key={value} className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors has-checked:bg-white has-checked:text-slate-900 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-blue-600">
                  <input type="radio" name="school-billing" value={value} defaultChecked={value === 'monthly'} className="sr-only" />
                  {text}
                </label>
              ))}
            </fieldset>
          </div>
          <ul className="mt-12 grid gap-4 lg:grid-cols-3">
            {PRICING.map((plan, i) => (
              <li key={plan.name} data-reveal style={{ ['--i' as string]: i }} className={cn('relative flex flex-col rounded-2xl border bg-white p-6 sm:p-8', plan.featured ? 'border-blue-600 shadow-[0_24px_50px_-28px_rgb(37_99_235/0.5)] ring-1 ring-blue-600' : 'border-slate-200')}>
                {plan.featured && <span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
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
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden /> {feature}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={cn(BTN, 'mt-8 w-full', plan.featured ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600' : 'border border-slate-300 text-slate-900 hover:border-slate-900 focus-visible:outline-slate-900')}>
                  {plan.cta}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="school-faq" className={cn(SECTION, 'bg-slate-50')}>
        <div className={cn(COL, 'grid gap-10 lg:grid-cols-[0.8fr_1.2fr]')}>
          <div data-reveal>
            <SectionTitle id="school-faq" eyebrow="FAQ" title="Questions schools ask us" />
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group rounded-xl border border-slate-200 bg-white px-5 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-slate-900 marker:hidden focus-visible:outline-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180" aria-hidden />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA, admissions and contact */}
      <section id="contact" aria-labelledby="school-cta" className="scroll-mt-28 bg-slate-900 py-20 sm:py-24">
        <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
          <div>
            <SectionTitle id="school-cta" tone="dark" eyebrow="Admissions & demo" title="See EduCore running your school" description="Book a 30-minute walkthrough, or ask our team about admissions, pricing and migration." />
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              {['Personalised walkthrough for your school', 'Reply within one working day', 'No commitment, no credit card'].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-400" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <EnquiryForm copy={ENQUIRY_COPY} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-14 text-slate-400">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <SchoolLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{SCHOOL_BRAND.tagline} for modern schools. A fictional product, designed as a showcase by Valorian Studio.</p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-white">{group.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link}>
                    <span className="cursor-default transition-colors hover:text-white">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={cn(COL, 'mt-12')}>
          <p className="border-t border-slate-800 pt-6 text-xs">© 2026 {SCHOOL_BRAND.name} (demo). All names, schools, figures and testimonials on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
