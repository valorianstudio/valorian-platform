import Link from 'next/link';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The navigation bar of a demo product's own marketing site (not Valorian's header). Server component: the mobile menu is a
 * native <details>, so it needs no JavaScript. By default it sticks just under Valorian's fixed header; `standalone` is for
 * full-page previews with no Valorian header: it sticks to the top and leaves room for the floating Back button.
 */
export function DemoNavbar({ brand, links, cta, standalone = false }: { brand: ReactNode; links: readonly { label: string; href: string }[]; cta: { label: string; href: string }; standalone?: boolean }) {
  return (
    <header className={cn('sticky z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur', standalone ? 'top-0' : 'top-(--navbar-height)')}>
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="#top" className={cn('flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--demo-accent,#2563eb)]', standalone && 'ml-[5.25rem] min-[1424px]:ml-0')}>
          {brand}
        </Link>
        <nav aria-label="Demo site" className={cn('hidden items-center gap-1', standalone ? 'lg:flex' : 'md:flex')}>
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={cta.href} className="hidden h-9 items-center rounded-lg bg-[var(--demo-accent,#2563eb)] px-4 text-sm font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)] min-[420px]:inline-flex">
            {cta.label}
          </a>
          <details className={cn('group relative', standalone ? 'lg:hidden' : 'md:hidden')}>
            <summary aria-label="Menu" className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-slate-200 text-slate-700 marker:hidden focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)] [&::-webkit-details-marker]:hidden">
              <Menu className="size-4" aria-hidden />
            </summary>
            <nav aria-label="Demo site menu" className="absolute right-0 top-11 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {link.label}
                </a>
              ))}
              <a href={cta.href} className="mt-1 block rounded-lg bg-[var(--demo-accent,#2563eb)] px-3 py-2.5 text-center text-sm font-semibold text-white min-[420px]:hidden">
                {cta.label}
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
