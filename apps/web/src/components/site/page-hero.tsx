import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(50%_80%_at_50%_0%,var(--primary-soft),transparent)]" />
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted">{description}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
