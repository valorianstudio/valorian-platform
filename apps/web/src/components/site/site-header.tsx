'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ButtonLink } from '@/components/ui/button';
import type { CtaLink, NavItem } from '@/lib/cms-types';
import { cn } from '@/lib/cn';
import { Wordmark } from './wordmark';

/**
 * Site header. Height comes from the `--navbar-height` CSS variable (globals.css), which the page offset, hero overlap
 * and mobile panel all share, so changing it in one place keeps every page below the navigation.
 *
 * The mobile panel and its overlay are siblings of <header>, not children: a `backdrop-filter` on the header makes it
 * the containing block for any `position: fixed` descendant, which collapsed the panel to nothing while the menu was open.
 */
export function SiteHeader({ brandName, items, cta }: { brandName: string; items: NavItem[]; cta: CtaLink | null }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const open = openAt === pathname;
  const links = items.map((item) => ({ href: item.url, label: item.label, newTab: item.openInNewTab }));
  const ctaLabel = cta?.label ?? 'Start a Project';
  const ctaUrl = cta?.url ?? '/contact';
  const close = useCallback(() => setOpenAt(null), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll lock while the menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes (and hands focus back to the toggle); growing into the desktop layout closes too.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenAt(null);
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onChange = (event: MediaQueryListEvent) => event.matches && setOpenAt(null);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onChange);
    };
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : href.startsWith('/') && pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300',
          scrolled || open ? 'border-[rgb(52_70_72/0.1)] bg-[#f8f4ee]/90 shadow-[0_6px_24px_-16px_rgb(52_70_72/0.35)] backdrop-blur-xl' : 'border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-(--navbar-height) w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Wordmark name={brandName} priority />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      aria-current={active ? 'page' : undefined}
                      className={cn('relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200', active ? 'bg-[rgb(52_70_72/0.08)] text-primary' : 'text-muted hover:bg-[rgb(52_70_72/0.05)] hover:text-primary')}
                    >
                      {link.label}
                      <span aria-hidden className={cn('absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-coral transition-opacity duration-200', active ? 'opacity-100' : 'opacity-0')} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ButtonLink href={ctaUrl} size="sm" className="hidden sm:inline-flex">
              {ctaLabel}
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpenAt(open ? null : pathname)}
              className="relative grid size-11 shrink-0 place-items-center rounded-full border border-[rgb(52_70_72/0.2)] bg-card/70 text-primary transition-colors hover:bg-card lg:hidden"
            >
              <span aria-hidden className="relative block h-3.5 w-5">
                <span className={cn('absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300', open ? 'top-1.5 rotate-45' : 'top-0')} />
                <span className={cn('absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-opacity duration-200', open && 'opacity-0')} />
                <span className={cn('absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300', open ? 'top-1.5 -rotate-45' : 'top-3')} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: dimmed overlay (click to close) under a panel that slides from beneath the header. */}
      <div id="mobile-menu" aria-hidden={!open} inert={!open} className={cn('fixed inset-0 z-40 transition-[visibility] duration-0 lg:hidden', open ? 'visible' : 'pointer-events-none invisible delay-300')}>
        <button type="button" tabIndex={-1} aria-label="Close menu" onClick={close} className={cn('absolute inset-0 bg-slate/45 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')} />
        <div
          className={cn(
            'absolute inset-x-0 top-(--navbar-height) max-h-[calc(100dvh-var(--navbar-height))] overflow-y-auto overscroll-contain rounded-b-3xl border-b border-border bg-[#f8f4ee] shadow-[var(--shadow-float)] transition-[opacity,transform] duration-300 ease-out',
            open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
          )}
        >
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-5 pb-6 pt-2 sm:px-8">
            {links.map((link, index) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={close}
                {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-current={isActive(link.href) ? 'page' : undefined}
                style={{ transitionDelay: open ? `${index * 35}ms` : '0ms' }}
                className={cn(
                  'display flex min-h-14 items-center justify-between border-b border-[rgb(52_70_72/0.1)] py-3.5 text-xl transition-[color,opacity,transform] duration-300 sm:text-2xl',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                  isActive(link.href) ? 'text-primary' : 'text-muted hover:text-primary',
                )}
              >
                {link.label}
                {isActive(link.href) && <span aria-hidden className="size-2 rounded-full bg-coral" />}
              </Link>
            ))}
            <ButtonLink href={ctaUrl} onClick={close} size="lg" className="mt-6">
              {ctaLabel}
            </ButtonLink>
          </nav>
        </div>
      </div>
    </>
  );
}
