'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/data/clothing/catalog';
import type { Product } from '@/data/clothing/catalog';
import { GarmentArt } from './garment-art';

const TAG: Record<NonNullable<Product['tag']>, string> = {
  New: 'bg-[var(--demo-accent)] text-white',
  Bestseller: 'bg-white text-[color:var(--demo-accent)] ring-1 ring-inset ring-[color:var(--demo-accent-ring)]',
  Limited: 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]',
  Sale: 'bg-[var(--demo-good)] text-[color:var(--demo-accent)]',
};

/**
 * A product in a grid: the garment, its tag, name, price and rating, with a colour choice that changes the garment in place.
 * `onOpen` makes the whole card a button. Used by the storefront, the landing page showcase and the mobile app.
 */
export function ProductCard({ product, onOpen, colourIndex = 0, onColour, index = 0, className }: { product: Product; onOpen?: () => void; colourIndex?: number; onColour?: (i: number) => void; index?: number; className?: string }) {
  const colour = product.colours[colourIndex] ?? product.colours[0];
  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--demo-accent-soft)] transition-transform duration-500 ease-out group-hover:scale-[1.02]">
        <GarmentArt art={product.art} colour={colour.hex === '#111111' ? '#2b2b2b' : colour.hex} accent={colour.hex === '#111111' || colour.hex === '#1E2A44' || colour.hex === '#4A4A4A' ? '#ffffff' : '#111111'} label={`${product.name} in ${colour.name}`} className="size-full p-6" />
        {product.tag && <span className={cn('absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold', TAG[product.tag])}>{product.tag}</span>}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
          <p className="truncate text-xs text-slate-500">{product.type}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold tabular-nums text-slate-900">{formatPrice(product.price)}</p>
          {product.was && <p className="text-xs tabular-nums text-slate-400 line-through">{formatPrice(product.was)}</p>}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
          <Star className="size-3 fill-[color:var(--demo-good)] text-[color:var(--demo-good)]" aria-hidden /> {product.rating} <span className="text-slate-400">({product.reviews})</span>
        </span>
        {onColour && (
          <span role="group" aria-label="Colour" className="flex gap-1">
            {product.colours.map((c, i) => (
              <button
                key={c.name}
                type="button"
                aria-label={`${c.name}`}
                aria-pressed={i === colourIndex}
                onClick={(event) => {
                  event.stopPropagation();
                  onColour(i);
                }}
                className={cn('size-3.5 rounded-full ring-1 ring-inset ring-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', i === colourIndex && 'ring-2 ring-[color:var(--demo-accent)] ring-offset-1')}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </span>
        )}
      </div>
    </>
  );
  const frame = cn('demo-rise group block w-full text-left', className);
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cn(frame, 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--demo-accent)]')} style={{ ['--i' as string]: index % 8 }}>
      {body}
    </button>
  ) : (
    <div className={frame} style={{ ['--i' as string]: index % 8 }}>
      {body}
    </div>
  );
}
