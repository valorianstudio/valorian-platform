'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import type { CtaLink, NavItem } from '@/lib/cms-types';
import { cn } from '@/lib/cn';
import { Wordmark } from './wordmark';

export function SiteHeader({ brandName, items, cta }: { brandName: string; items: NavItem[]; cta: CtaLink | null }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = openAt === pathname;
  const links = items.map((item) => ({ href: item.url, label: item.label, newTab: item.openInNewTab }));
  const ctaLabel = cta?.label ?? 'Start a Project';
  const ctaUrl = cta?.url ?? '/contact';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenAt(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : href.startsWith('/') && pathname.startsWith(href));

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300',
        scrolled || open ? 'border-[rgb(52_70_72/0.1)] bg-[#f8f4ee]/85 shadow-[0_6px_24px_-16px_rgb(52_70_72/0.35)] backdrop-blur-xl' : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-[4.5rem]">
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
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenAt(open ? null : pathname)}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-[rgb(52_70_72/0.2)] bg-card/70 text-primary transition-colors hover:bg-card lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          'fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-[#f8f4ee] transition-[opacity,transform] duration-300 ease-out lg:hidden',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8">
          {links.map((link, index) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-current={isActive(link.href) ? 'page' : undefined}
              style={{ transitionDelay: open ? `${index * 35}ms` : '0ms' }}
              className={cn(
                'display flex items-center justify-between border-b border-[rgb(52_70_72/0.1)] py-4 text-2xl transition-[color,opacity,transform] duration-300',
                open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                isActive(link.href) ? 'text-primary' : 'text-muted hover:text-primary',
              )}
            >
              {link.label}
              {isActive(link.href) && <span aria-hidden className="size-2 rounded-full bg-coral" />}
            </Link>
          ))}
          <ButtonLink href={ctaUrl} size="lg" className="mt-8">
            {ctaLabel}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
