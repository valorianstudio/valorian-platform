'use client';

import { ArrowRight, Check, ChevronRight, Heart, Minus, Plus, Search, ShoppingBag, Star, Truck, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Pill, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { DEPARTMENTS, PRODUCTS, REVIEWS, TRACKING, formatPrice, productById } from '@/data/clothing/catalog';
import type { Department } from '@/data/clothing/catalog';
import { cn } from '@/lib/cn';
import { GarmentArt } from './garment-art';
import { ProductCard } from './product-card';

export interface CartLine {
  key: string;
  id: string;
  size: string;
  colour: string;
  qty: number;
}

export type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'profile';

const SORTS = ['Featured', 'Price: low to high', 'Price: high to low', 'Best rated'] as const;

/** One place for cart maths, so the bag, the checkout and the mobile app agree on totals. */
export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + productById(l.id).price * l.qty, 0);
  const shipping = subtotal >= 200 || subtotal === 0 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax, count: lines.reduce((s, l) => s + l.qty, 0) };
}

/* ---------------------------------- Shell ---------------------------------- */

function StoreHeader({ page, go, count }: { page: Page; go: (p: Page, dept?: Department | 'All') => void; count: number }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <button type="button" onClick={() => go('home')} className="text-sm font-semibold tracking-[0.2em] text-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          MAISON VALE
        </button>
        <nav aria-label="Store" className="hidden items-center gap-5 md:flex">
          {(['Men', 'Women', 'Accessories'] as const).map((d) => (
            <button key={d} type="button" onClick={() => go('shop', d)} className={cn('text-xs font-medium uppercase tracking-wide transition-colors hover:text-[color:var(--demo-accent)]', page === 'shop' ? 'text-slate-500' : 'text-slate-700')}>
              {d}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go('profile')} aria-label="Account" className={cn('grid size-9 place-items-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', page === 'profile' && 'bg-slate-100')}>
            <User className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={() => go('cart')} aria-label={`Bag, ${count} items`} className="relative grid size-9 place-items-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
            <ShoppingBag className="size-4" aria-hidden />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-[var(--demo-good)] px-1 text-[9px] font-bold leading-4 text-[color:var(--demo-accent)]">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- Pages ---------------------------------- */

function HomePage({ go, onOpen, onAdd }: { go: (p: Page, d?: Department | 'All') => void; onOpen: (id: string) => void; onAdd: (id: string) => void }) {
  const featured = PRODUCTS.filter((p) => p.tag === 'Bestseller' || p.tag === 'New').slice(0, 4);
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--demo-accent-soft)]">
        <div className="grid items-center gap-6 px-5 py-10 sm:px-8 sm:py-14 md:grid-cols-2">
          <div className="demo-rise">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">Autumn Edit</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-[color:var(--demo-accent)] sm:text-4xl">Layers made to last the season</h2>
            <p className="mt-3 max-w-sm text-sm text-slate-700">Cashmere, Italian wool and considered tailoring. Free express delivery over $200.</p>
            <button type="button" onClick={() => go('shop', 'All')} className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--demo-accent)] px-5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
              Shop the edit <ArrowRight className="size-3.5" aria-hidden />
            </button>
          </div>
          <div className="demo-rise mx-auto w-full max-w-[16rem]" style={{ ['--i' as string]: 2 }}>
            <GarmentArt art="coat" colour="#C19A6B" accent="#111111" label="Tailored Wool Coat in camel" className="aspect-square w-full" />
          </div>
        </div>
      </section>
      <section className="px-5 py-8 sm:px-8">
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Shop by department</h3>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {DEPARTMENTS.map((d) => (
            <button key={d} type="button" onClick={() => go('shop', d)} className="group flex flex-col items-start rounded-xl border border-slate-200 bg-white p-4 text-left transition-[border-color,box-shadow] hover:border-[color:var(--demo-accent-ring)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <span className="text-sm font-semibold text-slate-900">{d}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 group-hover:text-[color:var(--demo-accent)]">
                Shop <ChevronRight className="size-3" aria-hidden />
              </span>
            </button>
          ))}
        </div>
      </section>
      <section className="px-5 pb-10 sm:px-8">
        <h3 className="text-lg font-semibold text-slate-900">Featured pieces</h3>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4">
          {featured.map((p, i) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} index={i} onOpen={() => onOpen(p.id)} />
              <button type="button" aria-label={`Add ${p.name} to bag`} onClick={() => onAdd(p.id)} className="absolute bottom-[4.5rem] right-2 grid size-8 place-items-center rounded-full bg-[var(--demo-accent)] text-white opacity-0 shadow-md transition-opacity duration-200 hover:bg-slate-800 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)] group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                <Plus className="size-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ShopPage({ dept, setDept, onOpen }: { dept: Department | 'All'; setDept: (d: Department | 'All') => void; onOpen: (id: string) => void }) {
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Featured');
  const [maxPrice, setMaxPrice] = useState<'Any' | '$150' | '$300' | '$500'>('Any');
  const [query, setQuery] = useState('');
  const [colourOf, setColourOf] = useState<Record<string, number>>({});
  const list = useMemo(() => {
    const cap = maxPrice === 'Any' ? Infinity : Number(maxPrice.slice(1));
    const filtered = PRODUCTS.filter((p) => (dept === 'All' || p.department === dept) && p.price <= cap && p.name.toLowerCase().includes(query.trim().toLowerCase()));
    const sorted = [...filtered];
    if (sort === 'Price: low to high') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'Best rated') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [dept, maxPrice, query, sort]);

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Shop</p>
          <h2 className="text-xl font-semibold text-slate-900">{dept === 'All' ? 'All products' : dept}</h2>
          <p className="text-xs text-slate-500">{list.length} pieces</p>
        </div>
        <Tabs label="Department" value={dept} onChange={setDept} tabs={(['All', ...DEPARTMENTS] as const).map((d) => ({ id: d, label: d }))} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-40 flex-1 sm:max-w-xs">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="h-9 w-full rounded-full border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <SelectMenu label="Price" value={maxPrice} options={['Any', '$150', '$300', '$500'] as const} onChange={setMaxPrice} className="w-28" />
        <div className="ml-auto">
          <SelectMenu label="Sort" value={sort} options={SORTS} onChange={setSort} className="w-44" align="right" />
        </div>
      </div>
      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">Nothing matches. Try a wider price range.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} index={i} onOpen={() => onOpen(p.id)} colourIndex={colourOf[p.id] ?? 0} onColour={(c) => setColourOf((s) => ({ ...s, [p.id]: c }))} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductPage({ id, onAdd, go }: { id: string; onAdd: (line: Omit<CartLine, 'key' | 'qty'>, qty: number) => void; go: (p: Page) => void }) {
  const product = productById(id);
  const [colour, setColour] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<'details' | 'reviews'>('details');
  const reviews = REVIEWS.filter((r) => r.product === product.id);
  const c = product.colours[colour];
  const add = () => {
    if (!size) return;
    onAdd({ id: product.id, size, colour: c.name }, qty);
    setAdded(true);
  };
  return (
    <div className="px-4 py-5 sm:px-6">
      <button type="button" onClick={() => go('shop')} className="text-xs text-slate-500 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
        ← Back to shop
      </button>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="demo-slide rounded-2xl bg-[var(--demo-accent-soft)] p-6">
            <GarmentArt key={c.name} art={product.art} colour={c.hex === '#111111' ? '#2b2b2b' : c.hex} accent={c.hex === '#111111' || c.hex === '#1E2A44' || c.hex === '#4A4A4A' ? '#ffffff' : '#111111'} label={`${product.name} in ${c.name}`} className="aspect-[4/5] w-full" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.colours.map((cc, i) => (
              <button key={cc.name} type="button" onClick={() => setColour(i)} aria-pressed={i === colour} className={cn('rounded-xl bg-[var(--demo-accent-soft)] p-2 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', i === colour && 'ring-2 ring-[color:var(--demo-accent)]')}>
                <GarmentArt art={product.art} colour={cc.hex === '#111111' ? '#2b2b2b' : cc.hex} accent={cc.hex === '#111111' || cc.hex === '#1E2A44' || cc.hex === '#4A4A4A' ? '#ffffff' : '#111111'} label={cc.name} className="aspect-square w-full" />
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{product.department} · {product.collection}</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">{product.name}</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-semibold tabular-nums text-slate-900">{formatPrice(product.price)}</span>
            {product.was && <span className="text-sm tabular-nums text-slate-400 line-through">{formatPrice(product.was)}</span>}
          </div>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-600">
            <Star className="size-3.5 fill-[color:var(--demo-good)] text-[color:var(--demo-good)]" aria-hidden /> {product.rating} · {product.reviews} reviews
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-900">Colour: <span className="font-normal text-slate-600">{c.name}</span></p>
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-900">Size</p>
            <div role="radiogroup" aria-label="Size" className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => setSize(s)} className={cn('min-w-11 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', size === s ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent)] text-white' : 'border-slate-300 text-slate-800 hover:border-slate-900')}>
                  {s}
                </button>
              ))}
            </div>
            {!size && <p className="mt-2 text-[11px] text-slate-500">Select a size to add to bag.</p>}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-slate-300">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-9 place-items-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                <Minus className="size-3.5" aria-hidden />
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="grid size-9 place-items-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                <Plus className="size-3.5" aria-hidden />
              </button>
            </div>
            <button type="button" disabled={!size} onClick={add} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--demo-accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
              {added ? <><Check className="size-4" aria-hidden /> Added to bag</> : `Add to bag · ${formatPrice(product.price * qty)}`}
            </button>
            <button type="button" aria-label="Save to wishlist" className="grid size-11 place-items-center rounded-full border border-slate-300 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <Heart className="size-4" aria-hidden />
            </button>
          </div>
          {added && (
            <button type="button" onClick={() => go('cart')} className="demo-rise mt-3 text-xs font-semibold text-[color:var(--demo-accent)] underline underline-offset-4">
              View bag
            </button>
          )}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <Truck className="size-4" aria-hidden /> Free express delivery over $200 · Free returns within 30 days
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-5">
        <Tabs label="Product information" value={tab} onChange={setTab} tabs={[{ id: 'details', label: 'Details' }, { id: 'reviews', label: 'Reviews', count: reviews.length }]} />
        <div key={tab} className="demo-rise mt-4 text-sm text-slate-600">
          {tab === 'details' ? (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Type: {product.type}</li>
              <li>Available sizes: {product.sizes.join(', ')}</li>
              <li>Made with care, dry clean recommended.</li>
            </ul>
          ) : reviews.length ? (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id}>
                  <p className="flex items-center gap-1 text-xs font-medium text-slate-900">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <Star key={i} className="size-3 fill-[color:var(--demo-good)] text-[color:var(--demo-good)]" aria-hidden />
                    ))}
                    <span className="ml-2">{r.name}</span>
                    <span className="ml-auto font-normal text-slate-400">{r.date}</span>
                  </p>
                  <p className="mt-1">{r.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet. Be the first to share your fit.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CartPage({ lines, onQty, go }: { lines: CartLine[]; onQty: (key: string, qty: number) => void; go: (p: Page) => void }) {
  const t = cartTotals(lines);
  if (lines.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <ShoppingBag className="mx-auto size-10 text-slate-300" aria-hidden />
        <p className="mt-4 text-base font-semibold text-slate-900">Your bag is empty</p>
        <button type="button" onClick={() => go('shop')} className="mt-5 inline-flex h-10 items-center rounded-full bg-[var(--demo-accent)] px-5 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          Continue shopping
        </button>
      </div>
    );
  }
  return (
    <div className="grid gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
      <ul className="space-y-3">
        {lines.map((l, i) => {
          const p = productById(l.id);
          return (
            <li key={l.key} className="demo-rise flex gap-4 rounded-xl border border-slate-200 bg-white p-3" style={{ ['--i' as string]: i }}>
              <div className="w-20 shrink-0 rounded-lg bg-[var(--demo-accent-soft)] p-1.5">
                <GarmentArt art={p.art} colour={p.colours[0].hex === '#111111' ? '#2b2b2b' : p.colours[0].hex} label={p.name} className="aspect-square w-full" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      {l.colour} · {l.size}
                    </p>
                  </div>
                  <button type="button" aria-label={`Remove ${p.name}`} onClick={() => onQty(l.key, 0)} className="grid size-7 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-full border border-slate-300">
                    <button type="button" aria-label="Decrease" onClick={() => onQty(l.key, l.qty - 1)} className="grid size-7 place-items-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                      <Minus className="size-3" aria-hidden />
                    </button>
                    <span className="w-6 text-center text-xs font-semibold tabular-nums">{l.qty}</span>
                    <button type="button" aria-label="Increase" onClick={() => onQty(l.key, l.qty + 1)} className="grid size-7 place-items-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                      <Plus className="size-3" aria-hidden />
                    </button>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-slate-900">{formatPrice(p.price * l.qty)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <aside aria-label="Order summary" className="h-fit rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-20">
        <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600"><dt>Subtotal ({t.count} items)</dt><dd className="tabular-nums">{formatPrice(t.subtotal)}</dd></div>
          <div className="flex justify-between text-slate-600"><dt>Delivery</dt><dd className="tabular-nums">{t.shipping === 0 ? 'Free' : formatPrice(t.shipping)}</dd></div>
          <div className="flex justify-between text-slate-600"><dt>Tax (8%)</dt><dd className="tabular-nums">{formatPrice(t.tax)}</dd></div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900"><dt>Total</dt><dd className="tabular-nums">{formatPrice(t.total)}</dd></div>
        </dl>
        {t.subtotal < 200 && <p className="mt-3 text-xs text-[color:var(--demo-good-ink)]">Add {formatPrice(200 - t.subtotal)} more for free delivery.</p>}
        <button type="button" onClick={() => go('checkout')} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--demo-accent)] text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          Checkout
        </button>
      </aside>
    </div>
  );
}

function CheckoutPage({ lines, onDone }: { lines: CartLine[]; onDone: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [placed, setPlaced] = useState(false);
  const t = cartTotals(lines);
  if (placed) {
    return (
      <div className="demo-rise px-5 py-16 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Check className="size-6" aria-hidden /></span>
        <p className="mt-4 text-base font-semibold text-slate-900">Thank you. Your order is placed.</p>
        <p className="mt-1 text-xs text-slate-500">Order #10483 · a confirmation has been sent to your email.</p>
        <button type="button" onClick={onDone} className="mt-5 inline-flex h-10 items-center rounded-full bg-[var(--demo-accent)] px-5 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          Back to shop
        </button>
      </div>
    );
  }
  return (
    <div className="grid gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
      <form onSubmit={(e) => { e.preventDefault(); if (step === 1) setStep(2); else setPlaced(true); }} className="space-y-5">
        <Tabs label="Checkout step" value={String(step)} onChange={(v) => setStep(v === '1' ? 1 : 2)} tabs={[{ id: '1', label: '1. Delivery' }, { id: '2', label: '2. Payment' }]} />
        {step === 1 ? (
          <div className="demo-rise grid gap-3 sm:grid-cols-2">
            {[['First name', 'Hannah'], ['Last name', 'Lindqvist'], ['Address', '14 Harbour Street'], ['City', 'Stockholm'], ['Postcode', '111 22'], ['Email', 'hannah.l@mail.example']].map(([label, value]) => (
              <label key={label} className={cn('text-xs font-medium text-slate-700', label === 'Address' || label === 'Email' ? 'sm:col-span-2' : '')}>
                {label}
                <input defaultValue={value} required className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
              </label>
            ))}
          </div>
        ) : (
          <div className="demo-rise space-y-3">
            <label className="block text-xs font-medium text-slate-700">
              Card number
              <input defaultValue="4242 4242 4242 4242" inputMode="numeric" required className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium text-slate-700">Expiry<input defaultValue="08 / 28" required className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" /></label>
              <label className="text-xs font-medium text-slate-700">CVC<input defaultValue="123" required className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" /></label>
            </div>
            <p className="text-[11px] text-slate-500">Demo checkout: no payment is taken.</p>
          </div>
        )}
        <button type="submit" disabled={lines.length === 0} className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--demo-accent)] text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          {step === 1 ? 'Continue to payment' : `Place order · ${formatPrice(t.total)}`}
        </button>
      </form>
      <aside aria-label="Order summary" className="h-fit rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-900">{t.count} items</p>
        <ul className="mt-3 space-y-2 text-xs text-slate-600">
          {lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-2"><span className="truncate">{productById(l.id).name} × {l.qty}</span><span className="tabular-nums">{formatPrice(productById(l.id).price * l.qty)}</span></li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900"><span>Total</span><span className="tabular-nums">{formatPrice(t.total)}</span></p>
      </aside>
    </div>
  );
}

function ProfilePage({ go }: { go: (p: Page) => void }) {
  const [tab, setTab] = useState<'orders' | 'tracking' | 'wishlist'>('tracking');
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-[var(--demo-accent)] text-sm font-semibold text-white">HL</span>
        <div>
          <p className="text-base font-semibold text-slate-900">Hannah Lindqvist</p>
          <p className="text-xs text-slate-500">VIP member · 14 orders</p>
        </div>
        <button type="button" onClick={() => go('home')} className="ml-auto text-xs text-slate-500 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">Sign out</button>
      </div>
      <div className="mt-6">
        <Tabs label="Account" value={tab} onChange={setTab} tabs={[{ id: 'tracking', label: 'Order tracking' }, { id: 'orders', label: 'Orders' }, { id: 'wishlist', label: 'Wishlist' }]} />
      </div>
      <div key={tab} className="demo-rise mt-4">
        {tab === 'tracking' && (
          <ol className="relative space-y-4 border-l border-slate-200 pl-5">
            {TRACKING.map((s) => (
              <li key={s.label} className="relative">
                <span className={cn('absolute -left-[1.6rem] top-1 grid size-3.5 place-items-center rounded-full', s.done ? 'bg-[var(--demo-good)]' : 'bg-slate-200')} />
                <p className={cn('text-sm font-medium', s.done ? 'text-slate-900' : 'text-slate-500')}>{s.label}</p>
                <p className="text-xs text-slate-500">{s.note}</p>
              </li>
            ))}
          </ol>
        )}
        {tab === 'orders' && (
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {[['#10479', 'Leather Tote', '$362', 'Delivered'], ['#10462', 'Silk Slip Dress', '$265', 'Delivered']].map(([id, name, total, status]) => (
              <li key={id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <div><p className="font-medium text-slate-900">{name}</p><p className="text-xs text-slate-500">{id}</p></div>
                <div className="text-right"><p className="tabular-nums text-slate-900">{total}</p><Pill tone="green">{status}</Pill></div>
              </li>
            ))}
          </ul>
        )}
        {tab === 'wishlist' && (
          <p className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">Your saved pieces appear here. Tap the heart on any product.</p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Storefront ---------------------------------- */

/**
 * The customer website: a working shop with its own header (the fictional brand, not Valorian's), a shared bag, and pages for home,
 * shop, product, cart, checkout and profile. Everything runs from local state with dummy data.
 */
export function Storefront() {
  const [page, setPage] = useState<Page>('home');
  const [dept, setDept] = useState<Department | 'All'>('All');
  const [productId, setProductId] = useState('p1');
  const [lines, setLines] = useState<CartLine[]>([{ key: 'p3-M-Ivory', id: 'p3', size: 'M', colour: 'Ivory', qty: 1 }]);
  const count = cartTotals(lines).count;

  const go = (next: Page, d?: Department | 'All') => {
    if (d !== undefined) setDept(d);
    setPage(next);
  };
  const open = (id: string) => {
    setProductId(id);
    setPage('product');
  };
  const add = (line: Omit<CartLine, 'key' | 'qty'>, qty: number) => {
    const key = `${line.id}-${line.size}-${line.colour}`;
    setLines((ls) => {
      const found = ls.find((l) => l.key === key);
      return found ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l)) : [...ls, { ...line, key, qty }];
    });
  };
  const quickAdd = (id: string) => add({ id, size: productById(id).sizes[0], colour: productById(id).colours[0].name }, 1);
  const setQty = (key: string, qty: number) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, qty } : l))));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgb(0_0_0/0.35)]">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-4 py-2.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 hidden h-6 flex-1 items-center rounded-md bg-white px-3 text-xs text-slate-500 sm:flex">shop.maisonvale.example/{page}</span>
      </div>
      <div className="h-[44rem] overflow-y-auto bg-white sm:h-[46rem]">
        <StoreHeader page={page} go={go} count={count} />
        <div key={page} className="demo-slide">
          {page === 'home' && <HomePage go={go} onOpen={open} onAdd={quickAdd} />}
          {page === 'shop' && <ShopPage dept={dept} setDept={setDept} onOpen={open} />}
          {page === 'product' && <ProductPage key={productId} id={productId} onAdd={add} go={(p) => go(p)} />}
          {page === 'cart' && <CartPage lines={lines} onQty={setQty} go={go} />}
          {page === 'checkout' && <CheckoutPage lines={lines} onDone={() => { setLines([]); go('shop'); }} />}
          {page === 'profile' && <ProfilePage go={go} />}
        </div>
      </div>
    </div>
  );
}

