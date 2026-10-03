import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="relative isolate -mt-16 overflow-hidden border-b border-border bg-[radial-gradient(60%_90%_at_92%_0%,rgb(251_224_195/0.85),transparent),radial-gradient(40%_60%_at_0%_100%,rgb(255_187_152/0.14),transparent)] lg:-mt-[4.5rem]">
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
        <p className="mb-5 inline-flex animate-fade-up items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          <span aria-hidden className="h-px w-8 bg-accent/60" />
          {eyebrow}
        </p>
        <h1 className="display max-w-3xl animate-fade-up text-balance text-4xl leading-[1.05] text-primary [animation-delay:80ms] sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-pretty text-lg leading-relaxed text-muted [animation-delay:180ms] sm:text-xl">{description}</p>
        {children && <div className="mt-8 animate-fade-up [animation-delay:280ms]">{children}</div>}
      </div>
    </section>
  );
}
