import { ArrowRight, Calendar, Check, Gift, MapPin, Quote, Star, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { FACILITIES_PUBLIC, FEATURES, FOOTER_LINKS, HOTEL_BRAND, LANDING_NAV, LOCATION, OFFERS_PUBLIC, ROOMS_PUBLIC, STATS, TESTIMONIALS } from '@/data/hotel/landing';
import type { FeatureIcon } from '@/data/hotel/landing';
import { HOTEL_THEME } from '@/data/hotel/meta';
import { cn } from '@/lib/cn';
import { HotelLogo } from './hotel-logo';
import { RoomArt } from './room-art';

/** Editorial serif for headlines: loaded only on this route, so the page reads as a luxury property. */
const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });
const sans = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = { booking: Calendar, rooms: Users, guests: Star, reservations: Calendar, payments: Gift, housekeeping: Check, staff: Users, analytics: Star };

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Arrival date', placeholder: '12 Oct 2026' },
  emailPlaceholder: 'you@example.com',
  topics: [
    { value: 'book', label: 'Request a room' },
    { value: 'event', label: 'Plan an event' },
    { value: 'gift', label: 'Buy a gift card' },
  ],
  messagePlaceholder: 'Tell us your dates, guests and any special occasion.',
  submitLabel: 'Request my stay',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const HEADING = cn(serif.className, 'tracking-tight');

/**
 * The marketing site of the fictional Hôtel Azure, as a standalone full-page preview (no Valorian header or footer). A Server Component
 * end to end: static HTML, a booking widget preview, room and facility cards, and one small enquiry form.
 */
export function HotelLandingPage() {
  return (
    <div id="top" style={HOTEL_THEME} className={cn('bg-white text-slate-900', sans.className)}>
      <DemoNavbar brand={<HotelLogo />} links={LANDING_NAV} cta={{ label: 'Book now', href: '#book' }} standalone />

      <main id="main">
        {/* Hero with booking widget */}
        <section aria-labelledby="hotel-hero" className="relative overflow-x-clip bg-[var(--demo-accent)] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_80%_20%,rgb(212_175_55/0.25),transparent)]" aria-hidden />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-28">
            <div className="min-w-0">
              <p className="demo-rise text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--demo-gold)]">Harbour promenade · Est. 1958</p>
              <h1 id="hotel-hero" className={cn(HEADING, 'demo-rise mt-5 text-balance text-5xl font-medium leading-[1.02] [--i:1] sm:text-6xl lg:text-[4.25rem]')}>
                Experience Premium Hospitality With Smart Hotel Management
              </h1>
              <p className="demo-rise mt-6 max-w-lg text-pretty text-base leading-relaxed text-white/80 [--i:2]">Rooms and suites above the harbour, a spa, fine dining and a concierge who is always on call.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#book" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--demo-gold)] px-7 text-sm font-semibold text-[color:var(--demo-accent)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Book a Room <ArrowRight className="size-4" aria-hidden /></a>
                <a href="#rooms" className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-7 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Explore Rooms</a>
              </div>
            </div>
            <div id="book" className="demo-rise scroll-mt-24 rounded-2xl bg-white p-5 text-slate-900 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)] sm:p-6" style={{ ['--i' as string]: 2 }}>
              <p className="text-sm font-semibold text-[color:var(--demo-accent)]">Check availability</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                {[['Check-in', '12 Oct 2026'], ['Check-out', '15 Oct 2026'], ['Guests', '2 adults'], ['Room', 'Any category']].map(([l, v]) => (
                  <div key={l} className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{l}</p><p className="mt-0.5 font-medium text-slate-900">{v}</p></div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {ROOMS_PUBLIC.map((r) => (
                  <div key={r.name} className="flex items-center justify-between rounded-xl bg-[var(--demo-accent-soft)] px-3 py-2.5 text-sm">
                    <span className="font-medium text-slate-900">{r.name}</span>
                    <span className="tabular-nums text-slate-700">from ${r.from}<span className="text-xs text-slate-500"> / night</span></span>
                  </div>
                ))}
              </div>
              <a href="#contact" className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-[var(--demo-accent)] text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Show available rooms</a>
              <p className="mt-3 text-center text-[11px] text-slate-500">Best rate guaranteed when you book direct.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="hotel-features" className={cn(SECTION, 'bg-[var(--demo-accent-soft)]')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="hotel-features" eyebrow="The Azure difference" title="Hospitality, run with precision" description="Every part of the stay, from the first search to the final folio, is calm, connected and personal." headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon];
                return (
                  <li key={f.title} data-reveal style={{ ['--i' as string]: i % 4 }} className="bg-white p-6">
                    <Icon className="size-5 text-[color:var(--demo-accent-ink)]" aria-hidden />
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Rooms */}
        <section id="rooms" aria-labelledby="hotel-rooms" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="hotel-rooms" eyebrow="Rooms and suites" title="Three ways to stay with us" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-6 lg:grid-cols-3">
              {ROOMS_PUBLIC.map((r, i) => (
                <li key={r.name} data-reveal style={{ ['--i' as string]: i }} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="aspect-[4/3] overflow-hidden"><RoomArt category={r.name.startsWith('Family') ? 'Family' : r.name === 'Suite' ? 'Suite' : 'Deluxe'} label={r.name} className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]" /></div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline justify-between gap-3"><h3 className={cn(HEADING, 'text-2xl font-medium text-slate-900')}>{r.name}</h3><p className="tabular-nums text-sm text-slate-700">from <span className="font-semibold text-slate-900">${r.from}</span></p></div>
                    <p className="mt-1 text-xs text-slate-500">{r.size}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.blurb}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">{r.features.map((f) => <li key={f} className="rounded-full bg-[var(--demo-accent-soft)] px-2.5 py-1 text-[11px] font-medium text-slate-800">{f}</li>)}</ul>
                    <a href="#book" className="mt-auto pt-6 text-xs font-semibold uppercase tracking-wide text-[color:var(--demo-accent-ink)] underline underline-offset-4 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">Check availability</a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Facilities */}
        <section id="facilities" aria-labelledby="hotel-facilities" className={cn(SECTION, 'bg-[var(--demo-accent)] text-white')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="hotel-facilities" tone="dark" eyebrow="Facilities" title="Everything within the walls" headingClassName={cn(HEADING, 'text-white')} /></div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FACILITIES_PUBLIC.map((f, i) => (
                <li key={f.name} data-reveal style={{ ['--i' as string]: i }} className="border-t border-white/20 pt-5">
                  <h3 className={cn(HEADING, 'text-xl font-medium')}>{f.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{f.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Offers */}
        <section id="offers" aria-labelledby="hotel-offers" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="hotel-offers" eyebrow="Special offers" title="Stay longer, enjoy more" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {OFFERS_PUBLIC.map((o, i) => (
                <li key={o.code} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-[color:var(--demo-accent-ring)] bg-white p-6">
                  <Gift className="size-5 text-[color:var(--demo-gold-ink)]" aria-hidden />
                  <h3 className={cn(HEADING, 'mt-4 text-2xl font-medium text-slate-900')}>{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{o.detail}</p>
                  <p className="mt-auto pt-6 font-mono text-xs text-slate-500">Code <span className="font-semibold text-slate-900">{o.code}</span></p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Stats + testimonials */}
        <section aria-labelledby="hotel-testimonials" className={cn(SECTION, 'bg-[var(--demo-accent-soft)]')}>
          <div className={COL}>
            <dl className="grid grid-cols-2 gap-6 border-b border-[color:var(--demo-accent-ring)] pb-12 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col"><dt className="order-2 mt-2 text-xs text-slate-500">{s.label}</dt><dd className={cn(HEADING, 'text-4xl font-medium tabular-nums text-[color:var(--demo-accent)]')}>{s.value}</dd></div>
              ))}
            </dl>
            <div data-reveal className="mt-12"><SectionTitle id="hotel-testimonials" eyebrow="Guest stories" title="Remembered long after checkout" headingClassName={HEADING} /></div>
            <ul className="mt-10 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <li key={t.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl bg-white p-7">
                  <div className="flex gap-0.5 text-[color:var(--demo-gold-ink)]" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="size-3.5 fill-current" aria-hidden />)}</div>
                  <Quote className="mt-4 size-5 text-slate-300" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{t.quote}</blockquote>
                  <footer className="mt-6 text-xs text-slate-500"><span className="font-semibold text-slate-900">{t.name}</span> · {t.city}</footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Location */}
        <section id="location" aria-labelledby="hotel-location" className={SECTION}>
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center')}>
            <div data-reveal>
              <SectionTitle id="hotel-location" eyebrow="Location" title="At the heart of the harbour" description={LOCATION.blurb} headingClassName={HEADING} />
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900"><MapPin className="size-4 text-[color:var(--demo-accent-ink)]" aria-hidden /> {LOCATION.address}</p>
              <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
                {LOCATION.distances.map(([place, time]) => <li key={place} className="flex justify-between py-3 text-sm"><span className="text-slate-700">{place}</span><span className="font-medium tabular-nums text-slate-900">{time}</span></li>)}
              </ul>
            </div>
            <div data-reveal style={{ ['--i' as string]: 1 }} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#dbe7f3,#f5f1eb)]" role="img" aria-label="Map showing the hotel by the harbour, near the old town and the ferry terminal">
              <svg viewBox="0 0 400 300" className="size-full" aria-hidden>
                <path d="M0 210 Q120 160 200 200 T400 180 V300 H0Z" fill="#bcd6e6" opacity="0.7" />
                <path d="M40 60 H360 M40 120 H360 M70 40 V260 M150 40 V260 M260 40 V260" stroke="#ffffff" strokeWidth="6" opacity="0.8" />
                <circle cx="210" cy="132" r="22" fill="#0f172a" opacity="0.12" />
                <circle cx="210" cy="132" r="9" fill="#d4af37" stroke="#0f172a" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </section>

        {/* Enquiry */}
        <section id="contact" aria-labelledby="hotel-cta" className="scroll-mt-20 bg-[var(--demo-accent)] py-20 sm:py-24">
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
            <div>
              <SectionTitle id="hotel-cta" tone="dark" eyebrow="Reserve your stay" title="Let us prepare your arrival" description="Tell us your dates and we will hold the right room, with a welcome that suits the occasion." headingClassName={HEADING} />
              <ul className="mt-8 space-y-3 text-sm text-white/80">{['Best rate when you book direct', 'Free cancellation until 48 hours before', 'A personal concierge from the first email'].map((item) => <li key={item} className="flex items-center gap-2.5"><Check className="size-4 text-[color:var(--demo-gold)]" aria-hidden /> {item}</li>)}</ul>
            </div>
            <EnquiryForm copy={ENQUIRY_COPY} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a1020] py-14 text-slate-400">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <HotelLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{HOTEL_BRAND.tagline}. A fictional hotel, designed as a showcase by Valorian Studio.</p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-white">{group.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">{group.links.map((link) => <li key={link}><span className="cursor-default transition-colors hover:text-white">{link}</span></li>)}</ul>
            </div>
          ))}
        </div>
        <div className={cn(COL, 'mt-12')}>
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {HOTEL_BRAND.name} (demo). All names, rooms, rates and reviews on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
