import { ArrowRight, Check } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import type { HeroContent } from '@/lib/cms-types';

/** Product showcase: a framed web app with an overlapping mobile screen. Pure markup, no images to load. */
function ProductShowcase() {
  const bars = [38, 52, 44, 66, 58, 78, 70, 92];
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[34rem] pb-10 lg:max-w-none">
      <div className="absolute -right-6 -top-6 size-56 rounded-full bg-coral/50 blur-3xl sm:size-72" />
      <div className="absolute -bottom-2 left-4 size-48 rounded-full bg-cream blur-3xl" />
      <div className="absolute right-0 top-10 h-[78%] w-[58%] rounded-[2.2rem] bg-slate/90" />

      {/* browser */}
      <div className="relative animate-fade-up overflow-hidden rounded-2xl border border-[rgb(52_70_72/0.18)] bg-card shadow-[var(--shadow-float)] [animation-delay:200ms]">
        <div className="flex items-center gap-1.5 border-b border-border bg-surface px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#e8a99a]" />
          <span className="size-2.5 rounded-full bg-[#ecd08b]" />
          <span className="size-2.5 rounded-full bg-[#a8c3a0]" />
          <span className="ml-3 flex h-6 flex-1 items-center rounded-full bg-background px-3 text-[10px] text-muted">app.clinicos.com/overview</span>
        </div>
        <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[9rem_1fr]">
          <div className="space-y-3 bg-slate p-3 sm:p-4">
            <div className="mb-4 size-6 rounded-lg bg-coral" />
            {['Overview', 'Patients', 'Schedule', 'Billing', 'Reports'].map((item, i) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className={`size-4 shrink-0 rounded ${i === 0 ? 'bg-coral' : 'bg-white/20'}`} />
                <span className={`hidden text-[11px] sm:block ${i === 0 ? 'font-semibold text-white' : 'text-white/60'}`}>{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4 bg-background p-4 sm:p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-muted">Good morning</p>
                <p className="display text-lg leading-tight text-primary sm:text-xl">Today at a glance</p>
              </div>
              <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold text-primary">Live</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                ['Appointments', '128'],
                ['New patients', '24'],
                ['Revenue', '$8.4k'],
              ].map(([label, value], i) => (
                <div key={label} className={`rounded-xl border border-border p-2.5 ${i === 2 ? 'bg-cream' : 'bg-card'}`}>
                  <p className="text-[9px] text-muted sm:text-[10px]">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-primary sm:text-base">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex h-24 items-end gap-2 sm:h-28">
                {bars.map((height, i) => (
                  <span key={i} className={`flex-1 rounded-t-md ${i === bars.length - 1 ? 'bg-coral' : 'bg-primary/80'}`} style={{ height: `${height}%`, opacity: i === bars.length - 1 ? 1 : 0.35 + i * 0.08 }} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {[78, 56].map((width) => (
                <div key={width} className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-surface-strong" />
                  <span className="h-2 rounded-full bg-surface-strong" style={{ width: `${width}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* phone */}
      <div className="absolute -bottom-0 -left-2 w-[30%] min-w-[7rem] max-w-[10rem] animate-float-slow sm:-left-6">
        <div className="rounded-[1.7rem] border-[5px] border-slate bg-slate shadow-[var(--shadow-float)]">
          <div className="overflow-hidden rounded-[1.3rem] bg-background">
            <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-slate/30" />
            <div className="space-y-2 p-2.5">
              <p className="display text-xs text-primary">My bookings</p>
              {[
                ['10:30', 'Check-up', 'bg-cream'],
                ['12:00', 'Follow-up', 'bg-card'],
                ['15:15', 'Consult', 'bg-card'],
              ].map(([time, label, tone]) => (
                <div key={time} className={`flex items-center gap-2 rounded-lg border border-border ${tone} p-1.5`}>
                  <span className="grid size-6 place-items-center rounded-md bg-slate text-[8px] font-semibold text-white">{time}</span>
                  <span className="text-[9px] font-medium text-primary">{label}</span>
                </div>
              ))}
              <div className="rounded-lg bg-coral py-1.5 text-center text-[9px] font-semibold text-primary">Book a visit</div>
            </div>
          </div>
        </div>
      </div>

      {/* confirmation chip */}
      <div className="absolute -right-2 bottom-2 hidden items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-[var(--shadow-lift)] sm:flex">
        <span className="grid size-7 place-items-center rounded-full bg-cream text-primary">
          <Check className="size-3.5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-primary">Booking confirmed</p>
          <p className="text-[10px] text-muted">Reminder sent to patient</p>
        </div>
      </div>
    </div>
  );
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative isolate -mt-16 overflow-hidden bg-[radial-gradient(70%_60%_at_85%_10%,rgb(251_224_195/0.9),transparent),radial-gradient(50%_50%_at_0%_100%,rgb(255_187_152/0.18),transparent)] lg:-mt-[4.5rem]">
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto grid grid-cols-1 w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pb-28 lg:pt-44">
        <div className="min-w-0">
          {content.eyebrow && (
            <p className="mb-8 inline-flex animate-fade-up items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              <span aria-hidden className="size-1.5 rounded-full bg-coral" />
              {content.eyebrow}
            </p>
          )}
          <h1 className="display text-balance text-[2.5rem] leading-[1.05] text-primary sm:text-6xl lg:text-[4.6rem]">
            <span className="mask-line">
              <span style={{ ['--d' as string]: 80 }}>{content.headline}</span>
            </span>
            {content.highlight && (
              <span className="mask-line">
                <span className="text-accent" style={{ ['--d' as string]: 220 }}>
                  {content.highlight}
                </span>
              </span>
            )}
          </h1>
          <p className="mt-8 max-w-xl animate-fade-up text-pretty text-lg leading-relaxed text-muted [animation-delay:380ms] sm:text-xl">{content.description}</p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:480ms] sm:flex-row">
            <ButtonLink href={content.primaryUrl} size="lg">
              {content.primaryLabel}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </ButtonLink>
            {content.secondaryLabel && content.secondaryUrl && (
              <ButtonLink href={content.secondaryUrl} variant="secondary" size="lg">
                {content.secondaryLabel}
              </ButtonLink>
            )}
          </div>
          <ul className="mt-12 flex animate-fade-up flex-wrap gap-x-7 gap-y-3 text-sm text-muted [animation-delay:580ms]">
            {['Production-grade engineering', 'Transparent delivery', 'Built for performance'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {content.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.imageUrl} alt="" width={900} height={700} fetchPriority="high" className="mx-auto w-full max-w-xl rounded-3xl border border-border shadow-[var(--shadow-float)] lg:max-w-none" />
          ) : (
            <ProductShowcase />
          )}
        </div>
      </div>
    </section>
  );
}
