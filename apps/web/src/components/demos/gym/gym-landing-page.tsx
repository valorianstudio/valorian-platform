import { ArrowRight, BarChart3, CalendarDays, Check, ClipboardCheck, CreditCard, Dumbbell, LayoutGrid, Quote, ShieldCheck, Star, Trophy, UserRound, Users, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Barlow_Condensed } from 'next/font/google';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { DemoPricing } from '@/components/demos/shared/demo-pricing';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { FEATURES, FOOTER_LINKS, GYM_BRAND, LANDING_NAV, PLANS_PUBLIC, SHOWCASE, STATS, TESTIMONIALS, TRAINERS_PUBLIC } from '@/data/gym/landing';
import type { FeatureIcon } from '@/data/gym/landing';
import { GYM_THEME } from '@/data/gym/meta';
import { cn } from '@/lib/cn';
import { GymHeroVisual } from './gym-hero-visual';
import { GymLogo } from './gym-logo';

/** Condensed display face for gym headlines: loaded only on this route, which gives the page its energy. */
const display = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = {
  members: Users,
  workouts: Dumbbell,
  trainers: UserRound,
  classes: CalendarDays,
  attendance: ClipboardCheck,
  payments: CreditCard,
  progress: Trophy,
  booking: LayoutGrid,
};

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Gym name', placeholder: 'Iron Parish Gym' },
  emailPlaceholder: 'jordan@gym.example',
  topics: [
    { value: 'trial', label: 'Start a free trial' },
    { value: 'demo', label: 'Book a product demo' },
    { value: 'pricing', label: 'Discuss pricing' },
  ],
  messagePlaceholder: 'Tell us about your gym: members, locations and how you take bookings today.',
  submitLabel: 'Start free trial',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
/** Inner column shared by every section, with the same gutters as the navbar and hero so edges line up. */
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const BTN = 'inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';
const HEADING = cn(display.className, 'uppercase tracking-tight');

/** Stat tiles beside the member-experience copy. Kept with the component because they are only used here. */
const SHOWCASE_CARDS: { title: string; value: string; icon: LucideIcon; tone: string }[] = [
  { title: 'Weekly check-ins', value: '2.3k', icon: Activity, tone: 'bg-gym text-white' },
  { title: 'Classes booked', value: '96%', icon: CalendarDays, tone: 'bg-blue-50 text-gym' },
  { title: 'Plans assigned', value: '127', icon: Dumbbell, tone: 'bg-green-50 text-gym' },
  { title: 'Retention rate', value: '91%', icon: BarChart3, tone: 'bg-orange-50 text-gym' },
];

/**
 * The marketing site of the fictional FORGE gym software, as a standalone full-page preview (no Valorian header or footer). A Server
 * Component end to end: static HTML, optimised images and a small trial sign-up form.
 */
export function GymLandingPage() {
  return (
    <div id="top" style={GYM_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<GymLogo />} links={LANDING_NAV} cta={{ label: 'Start free', href: '#contact' }} standalone />

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="gym-hero" className="relative overflow-x-clip bg-[radial-gradient(60%_70%_at_88%_0%,#dbeafe,transparent),linear-gradient(#f8fafc,#fff)]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:pb-28 lg:pt-24">
            <div className="min-w-0">
              <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-gym-green/30 bg-gym-green/10 px-3 py-1 text-xs font-semibold text-green-800">
                <ShieldCheck className="size-3.5" aria-hidden /> Trusted by 120+ gyms and studios
              </p>
              <h1 id="gym-hero" className={cn(HEADING, 'demo-rise mt-6 text-balance text-5xl font-extrabold leading-[0.98] text-gym [--i:1] sm:text-6xl lg:text-[4.5rem]')}>
                Transform Your Fitness Business With Smart Gym Management
              </h1>
              <p className="demo-rise mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">Members, classes, trainers and payments in one platform, with an app your members will actually open every day.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#contact" className={cn(BTN, 'bg-gym-blue text-white hover:brightness-110 focus-visible:outline-gym-blue')}>
                  Start Free Trial <ArrowRight className="size-4" aria-hidden />
                </a>
                <a href="#features" className={cn(BTN, 'border border-slate-300 bg-white text-gym hover:border-gym focus-visible:outline-gym')}>
                  Explore Features
                </a>
              </div>
              <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">
                {['Free 30-day trial', 'Migration included', 'Member app included'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-gym-green" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <GymHeroVisual />
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="gym-features" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="gym-features" eyebrow="Features" title="Everything your gym runs on" description="Eight connected modules replace spreadsheets, clipboards and the front-desk juggle." headingClassName={HEADING} />
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, i) => {
                const Icon = ICONS[feature.icon];
                return (
                  <article key={feature.title} data-reveal style={{ ['--i' as string]: i % 4 }} className={cn('group rounded-2xl border p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5', i === 0 ? 'border-gym bg-gym text-white lg:col-span-2 lg:p-8 [&_p]:text-white/75' : 'border-slate-200 bg-white hover:border-gym-blue/40 hover:shadow-[0_18px_40px_-24px_rgb(37_99_235/0.4)]')}>
                    <span className={cn('grid size-11 place-items-center rounded-xl transition-colors duration-200', i === 0 ? 'bg-gym-blue text-white' : 'bg-blue-50 text-gym-blue group-hover:bg-gym-blue group-hover:text-white')}>
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

        {/* Member experience */}
        <section aria-label="Member experience" className={SECTION}>
          <div className={cn(COL, 'grid items-center gap-12 lg:grid-cols-[1fr_1fr]')}>
            <div data-reveal>
              <SectionTitle eyebrow={SHOWCASE.eyebrow} title={SHOWCASE.title} description={SHOWCASE.description} headingClassName={HEADING} />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  [Activity, 'Live streaks and goals'],
                  [CalendarDays, 'One-tap class booking'],
                  [Dumbbell, 'Plans from your trainer'],
                  [Trophy, 'Personal bests, logged'],
                ].map(([Icon, label]) => {
                  const IconCmp = Icon as LucideIcon;
                  return (
                    <li key={label as string} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-sm font-medium text-slate-800">
                      <span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-gym-blue">
                        <IconCmp className="size-4" aria-hidden />
                      </span>
                      {label as string}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div data-reveal style={{ ['--i' as string]: 1 }} className="grid grid-cols-2 gap-4">
              {SHOWCASE_CARDS.map((card, i) => (
                <div key={card.title} data-reveal style={{ ['--i' as string]: i + 1 }} className={cn('rounded-2xl p-5', card.tone)}>
                  <card.icon className="size-5" aria-hidden />
                  <p className="mt-6 text-3xl font-extrabold tabular-nums">{card.value}</p>
                  <p className="mt-1 text-sm">{card.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trainers */}
        <section id="trainers" aria-labelledby="gym-trainers" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="gym-trainers" eyebrow="Our trainers" title="Coaches who run their day on FORGE" description="From the first assessment to the last session, trainers stay focused on members." headingClassName={HEADING} />
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRAINERS_PUBLIC.map((trainer, i) => (
                <li key={trainer.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                  <span aria-hidden className={cn(HEADING, 'grid size-14 place-items-center rounded-full bg-gym text-lg font-extrabold text-white')}>
                    {trainer.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{trainer.name}</h3>
                  <p className="text-sm text-gym-blue">{trainer.specialty}</p>
                  <blockquote className="mt-4 flex-1 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">&ldquo;{trainer.quote}&rdquo;</blockquote>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Statistics */}
        <section id="results" aria-label="Results in numbers" className="scroll-mt-20 bg-gym py-16 sm:py-20">
          <dl className={cn(COL, 'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4')}>
            {STATS.map((stat, i) => (
              <div key={stat.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col lg:border-l lg:border-white/15 lg:pl-8 first:lg:border-l-0 first:lg:pl-0">
                <dt className="order-2 mt-2 text-sm text-slate-300">{stat.label}</dt>
                <dd className={cn(HEADING, 'text-5xl font-extrabold tracking-tight text-white tabular-nums sm:text-6xl')}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="gym-testimonials" className={SECTION}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="gym-testimonials" eyebrow="Testimonials" title="Trusted by gym owners and coaches" headingClassName={HEADING} />
            </div>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((item, i) => (
                <li key={item.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex gap-0.5 text-gym-orange" role="img" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="size-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <Quote className="mt-5 size-6 text-blue-200" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{item.quote}</blockquote>
                  <footer className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <span aria-hidden className="grid size-10 place-items-center rounded-full bg-blue-50 text-sm font-semibold text-gym-blue">
                      {item.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.role}, {item.gym}
                      </p>
                    </div>
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Membership plans */}
        <section id="pricing" aria-labelledby="gym-pricing" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <DemoPricing plans={PLANS_PUBLIC} headingId="gym-pricing" title="Simple pricing for every gym" description="Every plan includes onboarding, data migration and a free trial month." headingClassName={HEADING} />
          </div>
        </section>

        {/* CTA and contact */}
        <section id="contact" aria-labelledby="gym-cta" className="scroll-mt-20 bg-gym py-20 sm:py-24">
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
            <div>
              <SectionTitle id="gym-cta" tone="dark" eyebrow="Start free" title="Fill your classes. Run the gym with less admin." description="Start a free 30-day trial, or book a walkthrough with a gym specialist for your members and timetable." headingClassName={HEADING} />
              <ul className="mt-8 space-y-3 text-sm text-slate-200">
                {['No card needed to start', 'We migrate your members for you', 'Cancel any time during the trial'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check className="size-4 text-gym-green" aria-hidden /> {item}
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
            <GymLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{GYM_BRAND.tagline}. A fictional product, designed as a showcase by Valorian Studio.</p>
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
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {GYM_BRAND.name} (demo). All names, gyms, figures and testimonials on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}

