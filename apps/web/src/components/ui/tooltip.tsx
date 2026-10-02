import type { ReactNode } from 'react';

export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="group relative block">
      {children}
      <span role="tooltip" className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}
