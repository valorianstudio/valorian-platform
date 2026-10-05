'use client';

import { Armchair, Bell, Check, ChefHat, ChevronRight, ClipboardList, Clock, CookingPot, House, Lock, LogOut, Mail, Minus, Plus, ReceiptText, Settings, ShoppingBag, Star, Truck, UserRound, UtensilsCrossed, BookOpenText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Pill } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { DASHBOARD_STATS, MENU, MENU_CATEGORIES, ORDERS, ORDER_FLOW, TABLES } from '@/data/restaurant/app';
import type { MenuItem, OrderStatus, TableStatus } from '@/data/restaurant/app';
import { cn } from '@/lib/cn';
import { DishArt } from './dish-art';
import { RestaurantLogo } from './restaurant-logo';
import { tone } from './restaurant-cards';

/** Screens of the guest and staff mobile apps. Compact, touch-sized and driven by dummy data. */

export type GuestScreen = 'splash' | 'login' | 'home' | 'menu' | 'details' | 'cart' | 'tracking' | 'profile';
export type StaffScreen = 'dashboard' | 'orders' | 'kitchen' | 'tables';
export type Cart = Record<string, number>;

export const GUEST_NAV: { id: Exclude<GuestScreen, 'splash' | 'login' | 'details'>; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'menu', label: 'Menu', icon: BookOpenText },
  { id: 'cart', label: 'Cart', icon: ShoppingBag },
  { id: 'tracking', label: 'Track', icon: Clock },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

export const STAFF_NAV: { id: StaffScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'kitchen', label: 'Kitchen', icon: CookingPot },
  { id: 'tables', label: 'Tables', icon: Armchair },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-resto text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const dish = (id: string) => MENU.find((m) => m.id === id) as MenuItem;
const money = (n: number) => `$${n}`;

/* ---------------------------------- Guest app ---------------------------------- */

export function GuestSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-resto px-6 pb-8 pt-16 text-center">
      <span className="grid size-20 animate-pulse-soft place-items-center rounded-3xl bg-gold text-white shadow-[0_20px_40px_-12px_rgb(217_119_6/0.6)]">
        <UtensilsCrossed className="size-9" aria-hidden />
      </span>
      <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">Ember &amp; Oak</h3>
      <p className="mt-2 text-[13px] text-white/70">Dine. Order. Enjoy.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-xl bg-white text-sm font-semibold text-resto hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        Get started
      </button>
    </div>
  );
}

export function GuestLogin({ onSignIn }: { onSignIn: () => void }) {
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <RestaurantLogo />
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">Welcome back</h3>
      <p className="mt-1 text-[13px] text-slate-500">Sign in to order and earn rewards.</p>
      <div className="mt-6 space-y-3">
        <div className={field}>
          <Mail className="size-4 text-slate-400" aria-hidden /> hannah.l@mail.example
        </div>
        <div className={field}>
          <Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••
        </div>
      </div>
      <button type="button" onClick={onSignIn} className={cn(primary, 'mt-auto')}>
        Sign in
      </button>
      <button type="button" onClick={onSignIn} className="mt-2 h-10 text-[13px] font-semibold text-gold-ink hover:underline focus-visible:outline-2 focus-visible:outline-gold">
        Continue as guest
      </button>
    </div>
  );
}

export function GuestHome({ go, onAdd, onOpen }: { go: (s: GuestScreen) => void; onAdd: (id: string) => void; onOpen: (id: string) => void }) {
  const special = dish('m3');
  const popular = MENU.filter((m) => m.tag === 'Popular' || m.tag === "Chef's pick").slice(0, 4);
  return (
    <>
      <AppHeader subtitle="Good evening" title="Hannah" right={<Avatar name="Hannah Lindqvist" />} />
      <Body>
        <button type="button" onClick={() => onOpen(special.id)} className="flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-amber-50 p-3 text-left ring-1 ring-amber-200 focus-visible:outline-2 focus-visible:outline-gold">
          <DishArt art={special.art} className="size-20 shrink-0 rounded-xl" />
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-gold-ink">Tonight&rsquo;s special</span>
            <span className="mt-0.5 block text-sm font-semibold text-slate-900">{special.name}</span>
            <span className="mt-1 block text-xs text-slate-600">{money(special.price)} · {special.prep} min</span>
          </span>
        </button>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Order', ShoppingBag, 'menu'],
            ['Reserve', Armchair, 'menu'],
            ['Track', Clock, 'tracking'],
          ].map(([label, Icon, target]) => {
            const IconCmp = Icon as LucideIcon;
            return (
              <button key={label as string} type="button" onClick={() => go(target as GuestScreen)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-[11px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-gold">
                <span className="grid size-8 place-items-center rounded-lg bg-amber-50 text-gold-ink">
                  <IconCmp className="size-4" aria-hidden />
                </span>
                {label as string}
              </button>
            );
          })}
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Popular tonight</p>
        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
          {popular.map((m) => (
            <div key={m.id} className="w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button type="button" onClick={() => onOpen(m.id)} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-gold">
                <DishArt art={m.art} className="h-20" />
                <span className="block truncate px-2.5 pt-2 text-xs font-semibold text-slate-900">{m.name}</span>
              </button>
              <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1">
                <span className="text-xs font-semibold tabular-nums text-slate-700">{money(m.price)}</span>
                <button type="button" aria-label={`Add ${m.name}`} onClick={() => onAdd(m.id)} className="grid size-6 place-items-center rounded-full bg-resto text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                  <Plus className="size-3.5" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Body>
    </>
  );
}

export function GuestMenu({ onAdd, onOpen, count, goCart }: { onAdd: (id: string) => void; onOpen: (id: string) => void; count: number; goCart: () => void }) {
  const [cat, setCat] = useState<(typeof MENU_CATEGORIES)[number]>('All');
  const list = MENU.filter((m) => m.available && (cat === 'All' || m.category === cat));
  return (
    <>
      <AppHeader subtitle="Ember & Oak" title="Menu" />
      <div role="group" aria-label="Category" className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-slate-200 bg-white px-3.5 py-2.5">
        {MENU_CATEGORIES.map((c) => (
          <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)} className={cn('shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-gold', c === cat ? 'bg-resto text-white' : 'bg-slate-100 text-slate-600')}>
            {c}
          </button>
        ))}
      </div>
      <Body>
        <div key={cat} className="demo-slide space-y-2">
          {list.map((m) => (
            <Card key={m.id} className="flex items-center gap-2.5 p-2">
              <button type="button" onClick={() => onOpen(m.id)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-gold">
                <DishArt art={m.art} className="size-14 shrink-0 rounded-lg" />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-slate-900">{m.name}</span>
                  <span className="block truncate text-[11px] text-slate-500">{m.description}</span>
                  <span className="mt-0.5 block text-xs font-semibold tabular-nums text-slate-800">{money(m.price)}</span>
                </span>
              </button>
              <button type="button" aria-label={`Add ${m.name}`} onClick={() => onAdd(m.id)} className="grid size-8 shrink-0 place-items-center rounded-full bg-resto text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                <Plus className="size-4" aria-hidden />
              </button>
            </Card>
          ))}
        </div>
      </Body>
      {count > 0 && (
        <button type="button" onClick={goCart} className="demo-rise mx-3.5 mb-2 flex shrink-0 items-center justify-between rounded-xl bg-gold-ink px-4 py-2.5 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
          <span>{count} item{count === 1 ? '' : 's'} in cart</span>
          <span className="inline-flex items-center gap-1">View cart <ChevronRight className="size-3.5" aria-hidden /></span>
        </button>
      )}
    </>
  );
}

export function GuestDetails({ id, qty, onQty, onAdd }: { id: string; qty: number; onQty: (n: number) => void; onAdd: (n: number) => void }) {
  const m = dish(id);
  return (
    <>
      <DishArt art={m.art} label={m.name} className="h-40 shrink-0" />
      <Body>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">{m.name}</h3>
          <p className="text-base font-semibold tabular-nums text-slate-900">{money(m.price)}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 font-medium text-slate-800">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {m.rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden /> {m.prep} min
          </span>
          {m.tag && <Pill tone="amber">{m.tag}</Pill>}
        </div>
        <p className="text-[13px] leading-relaxed text-slate-600">{m.description}</p>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5">
          <span className="text-xs font-medium text-slate-700">Quantity</span>
          <span className="inline-flex items-center gap-3">
            <button type="button" aria-label="Decrease" onClick={() => onQty(Math.max(1, qty - 1))} className="grid size-7 place-items-center rounded-full bg-slate-100 text-slate-700 focus-visible:outline-2 focus-visible:outline-gold">
              <Minus className="size-3.5" aria-hidden />
            </button>
            <span className="w-4 text-center text-sm font-semibold tabular-nums">{qty}</span>
            <button type="button" aria-label="Increase" onClick={() => onQty(qty + 1)} className="grid size-7 place-items-center rounded-full bg-resto text-white focus-visible:outline-2 focus-visible:outline-gold">
              <Plus className="size-3.5" aria-hidden />
            </button>
          </span>
        </div>
        <button type="button" onClick={() => onAdd(qty)} className={primary}>
          Add to cart · {money(m.price * qty)}
        </button>
      </Body>
    </>
  );
}

export function GuestCart({ cart, onQty, onPlace, goMenu }: { cart: Cart; onQty: (id: string, n: number) => void; onPlace: () => void; goMenu: () => void }) {
  const lines = Object.entries(cart).filter(([, n]) => n > 0);
  const subtotal = lines.reduce((sum, [id, n]) => sum + dish(id).price * n, 0);
  const service = Math.round(subtotal * 0.1 * 100) / 100;
  return (
    <>
      <AppHeader subtitle="Review your order" title="Cart" />
      {lines.length === 0 ? (
        <Body>
          <Card className="flex flex-col items-center py-10 text-center">
            <ShoppingBag className="size-8 text-slate-300" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-slate-900">Your cart is empty</p>
            <button type="button" onClick={goMenu} className="mt-3 rounded-lg bg-resto px-4 py-2 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
              Browse the menu
            </button>
          </Card>
        </Body>
      ) : (
        <>
          <Body>
            {lines.map(([id, n]) => (
              <Card key={id} className="flex items-center gap-2.5 p-2">
                <DishArt art={dish(id).art} className="size-12 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-900">{dish(id).name}</p>
                  <p className="text-xs tabular-nums text-slate-500">{money(dish(id).price * n)}</p>
                </div>
                <span className="inline-flex items-center gap-2">
                  <button type="button" aria-label={`Remove one ${dish(id).name}`} onClick={() => onQty(id, n - 1)} className="grid size-6 place-items-center rounded-full bg-slate-100 text-slate-700 focus-visible:outline-2 focus-visible:outline-gold">
                    <Minus className="size-3" aria-hidden />
                  </button>
                  <span className="w-3 text-center text-xs font-semibold tabular-nums">{n}</span>
                  <button type="button" aria-label={`Add one ${dish(id).name}`} onClick={() => onQty(id, n + 1)} className="grid size-6 place-items-center rounded-full bg-resto text-white focus-visible:outline-2 focus-visible:outline-gold">
                    <Plus className="size-3" aria-hidden />
                  </button>
                </span>
              </Card>
            ))}
            <Card>
              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>Service (10%)</dt>
                  <dd className="tabular-nums">${service.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1.5 text-sm font-semibold text-slate-900">
                  <dt>Total</dt>
                  <dd className="tabular-nums">${(subtotal + service).toFixed(2)}</dd>
                </div>
              </dl>
            </Card>
          </Body>
          <div className="shrink-0 border-t border-slate-200 bg-white px-3.5 py-2.5">
            <button type="button" onClick={onPlace} className={primary}>
              Place order · ${(subtotal + service).toFixed(2)}
            </button>
          </div>
        </>
      )}
    </>
  );
}

const STEPS: { label: string; note: string; icon: LucideIcon }[] = [
  { label: 'Order received', note: 'The kitchen has your order.', icon: ReceiptText },
  { label: 'Preparing', note: 'Chef Antoine is cooking.', icon: ChefHat },
  { label: 'On its way', note: 'Your server is bringing it.', icon: Truck },
  { label: 'Served', note: 'Enjoy your meal!', icon: Check },
];

export function GuestTracking({ placed, step, onAdvance, goMenu }: { placed: boolean; step: number; onAdvance: () => void; goMenu: () => void }) {
  return (
    <>
      <AppHeader subtitle={placed ? 'Order #1049 · Table 7' : 'No active order'} title="Order tracking" right={placed ? <Pill tone={step >= 3 ? 'green' : 'amber'}>{step >= 3 ? 'Done' : `${Math.max(2, 18 - step * 6)} min`}</Pill> : undefined} />
      <Body>
        {!placed ? (
          <Card className="flex flex-col items-center py-10 text-center">
            <Clock className="size-8 text-slate-300" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-slate-900">Nothing to track yet</p>
            <p className="mt-1 text-xs text-slate-500">Place an order and follow it here.</p>
            <button type="button" onClick={goMenu} className="mt-3 rounded-lg bg-resto px-4 py-2 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
              Browse the menu
            </button>
          </Card>
        ) : (
          <>
            <Card>
              <ol className="relative space-y-4">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const done = i <= step;
                  return (
                    <li key={s.label} className="relative flex items-start gap-3">
                      {i < STEPS.length - 1 && <span aria-hidden className={cn('absolute left-[0.95rem] top-8 h-[calc(100%-0.4rem)] w-0.5', i < step ? 'bg-fresh' : 'bg-slate-200')} />}
                      <span className={cn('relative z-10 grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300', done ? 'bg-fresh text-white' : 'bg-slate-100 text-slate-400')}>
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="pt-0.5">
                        <span className={cn('block text-[13px] font-semibold', done ? 'text-slate-900' : 'text-slate-400')}>{s.label}</span>
                        <span className="block text-[11px] text-slate-500">{s.note}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Card>
            <button type="button" onClick={onAdvance} disabled={step >= 3} className={cn(primary, 'disabled:opacity-40')}>
              {step >= 3 ? 'Order complete' : 'Simulate next step'}
            </button>
          </>
        )}
      </Body>
    </>
  );
}

export function GuestProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [
    [Bell, 'Notifications'],
    [ReceiptText, 'Order history'],
    [Settings, 'Settings'],
  ];
  return (
    <>
      <AppHeader subtitle="Guest" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center">
          <Avatar name="Hannah Lindqvist" size="lg" />
          <p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p>
          <p className="text-xs text-slate-500">Gold member · 1,240 points</p>
        </Card>
        <Card className="divide-y divide-slate-100 p-0">
          {rows.map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3 text-[13px] text-slate-700">
              <Icon className="size-4 text-slate-500" aria-hidden />
              {label}
              <ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden />
            </div>
          ))}
        </Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-gold">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </Body>
    </>
  );
}

/* ---------------------------------- Staff app ---------------------------------- */

export function StaffDashboard({ go, active }: { go: (s: StaffScreen) => void; active: number }) {
  return (
    <>
      <AppHeader subtitle="Friday service" title="Isabella Conti" right={<Avatar name="Isabella Conti" />} />
      <Body>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Sales today', money(DASHBOARD_STATS.sales)],
            ['Orders', String(DASHBOARD_STATS.orders)],
            ['Open orders', String(active)],
            ['Tables', `${DASHBOARD_STATS.activeTables}/${DASHBOARD_STATS.tablesTotal}`],
          ].map(([label, value]) => (
            <Card key={label}>
              <p className="text-[11px] text-slate-500">{label}</p>
              <p className="text-lg font-semibold tabular-nums text-slate-900">{value}</p>
            </Card>
          ))}
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Needs attention</p>
        {ORDERS.filter((o) => o.status === 'New').map((o) => (
          <button key={o.id} type="button" onClick={() => go('orders')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-gold">
            <Card className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-rose-50 text-rose-700">
                <ReceiptText className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-slate-900">
                  {o.id} · {o.table}
                </span>
                <span className="block text-[11px] text-slate-500">{o.minutes} min ago</span>
              </span>
              <ChevronRight className="size-4 text-slate-300" aria-hidden />
            </Card>
          </button>
        ))}
      </Body>
    </>
  );
}

export function StaffOrders({ status, onAdvance }: { status: Record<string, OrderStatus>; onAdvance: (id: string, to: OrderStatus) => void }) {
  return (
    <>
      <AppHeader subtitle="Floor and counter" title="Orders" />
      <Body>
        {ORDERS.map((o) => {
          const current = status[o.id] ?? o.status;
          const next = ORDER_FLOW[current];
          return (
            <Card key={o.id}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-slate-900">
                  {o.id} · {o.table}
                </p>
                <Pill tone={tone(current)}>{current}</Pill>
              </div>
              <p className="mt-1 truncate text-[11px] text-slate-500">{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold tabular-nums text-slate-800">{money(o.total)}</span>
                {next && (
                  <button type="button" onClick={() => onAdvance(o.id, next.to)} className="rounded-md bg-resto px-2.5 py-1 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                    {next.label}
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function StaffKitchen({ status, onAdvance }: { status: Record<string, OrderStatus>; onAdvance: (id: string, to: OrderStatus) => void }) {
  const queue = ORDERS.filter((o) => ['New', 'Preparing'].includes(status[o.id] ?? o.status));
  return (
    <>
      <AppHeader subtitle={`${queue.length} tickets`} title="Kitchen queue" right={<ChefHat className="size-5 text-white/70" aria-hidden />} />
      <Body>
        {queue.length === 0 && (
          <Card className="py-10 text-center">
            <Check className="mx-auto size-8 text-fresh" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-900">Kitchen is clear</p>
          </Card>
        )}
        {queue.map((o) => {
          const current = status[o.id] ?? o.status;
          return (
            <Card key={o.id} className={cn('demo-rise border-l-[3px]', current === 'New' ? 'border-l-rose-500' : 'border-l-amber-500')}>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-slate-900">
                  {o.id} · {o.table}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium tabular-nums text-slate-500">
                  <Clock className="size-3" aria-hidden /> {o.minutes}m
                </span>
              </div>
              <ul className="mt-1.5 space-y-0.5 text-xs text-slate-700">
                {o.items.map((i) => (
                  <li key={i.name}>
                    <span className="font-semibold tabular-nums">{i.qty}×</span> {i.name}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => onAdvance(o.id, current === 'New' ? 'Preparing' : 'Ready')} className="mt-2.5 h-8 w-full rounded-lg bg-resto text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                {current === 'New' ? 'Start cooking' : 'Mark ready'}
              </button>
            </Card>
          );
        })}
      </Body>
    </>
  );
}

const NEXT_TABLE: Record<TableStatus, TableStatus> = { Available: 'Occupied', Occupied: 'Cleaning', Cleaning: 'Available', Reserved: 'Occupied' };
const TABLE_CLASS: Record<TableStatus, string> = {
  Available: 'border-fresh bg-green-50 text-slate-900',
  Occupied: 'border-resto bg-resto text-white',
  Reserved: 'border-amber-500 bg-amber-50 text-slate-900',
  Cleaning: 'border-dashed border-slate-300 bg-slate-50 text-slate-500',
};

export function StaffTables() {
  const [status, setStatus] = useState<Record<string, TableStatus>>({});
  return (
    <>
      <AppHeader subtitle="Tap to change status" title="Table status" />
      <Body>
        <div className="grid grid-cols-3 gap-2">
          {TABLES.slice(0, 12).map((t) => {
            const current = status[t.id] ?? t.status;
            return (
              <button key={t.id} type="button" aria-label={`${t.id}: ${current}. Tap to change`} onClick={() => setStatus((s) => ({ ...s, [t.id]: NEXT_TABLE[current] }))} className={cn('flex aspect-square flex-col items-center justify-center rounded-xl border-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold', TABLE_CLASS[current])}>
                <span className="text-sm font-semibold">{t.id}</span>
                <span className="text-[10px] opacity-80">{current}</span>
              </button>
            );
          })}
        </div>
      </Body>
    </>
  );
}
