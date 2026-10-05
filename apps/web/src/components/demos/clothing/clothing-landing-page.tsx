import { ArrowRight, BadgeCheck, Check, Lock, Quote, Star, Truck, Sparkles, LayoutGrid, Search, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Cormorant_Garamond } from 'next/font/google';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { PRODUCTS, LOOKBOOK } from '@/data/clothing/catalog';
import { CATEGORIES_PUBLIC, CLOTHING_BRAND, FEATURES, FOOTER_LINKS, LANDING_NAV, NEWSLETTER_COPY, STATS, TESTIMONIALS } from '@/data/clothing/landing';
import type { FeatureIcon } from '@/data/clothing/landing';
import { CLOTHING_THEME } from '@/data/clothing/meta';
import { cn } from '@/lib/cn';
import { ClothingLogo } from './clothing-logo';
import { GarmentArt } from './garment-art';
import { ProductCard } from './product-card';

/** Editorial serif for the headlines: loaded only on this route, which gives the page its luxury feel. */
const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = { collections: Sparkles, showcase: LayoutGrid, shopping: Search, secure: Lock, delivery: Truck, reviews: Star };

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Store name', placeholder: 'Maison Vale' },
  emailPlaceholder: 'you@brand.example',
  topics: [
    { value: 'launch', label: 'Launch a store like this' },
    { value: 'migrate', label: 'Move my existing shop' },
    { value: 'pricing', label: 'Discuss pricing' },
  ],
  messagePlaceholder: 'Tell us about your brand and the kind of store you want.',
  submitLabel: 'Request a store demo',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const HEADING = cn(display.className, 'tracking-tight');

/**
 * The marketing site of the fictional Maison Vale fashion brand, as a standalone full-page preview (no Valorian header or footer).
 * A Server Component end to end: static HTML, one client form, and gently revealed sections.
 */
export function ClothingLandingPage() {
  const featured = PRODUCTS.filter((p) => p.tag === 'Bestseller' || p.tag === 'New' || p.tag === 'Limited').slice(0, 4);
  return (
    <div id="top" style={CLOTHING_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<ClothingLogo />} links={LANDING_NAV} cta={{ label: 'Shop now', href: '#collections' }} standalone />

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="fashion-hero" className="relative overflow-x-clip bg-[var(--demo-accent-soft)]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
            <div className="min-w-0">
              <p className="demo-rise text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">Autumn / Winter 2026</p>
              <h1 id="fashion-hero" className={cn(HEADING, 'demo-rise mt-5 text-balance text-5xl font-medium leading-[1.02] text-[color:var(--demo-accent)] [--i:1] sm:text-6xl lg:text-[4.25rem]')}>
                Discover Fashion Designed For Your Lifestyle
              </h1>
              <p className="demo-rise mt-6 max-w-md text-pretty text-base leading-relaxed text-slate-700 [--i:2]">Considered tailoring, cashmere and leather goods, cut to be worn every day and kept for years.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#collections" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--demo-accent)] px-7 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
                  Shop the Collection <ArrowRight className="size-4" aria-hidden />
                </a>
                <a href="#lookbook" className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--demo-accent)] px-7 text-sm font-semibold text-[color:var(--demo-accent)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
                  View the Lookbook
                </a>
              </div>
              <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700 [--i:4]">
                {['Free express delivery over $200', 'Free returns in 30 days', 'Secure checkout'].map((item) => (
                  <li key={item} className="flex items-center gap-2"><Check className="size-3.5 text-[color:var(--demo-good-ink)]" aria-hidden /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="demo-rise relative mx-auto w-full max-w-[32rem]" style={{ ['--i' as string]: 2 }}>
              <div className="grid grid-cols-5 grid-rows-5 gap-3 rounded-3xl bg-white p-4 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.35)] sm:p-5">
                <div className="col-span-3 row-span-3 rounded-2xl bg-[#e9e3d7] p-4"><GarmentArt art="coat" colour="#C19A6B" accent="#111111" label="Tailored Wool Coat in camel" className="size-full" /></div>
                <div className="col-span-2 row-span-2 rounded-2xl bg-[#f3efe8] p-3"><GarmentArt art="dress" colour="#111111" accent="#ffffff" label="Silk Slip Dress in black" className="size-full" /></div>
                <div className="col-span-2 row-span-3 rounded-2xl bg-[#f3efe8] p-3"><GarmentArt art="bag" colour="#C19A6B" accent="#111111" label="Leather Tote in camel" className="size-full" /></div>
                <div className="col-span-3 row-span-2 rounded-2xl bg-[#e9e3d7] p-3"><GarmentArt art="knit" colour="#F5F1EB" accent="#111111" label="Merino Crew Knit in ivory" className="size-full" /></div>
              </div>
              <div aria-hidden className="absolute -bottom-4 -left-3 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.4)] sm:flex">
                <span className="grid size-8 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Truck className="size-4" /></span>
                <div><p className="text-[11px] font-semibold text-slate-900">Order dispatched</p><p className="text-[10px] text-slate-500">Arrives Thu 8 Oct</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Collections (featured products) */}
        <section id="collections" aria-labelledby="fashion-collections" className={SECTION}>
          <div className={COL}>
            <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionTitle id="fashion-collections" eyebrow="New collections" title="Featured pieces this season" headingClassName={HEADING} />
              <a href="#categories" className="text-xs font-semibold uppercase tracking-wide text-[color:var(--demo-accent)] underline underline-offset-4 hover:opacity-70">Shop all</a>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {featured.map((p, i) => (
                <li key={p.id}><ProductCard product={p} index={i} /></li>
              ))}
            </ul>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" aria-labelledby="fashion-categories" className={cn(SECTION, 'bg-[var(--demo-accent-soft)]')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="fashion-categories" eyebrow="Shop by category" title="Men, women and accessories" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {CATEGORIES_PUBLIC.map((c, i) => (
                <li key={c.name} data-reveal style={{ ['--i' as string]: i }}>
                  <a href="#collections" className={cn('group flex h-72 flex-col justify-end overflow-hidden rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', c.tone)}>
                    <span className={cn(HEADING, 'text-3xl font-medium text-[color:var(--demo-accent)]')}>{c.name}</span>
                    <span className="mt-1 text-sm text-slate-700">{c.blurb}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--demo-accent)]">Explore <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden /></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="fashion-features" className={SECTION}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="fashion-features" eyebrow="The Maison Vale promise" title="Shopping, made simple and well made" headingClassName={HEADING} /></div>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon];
                return (
                  <li key={f.title} data-reveal style={{ ['--i' as string]: i % 3 }} className="bg-white p-7">
                    <Icon className="size-5 text-[color:var(--demo-accent)]" aria-hidden />
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Lookbook */}
        <section id="lookbook" aria-labelledby="fashion-lookbook" className={cn(SECTION, 'bg-[var(--demo-accent)] text-white')}>
          <div className={COL}>
            <div data-reveal><SectionTitle id="fashion-lookbook" tone="dark" eyebrow="Lookbook" title="Three ways to wear the season" headingClassName={cn(HEADING, 'text-white')} /></div>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {LOOKBOOK.map((l, i) => {
                const art = i === 0 ? 'coat' : i === 1 ? 'dress' : 'shirt';
                const colour = i === 0 ? '#C19A6B' : i === 1 ? '#1f1f1f' : '#F5F1EB';
                return (
                  <li key={l.id} data-reveal style={{ ['--i' as string]: i }} className="group overflow-hidden rounded-2xl bg-white/5">
                    <div className="aspect-[4/5] bg-[#1d1d1d] p-10 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                      <GarmentArt art={art} colour={colour} accent={i === 2 ? '#111111' : '#ffffff'} label={l.title} className="size-full" />
                    </div>
                    <div className="p-5">
                      <p className={cn(HEADING, 'text-2xl font-medium')}>{l.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{l.caption}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Stats + testimonials */}
        <section aria-labelledby="fashion-testimonials" className={SECTION}>
          <div className={COL}>
            <dl className="grid grid-cols-2 gap-6 border-b border-slate-200 pb-12 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col"><dt className="order-2 mt-2 text-xs text-slate-500">{s.label}</dt><dd className={cn(HEADING, 'text-4xl font-medium tabular-nums text-[color:var(--demo-accent)]')}>{s.value}</dd></div>
              ))}
            </dl>
            <div data-reveal className="mt-12"><SectionTitle id="fashion-testimonials" eyebrow="Customer reviews" title="Worn, loved and reviewed" headingClassName={HEADING} /></div>
            <ul className="mt-10 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <li key={t.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 p-7">
                  <div className="flex gap-0.5 text-[color:var(--demo-good)]" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="size-3.5 fill-current" aria-hidden />)}</div>
                  <Quote className="mt-4 size-5 text-slate-300" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{t.quote}</blockquote>
                  <footer className="mt-6 flex items-center gap-2 text-xs text-slate-500"><BadgeCheck className="size-3.5 text-[color:var(--demo-good-ink)]" aria-hidden /><span className="font-semibold text-slate-900">{t.name}</span>· {t.city} · Verified buyer</footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Newsletter + contact */}
        <section id="newsletter" aria-labelledby="fashion-newsletter" className={cn(SECTION, 'bg-[var(--demo-accent-soft)]')}>
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center')}>
            <div data-reveal>
              <SectionTitle id="fashion-newsletter" eyebrow="Newsletter" title={NEWSLETTER_COPY.title} description={NEWSLETTER_COPY.description} headingClassName={HEADING} />
              <form className="mt-8 flex max-w-md flex-col gap-2 sm:flex-row" action="#newsletter">
                <label className="sr-only" htmlFor="fashion-email">Email address</label>
                <input id="fashion-email" type="email" required placeholder="Your email" className="h-12 flex-1 rounded-full border border-slate-300 bg-white px-5 text-sm placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--demo-accent)] px-6 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]"><Mail className="size-4" aria-hidden /> Subscribe</button>
              </form>
              <p className="mt-3 text-[11px] text-slate-500">Demo newsletter: nothing is sent.</p>
            </div>
            <div id="contact" className="scroll-mt-20">
              <EnquiryForm copy={ENQUIRY_COPY} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--demo-accent)] py-14 text-slate-400">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <ClothingLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{CLOTHING_BRAND.tagline}. A fictional brand, designed as a showcase by Valorian Studio.</p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-white">{group.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">{group.links.map((link) => <li key={link}><span className="cursor-default transition-colors hover:text-white">{link}</span></li>)}</ul>
            </div>
          ))}
        </div>
        <div className={cn(COL, 'mt-12')}>
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {CLOTHING_BRAND.name} (demo). All names, collections, prices and reviews on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
