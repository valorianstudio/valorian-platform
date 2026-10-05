import { ArrowRight, BarChart3, Boxes, CalendarDays, Check, CreditCard, Dog, Package, PawPrint, Quote, ShieldCheck, Star, Stethoscope, Store, Users, Scissors, ShoppingBag, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Manrope } from 'next/font/google';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { DemoPricing } from '@/components/demos/shared/demo-pricing';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { CATEGORIES_PUBLIC, FEATURES, FOOTER_LINKS, LANDING_NAV, OFFERS_PUBLIC, PETSHOP_BRAND, PLANS_PUBLIC, SERVICES_PUBLIC, STATS, TESTIMONIALS } from '@/data/petshop/landing';
import type { FeatureIcon } from '@/data/petshop/landing';
import { PETSHOP_THEME } from '@/data/petshop/meta';
import { cn } from '@/lib/cn';
import { PetshopLogo } from './petshop-logo';

/** Rounded, friendly sans for headlines: loaded only on this route. */
const display = Manrope({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = { store: Store, grooming: Scissors, vet: Stethoscope, inventory: Boxes, customers: Users, records: PawPrint, online: ShoppingBag, payments: CreditCard };
const SERVICE_ICONS: LucideIcon[] = [Scissors, Stethoscope, Dog, Package];
const CATEGORY_ICONS: LucideIcon[] = [Dog, PawPrint, Sparkles, Package];

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Pet name', placeholder: 'Biscuit' },
  emailPlaceholder: 'you@mail.example',
  topics: [
    { value: 'grooming', label: 'Book a grooming visit' },
    { value: 'vet', label: 'Book a vet checkup' },
    { value: 'shop', label: 'Ask about the shop or delivery' },
  ],
  messagePlaceholder: 'Tell us your pet’s breed, age and what they need.',
  submitLabel: 'Request booking',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const HEADING = cn(display.className, 'tracking-tight');

/**
 * The marketing site of the fictional PAWSOME pet shop, as a standalone full-page preview (no Valorian header or footer).
 * A Server Component end to end: static HTML, a product preview, a booking form and gently revealed sections.
 */
export function PetshopLandingPage() {
  return (
    <div id="top" style={PETSHOP_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<PetshopLogo />} links={LANDING_NAV} cta={{ label: 'Book now', href: '#contact' }} standalone />

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="petshop-hero" className="relative overflow-x-clip bg-[linear-gradient(180deg,#fef3c7,#ffffff_70%)]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pb-28">
            <div className="min-w-0">
              <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-[color:var(--demo-accent-ink)]"><ShieldCheck className="size-3.5" aria-hidden /> Vet-recommended food · Certified groomers</p>
              <h1 id="petshop-hero" className={cn(HEADING, 'demo-rise mt-6 text-balance text-5xl font-extrabold leading-[1.04] text-[color:var(--demo-accent-ink)] [--i:1] sm:text-6xl lg:text-[4.1rem]')}>
                Everything your pet needs, in one place
              </h1>
              <p className="demo-rise mt-6 max-w-lg text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">Food, grooming, vet checkups and training for dogs, cats and birds, booked and tracked from one friendly shop.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--demo-orange)] px-7 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgb(249_115_22/0.8)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-orange)]">Book a visit <ArrowRight className="size-4" aria-hidden /></a>
                <a href="#categories" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-900 hover:border-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Shop the store</a>
              </div>
              <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">{['Grooming from $35', 'Same-day vet slots', 'Delivery on food'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 text-[color:var(--demo-accent)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <div className="demo-rise relative mx-auto w-full max-w-[34rem]" style={{ ['--i' as string]: 2 }}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(20_83_45/0.35)]">
                <div className="grid aspect-[4/3] grid-cols-2 gap-3 bg-[var(--demo-accent-soft)] p-5">
                  {[['Grooming', Scissors], ['Checkups', Stethoscope], ['Dog food', Dog], ['Toys', Sparkles]].map(([label, Icon]) => {
                    const IconCmp = Icon as LucideIcon;
                    return <div key={label as string} className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent)] text-white"><IconCmp className="size-4" aria-hidden /></span><p className="text-sm font-semibold text-slate-900">{label as string}</p></div>;
                  })}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 p-4">
                  <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[var(--demo-orange)] text-white"><CalendarDays className="size-4" aria-hidden /></span><div><p className="text-xs font-semibold text-slate-900">Grooming booked for Biscuit</p><p className="text-[11px] text-slate-500">Mon 12 Oct · 09:00</p></div></div>
                  <span className="rounded-full bg-[var(--demo-good-soft)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--demo-good-ink)]">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" aria-labelledby="petshop-categories" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="petshop-categories" eyebrow="Shop by pet" title="Food and supplies for every pet" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES_PUBLIC.map((c, i) => {
                const Icon = CATEGORY_ICONS[i];
                return (
                  <li key={c.name} data-reveal style={{ ['--i' as string]: i }} className={cn('flex flex-col rounded-2xl p-6', c.tone)}>
                    <Icon className="size-6 text-[color:var(--demo-accent)]" aria-hidden />
                    <h3 className={cn(HEADING, 'mt-5 text-xl font-bold text-slate-900')}>{c.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.blurb}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Services */}
        <section id="services" aria-labelledby="petshop-services" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="petshop-services" eyebrow="Care services" title="Grooming, checkups and training" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {SERVICES_PUBLIC.map((s, i) => {
                const Icon = SERVICE_ICONS[i];
                return (
                  <li key={s.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
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

        {/* Features */}
        <section id="features" aria-labelledby="petshop-features" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="petshop-features" eyebrow="Built for pet care" title="Everything the shop runs on" headingClassName={HEADING} /></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon];
                return (
                  <article key={f.title} data-reveal style={{ ['--i' as string]: i % 4 }} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-[0_18px_40px_-24px_rgb(22_101_52/0.35)]">
                    <span className="grid size-11 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)] transition-colors duration-200 group-hover:bg-[var(--demo-accent)] group-hover:text-white"><Icon className="size-5" aria-hidden /></span>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Results */}
        <section id="results" aria-label="Results in numbers" className="scroll-mt-20 bg-[var(--demo-header)] py-16 sm:py-20">
          <dl className={cn(COL, 'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4')}>
            {STATS.map((s, i) => (
              <div key={s.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col lg:border-l lg:border-white/15 lg:pl-8 first:lg:border-l-0 first:lg:pl-0">
                <dt className="order-2 mt-2 text-sm text-emerald-100">{s.label}</dt>
                <dd className={cn(HEADING, 'text-4xl font-extrabold tabular-nums text-white sm:text-5xl')}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Offers */}
        <section id="offers" aria-labelledby="petshop-offers" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="petshop-offers" eyebrow="This month" title="Offers for new and returning pets" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {OFFERS_PUBLIC.map((o, i) => (
                <li key={o.title} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-dashed border-[color:var(--demo-orange)] bg-[var(--demo-accent-soft)] p-7">
                  <h3 className={cn(HEADING, 'text-lg font-bold text-slate-900')}>{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{o.detail}</p>
                  <p className="mt-auto pt-6 text-xs font-semibold tracking-wider text-[color:var(--demo-orange-ink)]">Code {o.code}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section id="reviews" aria-labelledby="petshop-reviews" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="petshop-reviews" eyebrow="Happy owners" title="Loved by pets and their people" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <li key={t.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex gap-0.5 text-[color:var(--demo-orange)]" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="size-4 fill-current" aria-hidden />)}</div>
                  <Quote className="mt-5 size-6 text-emerald-200" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{t.quote}</blockquote>
                  <footer className="mt-6 border-t border-slate-100 pt-5"><p className="text-sm font-semibold text-slate-900">{t.name}</p><p className="text-xs text-slate-500">{t.pet}</p></footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" aria-labelledby="petshop-pricing" className={SECTION}>
          <div className={COL}>
            <DemoPricing plans={PLANS_PUBLIC} headingId="petshop-pricing" title="Plans for every pet family" description="Start with records and reminders, or join Pet Plus for discounts on grooming and checkups." headingClassName={HEADING} />
          </div>
        </section>

        {/* Booking */}
        <section id="contact" aria-labelledby="petshop-cta" className="scroll-mt-20 bg-[var(--demo-accent)] py-20 sm:py-24">
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
            <div>
              <SectionTitle id="petshop-cta" tone="dark" eyebrow="Book a visit" title="Your pet’s next appointment is one form away" description="Tell us about your pet and we will confirm a grooming slot or vet checkup within the hour." headingClassName={HEADING} />
              <ul className="mt-8 space-y-3 text-sm text-emerald-50">{['Certified groomers and vets', 'Reminders for every vaccination', 'Pet records shared with you online'].map((item) => <li key={item} className="flex items-center gap-2.5"><Check className="size-4 text-[color:var(--demo-orange)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <EnquiryForm copy={ENQUIRY_COPY} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f2a18] py-14 text-emerald-100/70">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <PetshopLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{PETSHOP_BRAND.tagline}. A fictional shop, designed as a showcase by Valorian Studio.</p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-white">{group.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">{group.links.map((link) => <li key={link}><span className="cursor-default transition-colors hover:text-white">{link}</span></li>)}</ul>
            </div>
          ))}
        </div>
        <div className={cn(COL, 'mt-12')}>
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {PETSHOP_BRAND.name} (demo). All pets, owners, prices and figures on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
