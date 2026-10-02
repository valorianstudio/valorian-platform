'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export const menuItemClass = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-strong';

export function Dropdown({ trigger, label, children }: { trigger: ReactNode; label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex items-center rounded-lg">
        {trigger}
      </button>
      {open && (
        <div role="menu" onClick={() => setOpen(false)} className="absolute right-0 z-50 mt-2 w-56 animate-fade-up rounded-xl border border-border bg-background p-1.5 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}
