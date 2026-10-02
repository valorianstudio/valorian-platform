'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';
import type { ClientEventType } from '@/lib/analytics';

const ENTITY_EVENTS: [RegExp, ClientEventType][] = [
  [/^\/demos\/[a-z0-9-]+$/, 'DEMO_VIEW'],
  [/^\/services\/[a-z0-9-]+$/, 'SERVICE_VIEW'],
  [/^\/solutions\/[a-z0-9-]+$/, 'SOLUTION_VIEW'],
  [/^\/case-studies\/[a-z0-9-]+$/, 'CASE_STUDY_VIEW'],
  [/^\/insights\/[a-z0-9-]+$/, 'ARTICLE_VIEW'],
];

/** Page views plus click tracking for calls to action. Renders nothing. */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    const path = pathname.replace(/\/+$/, '') || '/';
    track({ type: 'PAGE_VIEW', path });
    const entity = ENTITY_EVENTS.find(([pattern]) => pattern.test(path));
    if (entity) track({ type: entity[1], path });
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';
      const explicit = anchor.getAttribute('data-track');
      if (explicit && /^[a-z0-9-]+$/.test(explicit)) return track({ type: 'CTA_CLICK', cta: explicit });
      if (/^https:\/\/wa\.me\//.test(href)) return track({ type: 'WHATSAPP_CLICK' });
      if (href.startsWith('/estimate')) return track({ type: 'CTA_CLICK', cta: 'estimate' });
      if (href.startsWith('/contact')) return track({ type: 'CTA_CLICK', cta: 'contact' });
    }
    document.addEventListener('click', onClick, { passive: true });
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
