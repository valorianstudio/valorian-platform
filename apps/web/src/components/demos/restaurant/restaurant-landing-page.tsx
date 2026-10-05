import { ArrowRight, BookOpenText, Boxes, CalendarCheck, Check, CreditCard, LayoutGrid, Quote, ShieldCheck, ShoppingBag, Star, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { DemoPricing } from '@/components/demos/shared/demo-pricing';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { FEATURES, FOOTER_LINKS, LANDING_NAV, PRICING, RESTAURANT_BRAND, SHOWCASE, SHOWCASE_INTRO, TEAM, TESTIMONIALS } from '@/data/restaurant/landing';
import type { FeatureIcon } from '@/data/restaurant/landing';
import { RESTAURANT_THEME } from '@/data/restaurant/meta';
import { cn } from '@/lib/cn';
import { DishArt } from './dish-art';
import { RestaurantHeroVisual } from './restaurant-hero-visual';
import { RestaurantLogo } from './restaurant-logo';

/** Serif display face for headlines: loaded only on this route, which gives the page its restaurant character. */
const display = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = {
  ordering: ShoppingBag,
  tables: LayoutGrid,
  menu: BookOpenText,
  reservations: CalendarCheck,
  pos: CreditCard,
  inventory: Boxes,
  customers: Users,
};

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Restaurant name', placeholder: 'Ember & Oak' },
  emailPlaceholder: 'jordan@restaurant.example',
  topics: [
    { value: 'demo', label: 'Book a product demo' },
    { value: 'migration', label: 'Ask about menu set-up' },
    { value: 'pricing', label: 'Discuss pricing' },
  ],
  messagePlaceholder: 'Tell us about your restaurant: seats, locations and how you take orders today.',
  submitLabel: 'Book a demo',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
/** Inner column shared by every section, with the same gutters as the navbar and hero so edges line up. */
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const BTN = 'inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';
const HEADING = cn(display.className, 'tracking-tight');

/**
 * The marketing site of the fictional TableFlow product, as a standalone full-page preview (no Valorian header or footer). A Server
 * Component end to end: static HTML, two optimised images (the dashboard and phone previews) and a small demo-request form.
 */
export function RestaurantLandingPage() {
  return (
    <div id="top" style={RESTAURANT_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<RestaurantLogo />} links={LANDING_NAV} cta={{ label: 'Book a demo', href: '#contact' }} standalone />

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="resto-hero" className="relative overflow-x-clip bg-[radial-gradient(60%_70%_at_88%_0%,#fef3c7,transparent),linear-gradient(#f9fafb,#fff)]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:pb-28 lg:pt-24">
            <div className="min-w-0">
              <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                <ShieldCheck className="size-3.5" aria-hidden /> Trusted by 400+ restaurants
              </p>
              <h1 id="resto-hero" className={cn(HEADING, 'demo-rise mt-6 text-balance text-4xl font-semibold leading-[1.08] text-resto [--i:1] sm:text-5xl lg:text-[3.5rem]')}>
                Smart Restaurant Management Made Simple
              </h1>
              <p className="demo-rise mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">Orders, tables, reservations, menu and stock in one calm platform, with apps for your guests and your team.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#contact" className={cn(BTN, 'bg-resto text-white hover:bg-slate-800 focus-visible:outline-resto')}>
                  Book a Demo <ArrowRight className="size-4" aria-hidden />
                </a>
                <a href="#features" className={cn(BTN, 'border border-slate-300 bg-white text-resto hover:border-resto focus-visible:outline-resto')}>
                  Explore Features
                </a>
              </div>
              <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">
                {['No commission on orders', 'Set up in days', 'Guest and staff apps'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-fresh" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <RestaurantHeroVisual />
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="resto-features" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="resto-features" eyebrow="Features" title="Everything your restaurant runs on" description="Seven connected modules replace order pads, spreadsheets and disconnected apps." headingClassName={HEADING} />
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, i) => {
                const Icon = ICONS[feature.icon];
                return (
                  <article key={feature.title} data-reveal style={{ ['--i' as string]: i % 4 }} className={cn('group rounded-2xl border p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5', i === 0 ? 'border-resto bg-resto text-white lg:col-span-2 lg:p-8 [&_p]:text-white/75' : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-[0_18px_40px_-24px_rgb(217_119_6/0.45)]')}>
                    <span className={cn('grid size-11 place-items-center rounded-xl transition-colors duration-200', i === 0 ? 'bg-gold text-white' : 'bg-amber-50 text-gold-ink group-hover:bg-gold-ink group-hover:text-white')}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className={cn('mt-5 font-semibold', i === 0 ? 'text-xl text-white' : 'text-base text-slate-900')}>{feature.title}</h3>
                    <p className={cn('mt-2 text-sm leading-relaxed', i !== 0 && 'text-slate-600')}>{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Food showcase */}
        <section id="menu" aria-labelledby="resto-menu" className={SECTION}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="resto-menu" eyebrow={SHOWCASE_INTRO.eyebrow} title={SHOWCASE_INTRO.title} description={SHOWCASE_INTRO.description} headingClassName={HEADING} />
            </div>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SHOWCASE.map((dish, i) => (
                <li key={dish.name} data-reveal style={{ ['--i' as string]: i % 3 }} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow duration-200 hover:shadow-[0_24px_50px_-28px_rgb(17_24_39/0.4)]">
                  <DishArt art={dish.art} label={dish.name} className="h-48 transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={cn(HEADING, 'text-lg font-semibold text-resto')}>{dish.name}</h3>
                      <p className="text-base font-semibold tabular-nums text-gold-ink">${dish.price}</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{dish.description}</p>
                    <p className="mt-3 inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900">{dish.tag}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Team */}
        <section id="team" aria-labelledby="resto-team" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="resto-team" eyebrow="The team" title="Built with the people who run the pass" description="Chefs, managers and waiters shaped every screen, so service stays fast when the room is full." headingClassName={HEADING} />
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map((person, i) => (
                <li key={person.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                  <span aria-hidden className={cn(HEADING, 'grid size-14 place-items-center rounded-full bg-resto text-lg font-semibold text-amber-400')}>
                    {person.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{person.name}</h3>
                  <p className="text-sm text-gold-ink">{person.role}</p>
                  <blockquote className="mt-4 flex-1 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">&ldquo;{person.quote}&rdquo;</blockquote>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="resto-testimonials" className={SECTION}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="resto-testimonials" eyebrow="Testimonials" title="Loved by owners and teams" headingClassName={HEADING} />
            </div>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((item, i) => (
                <li key={item.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex gap-0.5 text-amber-500" role="img" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="size-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <Quote className="mt-5 size-6 text-amber-300" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{item.quote}</blockquote>
                  <footer className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <span aria-hidden className="grid size-10 place-items-center rounded-full bg-amber-50 text-sm font-semibold text-gold-ink">
                      {item.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.role}, {item.place}
                      </p>
                    </div>
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" aria-labelledby="resto-pricing" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <DemoPricing plans={PRICING} headingId="resto-pricing" title="Simple pricing for every kitchen" description="Every plan includes menu set-up, training and a free trial month." headingClassName={HEADING} />
          </div>
        </section>

        {/* CTA and contact */}
        <section id="contact" aria-labelledby="resto-cta" className="scroll-mt-20 bg-resto py-20 sm:py-24">
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
            <div>
              <SectionTitle id="resto-cta" tone="dark" eyebrow="Book a demo" title="See TableFlow running your restaurant" description="A 30-minute walkthrough with a restaurant specialist, built around your menu and floor plan." headingClassName={HEADING} />
              <ul className="mt-8 space-y-3 text-sm text-slate-200">
                {['Personalised walkthrough for your restaurant', 'Reply within one working day', 'No commitment, no credit card'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check className="size-4 text-green-400" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <EnquiryForm copy={ENQUIRY_COPY} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b111c] py-14 text-slate-400">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <RestaurantLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{RESTAURANT_BRAND.tagline}. A fictional product, designed as a showcase by Valorian Studio.</p>
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
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {RESTAURANT_BRAND.name} (demo). All names, restaurants, figures and testimonials on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
