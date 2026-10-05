'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One shared IntersectionObserver reveals every [data-reveal] element as it scrolls into view.
 * Sections stay Server Components; they only add the attribute.
 *
 * Page content streams in after this component has mounted (the homepage waits on the CMS), so a one-off scan is not enough:
 * a MutationObserver picks up every [data-reveal] element added later, and the scan runs again after each navigation.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)').forEach((el) => el.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    // Observing an element that is already observed is a no-op, so rescanning the whole page is safe.
    const scan = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)').forEach((el) => observer.observe(el));
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
