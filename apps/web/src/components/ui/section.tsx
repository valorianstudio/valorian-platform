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
    <section id={id} className={cn('py-16 sm:py-20 lg:py-24', tone === 'surface' && 'border-y border-border bg-surface')}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {(eyebrow || title) && (
          <div className="mb-10 max-w-2xl sm:mb-14">
            {eyebrow && <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p>}
            {title && <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>}
            {description && <p className="mt-4 text-pretty text-lg text-muted">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
