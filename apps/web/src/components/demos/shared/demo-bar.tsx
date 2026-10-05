import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface DemoBarExperience {
  key: string;
  label: string;
  href: string;
}

/**
 * Valorian's own strip above every interactive demo: says it is a showcase, lets visitors hop between the demo's experiences
 * (overview, landing page, website, mobile app) and keeps a way to start a project one click away. Server component.
 */
export function DemoBar({ title, slug, overviewHref, experiences, active }: { title: string; slug: string; overviewHref: string; experiences: DemoBarExperience[]; active: string }) {
  const items: DemoBarExperience[] = [{ key: 'overview', label: 'Overview', href: overviewHref }, ...experiences];
  return (
    <div className="border-b border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2.5 sm:px-8">
        <p className="min-w-0 text-xs">
          <span className="font-semibold text-white">{title}</span>
          <span className="text-slate-400"> · Interactive demo by Valorian Studio</span>
        </p>
        <nav aria-label={`${title} experiences`} className="-mx-1 order-last flex w-full min-w-0 items-center gap-1 overflow-x-auto px-1 sm:order-none sm:w-auto sm:flex-1 sm:justify-center">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.key === active ? 'page' : undefined}
              className={cn('shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400', item.key === active ? 'bg-white text-slate-900' : 'text-slate-300 hover:bg-white/10 hover:text-white')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={`/contact?demo=${slug}`} className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--demo-good-light,#6ee7b7)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">
          Order a system like this <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
