import { AlarmClock, ArrowRight, BadgeCheck, Bell, Boxes, Check, ClipboardList, CreditCard, Droplets, FileText, HeartPulse, Pill as PillIcon, Quote, ShieldCheck, Sparkles, Star, Stethoscope, Syringe, Truck, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Inter_Tight } from 'next/font/google';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { DemoPricing } from '@/components/demos/shared/demo-pricing';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { CATEGORIES_PUBLIC, DELIVERY_STEPS, FEATURED_PRODUCTS, FEATURES, FOOTER_LINKS, LANDING_NAV, PHARMACY_BRAND, PLANS_PUBLIC, SERVICES_PUBLIC, STATS, TESTIMONIALS } from '@/data/pharmacy/landing';
import type { FeatureIcon } from '@/data/pharmacy/landing';
import { PHARMACY_THEME } from '@/data/pharmacy/meta';
import { cn } from '@/lib/cn';
import { PharmacyLogo } from './pharmacy-logo';

/** Clean, humanist sans for headlines: loaded only on this route. */
const display = Inter_Tight({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = { order: ShieldCheck, prescription: ClipboardList, inventory: Boxes, customers: Users, reminder: AlarmClock, delivery: Truck, billing: CreditCard, records: FileText };
const CATEGORY_ICONS: LucideIcon[] = [PillIcon, Stethoscope, Sparkles, Droplets];
const SERVICE_ICONS: LucideIcon[] = [ClipboardList, Stethoscope, HeartPulse, Syringe];
const WHY: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Pharmacist-checked', description: 'Every prescription and sensitive order is verified by a registered pharmacist.', icon: BadgeCheck },
  { title: 'Genuine medicines', description: 'Sourced from licensed wholesalers with batch numbers and expiry dates on every pack.', icon: ShieldCheck },
  { title: 'Always on call', description: 'Speak to a pharmacist by phone or chat, any hour, about any medicine.', icon: Bell },
];

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Full name', placeholder: 'Hannah Lindqvist' },
  emailPlaceholder: 'you@mail.example',
  topics: [
    { value: 'refill', label: 'Request a prescription refill' },
    { value: 'order', label: 'Order medicines for delivery' },
    { value: 'advice', label: 'Ask a pharmacist a question' },
  ],
  messagePlaceholder: 'Tell us the medicine, the strength and any questions you have.',
  submitLabel: 'Send request',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const HEADING = cn(display.className, 'tracking-tight');

/**
 * The marketing site of the fictional CLEARWELL pharmacy, as a standalone full-page preview (no Valorian header or footer).
 * A Server Component end to end: static HTML, a medicine preview, a booking form and gently revealed sections.
 */
export function PharmacyLandingPage() {
  return (
    <div id="top" style={PHARMACY_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<PharmacyLogo />} links={LANDING_NAV} cta={{ label: 'Order medicines', href: '#contact' }} standalone />

      <main id="main">
        {/* Hero with medicine preview */}
        <section aria-labelledby="pharmacy-hero" className="relative overflow-x-clip bg-[linear-gradient(180deg,#e6f0f8,#ffffff_75%)]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pb-28">
            <div className="min-w-0">
              <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-[color:var(--demo-accent-ink)]"><ShieldCheck className="size-3.5" aria-hidden /> Registered pharmacists · Licensed and insured</p>
              <h1 id="pharmacy-hero" className={cn(HEADING, 'demo-rise mt-6 text-balance text-5xl font-extrabold leading-[1.04] text-[color:var(--demo-accent-ink)] [--i:1] sm:text-6xl lg:text-[4.1rem]')}>
                Smart Pharmacy Management For Better Healthcare
              </h1>
              <p className="demo-rise mt-6 max-w-lg text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">Order medicines, send prescriptions and get refills delivered, with a pharmacist one call away.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--demo-accent)] px-7 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgb(15_76_129/0.8)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Order medicines <ArrowRight className="size-4" aria-hidden /></a>
                <a href="#upload" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-900 hover:border-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Upload a prescription</a>
              </div>
              <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">{['Delivery in 60 minutes', 'Refills on file', 'Secure card or wallet'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 text-[color:var(--demo-good-ink)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <div className="demo-rise relative mx-auto w-full max-w-[34rem]" style={{ ['--i' as string]: 2 }}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(15_76_129/0.35)]">
                <div className="grid grid-cols-2 gap-3 bg-[var(--demo-accent-soft)] p-5">
                  {FEATURED_PRODUCTS.map((p) => (
                    <div key={p.name} className="flex flex-col rounded-xl bg-white p-4 shadow-sm">
                      <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent)] text-white"><PillIcon className="size-4" aria-hidden /></span>
                      <p className="mt-3 text-sm font-semibold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-500">{p.detail}</p>
                      <p className="mt-2 text-sm font-semibold tabular-nums text-[color:var(--demo-accent-ink)]">{p.price}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 p-4">
                  <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[var(--demo-good)] text-white"><Truck className="size-4" aria-hidden /></span><div><p className="text-xs font-semibold text-slate-900">Order #7741 is on its way</p><p className="text-[11px] text-slate-500">Arriving by 15:40</p></div></div>
                  <span className="rounded-full bg-[var(--demo-good-soft)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--demo-good-ink)]">On the way</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" aria-labelledby="pharmacy-categories" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="pharmacy-categories" eyebrow="Medicine categories" title="Everything your pharmacy needs, in one place" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES_PUBLIC.map((c, i) => {
                const Icon = CATEGORY_ICONS[i];
                return (
                  <li key={c.name} data-reveal style={{ ['--i' as string]: i }} className={cn('flex flex-col rounded-2xl p-6', c.tone)}>
                    <Icon className="size-6 text-[color:var(--demo-accent)]" aria-hidden />
                    <h3 className={cn(HEADING, 'mt-5 text-lg font-bold text-slate-900')}>{c.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.blurb}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Featured products */}
        <section id="products" aria-labelledby="pharmacy-products" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><SectionTitle id="pharmacy-products" eyebrow="Featured products" title="Popular healthcare essentials" headingClassName={HEADING} /><a href="#contact" className="text-sm font-semibold text-[color:var(--demo-accent-ink)] hover:underline">View all products</a></div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_PRODUCTS.map((p, i) => (
                <li key={p.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-[border-color,box-shadow] duration-200 hover:border-[color:var(--demo-accent-ring)] hover:shadow-[0_18px_40px_-24px_rgb(15_76_129/0.35)]">
                  <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><PillIcon className="size-5" aria-hidden /></span><span className="rounded-full bg-[var(--demo-good-soft)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--demo-good-ink)]">{p.tag}</span></div>
                  <h3 className={cn(HEADING, 'mt-5 text-base font-bold text-slate-900')}>{p.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{p.detail}</p>
                  <p className="mt-auto pt-5 text-base font-bold tabular-nums text-[color:var(--demo-accent-ink)]">{p.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="pharmacy-features" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="pharmacy-features" eyebrow="Built for safe care" title="From prescription to doorstep" headingClassName={HEADING} /></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon];
                return (
                  <article key={f.title} data-reveal style={{ ['--i' as string]: i % 4 }} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-[0_18px_40px_-24px_rgb(15_76_129/0.35)]">
                    <span className="grid size-11 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)] transition-colors duration-200 group-hover:bg-[var(--demo-accent)] group-hover:text-white"><Icon className="size-5" aria-hidden /></span>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section id="why" aria-labelledby="pharmacy-why" className={cn(SECTION, 'bg-slate-50')}>
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start')}>
            <div data-reveal><SectionTitle id="pharmacy-why" eyebrow="Why choose us" title="Trusted by patients and clinics" description="Careful dispensing, honest pricing and a pharmacy team that takes the time to explain." headingClassName={HEADING} /></div>
            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {WHY.map((w, i) => {
                const Icon = w.icon;
                return (
                  <li key={w.title} data-reveal style={{ ['--i' as string]: i }} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--demo-accent)] text-white"><Icon className="size-5" aria-hidden /></span>
                    <div><h3 className="text-base font-semibold text-slate-900">{w.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{w.description}</p></div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Healthcare services */}
        <section id="services" aria-labelledby="pharmacy-services" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="pharmacy-services" eyebrow="Healthcare services" title="Care beyond the counter" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {SERVICES_PUBLIC.map((s, i) => {
                const Icon = SERVICE_ICONS[i];
                return (
                  <li key={s.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 p-6">
                    <Icon className="size-6 text-[color:var(--demo-accent)]" aria-hidden />
                    <h3 className={cn(HEADING, 'mt-5 text-lg font-bold text-slate-900')}>{s.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.blurb}</p>
                    <p className="mt-auto pt-6 text-sm font-semibold text-[color:var(--demo-accent-ink)]">{s.from}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Results */}
        <section id="results" aria-label="Results in numbers" className="scroll-mt-20 bg-[var(--demo-header)] py-16 sm:py-20">
          <dl className={cn(COL, 'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4')}>
            {STATS.map((s, i) => (
              <div key={s.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col lg:border-l lg:border-white/15 lg:pl-8 first:lg:border-l-0 first:lg:pl-0">
                <dt className="order-2 mt-2 text-sm text-sky-100">{s.label}</dt>
                <dd className={cn(HEADING, 'text-4xl font-extrabold tabular-nums text-white sm:text-5xl')}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Testimonials */}
        <section id="reviews" aria-labelledby="pharmacy-testimonials" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="pharmacy-testimonials" eyebrow="Customer testimonials" title="Patients who trust their pharmacy" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <li key={t.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex gap-0.5 text-[color:var(--demo-cyan)]" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="size-4 fill-current" aria-hidden />)}</div>
                  <Quote className="mt-5 size-6 text-sky-200" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{t.quote}</blockquote>
                  <footer className="mt-6 border-t border-slate-100 pt-5"><p className="text-sm font-semibold text-slate-900">{t.name}</p><p className="text-xs text-slate-500">{t.role}</p></footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Delivery information */}
        <section id="delivery" aria-labelledby="pharmacy-delivery" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="pharmacy-delivery" eyebrow="Delivery information" title="From pharmacist to your door" description="Every delivery is checked, sealed and tracked. Prescription orders are never shipped before pharmacist sign-off." headingClassName={HEADING} /></div>
            <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {DELIVERY_STEPS.map((s, i) => (
                <li key={s.title} data-reveal style={{ ['--i' as string]: i }} className="relative rounded-2xl border border-slate-200 bg-white p-6">
                  <span className={cn(HEADING, 'grid size-10 place-items-center rounded-full bg-[var(--demo-accent)] text-base font-bold text-white')}>{i + 1}</span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" aria-labelledby="pharmacy-pricing" className={SECTION}>
          <div className={COL}>
            <DemoPricing plans={PLANS_PUBLIC} headingId="pharmacy-pricing" title="Simple plans for patients and clinics" description="Free to order, or join Care Plus for free prescription delivery and family reminders." headingClassName={HEADING} />
          </div>
        </section>

        {/* CTA and contact */}
        <section id="contact" aria-labelledby="pharmacy-cta" className="scroll-mt-20 bg-[var(--demo-accent)] py-20 sm:py-24">
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
            <div>
              <SectionTitle id="pharmacy-cta" tone="dark" eyebrow="Get started" title="Your next refill is one message away" description="Tell us what you need and a pharmacist will confirm the order and delivery time within minutes." headingClassName={HEADING} />
              <ul className="mt-8 space-y-3 text-sm text-sky-100">{['Pharmacist checks every prescription', 'Refills and reminders on file', 'Live tracking for every delivery'].map((item) => <li key={item} className="flex items-center gap-2.5"><Check className="size-4 text-[color:var(--demo-cyan)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <EnquiryForm copy={ENQUIRY_COPY} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#082a46] py-14 text-sky-100/70">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <PharmacyLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{PHARMACY_BRAND.tagline}. A fictional pharmacy, designed as a showcase by Valorian Studio.</p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-white">{group.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">{group.links.map((link) => <li key={link}><span className="cursor-default transition-colors hover:text-white">{link}</span></li>)}</ul>
            </div>
          ))}
        </div>
        <div className={cn(COL, 'mt-12')}>
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {PHARMACY_BRAND.name} (demo). All medicines, prices, pharmacists and figures on this page are fictional and not medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
