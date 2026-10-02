'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const base = useId();

  return (
    <div>
      <div role="tablist" className="-mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-border px-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-selected={active === item.id}
            aria-controls={`${base}-panel-${item.id}`}
            onClick={() => setActive(item.id)}
            className={cn(
              'relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors',
              active === item.id ? 'text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-primary' : 'text-muted hover:text-foreground',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div key={item.id} role="tabpanel" id={`${base}-panel-${item.id}`} aria-labelledby={`${base}-tab-${item.id}`} hidden={active !== item.id} className="space-y-5">
          {item.content}
        </div>
      ))}
    </div>
  );
}
