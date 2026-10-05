'use client';

import { Bell, Bike, Check, ChevronRight, Clock, CreditCard, House, Lock, LogOut, Mail, MapPin, Navigation, Package, Search, Settings, ShieldCheck, Star, Wallet, Zap, Map, CircleDollarSign, ListChecks, Gauge } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Pill, ProgressBar } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { ADDRESSES, ORDERS, RIDERS, SERVICES, TRACK_STEPS } from '@/data/delivery/operations';
import { cn } from '@/lib/cn';
import { DeliveryLogo } from './delivery-logo';
import { MapView } from './map-view';
import { tone } from './delivery-cards';

/** Screens of the customer app and the rider app. Compact, touch-sized, and driven by dummy data. */

export type CustomerScreen = 'splash' | 'login' | 'home' | 'book' | 'address' | 'track' | 'payment' | 'history' | 'profile';
export type RiderScreen = 'dashboard' | 'orders' | 'route' | 'status' | 'earnings';

export const CUSTOMER_NAV: { id: 'home' | 'book' | 'track' | 'history' | 'profile'; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'book', label: 'Book', icon: Package },
  { id: 'track', label: 'Track', icon: MapPin },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'profile', label: 'Profile', icon: Settings },
];

export const RIDER_NAV: { id: RiderScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'orders', label: 'Orders', icon: ListChecks },
  { id: 'route', label: 'Route', icon: Map },
  { id: 'status', label: 'Status', icon: Gauge },
  { id: 'earnings', label: 'Earnings', icon: CircleDollarSign },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--demo-accent)] text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';
const money = (n: number) => `$${n.toFixed(2)}`;

/* ---------------------------------- Customer app ---------------------------------- */

export function CustomerSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--demo-accent)] px-6 pb-8 pt-20 text-center">
      <span className="grid size-20 animate-pulse-soft place-items-center rounded-3xl bg-[var(--demo-orange)] text-white shadow-[0_20px_40px_-12px_rgb(249_115_22/0.6)]"><Bike className="size-9" aria-hidden /></span>
      <h3 className="mt-7 text-2xl font-bold tracking-tight text-white">SWIFTWHEEL</h3>
      <p className="mt-2 text-[13px] text-white/75">Fast, reliable delivery at your fingertips.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-xl bg-white text-sm font-semibold text-[color:var(--demo-accent)] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get started</button>
    </div>
  );
}

export function CustomerLogin({ onSignIn }: { onSignIn: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <DeliveryLogo />
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">{mode === 'in' ? 'Welcome back' : 'Create account'}</h3>
      <div role="tablist" aria-label="Sign in or register" className="mt-4 grid grid-cols-2 rounded-full bg-slate-100 p-1">
        {(['in', 'up'] as const).map((m) => <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => setMode(m)} className={cn('rounded-full py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}>{m === 'in' ? 'Sign in' : 'Register'}</button>)}
      </div>
      <div className="mt-5 space-y-3">
        {mode === 'up' && <div className={field}>Hannah Lindqvist</div>}
        <div className={field}><Mail className="size-4 text-slate-400" aria-hidden /> hannah.l@mail.example</div>
        <div className={field}><Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••</div>
      </div>
      <button type="button" onClick={onSignIn} className={cn(primary, 'mt-auto')}>{mode === 'in' ? 'Sign in' : 'Create account'}</button>
      <p className="mt-3 text-center text-[11px] text-slate-500">Demo app: continue to book a delivery.</p>
    </div>
  );
}

export function CustomerHome({ go }: { go: (s: CustomerScreen) => void }) {
  const live = ORDERS[0];
  return (
    <>
      <AppHeader subtitle="Good afternoon" title="Hannah" right={<button type="button" aria-label="Notifications" className="grid size-9 place-items-center rounded-full bg-white/10 focus-visible:outline-2 focus-visible:outline-white"><Bell className="size-4" aria-hidden /></button>} />
      <Body>
        <div className="relative">
          <div className="relative h-28 overflow-hidden rounded-2xl"><MapView from={{ x: 25, y: 60, label: 'Pickup' }} to={{ x: 75, y: 35, label: 'Drop' }} progress={60} label="Your delivery" className="size-full" /></div>
        </div>
        <button type="button" onClick={() => go('track')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Bike className="size-4" aria-hidden /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">{live.id} · on the way</span><span className="block text-[10px] text-slate-500">{live.rider} · arriving in {live.eta} min</span></span><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card>
        </button>
        <button type="button" onClick={() => go('book')} className="flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left text-[13px] text-slate-500 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Search className="size-4" aria-hidden /> Where to today?</button>
        <div className="grid grid-cols-3 gap-2">
          {SERVICES.map((s) => <button key={s.id} type="button" onClick={() => go('book')} className="rounded-xl border border-slate-200 bg-white py-3 text-center active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><p className="text-[12px] font-semibold text-slate-900">{s.label}</p><p className="text-[10px] text-slate-500">{s.eta}</p></button>)}
        </div>
      </Body>
    </>
  );
}

export function CustomerBook({ onNext }: { onNext: (service: string) => void }) {
  const [service, setService] = useState<(typeof SERVICES)[number]['id']>('food');
  const picked = SERVICES.find((s) => s.id === service) ?? SERVICES[0];
  return (
    <>
      <AppHeader subtitle="New delivery" title="Book a delivery" />
      <Body>
        <div role="radiogroup" aria-label="Service" className="grid grid-cols-3 gap-2">
          {SERVICES.map((s) => <button key={s.id} type="button" role="radio" aria-checked={service === s.id} onClick={() => setService(s.id)} className={cn('rounded-xl border bg-white p-3 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', service === s.id ? 'border-[color:var(--demo-accent)] ring-1 ring-[color:var(--demo-accent)]' : 'border-slate-200')}><p className="text-[12px] font-semibold text-slate-900">{s.label}</p><p className="text-[10px] text-slate-500">{s.eta}</p><p className="mt-1 text-[11px] font-semibold tabular-nums text-slate-900">{money(s.price)}</p></button>)}
        </div>
        <Card className="space-y-2.5">
          <label className="block text-[11px] font-medium text-slate-600">Pickup<input defaultValue="Ember & Oak, 3 Market Sq" className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-[12px] focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" /></label>
          <label className="block text-[11px] font-medium text-slate-600">Drop-off<input defaultValue="14 Harbour St" className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-[12px] focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" /></label>
        </Card>
        <button type="button" onClick={() => onNext(picked.id)} className={primary}>Choose address</button>
      </Body>
    </>
  );
}

export function CustomerAddress({ onPick }: { onPick: () => void }) {
  const [pick, setPick] = useState<string>(ADDRESSES[0]);
  return (
    <>
      <AppHeader subtitle="Where should we deliver?" title="Address" />
      <div className="relative h-36 shrink-0"><MapView from={{ x: 30, y: 62, label: 'Pickup' }} to={{ x: 70, y: 36, label: pick }} progress={0} label="Address map" className="size-full" /></div>
      <Body>
        <div role="radiogroup" aria-label="Saved addresses" className="space-y-2">
          {ADDRESSES.map((a) => <button key={a} type="button" role="radio" aria-checked={pick === a} onClick={() => setPick(a)} className={cn('flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', pick === a ? 'border-[color:var(--demo-accent)]' : 'border-slate-200')}><MapPin className="size-4 text-[color:var(--demo-orange-ink)]" aria-hidden /><span className="min-w-0 flex-1 truncate text-[12px] text-slate-900">{a}</span>{pick === a && <Check className="size-4 text-[color:var(--demo-accent)]" aria-hidden />}</button>)}
        </div>
        <button type="button" onClick={onPick} className={primary}>Confirm address</button>
      </Body>
    </>
  );
}

export function CustomerTrack() {
  const order = ORDERS[0];
  return (
    <>
      <AppHeader subtitle={`${order.id} · ${order.rider}`} title="Live tracking" right={<Pill tone="blue">ETA {order.eta} min</Pill>} />
      <div className="relative h-44 shrink-0"><MapView from={order.from} to={order.to} progress={order.progress} label="Live route" className="size-full" /></div>
      <Body>
        <Card>
          <ol className="relative space-y-4 border-l border-slate-200 pl-4">
            {TRACK_STEPS.map((s) => <li key={s.label} className="relative"><span className={cn('absolute -left-[1.2rem] top-0.5 grid size-3 place-items-center rounded-full', s.done ? 'bg-[var(--demo-good)]' : 'bg-slate-200')} /><p className={cn('text-[12px] font-semibold', s.done ? 'text-slate-900' : 'text-slate-500')}>{s.label}</p><p className="text-[10px] text-slate-500">{s.note}</p></li>)}
          </ol>
        </Card>
        <Card className="flex items-center gap-3"><Avatar name={order.rider} size="sm" /><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">{order.rider}</p><p className="text-[10px] text-slate-500">E-bike · 4.9 rating</p></div><span className="grid size-8 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Check className="size-4" aria-hidden /></span></Card>
      </Body>
    </>
  );
}

export function CustomerPayment({ onPaid }: { onPaid: () => void }) {
  const [method, setMethod] = useState<'wallet' | 'card'>('wallet');
  return (
    <>
      <AppHeader subtitle="Secure payment" title="Payment" />
      <Body>
        <div role="radiogroup" aria-label="Payment method" className="space-y-2">
          {([['wallet', 'Wallet pay', 'Fastest, one tap'], ['card', 'Card ending 4242', 'Visa']] as const).map(([id, label, note]) => <button key={id} type="button" role="radio" aria-checked={method === id} onClick={() => setMethod(id)} className={cn('flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', method === id ? 'border-[color:var(--demo-accent)]' : 'border-slate-200')}><CreditCard className="size-4 text-slate-500" aria-hidden /><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">{label}</span><span className="block text-[10px] text-slate-500">{note}</span></span>{method === id && <Check className="size-4 text-[color:var(--demo-accent)]" aria-hidden />}</button>)}
        </div>
        <Card className="space-y-1.5 text-[12px]">
          <div className="flex justify-between text-slate-600"><span>Delivery</span><span className="tabular-nums">{money(6.5)}</span></div>
          <div className="flex justify-between text-slate-600"><span>Service fee</span><span className="tabular-nums">{money(0.5)}</span></div>
          <div className="flex justify-between border-t border-slate-100 pt-1.5 font-semibold text-slate-900"><span>Total</span><span className="tabular-nums">{money(7)}</span></div>
        </Card>
        <button type="button" onClick={onPaid} className={primary}>Pay {money(7)}</button>
      </Body>
    </>
  );
}

export function CustomerHistory() {
  return (
    <>
      <AppHeader subtitle="Your deliveries" title="History" />
      <Body>
        {ORDERS.map((o) => (
          <Card key={o.id} className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Package className="size-4" aria-hidden /></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold text-slate-900">{o.kind} · {o.pickup}</span><span className="block text-[10px] text-slate-500">{o.id} · {o.placed}</span></span>
            <Pill tone={tone(o.status)}>{o.status}</Pill>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function CustomerProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [[Star, 'Plus member · 48 deliveries'], [ShieldCheck, 'Privacy and safety'], [Bell, 'Notifications'], [Settings, 'Settings']];
  return (
    <>
      <AppHeader subtitle="Customer" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center"><Avatar name="Hannah Lindqvist" size="lg" /><p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p><p className="text-[11px] text-slate-500">Plus member · 14 Harbour St</p></Card>
        <Card className="divide-y divide-slate-100 p-0">{rows.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 px-3 py-3 text-[12px] text-slate-700"><Icon className="size-4 text-slate-500" aria-hidden />{label}<ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden /></div>)}</Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><LogOut className="size-4" aria-hidden /> Sign out</button>
      </Body>
    </>
  );
}

/* ---------------------------------- Rider app ---------------------------------- */

export function RiderDashboard({ go }: { go: (s: RiderScreen) => void }) {
  const r = RIDERS[0];
  return (
    <>
      <AppHeader subtitle="Shift · 11:00–19:00" title={r.name} right={<Avatar name={r.name} />} />
      <Body>
        <div className="grid grid-cols-3 gap-2">{[['Today', '$84'], ['Drops', '9'], ['On time', `${r.onTime}%`]].map(([l, v]) => <Card key={l} className="text-center"><p className="text-base font-semibold tabular-nums text-slate-900">{v}</p><p className="text-[10px] text-slate-500">{l}</p></Card>)}</div>
        <button type="button" onClick={() => go('orders')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Card className="border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)]"><p className="text-[11px] font-medium text-[color:var(--demo-accent-ink)]">New order nearby · 1.2 km</p><p className="mt-0.5 text-sm font-semibold text-slate-900">{ORDERS[2].pickup} → {ORDERS[2].drop}</p><p className="text-[11px] text-slate-600">{money(ORDERS[2].fee)} · tap to review</p></Card></button>
        <Card><p className="text-[11px] font-semibold text-slate-900">Shift progress</p><div className="mt-2"><ProgressBar value={45} tone="blue" /></div></Card>
      </Body>
    </>
  );
}

export function RiderOrders({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <>
      <AppHeader subtitle="Nearby, ready to accept" title="New orders" />
      <Body>
        <Card className="space-y-2">
          <div className="flex items-center justify-between"><p className="text-[12px] font-semibold text-slate-900">{ORDERS[2].id} · Business</p><Pill tone="amber">Waiting</Pill></div>
          <p className="text-[11px] text-slate-600">{ORDERS[2].pickup} → {ORDERS[2].drop}</p>
          <p className="text-[11px] text-slate-500">{ORDERS[2].distance} km · {money(ORDERS[2].fee)}</p>
          <button type="button" onClick={() => { setAccepted(true); onAccept(); }} className={cn(primary, accepted && 'bg-[var(--demo-good)] hover:bg-[var(--demo-good)]')}>{accepted ? <><Check className="size-4" aria-hidden /> Accepted</> : 'Accept order'}</button>
        </Card>
        <Card className="space-y-1"><p className="text-[12px] font-semibold text-slate-900">{ORDERS[0].id} · Food</p><p className="text-[11px] text-slate-600">{ORDERS[0].pickup} → {ORDERS[0].drop}</p></Card>
      </Body>
    </>
  );
}

export function RiderRoute() {
  const order = ORDERS[0];
  return (
    <>
      <AppHeader subtitle={`Next: ${order.drop}`} title="Navigation" right={<Pill tone="blue">{order.eta} min</Pill>} />
      <div className="relative h-56 shrink-0"><MapView from={{ x: 22, y: 70, label: 'You' }} to={order.to} progress={55} label="Navigation route" className="size-full" /></div>
      <Body>
        <Card className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[var(--demo-accent)] text-white"><Navigation className="size-5" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">In 200 m, turn left</p><p className="text-[10px] text-slate-500">Harbour St, drop-off on the right</p></div></Card>
        <button type="button" className={primary}>Start navigation</button>
      </Body>
    </>
  );
}

export function RiderStatus() {
  const [step, setStep] = useState(1);
  const steps = ['Picked up', 'On the way', 'Delivered'] as const;
  return (
    <>
      <AppHeader subtitle={`${ORDERS[0].id} · ${ORDERS[0].customer}`} title="Delivery status" />
      <Body>
        <Card>
          <ol className="space-y-3">
            {steps.map((s, i) => <li key={s} className="flex items-center gap-3"><span className={cn('grid size-7 place-items-center rounded-full text-[11px] font-semibold', i < step ? 'bg-[var(--demo-good)] text-white' : i === step ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-500')}>{i < step ? <Check className="size-3.5" aria-hidden /> : i + 1}</span><span className={cn('text-[12px] font-medium', i <= step ? 'text-slate-900' : 'text-slate-500')}>{s}</span></li>)}
          </ol>
        </Card>
        <button type="button" disabled={step >= 2} onClick={() => setStep((s) => Math.min(2, s + 1))} className={cn(primary, 'disabled:bg-slate-300')}>{step >= 2 ? 'Delivered and signed' : step === 0 ? 'Mark on the way' : 'Confirm delivery'}</button>
        <p className="flex items-center gap-1.5 text-[10px] text-slate-500"><Zap className="size-3" aria-hidden /> A photo of the drop-off is taken automatically.</p>
      </Body>
    </>
  );
}

export function RiderEarnings() {
  const bars = [42, 58, 36, 66, 48, 72, 60];
  return (
    <>
      <AppHeader subtitle="This week" title="Earnings" />
      <Body>
        <Card><p className="text-[11px] text-slate-500">Week total</p><p className="text-xl font-semibold tabular-nums text-slate-900">$842</p><div className="mt-3 flex h-24 items-end gap-1.5">{bars.map((v, i) => <div key={i} className="demo-grow flex-1 rounded-t-md bg-[var(--demo-accent)]" style={{ height: `${v}%`, opacity: 0.45 + i / 14, ['--i' as string]: i }} />)}</div></Card>
        <Card className="flex items-center justify-between"><span className="text-[12px] text-slate-700">Paid out to bank</span><span className="text-[12px] font-semibold tabular-nums text-slate-900">$620</span></Card>
        <Card className="flex items-center gap-3"><Wallet className="size-4 text-slate-500" aria-hidden /><p className="text-[12px] text-slate-700">Next payout Friday, 09:00</p></Card>
      </Body>
    </>
  );
}
