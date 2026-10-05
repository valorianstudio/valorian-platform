import { ArrowRight, BarChart3, Bike, Check, CreditCard, MapPinned, Quote, Route, ShieldCheck, Star, Store, Truck, Package, Briefcase, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Manrope } from 'next/font/google';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { DemoPricing } from '@/components/demos/shared/demo-pricing';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { DELIVERY_BRAND, FEATURES, FOOTER_LINKS, HOW_IT_WORKS, LANDING_NAV, PARTNERS, PLANS_PUBLIC, SERVICES_PUBLIC, STATS, TESTIMONIALS } from '@/data/delivery/landing';
import type { FeatureIcon } from '@/data/delivery/landing';
import { DELIVERY_THEME } from '@/data/delivery/meta';
import { cn } from '@/lib/cn';
import { DeliveryLogo } from './delivery-logo';
import { MapView } from './map-view';

/** Geometric sans for the headlines: loaded only on this route, which gives the page its fast, modern tone. */
const display = Manrope({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = { booking: Truck, tracking: MapPinned, riders: Bike, route: Route, payments: CreditCard, analytics: BarChart3 };
const SERVICE_ICONS: LucideIcon[] = [UtensilsCrossed, Package, Briefcase];

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Business name', placeholder: 'Northwind Logistics' },
  emailPlaceholder: 'you@business.example',
  topics: [
    { value: 'order', label: 'Order a delivery now' },
    { value: 'business', label: 'Set up business delivery' },
    { value: 'rider', label: 'Become a rider' },
  ],
  messagePlaceholder: 'Tell us what you deliver, how often and from where.',
  submitLabel: 'Get started',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const HEADING = cn(display.className, 'tracking-tight');

/**
 * The marketing site of the fictional Swiftwheel delivery company, as a standalone full-page preview (no Valorian header or footer).
 * A Server Component end to end: static HTML, a live map preview, a booking form and gently revealed sections.
 */
export function DeliveryLandingPage() {
  return (
    <div id="top" style={DELIVERY_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<DeliveryLogo />} links={LANDING_NAV} cta={{ label: 'Order now', href: '#book' }} standalone />

      <main id="main">
        {/* Hero with map preview and booking */}
        <section aria-labelledby="delivery-hero" className="relative overflow-x-clip bg-[linear-gradient(180deg,#eff6ff,#ffffff)]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pb-28">
            <div className="min-w-0">
              <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-[color:var(--demo-accent-ink)]"><ShieldCheck className="size-3.5" aria-hidden /> Insured riders · Live in 1,200 zones</p>
              <h1 id="delivery-hero" className={cn(HEADING, 'demo-rise mt-6 text-balance text-5xl font-extrabold leading-[1.04] text-[color:var(--demo-header)] [--i:1] sm:text-6xl lg:text-[4.1rem]')}>
                Fast, Reliable Delivery At Your Fingertips
              </h1>
              <p className="demo-rise mt-6 max-w-lg text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">Food, parcels and business runs, delivered by vetted riders and tracked live from pickup to the door.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#book" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--demo-orange)] px-7 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgb(249_115_22/0.8)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-orange)]">Book a Delivery <ArrowRight className="size-4" aria-hidden /></a>
                <a href="#how" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-900 hover:border-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">See How It Works</a>
              </div>
              <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">{['Delivery in 28 min on average', 'Insured up to $500', 'Pay by card or wallet'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 text-[color:var(--demo-good-ink)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <div className="demo-rise relative mx-auto w-full max-w-[34rem]" style={{ ['--i' as string]: 2 }}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(15_23_42/0.4)]">
                <MapView from={{ x: 24, y: 64, label: 'Ember & Oak' }} to={{ x: 76, y: 32, label: 'Your door' }} progress={62} label="Live delivery tracking preview" className="aspect-[4/3] w-full" />
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 p-4">
                  <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[var(--demo-accent)] text-white"><Bike className="size-4" aria-hidden /></span><div><p className="text-xs font-semibold text-slate-900">Jordan is 4 min away</p><p className="text-[11px] text-slate-500">Food order · Ember &amp; Oak</p></div></div>
                  <span className="rounded-full bg-[var(--demo-good-soft)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--demo-good-ink)]">On the way</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" aria-labelledby="delivery-services" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="delivery-services" eyebrow="Service categories" title="One platform for every delivery" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {SERVICES_PUBLIC.map((s, i) => {
                const Icon = SERVICE_ICONS[i];
                return (
                  <li key={s.name} data-reveal style={{ ['--i' as string]: i }} className={cn('flex flex-col rounded-2xl p-7', s.tone)}>
                    <Icon className="size-6 text-[color:var(--demo-accent)]" aria-hidden />
                    <h3 className={cn(HEADING, 'mt-5 text-xl font-bold text-slate-900')}>{s.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.blurb}</p>
                    <p className="mt-auto pt-6 text-sm font-semibold text-[color:var(--demo-accent-ink)]">{s.from}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="delivery-features" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="delivery-features" eyebrow="Built for speed" title="Everything between order and doorstep" headingClassName={HEADING} /></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon];
                return (
                  <article key={f.title} data-reveal style={{ ['--i' as string]: i % 3 }} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-[0_18px_40px_-24px_rgb(29_78_216/0.35)]">
                    <span className="grid size-11 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)] transition-colors duration-200 group-hover:bg-[var(--demo-accent)] group-hover:text-white"><Icon className="size-5" aria-hidden /></span>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" aria-labelledby="delivery-how" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="delivery-how" eyebrow="How it works" title="Four steps from order to delivered" headingClassName={HEADING} /></div>
            <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((s, i) => (
                <li key={s.title} data-reveal style={{ ['--i' as string]: i }} className="relative rounded-2xl border border-slate-200 p-6">
                  <span className={cn(HEADING, 'grid size-10 place-items-center rounded-full bg-[var(--demo-accent)] text-base font-bold text-white')}>{i + 1}</span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
                  {i < HOW_IT_WORKS.length - 1 && <span aria-hidden className="absolute -right-3 top-10 hidden h-px w-6 bg-slate-300 lg:block" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Statistics */}
        <section id="results" aria-label="Results in numbers" className="scroll-mt-20 bg-[var(--demo-header)] py-16 sm:py-20">
          <dl className={cn(COL, 'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4')}>
            {STATS.map((s, i) => (
              <div key={s.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col lg:border-l lg:border-white/15 lg:pl-8 first:lg:border-l-0 first:lg:pl-0">
                <dt className="order-2 mt-2 text-sm text-slate-300">{s.label}</dt>
                <dd className={cn(HEADING, 'text-4xl font-extrabold tabular-nums text-white sm:text-5xl')}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Testimonials + partners */}
        <section aria-labelledby="delivery-testimonials" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="delivery-testimonials" eyebrow="Customer reviews" title="Trusted by restaurants, shops and riders" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <li key={t.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex gap-0.5 text-[color:var(--demo-orange)]" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="size-4 fill-current" aria-hidden />)}</div>
                  <Quote className="mt-5 size-6 text-blue-200" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{t.quote}</blockquote>
                  <footer className="mt-6 border-t border-slate-100 pt-5"><p className="text-sm font-semibold text-slate-900">{t.name}</p><p className="text-xs text-slate-500">{t.role}</p></footer>
                </li>
              ))}
            </ul>
            <div id="partners" data-reveal className="mt-14 scroll-mt-20 rounded-2xl bg-slate-50 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Partners we deliver for</p>
              <ul className="mt-5 flex flex-wrap gap-2.5">{PARTNERS.map((p) => <li key={p} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"><Store className="size-3.5 text-[color:var(--demo-accent)]" aria-hidden /> {p}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" aria-labelledby="delivery-pricing" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <DemoPricing plans={PLANS_PUBLIC} headingId="delivery-pricing" title="Simple pricing, no surprises" description="Pay per delivery, or subscribe for discounted per-drop rates and priority riders." headingClassName={HEADING} />
          </div>
        </section>

        {/* CTA and booking */}
        <section id="book" aria-labelledby="delivery-cta" className="scroll-mt-20 bg-[var(--demo-accent)] py-20 sm:py-24">
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
            <div>
              <SectionTitle id="delivery-cta" tone="dark" eyebrow="Get started" title="Your next delivery is one form away" description="Tell us what you need moved, and we will confirm a rider and a time within minutes." headingClassName={HEADING} />
              <ul className="mt-8 space-y-3 text-sm text-blue-100">{['No minimum order for pay as you go', 'Insured deliveries from day one', 'Live tracking for every order'].map((item) => <li key={item} className="flex items-center gap-2.5"><Check className="size-4 text-[color:var(--demo-good-light)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <EnquiryForm copy={ENQUIRY_COPY} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1220] py-14 text-slate-400">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <DeliveryLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{DELIVERY_BRAND.tagline}. A fictional company, designed as a showcase by Valorian Studio.</p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-white">{group.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">{group.links.map((link) => <li key={link}><span className="cursor-default transition-colors hover:text-white">{link}</span></li>)}</ul>
            </div>
          ))}
        </div>
        <div className={cn(COL, 'mt-12')}>
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {DELIVERY_BRAND.name} (demo). All names, riders, partners and figures on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
