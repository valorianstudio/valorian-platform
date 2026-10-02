'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

export const ESTIMATOR_SECTIONS = [
  { slug: 'types', label: 'Project types' },
  { slug: 'features', label: 'Features' },
  { slug: 'categories', label: 'Categories' },
  { slug: 'integrations', label: 'Integrations' },
  { slug: 'complexity', label: 'Complexity' },
  { slug: 'rules', label: 'Pricing rules' },
  { slug: 'settings', label: 'Settings' },
] as const;

export function EstimatorNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Estimator sections" className="-mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-border px-1">
      {ESTIMATOR_SECTIONS.map((section) => {
        const href = `/admin/estimator/${section.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={section.slug}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-primary' : 'text-muted hover:text-foreground',
            )}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
