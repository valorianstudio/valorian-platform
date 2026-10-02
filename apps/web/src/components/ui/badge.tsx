import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const tones = {
  neutral: 'bg-surface-strong text-muted',
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent',
  danger: 'bg-danger-soft text-danger',
} as const;

export function Badge({ tone = 'neutral', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)} {...props} />;
}
