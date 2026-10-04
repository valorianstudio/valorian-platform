'use client';

import { useEffect, useId, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Globe, Smartphone } from 'lucide-react';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

interface Panel {
  type: 'WEBSITE' | 'MOBILE';
  label: string;
  content: ReactNode;
}

export function PlatformTabs({ panels, initial }: { panels: Panel[]; initial: Panel['type'] }) {
  const [active, setActive] = useState(initial);
  const base = useId();

  // Deep links (?platform=mobile) are read on the client, so the page never depends on the query string and can be cached.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('platform') === 'mobile' && panels.some((panel) => panel.type === 'MOBILE')) setActive('MOBILE');
  }, [panels]);

  function select(type: Panel['type']) {
    if (type !== active) track({ type: 'DEMO_PLATFORM_SELECT', platform: type });
    setActive(type);
    const url = new URL(window.location.href);
    url.searchParams.set('platform', type === 'MOBILE' ? 'mobile' : 'website');
    window.history.replaceState(null, '', url);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const index = panels.findIndex((p) => p.type === active);
    const next = panels[(index + (event.key === 'ArrowRight' ? 1 : -1) + panels.length) % panels.length];
    select(next.type);
    document.getElementById(`${base}-tab-${next.type}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Platform" onKeyDown={onKeyDown} className="inline-flex rounded-xl border border-border bg-surface p-1">
        {panels.map((panel) => {
          const selected = panel.type === active;
          const Icon = panel.type === 'MOBILE' ? Smartphone : Globe;
          return (
            <button
              key={panel.type}
              type="button"
              role="tab"
              id={`${base}-tab-${panel.type}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${panel.type}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(panel.type)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:px-5',
                selected ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {panel.label}
            </button>
          );
        })}
      </div>
      {panels.map((panel) => (
        <div
          key={panel.type}
          role="tabpanel"
          id={`${base}-panel-${panel.type}`}
          aria-labelledby={`${base}-tab-${panel.type}`}
          hidden={panel.type !== active}
          className="mt-8 animate-fade-up"
        >
          {panel.content}
        </div>
      ))}
    </div>
  );
}
