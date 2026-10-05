import { cn } from '@/lib/cn';

/** Eyebrow, heading and intro for a section of a demo page. `tone="dark"` is for navy backgrounds. */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  as: Heading = 'h2',
  id,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className={cn('mb-3 text-xs font-semibold uppercase tracking-[0.14em]', dark ? 'text-[color:var(--demo-good-light,#6ee7b7)]' : 'text-[color:var(--demo-accent,#2563eb)]')}>{eyebrow}</p>}
      <Heading id={id} className={cn('text-balance text-3xl font-semibold tracking-tight sm:text-4xl', dark ? 'text-white' : 'text-slate-900')}>{title}</Heading>
      {description && <p className={cn('mt-4 text-pretty text-base leading-relaxed sm:text-lg', dark ? 'text-slate-300' : 'text-slate-600')}>{description}</p>}
    </div>
  );
}
