'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface BrowserItem {
  slug: string;
  sector: string;
  platforms: string[];
}

const PLATFORMS = ['Landing Page', 'Website', 'Mobile App'] as const;

/**
 * The compact filter above the demo grid: an industry row and three platform checkboxes. The cards are rendered on the server and passed
 * in, so every demo is in the HTML and the filter only decides which ones are shown. A demo shows when it matches the industry and offers
 * at least one of the ticked platforms.
 */
export function DemoBrowser({ items, cards, sectors, total }: { items: BrowserItem[]; cards: Record<string, ReactNode>; sectors: string[]; total: number }) {
  const [sector, setSector] = useState('All');
  const [platforms, setPlatforms] = useState<string[]>([...PLATFORMS]);

  const visible = items.filter((item) => (sector === 'All' || item.sector === sector) && item.platforms.some((platform) => platforms.includes(platform)));

  function togglePlatform(platform: string) {
    setPlatforms((current) => (current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]));
  }

  function reset() {
    setSector('All');
    setPlatforms([...PLATFORMS]);
  }

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p id="demo-industry-label" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Industry</p>
            <div role="group" aria-labelledby="demo-industry-label" className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
              {['All', ...sectors].map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={sector === item}
                  onClick={() => setSector(item)}
                  className={cn(
                    'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    sector === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-primary hover:border-primary',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <p id="demo-platform-label" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Platform</p>
            <div role="group" aria-labelledby="demo-platform-label" className="mt-2 flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => {
                const on = platforms.includes(platform);
                return (
                  <label
                    key={platform}
                    className={cn(
                      'relative inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary',
                      on ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-background text-muted',
                    )}
                  >
                    <input type="checkbox" checked={on} onChange={() => togglePlatform(platform)} className="sr-only" />
                    <span aria-hidden className={cn('grid size-4 place-items-center rounded border', on ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background')}>
                      {on && <Check className="size-3" />}
                    </span>
                    {platform}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        Showing {visible.length} of {total} demos
      </p>

      {visible.length > 0 ? (
        <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <li key={item.slug}>{cards[item.slug]}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-muted">No demos match these filters.</p>
          <button type="button" onClick={reset} className="mt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
