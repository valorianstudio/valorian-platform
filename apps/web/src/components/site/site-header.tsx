'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ButtonLink } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/site';
import { cn } from '@/lib/cn';
import { Wordmark } from './wordmark';

export function SiteHeader({ brandName }: { brandName: string }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = openAt === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-200',
        scrolled || open ? 'border-border bg-background/90 backdrop-blur-md' : 'border-transparent bg-background/0',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Wordmark name={brandName} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground',
                    isActive(link.href) ? 'text-foreground' : 'text-muted',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Start a Project
          </ButtonLink>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenAt(open ? null : pathname)}
            className="grid size-10 place-items-center rounded-lg text-foreground hover:bg-surface-strong lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-6 sm:px-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'rounded-xl px-4 py-3.5 text-lg font-medium transition-colors hover:bg-surface-strong',
                  isActive(link.href) ? 'bg-surface text-foreground' : 'text-muted',
                )}
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink href="/contact" size="lg" className="mt-4">
              Start a Project
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
