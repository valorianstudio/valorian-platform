import { ArrowRight, Check, GitBranch } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function ProductMock() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary-soft via-transparent to-accent-soft opacity-80 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-1.5 border-b border-border bg-surface px-4 py-3">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 h-5 w-40 rounded-md bg-surface-strong" />
        </div>
        <div className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[9rem_1fr]">
          <div className="space-y-2.5 border-r border-border bg-surface p-3 sm:p-4">
            {[70, 90, 60, 80, 50].map((width, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`size-4 shrink-0 rounded ${i === 0 ? 'bg-primary' : 'bg-surface-strong'}`} />
                <span className="hidden h-2.5 rounded bg-surface-strong sm:block" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
          <div className="space-y-4 p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Revenue', value: '$48.2k', tone: 'text-accent' },
                { label: 'Users', value: '12.4k', tone: 'text-primary' },
                { label: 'Uptime', value: '99.99%', tone: 'text-foreground' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border p-3">
                  <p className="text-[10px] text-muted sm:text-xs">{stat.label}</p>
                  <p className={`mt-1 text-sm font-semibold sm:text-lg ${stat.tone}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border p-4">
              <svg viewBox="0 0 300 100" className="h-24 w-full sm:h-32" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 80 C40 70 60 85 100 60 S160 55 190 40 S250 30 300 12 L300 100 L0 100Z" fill="url(#hero-area)" />
                <path d="M0 80 C40 70 60 85 100 60 S160 55 190 40 S250 30 300 12" fill="none" stroke="var(--primary)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div className="space-y-2">
              {[85, 65].map((width) => (
                <div key={width} className="h-2.5 rounded bg-surface-strong" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-2 hidden animate-float items-center gap-3 rounded-xl border border-border bg-background p-3 pr-5 shadow-xl sm:flex lg:-left-8">
        <span className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
          <Check className="size-4" />
        </span>
        <div>
          <p className="text-xs font-semibold">Deployment successful</p>
          <p className="text-[11px] text-muted">Production &middot; 38s</p>
        </div>
      </div>
      <div className="absolute -right-2 -top-5 hidden items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs shadow-xl sm:flex lg:-right-6">
        <GitBranch className="size-3.5 text-primary" />
        <span className="text-muted">main</span>
        <span className="text-accent">+128</span>
      </div>
    </div>
  );
}

export function Hero({ category }: { category: string }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_0%,var(--primary-soft),transparent)]" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="animate-fade-up">
          <Badge tone="primary" className="mb-6 px-3 py-1 text-[13px]">
            {category}
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Engineering digital products <span className="text-primary">built to scale.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted sm:text-xl">
            Valorian Studio designs and builds custom software, web applications, SaaS platforms, mobile apps and AI-powered solutions for businesses that plan to grow.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              Start a Project
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/demos" variant="secondary" size="lg">
              Explore Our Work
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {['Production-grade engineering', 'Transparent delivery', 'Built for performance'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ProductMock />
      </div>
    </section>
  );
}
