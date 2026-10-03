'use client';

import { useEffect, useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';

const linkClass = 'inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-border px-3 text-sm font-medium text-muted transition-colors hover:text-foreground';

/** Plain share links plus Web Share / copy. No third-party scripts. `url` must be absolute. */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare('share' in navigator), []);

  const targets = [
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`],
    ['X', `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the share links remain usable */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-muted">Share</span>
      {targets.map(([label, href]) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
        </a>
      ))}
      {canShare && (
        <button type="button" onClick={() => navigator.share({ title, url }).catch(() => undefined)} className={linkClass}>
          <Share2 className="size-4" aria-hidden /> More
        </button>
      )}
      <button type="button" onClick={copy} className={linkClass}>
        {copied ? <Check className="size-4 text-accent" aria-hidden /> : <Link2 className="size-4" aria-hidden />} {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}
