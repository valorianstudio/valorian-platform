import Link from 'next/link';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * The navigation bar of a demo product's own marketing site (not Valorian's header). Server component: the mobile menu is a
 * native <details>, so it needs no JavaScript. It sticks just under Valorian's fixed header.
 */
export function DemoNavbar({ brand, links, cta }: { brand: ReactNode; links: readonly { label: string; href: string }[]; cta: { label: string; href: string } }) {
  return (
    <header className="sticky top-(--navbar-height) z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="#top" className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
          {brand}
        </Link>
        <nav aria-label="Demo site" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={cta.href} className="inline-flex h-9 items-center rounded-lg bg-[var(--demo-accent,#2563eb)] px-4 text-sm font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
            {cta.label}
          </a>
          <details className="group relative md:hidden">
            <summary aria-label="Menu" className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-slate-200 text-slate-700 marker:hidden focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)] [&::-webkit-details-marker]:hidden">
              <Menu className="size-4" aria-hidden />
            </summary>
            <nav aria-label="Demo site menu" className="absolute right-0 top-11 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
