'use client';

import { Bell, Check, ChevronRight, CreditCard, Grid2x2, Heart, House, Lock, LogOut, Mail, Package, Search, Settings, ShoppingBag, Star, Tag, Truck, UserRound, X, Minus, Plus, Sparkles, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar, Pill, ProgressBar } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { DEPARTMENTS, ORDERS, PRODUCTS, TRACKING, formatPrice, productById } from '@/data/clothing/catalog';
import { cn } from '@/lib/cn';
import { GarmentArt } from './garment-art';
import { ClothingLogo } from './clothing-logo';
import { cartTotals } from './storefront';
import type { CartLine } from './storefront';

/** Screens of the shopping app and the seller app. Compact, touch-sized, and driven by dummy data. */

export type ShopScreen = 'splash' | 'login' | 'home' | 'categories' | 'search' | 'product' | 'cart' | 'checkout' | 'tracking' | 'profile';
export type SellerScreen = 'dashboard' | 'orders' | 'products' | 'analytics';

export const SHOP_NAV: { id: 'home' | 'categories' | 'search' | 'cart' | 'profile'; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'categories', label: 'Shop', icon: Grid2x2 },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'cart', label: 'Bag', icon: ShoppingBag },
  { id: 'profile', label: 'Account', icon: UserRound },
];

export const SELLER_NAV: { id: SellerScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'products', label: 'Products', icon: Tag },
  { id: 'analytics', label: 'Sales', icon: TrendingUp },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--demo-accent)] text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';
const swatch = (hex: string) => (hex === '#111111' ? '#2b2b2b' : hex);
const onColour = (hex: string) => (hex === '#111111' || hex === '#1E2A44' || hex === '#4A4A4A' ? '#ffffff' : '#111111');

/* ---------------------------------- Shopping app ---------------------------------- */

export function ShopSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--demo-accent)] px-6 pb-8 pt-20 text-center">
      <p className="text-lg font-semibold tracking-[0.3em] text-white">MAISON VALE</p>
      <span className="mt-3 h-px w-14 bg-[var(--demo-good)]" aria-hidden />
      <p className="mt-4 text-[13px] text-white/75">Fashion for the way you live.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-full bg-white text-sm font-semibold text-[color:var(--demo-accent)] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        Shop now
      </button>
    </div>
  );
}

export function ShopLogin({ onSignIn }: { onSignIn: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <ClothingLogo />
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">{mode === 'in' ? 'Welcome back' : 'Create account'}</h3>
      <div role="tablist" aria-label="Sign in or register" className="mt-4 grid grid-cols-2 rounded-full bg-slate-100 p-1">
        {(['in', 'up'] as const).map((m) => (
          <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => setMode(m)} className={cn('rounded-full py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}>
            {m === 'in' ? 'Sign in' : 'Register'}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {mode === 'up' && <div className={field}>Hannah Lindqvist</div>}
        <div className={field}><Mail className="size-4 text-slate-400" aria-hidden /> hannah.l@mail.example</div>
        <div className={field}><Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••</div>
      </div>
      <button type="button" onClick={onSignIn} className={cn(primary, 'mt-auto')}>{mode === 'in' ? 'Sign in' : 'Create account'}</button>
      <p className="mt-3 text-center text-[11px] text-slate-500">Demo app: continue to explore the store.</p>
    </div>
  );
}

export function ShopHome({ onOpen, onAdd, go }: { onOpen: (id: string) => void; onAdd: (id: string) => void; go: (s: ShopScreen) => void }) {
  const picks = PRODUCTS.filter((p) => p.tag === 'Bestseller' || p.tag === 'New').slice(0, 4);
  return (
    <>
      <AppHeader subtitle="Autumn Edit" title="Hello, Hannah" right={<button type="button" aria-label="Notifications" className="grid size-9 place-items-center rounded-full bg-white/10 focus-visible:outline-2 focus-visible:outline-white"><Bell className="size-4" aria-hidden /></button>} />
      <Body>
        <button type="button" onClick={() => go('categories')} className="block w-full overflow-hidden rounded-2xl bg-[var(--demo-accent-soft)] p-4 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">New season</p>
          <p className="mt-1 text-base font-semibold text-[color:var(--demo-accent)]">Layers made to last</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[color:var(--demo-accent)]">Shop the edit <ChevronRight className="size-3" aria-hidden /></span>
        </button>
        <div className="grid grid-cols-3 gap-2">
          {DEPARTMENTS.map((d) => (
            <button key={d} type="button" onClick={() => go('categories')} className="rounded-xl border border-slate-200 bg-white py-3 text-[12px] font-semibold text-slate-900 active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">{d}</button>
          ))}
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Picked for you</p>
        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
          {picks.map((p) => (
            <div key={p.id} className="w-36 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button type="button" onClick={() => onOpen(p.id)} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                <div className="bg-[var(--demo-accent-soft)] p-2"><GarmentArt art={p.art} colour={swatch(p.colours[0].hex)} accent={onColour(p.colours[0].hex)} label={p.name} className="aspect-square w-full" /></div>
                <span className="block truncate px-2.5 pt-2 text-[12px] font-medium text-slate-900">{p.name}</span>
              </button>
              <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1">
                <span className="text-[12px] font-semibold tabular-nums text-slate-800">{formatPrice(p.price)}</span>
                <button type="button" aria-label={`Add ${p.name} to bag`} onClick={() => onAdd(p.id)} className="grid size-7 place-items-center rounded-full bg-[var(--demo-accent)] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]"><Plus className="size-3.5" aria-hidden /></button>
              </div>
            </div>
          ))}
        </div>
      </Body>
    </>
  );
}

export function ShopCategories({ onOpen }: { onOpen: (id: string) => void }) {
  const [dept, setDept] = useState<'All' | 'Men' | 'Women' | 'Accessories'>('All');
  const list = PRODUCTS.filter((p) => dept === 'All' || p.department === dept);
  return (
    <>
      <AppHeader subtitle="Shop" title="Categories" />
      <div role="group" aria-label="Department" className="flex shrink-0 gap-1.5 border-b border-slate-200 bg-white px-3.5 py-2.5">
        {(['All', 'Men', 'Women', 'Accessories'] as const).map((d) => (
          <button key={d} type="button" aria-pressed={d === dept} onClick={() => setDept(d)} className={cn('flex-1 rounded-full py-1.5 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', d === dept ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>{d}</button>
        ))}
      </div>
      <Body>
        <div key={dept} className="demo-slide grid grid-cols-2 gap-2.5">
          {list.map((p) => (
            <button key={p.id} type="button" onClick={() => onOpen(p.id)} className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <div className="bg-[var(--demo-accent-soft)] p-2"><GarmentArt art={p.art} colour={swatch(p.colours[0].hex)} accent={onColour(p.colours[0].hex)} label={p.name} className="aspect-[4/5] w-full" /></div>
              <div className="p-2"><p className="truncate text-[11px] font-medium text-slate-900">{p.name}</p><p className="text-[11px] tabular-nums text-slate-600">{formatPrice(p.price)}</p></div>
            </button>
          ))}
        </div>
      </Body>
    </>
  );
}

export function ShopSearch({ onOpen }: { onOpen: (id: string) => void }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => (q.trim() ? PRODUCTS.filter((p) => (p.name + p.type).toLowerCase().includes(q.trim().toLowerCase())) : []), [q]);
  const popular = ['Coat', 'Knit', 'Trouser', 'Tote'];
  return (
    <>
      <AppHeader subtitle="Find something" title="Search" />
      <div className="shrink-0 border-b border-slate-200 bg-white p-3">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Coats, knits, totes" className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-9 text-[13px] placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
          {q && <button type="button" aria-label="Clear search" onClick={() => setQ('')} className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-slate-500 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><X className="size-3.5" aria-hidden /></button>}
        </label>
        {!q && <div className="mt-3 flex flex-wrap gap-1.5">{popular.map((t) => <button key={t} type="button" onClick={() => setQ(t)} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">{t}</button>)}</div>}
      </div>
      <Body>
        {q && results.length === 0 && <p className="py-8 text-center text-xs text-slate-500">No pieces match “{q}”.</p>}
        {results.map((p) => (
          <button key={p.id} type="button" onClick={() => onOpen(p.id)} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
            <Card className="flex items-center gap-3 p-2">
              <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] p-1"><GarmentArt art={p.art} colour={swatch(p.colours[0].hex)} accent={onColour(p.colours[0].hex)} label={p.name} className="size-full" /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-slate-900">{p.name}</span><span className="block text-[11px] text-slate-500">{p.type}</span></span>
              <span className="text-[12px] font-semibold tabular-nums text-slate-900">{formatPrice(p.price)}</span>
            </Card>
          </button>
        ))}
      </Body>
    </>
  );
}

export function ShopProduct({ id, onAdd, go }: { id: string; onAdd: (id: string, size: string) => void; go: (s: ShopScreen) => void }) {
  const p = productById(id);
  const [size, setSize] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  return (
    <>
      <div className="relative shrink-0 bg-[var(--demo-accent-soft)] p-6">
        <GarmentArt art={p.art} colour={swatch(p.colours[0].hex)} accent={onColour(p.colours[0].hex)} label={p.name} className="mx-auto aspect-square w-[70%]" />
        <button type="button" aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={saved} onClick={() => setSaved((s) => !s)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Heart className={cn('size-4', saved && 'fill-[color:var(--demo-accent)] text-[color:var(--demo-accent)]')} aria-hidden /></button>
        <button type="button" aria-label="Back" onClick={() => go('categories')} className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><X className="size-4" aria-hidden /></button>
      </div>
      <Body>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">{p.department} · {p.collection}</p>
          <h3 className="text-base font-semibold text-slate-900">{p.name}</h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-base font-semibold tabular-nums text-slate-900">{formatPrice(p.price)}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600"><Star className="size-3 fill-[color:var(--demo-good)] text-[color:var(--demo-good)]" aria-hidden /> {p.rating} ({p.reviews})</span>
          </div>
        </div>
        <p className="text-[12px] leading-relaxed text-slate-600">{p.description}</p>
        <div>
          <p className="text-[11px] font-semibold text-slate-900">Size</p>
          <div role="radiogroup" aria-label="Size" className="mt-2 flex flex-wrap gap-1.5">
            {p.sizes.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => setSize(s)} className={cn('min-w-10 rounded-full border px-2.5 py-1 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', size === s ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent)] text-white' : 'border-slate-300 text-slate-800')}>{s}</button>
            ))}
          </div>
        </div>
        <button type="button" disabled={!size} onClick={() => { onAdd(p.id, size!); setAdded(true); }} className={cn(primary, 'disabled:bg-slate-300')}>
          {added ? <><Check className="size-4" aria-hidden /> Added to bag</> : size ? `Add to bag · ${formatPrice(p.price)}` : 'Select a size'}
        </button>
      </Body>
    </>
  );
}

export function ShopCart({ lines, onQty, go }: { lines: CartLine[]; onQty: (key: string, qty: number) => void; go: (s: ShopScreen) => void }) {
  const t = cartTotals(lines);
  if (lines.length === 0) {
    return (
      <>
        <AppHeader subtitle="Your selection" title="Bag" />
        <Body>
          <Card className="flex flex-col items-center py-10 text-center"><ShoppingBag className="size-8 text-slate-300" aria-hidden /><p className="mt-3 text-sm font-semibold text-slate-900">Your bag is empty</p><button type="button" onClick={() => go('categories')} className="mt-3 rounded-full bg-[var(--demo-accent)] px-4 py-2 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Start shopping</button></Card>
        </Body>
      </>
    );
  }
  return (
    <>
      <AppHeader subtitle={`${t.count} items`} title="Bag" />
      <Body>
        {lines.map((l) => {
          const p = productById(l.id);
          return (
            <Card key={l.key} className="flex items-center gap-2.5 p-2">
              <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] p-1"><GarmentArt art={p.art} colour={swatch(p.colours[0].hex)} label={p.name} className="size-full" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-slate-900">{p.name}</p>
                <p className="text-[10px] text-slate-500">{l.colour} · {l.size}</p>
                <div className="mt-1 flex items-center gap-2">
                  <button type="button" aria-label="Decrease" onClick={() => onQty(l.key, l.qty - 1)} className="grid size-6 place-items-center rounded-full bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Minus className="size-3" aria-hidden /></button>
                  <span className="w-4 text-center text-[11px] font-semibold tabular-nums">{l.qty}</span>
                  <button type="button" aria-label="Increase" onClick={() => onQty(l.key, l.qty + 1)} className="grid size-6 place-items-center rounded-full bg-[var(--demo-accent)] text-white focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Plus className="size-3" aria-hidden /></button>
                </div>
              </div>
              <span className="text-[12px] font-semibold tabular-nums text-slate-900">{formatPrice(p.price * l.qty)}</span>
            </Card>
          );
        })}
        <Card>
          <dl className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-600"><dt>Subtotal</dt><dd className="tabular-nums">{formatPrice(t.subtotal)}</dd></div>
            <div className="flex justify-between text-slate-600"><dt>Delivery</dt><dd>{t.shipping === 0 ? 'Free' : formatPrice(t.shipping)}</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-1.5 text-[13px] font-semibold text-slate-900"><dt>Total</dt><dd className="tabular-nums">{formatPrice(t.total)}</dd></div>
          </dl>
        </Card>
        <button type="button" onClick={() => go('checkout')} className={primary}>Checkout</button>
      </Body>
    </>
  );
}

export function ShopCheckout({ lines, onPlaced }: { lines: CartLine[]; onPlaced: () => void }) {
  const t = cartTotals(lines);
  const [method, setMethod] = useState<'card' | 'wallet'>('wallet');
  return (
    <>
      <AppHeader subtitle="Secure checkout" title="Checkout" />
      <Body>
        <Card>
          <p className="text-[11px] font-semibold text-slate-900">Delivery</p>
          <p className="mt-1 flex items-center gap-2 text-[12px] text-slate-700"><Truck className="size-3.5 text-slate-500" aria-hidden /> 14 Harbour Street, Stockholm</p>
        </Card>
        <div role="radiogroup" aria-label="Payment" className="space-y-2">
          {([['wallet', 'Wallet pay', 'Fastest, one tap'], ['card', 'Card ending 4242', 'Visa']] as const).map(([id, label, note]) => (
            <button key={id} type="button" role="radio" aria-checked={method === id} onClick={() => setMethod(id)} className={cn('flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', method === id ? 'border-[color:var(--demo-accent)]' : 'border-slate-200')}>
              <CreditCard className="size-4 text-slate-500" aria-hidden />
              <span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">{label}</span><span className="block text-[10px] text-slate-500">{note}</span></span>
              {method === id && <Check className="size-4 text-[color:var(--demo-accent)]" aria-hidden />}
            </button>
          ))}
        </div>
        <Card className="flex justify-between text-[13px] font-semibold text-slate-900"><span>Total ({t.count} items)</span><span className="tabular-nums">{formatPrice(t.total)}</span></Card>
        <button type="button" onClick={onPlaced} disabled={lines.length === 0} className={cn(primary, 'disabled:bg-slate-300')}>Place order</button>
      </Body>
    </>
  );
}

export function ShopTracking({ placed }: { placed: boolean }) {
  return (
    <>
      <AppHeader subtitle="Order #10483" title="Tracking" right={<Pill tone={placed ? 'blue' : 'slate'}>{placed ? 'On its way' : 'No order'}</Pill>} />
      <Body>
        <Card>
          <ol className="relative space-y-4 border-l border-slate-200 pl-4">
            {TRACKING.map((s, i) => (
              <li key={s.label} className="relative">
                <span className={cn('absolute -left-[1.3rem] top-0.5 grid size-3 place-items-center rounded-full', s.done || (placed && i === 0) ? 'bg-[var(--demo-good)]' : 'bg-slate-200')} />
                <p className={cn('text-[12px] font-semibold', s.done ? 'text-slate-900' : 'text-slate-500')}>{s.label}</p>
                <p className="text-[10px] text-slate-500">{s.note}</p>
              </li>
            ))}
          </ol>
        </Card>
        <p className="text-[11px] text-slate-500">Your courier will message you when the parcel is on the way.</p>
      </Body>
    </>
  );
}

export function ShopProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [[Package, 'My orders'], [Heart, 'Wishlist'], [Sparkles, 'Member rewards: 1,240 points'], [Settings, 'Settings']];
  return (
    <>
      <AppHeader subtitle="Member" title="Account" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center">
          <Avatar name="Hannah Lindqvist" size="lg" />
          <p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p>
          <p className="text-[11px] text-slate-500">VIP member · 14 orders</p>
        </Card>
        <Card className="divide-y divide-slate-100 p-0">
          {rows.map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3 text-[12px] text-slate-700"><Icon className="size-4 text-slate-500" aria-hidden />{label}<ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden /></div>
          ))}
        </Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><LogOut className="size-4" aria-hidden /> Sign out</button>
      </Body>
    </>
  );
}

/* ---------------------------------- Seller app ---------------------------------- */

export function SellerDashboard({ go }: { go: (s: SellerScreen) => void }) {
  return (
    <>
      <AppHeader subtitle="Saturday" title="Maison Vale" right={<Avatar name="Amelia Stone" />} />
      <Body>
        <div className="grid grid-cols-2 gap-2">
          {[['Sales today', '$4,862'], ['Orders', '31'], ['Visitors', '2.1k'], ['Conversion', '3.8%']].map(([l, v]) => (
            <Card key={l}><p className="text-[10px] text-slate-500">{l}</p><p className="text-base font-semibold tabular-nums text-slate-900">{v}</p></Card>
          ))}
        </div>
        <button type="button" onClick={() => go('orders')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Package className="size-4" aria-hidden /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">{ORDERS[0].id} needs packing</span><span className="block text-[10px] text-slate-500">{ORDERS[0].customer} · {formatPrice(ORDERS[0].total)}</span></span><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card>
        </button>
        <Card>
          <p className="text-[11px] font-semibold text-slate-900">Low stock</p>
          <p className="mt-1 text-[11px] text-slate-600">Tailored Wool Coat · 9 left</p>
          <div className="mt-2"><ProgressBar value={15} tone="blue" /></div>
        </Card>
      </Body>
    </>
  );
}

export function SellerOrders() {
  const [status, setStatus] = useState(ORDERS.map((o) => o.status as string));
  return (
    <>
      <AppHeader subtitle="Packing and shipping" title="Orders" />
      <Body>
        {ORDERS.slice(0, 5).map((o, i) => {
          const current = status[i];
          const next = current === 'Placed' ? 'Packed' : current === 'Packed' ? 'Shipped' : null;
          return (
            <Card key={o.id} className="space-y-2">
              <div className="flex items-center justify-between"><p className="text-[12px] font-semibold text-slate-900">{o.id}</p><Pill tone={current === 'Delivered' ? 'green' : current === 'Returned' ? 'red' : 'blue'}>{current}</Pill></div>
              <p className="text-[11px] text-slate-600">{o.customer} · {o.items} items · {formatPrice(o.total)}</p>
              {next && <button type="button" onClick={() => setStatus((s) => s.map((x, j) => (j === i ? next : x)))} className="rounded-full bg-[var(--demo-accent)] px-3 py-1 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Mark {next.toLowerCase()}</button>}
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function SellerProducts() {
  return (
    <>
      <AppHeader subtitle={`${PRODUCTS.length} products`} title="Products" />
      <Body>
        {PRODUCTS.slice(0, 7).map((p) => (
          <Card key={p.id} className="flex items-center gap-3 p-2">
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] p-1"><GarmentArt art={p.art} colour={swatch(p.colours[0].hex)} accent={onColour(p.colours[0].hex)} label={p.name} className="size-full" /></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold text-slate-900">{p.name}</span><span className="block text-[10px] text-slate-500">{p.stock} in stock · {formatPrice(p.price)}</span></span>
            <Pill tone={p.stock < 15 ? 'amber' : 'green'}>{p.stock < 15 ? 'Low' : 'OK'}</Pill>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function SellerAnalytics() {
  const bars = [9.2, 11.4, 10.1, 13.8, 17.6, 21.9, 14.3];
  return (
    <>
      <AppHeader subtitle="This week" title="Sales" />
      <Body>
        <Card>
          <p className="text-[11px] text-slate-500">Revenue, $ thousands</p>
          <p className="text-lg font-semibold tabular-nums text-slate-900">$99.3k</p>
          <div className="mt-3 flex h-24 items-end gap-1.5">
            {bars.map((v, i) => <div key={i} className="demo-grow flex-1 rounded-t-md bg-[var(--demo-accent)]" style={{ height: `${(v / 22) * 100}%`, ['--i' as string]: i, opacity: 0.45 + (i / 14) }} />)}
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-2">
          <Card><p className="text-[10px] text-slate-500">Average order</p><p className="text-sm font-semibold tabular-nums text-slate-900">$196</p></Card>
          <Card><p className="text-[10px] text-slate-500">Returns</p><p className="text-sm font-semibold tabular-nums text-slate-900">4.1%</p></Card>
        </div>
      </Body>
    </>
  );
}

