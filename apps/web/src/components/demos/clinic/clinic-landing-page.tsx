import { ArrowRight, BarChart3, CalendarDays, Check, CreditCard, FileHeart, Pill, Quote, ShieldCheck, Star, Stethoscope, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DemoNavbar } from '@/components/demos/shared/demo-navbar';
import { EnquiryForm } from '@/components/demos/shared/enquiry-form';
import type { EnquiryCopy } from '@/components/demos/shared/enquiry-form';
import { SectionTitle } from '@/components/demos/shared/section-title';
import { INITIAL_TEETH } from '@/data/clinic/app';
import { CLINIC_BRAND, DENTAL_POINTS, DOCTORS, FEATURES, FOOTER_LINKS, LANDING_NAV, STATS, TESTIMONIALS } from '@/data/clinic/landing';
import type { FeatureIcon } from '@/data/clinic/landing';
import { CLINIC_THEME } from '@/data/clinic/meta';
import { cn } from '@/lib/cn';
import { ClinicHeroVisual } from './clinic-hero-visual';
import { ClinicLogo } from './clinic-logo';
import { ToothChart, ToothLegend } from './tooth-chart';

const ICONS: Record<FeatureIcon, LucideIcon> = {
  patients: Users,
  appointments: CalendarDays,
  doctors: Stethoscope,
  prescription: Pill,
  records: FileHeart,
  billing: CreditCard,
  reports: BarChart3,
};

const ENQUIRY_COPY: EnquiryCopy = {
  organisation: { label: 'Clinic name', placeholder: 'Brightsmile Dental' },
  emailPlaceholder: 'jordan@clinic.example',
  topics: [
    { value: 'demo', label: 'Book a product demo' },
    { value: 'migration', label: 'Ask about data migration' },
    { value: 'pricing', label: 'Discuss pricing' },
  ],
  messagePlaceholder: 'Tell us about your clinic: how many dentists, rooms and patients.',
  submitLabel: 'Book a demo',
};

const SECTION = 'scroll-mt-28 py-20 sm:py-24';
/** Inner column shared by every section, with the same gutters as the navbar and hero so edges line up. */
const COL = 'mx-auto w-full max-w-7xl px-5 sm:px-8';
const BTN = 'inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';

/**
 * The marketing site of the fictional ClinicOS product. A standalone full-page preview (no Valorian header or footer) and a Server Component end to end: every section is static HTML, and the
 * only client code is the small demo-request form.
 */
export function ClinicLandingPage() {
  return (
    <div id="top" style={CLINIC_THEME} className="bg-white text-slate-900">
      <DemoNavbar brand={<ClinicLogo />} links={LANDING_NAV} cta={{ label: 'Book a demo', href: '#contact' }} standalone />

      <main id="main">
      {/* Hero */}
      <section aria-labelledby="clinic-hero" className="relative overflow-x-clip bg-[radial-gradient(60%_70%_at_88%_0%,#e8f1f9,transparent)]">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pb-28 lg:pt-24">
          <div className="min-w-0">
            <p className="demo-rise inline-flex items-center gap-2 rounded-full border border-clinic-green/30 bg-clinic-green/10 px-3 py-1 text-xs font-semibold text-green-800">
              <ShieldCheck className="size-3.5" aria-hidden /> Trusted by 120+ clinics
            </p>
            <h1 id="clinic-hero" className="demo-rise mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-clinic-ink [--i:1] sm:text-5xl lg:text-[3.5rem]">
              Care your patients feel from the first click
            </h1>
            <p className="demo-rise mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-600 [--i:2]">Appointments, patient records, prescriptions and billing in one calm, secure platform for dental and medical clinics.</p>
            <div className="demo-rise mt-9 flex flex-col gap-3 [--i:3] sm:flex-row">
              <a href="#contact" className={cn(BTN, 'bg-clinic text-white hover:bg-clinic-ink focus-visible:outline-clinic')}>
                Book a Demo <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#features" className={cn(BTN, 'border border-slate-300 bg-white text-clinic-ink hover:border-clinic focus-visible:outline-clinic')}>
                Explore Features
              </a>
            </div>
            <ul className="demo-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 [--i:4]">
              {['HIPAA-ready security', 'Free data migration', 'Patient mobile app'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-clinic-teal-ink" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <ClinicHeroVisual />
        </div>
      </section>

      {/* Features */}
      <section id="features" aria-labelledby="clinic-features" className={cn(SECTION, 'bg-slate-50')}>
        <div className={COL}>
          <div data-reveal>
            <SectionTitle id="clinic-features" eyebrow="Features" title="Everything your clinic runs on, in one place" description="Seven connected modules replace paper charts, spreadsheets and disconnected tools." />
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => {
              const Icon = ICONS[feature.icon];
              return (
                <article key={feature.title} data-reveal style={{ ['--i' as string]: i % 4 }} className={cn('group rounded-2xl border p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5', i === 0 ? 'border-clinic bg-clinic text-white lg:col-span-2 lg:p-8 [&_p]:text-white/80' : 'border-slate-200 bg-white hover:border-clinic-teal/50 hover:shadow-[0_18px_40px_-24px_rgb(14_165_164/0.45)]')}>
                  <span className={cn('grid size-11 place-items-center rounded-xl transition-colors duration-200', i === 0 ? 'bg-white/15 text-white' : 'bg-clinic-teal/10 text-clinic-teal-ink group-hover:bg-clinic-teal-ink group-hover:text-white')}>
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

      {/* Dental care */}
      <section id="dental" aria-labelledby="clinic-dental" className={SECTION}>
        <div className={cn(COL, 'grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]')}>
          <div data-reveal className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
            <div role="img" aria-label="Sample dental chart with treated and healthy teeth">
              <ToothChart teeth={INITIAL_TEETH} showNumbers />
            </div>
            <div className="mt-4">
              <ToothLegend />
            </div>
          </div>
          <div data-reveal>
            <SectionTitle id="clinic-dental" eyebrow="Dental care built in" title="A dental chart that works as hard as you do" description="Record every tooth, plan treatment and show patients exactly what is happening, without leaving the chair." />
            <ul className="mt-8 space-y-3">
              {DENTAL_POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-slate-700">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-clinic-green/15 text-green-800">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" aria-labelledby="clinic-doctors" className={cn(SECTION, 'bg-slate-50')}>
        <div className={COL}>
          <div data-reveal>
            <SectionTitle id="clinic-doctors" eyebrow="Care teams" title="Doctors who run their day on ClinicOS" description="From the first appointment to the final invoice, clinicians stay focused on patients." />
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DOCTORS.map((doctor, i) => (
              <li key={doctor.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <span aria-hidden className="grid size-14 place-items-center rounded-full bg-clinic/10 text-lg font-semibold text-clinic">
                  {doctor.name
                    .replace('Dr. ', '')
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{doctor.name}</h3>
                <p className="text-sm text-clinic-teal-ink">{doctor.role}</p>
                <p className="text-xs text-slate-500">{doctor.focus}</p>
                <blockquote className="mt-4 flex-1 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">&ldquo;{doctor.quote}&rdquo;</blockquote>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Statistics */}
      <section id="results" aria-label="Results in numbers" className="scroll-mt-28 bg-clinic-ink py-16 sm:py-20">
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
      <section aria-labelledby="clinic-testimonials" className={SECTION}>
        <div className={COL}>
          <div data-reveal>
            <SectionTitle id="clinic-testimonials" eyebrow="Testimonials" title="What clinic owners and patients say" />
          </div>
          <ul className="mt-12 grid gap-4 lg:grid-cols-3">
            {TESTIMONIALS.map((item, i) => (
              <li key={item.name} data-reveal style={{ ['--i' as string]: i }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex gap-0.5 text-amber-400" role="img" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
                <Quote className="mt-5 size-6 text-clinic-teal/40" aria-hidden />
                <blockquote className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">{item.quote}</blockquote>
                <footer className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <span aria-hidden className="grid size-10 place-items-center rounded-full bg-clinic-teal/10 text-sm font-semibold text-clinic-teal-ink">
                    {item.name
                      .replace('Dr. ', '')
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.role}, {item.clinic}
                    </p>
                  </div>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA and contact */}
      <section id="contact" aria-labelledby="clinic-cta" className="scroll-mt-28 bg-clinic py-20 sm:py-24">
        <div className={cn(COL, 'grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center')}>
          <div>
            <SectionTitle id="clinic-cta" tone="dark" eyebrow="Book a demo" title="See ClinicOS running your clinic" description="A 30-minute walkthrough with a clinic specialist, using your own workflow." />
            <ul className="mt-8 space-y-3 text-sm text-slate-200">
              {['Personalised walkthrough for your clinic', 'Reply within one working day', 'No commitment, no credit card'].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="size-4 text-clinic-green" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <EnquiryForm copy={ENQUIRY_COPY} />
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-clinic-ink py-14 text-slate-400">
        <div className={cn(COL, 'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]')}>
          <div>
            <ClinicLogo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{CLINIC_BRAND.tagline}. A fictional product, designed as a showcase by Valorian Studio.</p>
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
          <p className="border-t border-white/10 pt-6 text-xs">© 2026 {CLINIC_BRAND.name} (demo). All names, clinics, figures and testimonials on this page are fictional.</p>
        </div>
      </footer>
    </div>
  );
}
