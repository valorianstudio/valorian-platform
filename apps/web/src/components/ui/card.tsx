import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Static warm-white surface. Use the `card-lift` class on interactive cards for the hover elevation. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]', className)} {...props} />;
}
