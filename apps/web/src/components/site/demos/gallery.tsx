'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SmartImage } from '@/components/ui/smart-image';
import { cn } from '@/lib/cn';

interface Shot {
  id: string;
  url: string;
  altText: string;
  caption: string | null;
}

export function Gallery({ shots, variant }: { shots: Shot[]; variant: 'web' | 'phone' }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = index !== null;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  function show(next: number) {
    setIndex((next + shots.length) % shots.length);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (index === null) return;
    if (event.key === 'ArrowRight') show(index + 1);
    if (event.key === 'ArrowLeft') show(index - 1);
  }

  const current = index === null ? null : shots[index];
  const phone = variant === 'phone';

  return (
    <>
      <ul className={cn(phone ? '-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4' : 'grid gap-4 sm:grid-cols-2')}>
        {shots.map((shot, i) => (
          <li key={shot.id} className={cn(phone && 'w-44 shrink-0 snap-start sm:w-auto')}>
            <figure>
              <button
                type="button"
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setIndex(i);
                }}
                aria-label={`Enlarge: ${shot.altText}`}
                className={cn(
                  'block w-full overflow-hidden border border-border bg-surface transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-lg',
                  phone ? 'aspect-[9/19.5] rounded-[1.75rem] border-4 border-foreground/80' : 'aspect-[16/10] rounded-xl',
                )}
              >
                <SmartImage src={shot.url} alt={shot.altText} width={phone ? 360 : 960} height={phone ? 780 : 600} sizes={phone ? '176px' : '(min-width: 640px) 45vw, 100vw'} retry={false} className="size-full object-cover object-top" />
              </button>
              {shot.caption && <figcaption className="mt-2 text-sm text-muted">{shot.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onKeyDown={onKeyDown}
        onClose={() => {
          setIndex(null);
          opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) setIndex(null);
        }}
        aria-label="Screenshot viewer"
        className="m-auto max-h-[92vh] w-[calc(100%-1.5rem)] max-w-5xl overflow-hidden rounded-2xl border border-border bg-background p-0 text-foreground backdrop:bg-foreground/70"
      >
        {current && (
          <div className="relative flex max-h-[92vh] flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <p className="min-w-0 truncate text-sm text-muted">{current.caption ?? current.altText}</p>
              <button type="button" onClick={() => setIndex(null)} aria-label="Close" className="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-surface-strong">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-surface p-3">
              <SmartImage src={current.url} alt={current.altText} width={1600} height={1000} sizes="(min-width: 1024px) 960px, 100vw" className="h-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain" />
            </div>
            {shots.length > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <button type="button" onClick={() => show((index ?? 0) - 1)} aria-label="Previous screenshot" className="grid size-10 place-items-center rounded-lg hover:bg-surface-strong">
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <span className="text-sm text-muted">{(index ?? 0) + 1} / {shots.length}</span>
                <button type="button" onClick={() => show((index ?? 0) + 1)} aria-label="Next screenshot" className="grid size-10 place-items-center rounded-lg hover:bg-surface-strong">
                  <ChevronRight className="size-5" aria-hidden />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
