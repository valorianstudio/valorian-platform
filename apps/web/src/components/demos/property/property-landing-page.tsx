import { ArrowRight, BarChart3, Building2, Check, ClipboardList, CreditCard, DoorOpen, Hammer, Home, Lightbulb, Quote, ShieldCheck, Star, Thermometer, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Inter_Tight } from 'next/font/google';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { DemoPricing } from '@/components/demos/shared/demo-pricing';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { FEATURES, FOOTER_LINKS, GALLERY, GALLERY_NOTE, LANDING_NAV, PLANS_PUBLIC, PROPERTY_BRAND, PROPERTY_TYPES, SMART_FEATURES, STATS, TESTIMONIALS, WHY } from '@/data/property/landing';
import type { FeatureIcon } from '@/data/property/landing';
import { PROPERTY_THEME } from '@/data/property/meta';
import { cn } from '@/lib/cn';
import { PropertyLogo } from './property-logo';

/** Refined sans for headlines: loaded only on this route. */
const display = Inter_Tight({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = { property: Building2, tenant: Home, maintenance: Wrench, rent: CreditCard, smart: Lightbulb, operations: Hammer, visitor: DoorOpen, analytics: BarChart3 };
const TYPE_ICONS: LucideIcon[] = [Building2, Home, ClipboardList];
const SMART_ICONS: LucideIcon[] = [ShieldCheck, Thermometer, DoorOpen, BarChart3];
const WHY_ICONS: LucideIcon[] = [Home, Wrench, CreditCard];

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Company or name', placeholder: 'Harbor Holdings' },
  emailPlaceholder: 'you@company.example',
  topics: [
    { value: 'owner', label: 'Manage my own homes' },
    { value: 'portfolio', label: 'Manage a building portfolio' },
    { value: 'resident', label: 'I am a resident' },
  ],
  messagePlaceholder: 'Tell us how many units or buildings you manage and what you want to improve.',
  submitLabel: 'Request a demo',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const HEADING = cn(display.className, 'tracking-tight');

/**
 * The marketing site of the fictional KEYSTONE property management company, as a standalone full-page preview (no Valorian header or
 * footer). A Server Component end to end: static HTML, a dashboard preview, an enquiry form and gently revealed sections.
 */
export function PropertyLandingPage() {
  return (
    <div id="top" style={PROPERTY_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<PropertyLogo />} links={LANDING_NAV} cta={{ label: 'Request a demo', href: '#contact' }} standalone />

      <main id="main">
        {/* Hero with dashboard preview */}
        <section aria-labelledby="property-hero" className="relative overflow-x-clip bg-[linear-gradient(180deg,#f8fafc,#ffffff_75%)]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pb-28">
            <div className="min-w-0">
              <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-[color:var(--demo-good-ink)]"><ShieldCheck className="size-3.5" aria-hidden /> Secure resident data · 1,200+ homes managed</p>
              <h1 id="property-hero" className={cn(HEADING, 'demo-rise mt-6 text-balance text-5xl font-extrabold leading-[1.04] text-[color:var(--demo-header)] [--i:1] sm:text-6xl lg:text-[4.1rem]')}>
                Smart Property Management For Modern Living
              </h1>
              <p className="demo-rise mt-6 max-w-lg text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">Rent, repairs, visitors and building operations in one calm platform, for owners, managers and residents.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--demo-orange)] px-7 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgb(4_120_87/0.7)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-orange)]">Request a demo <ArrowRight className="size-4" aria-hidden /></a>
                <a href="#features" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-900 hover:border-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Explore features</a>
              </div>
              <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">{['Rent collected on time', 'Repairs answered in 2 hours', 'Visitors approved from the app'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 text-[color:var(--demo-good-ink)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <div className="demo-rise relative mx-auto w-full max-w-[34rem]" style={{ ['--i' as string]: 2 }}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(15_23_42/0.4)]">
                <div className="grid grid-cols-2 gap-3 bg-[var(--demo-accent-soft)] p-5">
                  {[['Occupancy', '96%', 'text-emerald-700'], ['Monthly rent', '$286k', 'text-slate-900'], ['Open repairs', '17', 'text-amber-700'], ['Visitors today', '9', 'text-slate-900']].map(([label, value, tone]) => (
                    <div key={label} className="rounded-xl bg-white p-4 shadow-sm"><p className="text-[11px] text-slate-500">{label}</p><p className={cn('mt-1 text-xl font-semibold tabular-nums', tone)}>{value}</p></div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 p-4">
                  <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[var(--demo-accent)] text-white"><Wrench className="size-4" aria-hidden /></span><div><p className="text-xs font-semibold text-slate-900">Kitchen tap repair, 4B</p><p className="text-[11px] text-slate-500">Tomas Berg arriving 14:00</p></div></div>
                  <span className="rounded-full bg-[var(--demo-good-soft)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--demo-good-ink)]">In progress</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property types */}
        <section id="portfolio" aria-labelledby="property-types" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="property-types" eyebrow="Property showcase" title="Apartments, residences and commercial spaces" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {PROPERTY_TYPES.map((t, i) => {
                const Icon = TYPE_ICONS[i];
                return (
                  <li key={t.name} data-reveal style={{ ['--i' as string]: i }} className={cn('flex flex-col rounded-2xl border border-slate-200 p-7', t.tone)}>
                    <Icon className="size-6 text-[color:var(--demo-accent)]" aria-hidden />
                    <h3 className={cn(HEADING, 'mt-5 text-xl font-bold text-slate-900')}>{t.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.blurb}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="property-features" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="property-features" eyebrow="Everything in one place" title="Run every building from a single platform" headingClassName={HEADING} /></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon];
                return (
                  <article key={f.title} data-reveal style={{ ['--i' as string]: i % 4 }} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-[0_18px_40px_-24px_rgb(15_23_42/0.35)]">
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
        <section id="why" aria-labelledby="property-why" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="property-why" eyebrow="Why choose us" title="Fewer vacancies, faster repairs, clear finances" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {WHY.map((w, i) => {
                const Icon = WHY_ICONS[i];
                return (
                  <li key={w.title} data-reveal style={{ ['--i' as string]: i }} className="rounded-2xl border border-slate-200 p-7">
                    <span className="grid size-11 place-items-center rounded-xl bg-[var(--demo-accent)] text-white"><Icon className="size-5" aria-hidden /></span>
                    <h3 className={cn(HEADING, 'mt-5 text-lg font-bold text-slate-900')}>{w.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Smart features */}
        <section id="smart" aria-labelledby="property-smart" className={cn(SECTION, 'bg-[var(--demo-header)] text-white')}>
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start')}>
            <div data-reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--demo-gold)]">Smart features</p>
              <h2 id="property-smart" className={cn(HEADING, 'mt-3 text-balance text-3xl font-bold sm:text-4xl')}>Smart home monitoring that works quietly in the background</h2>
              <p className="mt-4 max-w-md text-pretty text-slate-300">Residents stay in control, and managers hear about problems before they become emergencies.</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {SMART_FEATURES.map((s, i) => {
                const Icon = SMART_ICONS[i];
                return (
                  <li key={s.title} data-reveal style={{ ['--i' as string]: i }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <Icon className="size-5 text-[color:var(--demo-gold)]" aria-hidden />
                    <h3 className="mt-4 text-base font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" aria-labelledby="property-gallery" className={SECTION}>
          <div className={COL}>
            <div data-reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><SectionTitle id="property-gallery" eyebrow="Property gallery" title="Buildings we look after" headingClassName={HEADING} /><p className="text-xs text-slate-500">{GALLERY_NOTE}</p></div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GALLERY.map((g, i) => (
                <li key={g.title} data-reveal style={{ ['--i' as string]: i }} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div role="img" aria-label={`${g.title} building illustration`} className={cn('relative flex aspect-[4/3] items-end bg-gradient-to-br p-5 transition-transform duration-500 group-hover:scale-[1.02]', g.tone)}>
                    <Building2 className="absolute right-5 top-5 size-10 text-white/25" aria-hidden />
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900">{g.place}</span>
                  </div>
                  <p className={cn(HEADING, 'p-4 text-base font-bold text-slate-900')}>{g.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Results */}
        <section id="results" aria-label="Results in numbers" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
          <dl className={cn(COL, 'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4')}>
            {STATS.map((s, i) => (
              <div key={s.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col lg:border-l lg:border-slate-200 lg:pl-8 first:lg:border-l-0 first:lg:pl-0">
                <dt className="order-2 mt-2 text-sm text-slate-600">{s.label}</dt>
                <dd className={cn(HEADING, 'text-4xl font-extrabold tabular-nums text-[color:var(--demo-header)] sm:text-5xl')}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Testimonials */}
        <section id="reviews" aria-labelledby="property-testimonials" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="property-testimonials" eyebrow="Customer testimonials" title="Owners and residents who trust Keystone" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <li key={t.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex gap-0.5 text-[color:var(--demo-gold)]" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="size-4 fill-current" aria-hidden />)}</div>
                  <Quote className="mt-5 size-6 text-emerald-200" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{t.quote}</blockquote>
                  <footer className="mt-6 border-t border-slate-100 pt-5"><p className="text-sm font-semibold text-slate-900">{t.name}</p><p className="text-xs text-slate-500">{t.role}</p></footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" aria-labelledby="property-pricing" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <DemoPricing plans={PLANS_PUBLIC} headingId="property-pricing" title="Plans for owners and management companies" description="Start with a few units, or run a full portfolio with smart monitoring and reports." headingClassName={HEADING} />
          </div>
        </section>

        {/* CTA and contact */}
        <section id="contact" aria-labelledby="property-cta" className="scroll-mt-20 bg-[var(--demo-header)] py-20 sm:py-24">
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
            <div>
              <SectionTitle id="property-cta" tone="dark" eyebrow="Get started" title="See your portfolio on Keystone this week" description="Tell us about your buildings and we will set up a walkthrough with your numbers in mind." headingClassName={HEADING} />
              <ul className="mt-8 space-y-3 text-sm text-slate-200">{['Live rent and occupancy from day one', 'Residents onboarded in one afternoon', 'Dedicated success manager'].map((item) => <li key={item} className="flex items-center gap-2.5"><Check className="size-4 text-[color:var(--demo-gold)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <EnquiryForm copy={ENQUIRY_COPY} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1222] py-14 text-slate-400">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <PropertyLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{PROPERTY_BRAND.tagline}. A fictional company, designed as a showcase by Valorian Studio.</p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-white">{group.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">{group.links.map((link) => <li key={link}><span className="cursor-default transition-colors hover:text-white">{link}</span></li>)}</ul>
            </div>
          ))}
        </div>
        <div className={cn(COL, 'mt-12')}>
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {PROPERTY_BRAND.name} (demo). All buildings, residents, prices and figures on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
