import type { ReactNode } from 'react';

/** Heading band above an interactive experience (website or mobile app), with a one-line instruction for visitors. */
export function DemoExperienceIntro({ eyebrow, title, description, hint, children }: { eyebrow: string; title: string; description: string; hint: string; children: ReactNode }) {
  return (
    <div className="bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--demo-accent,#2563eb)]">{eyebrow}</p>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
        <p className="mt-5 inline-flex max-w-full items-start gap-2 rounded-lg border border-[color:var(--demo-accent-ring,#bfdbfe)] bg-[var(--demo-accent-soft,#eff6ff)] px-3 py-2 text-sm text-slate-800">
          <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--demo-accent,#2563eb)]" />
          {hint}
        </p>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
