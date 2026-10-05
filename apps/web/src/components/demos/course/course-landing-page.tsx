import { ArrowRight, Award, BarChart3, BookOpen, Check, ClipboardCheck, GraduationCap, MessagesSquare, Quote, Radio, ShieldCheck, Star, Trophy, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Inter_Tight } from 'next/font/google';
import Image from 'next/image';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { DemoPricing } from '@/components/demos/shared/demo-pricing';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { CATEGORIES_PUBLIC, COURSE_BRAND, FEATURES, FOOTER_LINKS, INSTRUCTORS_PUBLIC, LANDING_NAV, PLANS_PUBLIC, STATS, TESTIMONIALS } from '@/data/course/landing';
import type { FeatureIcon } from '@/data/course/landing';
import { COURSE_THEME } from '@/data/course/meta';
import { cn } from '@/lib/cn';
import { CourseLogo } from './course-logo';

/** Friendly sans for the headlines: loaded only on this route, which gives the page a clean, modern learning feel. */
const display = Inter_Tight({ subsets: ['latin'], weight: ['500', '600', '700'], display: 'swap' });

const ICONS: Record<FeatureIcon, LucideIcon> = {
  courses: BookOpen,
  dashboard: BarChart3,
  instructor: UserRound,
  live: Radio,
  certificate: Award,
  progress: Trophy,
  assessment: ClipboardCheck,
  community: MessagesSquare,
};

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Organisation', placeholder: 'Northwind Logistics' },
  emailPlaceholder: 'jordan@organisation.example',
  topics: [
    { value: 'trial', label: 'Start a free trial' },
    { value: 'teams', label: 'Set up a team' },
    { value: 'academy', label: 'Launch an academy' },
  ],
  messagePlaceholder: 'Tell us what you want to teach or learn, and roughly how many learners.',
  submitLabel: 'Start learning free',
};

const SECTION = 'scroll-mt-20 py-20 sm:py-24';
/** Inner column shared by every section, with the same gutters as the navbar and hero so edges line up. */
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const BTN = 'inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';
const HEADING = cn(display.className, 'tracking-tight');

/**
 * The marketing site of the fictional Learnova platform, as a standalone full-page preview (no Valorian header or footer). A Server
 * Component end to end: static HTML, a few lightweight cards and a small trial form.
 */
export function CourseLandingPage() {
  return (
    <div id="top" style={COURSE_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<CourseLogo />} links={LANDING_NAV} cta={{ label: 'Start learning', href: '#contact' }} standalone />

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="course-hero" className="relative overflow-x-clip bg-[radial-gradient(60%_70%_at_88%_0%,#e0e7ff,transparent),linear-gradient(#f8fafc,#fff)]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:pb-28 lg:pt-24">
            <div className="min-w-0">
              <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800">
                <ShieldCheck className="size-3.5" aria-hidden /> Trusted by 2.4M learners worldwide
              </p>
              <h1 id="course-hero" className={cn(HEADING, 'demo-rise mt-6 text-balance text-4xl font-semibold leading-[1.1] text-slate-900 [--i:1] sm:text-5xl lg:text-[3.4rem]')}>
                Learn Without Limits With Smart Digital Education
              </h1>
              <p className="demo-rise mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">Expert-led courses, clear progress and certificates that open doors, for individuals, teams and academies.</p>
              <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
                <a href="#contact" className={cn(BTN, 'bg-[var(--demo-accent)] text-white hover:brightness-110 focus-visible:outline-[color:var(--demo-accent)]')}>
                  Start Learning Free <ArrowRight className="size-4" aria-hidden />
                </a>
                <a href="#categories" className={cn(BTN, 'border border-slate-300 bg-white text-slate-900 hover:border-slate-900 focus-visible:outline-slate-900')}>
                  Browse Courses
                </a>
              </div>
              <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">
                {['Learn at your own pace', 'Certificates included', 'Mobile app included'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-[color:var(--demo-good)]" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto w-full max-w-[36rem] pb-8 lg:max-w-none">
              <div className="absolute -right-6 -top-6 hidden size-64 rounded-full bg-indigo-200/50 blur-3xl sm:block" />
              <div className="demo-rise relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(67_56_202/0.4),0_8px_24px_-12px_rgb(15_23_42/0.15)]">
                <Image src="/demos/course-learning-dashboard.webp" alt="Learnova platform dashboard showing courses, students and learning analytics" width={1216} height={751} priority sizes="(min-width: 1024px) 640px, 100vw" className="h-auto w-full" />
              </div>
              <div className="demo-rise absolute -bottom-2 left-2 hidden w-[23%] min-w-[6.5rem] max-w-40 sm:block lg:-left-6" style={{ ['--i' as string]: 6 }}>
                <Image src="/demos/course-learning-phone.webp" alt="Learnova student mobile app showing the home dashboard and continue-learning card" width={608} height={1250} sizes="160px" className="h-auto w-full drop-shadow-[0_20px_30px_rgb(67_56_202/0.35)]" />
              </div>
              <div aria-hidden className="demo-rise absolute -top-4 right-2 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgb(67_56_202/0.45)] sm:flex lg:-right-3" style={{ ['--i' as string]: 7 }}>
                <span className="grid size-8 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]">
                  <Award className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900">Certificate earned</p>
                  <p className="text-[10px] text-slate-500">UI Design Systems</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course categories */}
        <section id="categories" aria-labelledby="course-categories" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="course-categories" eyebrow="Course categories" title="Find the skill you want to build" description="Hundreds of expert-led courses across the fields that matter most at work." headingClassName={HEADING} />
            </div>
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES_PUBLIC.map((c, i) => (
                <li key={c.name} data-reveal style={{ ['--i' as string]: i % 3 }}>
                  <a href="#contact" className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                    <span className="flex items-center gap-3">
                      <span className={cn('grid size-10 place-items-center rounded-xl', c.tone)}>
                        <BookOpen className="size-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">{c.name}</span>
                        <span className="block text-xs text-slate-500">{c.courses} courses</span>
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="course-features" className={SECTION}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="course-features" eyebrow="Features" title="Everything a modern course platform needs" description="From the first lesson to the certificate, learners and instructors have what they need in one place." headingClassName={HEADING} />
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, i) => {
                const Icon = ICONS[feature.icon];
                return (
                  <article key={feature.title} data-reveal style={{ ['--i' as string]: i % 4 }} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-[0_18px_40px_-24px_rgb(67_56_202/0.35)]">
                    <span className="grid size-11 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)] transition-colors duration-200 group-hover:bg-[var(--demo-accent)] group-hover:text-white">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Instructors */}
        <section id="instructors" aria-labelledby="course-instructors" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="course-instructors" eyebrow="Featured instructors" title="Learn from people who do the work" description="Our instructors build products, run teams and teach from real experience." headingClassName={HEADING} />
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {INSTRUCTORS_PUBLIC.map((instructor, i) => (
                <li key={instructor.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                  <span aria-hidden className={cn(HEADING, 'grid size-14 place-items-center rounded-full bg-[var(--demo-accent)] text-lg font-semibold text-white')}>
                    {instructor.name
                      .replace('Dr. ', '')
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{instructor.name}</h3>
                  <p className="text-sm text-[color:var(--demo-accent)]">{instructor.specialty}</p>
                  <p className="text-xs text-slate-500">{instructor.students}</p>
                  <blockquote className="mt-4 flex-1 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">&ldquo;{instructor.quote}&rdquo;</blockquote>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Statistics */}
        <section id="results" aria-label="Results in numbers" className="scroll-mt-20 bg-[var(--demo-accent)] py-16 sm:py-20">
          <dl className={cn(COL, 'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4')}>
            {STATS.map((stat, i) => (
              <div key={stat.label} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col lg:border-l lg:border-white/20 lg:pl-8 first:lg:border-l-0 first:lg:pl-0">
                <dt className="order-2 mt-2 text-sm text-indigo-100">{stat.label}</dt>
                <dd className={cn(HEADING, 'text-4xl font-semibold tracking-tight text-white tabular-nums sm:text-5xl')}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="course-testimonials" className={SECTION}>
          <div className={COL}>
            <div data-reveal>
              <SectionTitle id="course-testimonials" eyebrow="Student stories" title="Real results from learners" headingClassName={HEADING} />
            </div>
            <ul className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((item, i) => (
                <li key={item.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex gap-0.5 text-amber-500" role="img" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="size-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <Quote className="mt-5 size-6 text-indigo-200" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{item.quote}</blockquote>
                  <footer className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <span aria-hidden className="grid size-10 place-items-center rounded-full bg-indigo-50 text-sm font-semibold text-[color:var(--demo-accent-ink)]">
                      {item.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.role}, {item.org}
                      </p>
                    </div>
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" aria-labelledby="course-pricing" className={cn(SECTION, 'bg-slate-50')}>
          <div className={COL}>
            <DemoPricing plans={PLANS_PUBLIC} headingId="course-pricing" title="Plans for learners, teams and academies" description="Start free. Every plan includes certificates, progress tracking and the mobile app." headingClassName={HEADING} />
          </div>
        </section>

        {/* CTA and contact */}
        <section id="contact" aria-labelledby="course-cta" className="scroll-mt-20 bg-slate-900 py-20 sm:py-24">
          <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
            <div>
              <SectionTitle id="course-cta" tone="dark" eyebrow="Start today" title="Your next skill starts with one lesson" description="Start free, or talk to our team about launching a course, a team programme or an academy." headingClassName={HEADING} />
              <ul className="mt-8 space-y-3 text-sm text-slate-200">
                {['Free to start, no card needed', 'Set up in an afternoon', 'Certificates from day one'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <GraduationCap className="size-4 text-[color:var(--demo-good-light)]" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <EnquiryForm copy={ENQUIRY_COPY} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f0e26] py-14 text-slate-400">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <CourseLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{COURSE_BRAND.tagline}. A fictional product, designed as a showcase by Valorian Studio.</p>
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
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {COURSE_BRAND.name} (demo). All names, courses, figures and testimonials on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
