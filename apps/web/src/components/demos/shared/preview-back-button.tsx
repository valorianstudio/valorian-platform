'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * The only Valorian element on a standalone landing-page preview: a floating "Back" pill. It returns to the page the visitor came
 * from when that was on this site, and otherwise to the demo's overview (the parent path), so it works from a shared or bookmarked link.
 */
export function PreviewBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const fallback = pathname.split('/').slice(0, -1).join('/') || '/demos';

  return (
    <Link
      href={fallback}
      onClick={(event) => {
        event.preventDefault();
        let sameSite = false;
        try {
          sameSite = Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin;
        } catch {
          sameSite = false;
        }
        if (sameSite && window.history.length > 1) router.back();
        else router.push(fallback);
      }}
      className="fixed left-3 top-2.5 z-[100] inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-900/90 px-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <ArrowLeft className="size-4" aria-hidden /> Back
    </Link>
  );
}
