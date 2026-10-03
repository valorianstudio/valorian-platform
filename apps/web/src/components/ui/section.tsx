import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'default' | 'surface';
  children: ReactNode;
}

export function Section({ id, eyebrow, title, description, tone = 'default', children }: SectionProps) {
  return (
    <section id={id} className={cn('relative py-20 sm:py-24 lg:py-32', tone === 'surface' && 'bg-surface')}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {(eyebrow || title) && (
          <div data-reveal className="mb-12 max-w-2xl sm:mb-16">
            {eyebrow && (
              <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                <span aria-hidden className="h-px w-8 bg-accent/60" />
                {eyebrow}
              </p>
            )}
            {title && <h2 className="display text-balance text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.08]">{title}</h2>}
            {description && <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
