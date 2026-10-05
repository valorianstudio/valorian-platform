'use client';

import { AlarmClock, Bell, BadgeCheck, Boxes, Check, ChevronRight, ClipboardList, Cross, Droplets, House, LogOut, Lock, Mail, Minus, Pill as PillIcon, Plus, Search, Settings, ShoppingBag, Truck, Upload, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Pill, ProgressBar } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { MEDICINES, NOTIFICATIONS, ORDERS, PRESCRIPTIONS, REMINDERS, TRACK } from '@/data/pharmacy/catalog';
import { cn } from '@/lib/cn';
import { PharmacyLogo } from './pharmacy-logo';
import { orderTone, rxTone, stockTone } from './pharmacy-cards';

/** Screens of the customer app and the staff app. Compact, touch-sized and driven by dummy data. */

export type CustomerScreen = 'splash' | 'login' | 'home' | 'search' | 'product' | 'upload' | 'cart' | 'track' | 'reminder' | 'profile';
export type StaffScreen = 'dashboard' | 'orders' | 'inventory' | 'review' | 'delivery';

export const CUSTOMER_NAV: { id: 'home' | 'search' | 'cart' | 'track' | 'profile'; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'cart', label: 'Basket', icon: ShoppingBag },
  { id: 'track', label: 'Orders', icon: Truck },
  { id: 'profile', label: 'Profile', icon: User },
];

export const STAFF_NAV: { id: StaffScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'inventory', label: 'Stock', icon: Boxes },
  { id: 'review', label: 'Review', icon: ClipboardList },
  { id: 'delivery', label: 'Delivery', icon: Truck },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--demo-accent)] text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';
const iconBtn = 'grid size-9 place-items-center rounded-full bg-white/10 focus-visible:outline-2 focus-visible:outline-white';

/* ---------------------------------- Customer app ---------------------------------- */

export function CustomerSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--demo-accent)] px-6 pb-8 pt-20 text-center">
      <span className="grid size-20 place-items-center rounded-3xl bg-[var(--demo-cyan)] text-[color:var(--demo-header)] shadow-[0_20px_40px_-12px_rgb(6_182_212/0.6)]"><Cross className="size-9" strokeWidth={2.5} aria-hidden /></span>
      <h3 className="mt-7 text-2xl font-bold tracking-tight text-white">CLEARWELL</h3>
      <p className="mt-2 text-[13px] text-white/80">Trusted pharmacy care, delivered.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-xl bg-white text-sm font-semibold text-[color:var(--demo-accent)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get started</button>
    </div>
  );
}

export function CustomerLogin({ onSignIn }: { onSignIn: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <PharmacyLogo />
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
      <p className="mt-3 text-center text-[11px] text-slate-500">Demo app: continue to your pharmacy.</p>
    </div>
  );
}

export function CustomerHome({ go }: { go: (s: CustomerScreen) => void }) {
  return (
    <>
      <AppHeader subtitle="Good morning" title="Hannah" right={<button type="button" aria-label="Notifications" className={iconBtn}><Bell className="size-4" aria-hidden /></button>} />
      <Body>
        <button type="button" onClick={() => go('search')} className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-[12px] text-slate-500 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Search className="size-4" aria-hidden /> Search medicines and products</button>
        <button type="button" onClick={() => go('reminder')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Card className="flex items-center gap-3 border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)]">
            <span className="grid size-10 place-items-center rounded-full bg-white text-[color:var(--demo-accent)]"><AlarmClock className="size-5" aria-hidden /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">Next dose: Amoxil 500</span><span className="block text-[11px] text-slate-600">Due at 14:00 · 1 capsule</span></span>
            <ChevronRight className="size-4 text-slate-400" aria-hidden />
          </Card>
        </button>
        <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Truck className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Order #7741 out for delivery</p><p className="text-[10px] text-slate-500">Arriving by 15:40</p></div></Card>
        <div className="grid grid-cols-3 gap-2">
          {([['Refill', ClipboardList, 'upload'], ['Basket', ShoppingBag, 'cart'], ['Reminders', AlarmClock, 'reminder']] as const).map(([label, Icon, target]) => {
            const IconCmp = Icon as LucideIcon;
            return <button key={label} type="button" onClick={() => go(target as CustomerScreen)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 text-[10px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><span className="grid size-8 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><IconCmp className="size-4" aria-hidden /></span>{label}</button>;
          })}
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Featured</p>
        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
          {MEDICINES.filter((m) => !m.rx).slice(0, 4).map((m) => <button key={m.id} type="button" onClick={() => go('product')} className="w-32 shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><p className="truncate text-[11px] font-semibold text-slate-900">{m.name}</p><p className="mt-1 text-[11px] font-semibold tabular-nums text-slate-700">${m.price.toFixed(2)}</p></button>)}
        </div>
      </Body>
    </>
  );
}

export function CustomerSearch({ onPick }: { onPick: () => void }) {
  const [query, setQuery] = useState('');
  const list = MEDICINES.filter((m) => `${m.name} ${m.generic}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <AppHeader subtitle="Pharmacy" title="Search" />
      <Body>
        <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[12px] text-slate-600 focus-within:border-[color:var(--demo-accent)]"><Search className="size-4 text-slate-400" aria-hidden /><span className="sr-only">Search</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Medicine or generic name" className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none" /></label>
        {list.map((m) => (
          <button key={m.id} type="button" onClick={onPick} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><PillIcon className="size-4" aria-hidden /></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold text-slate-900">{m.name}</span><span className="block truncate text-[10px] text-slate-500">{m.generic} · {m.strength}</span></span>
            {m.rx ? <Pill tone="blue">Rx</Pill> : <span className="text-[11px] font-semibold tabular-nums text-slate-700">${m.price.toFixed(2)}</span>}
          </button>
        ))}
        {list.length === 0 && <p className="py-6 text-center text-[12px] text-slate-500">No matches yet.</p>}
      </Body>
    </>
  );
}

export function CustomerProduct({ onAdd }: { onAdd: () => void }) {
  const medicine = MEDICINES[3];
  const [added, setAdded] = useState(false);
  return (
    <>
      <AppHeader subtitle={medicine.generic} title={medicine.name} />
      <Body>
        <Card className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><PillIcon className="size-7" aria-hidden /></span>
          <p className="text-sm font-semibold text-slate-900">{medicine.strength}</p>
          <div className="flex flex-wrap justify-center gap-1.5"><Pill tone={stockTone(medicine)}>{medicine.stock} in stock</Pill><Pill tone="slate">Exp. {medicine.expiry}</Pill></div>
        </Card>
        <Card className="space-y-2 text-[11px] text-slate-600"><p className="font-semibold text-slate-900">Used for</p><p>Relief of mild to moderate pain and fever. Take with food. Ask a pharmacist if you are pregnant or taking other medicines.</p></Card>
        <Card className="flex items-center justify-between"><span className="text-[12px] text-slate-600">Price</span><span className="text-base font-semibold tabular-nums text-slate-900">${medicine.price.toFixed(2)}</span></Card>
        <button type="button" onClick={() => { setAdded(true); onAdd(); }} className={primary}>{added ? <><Check className="size-4" aria-hidden /> Added to basket</> : 'Add to basket'}</button>
      </Body>
    </>
  );
}

export function CustomerUpload() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <AppHeader subtitle="Refill or new prescription" title="Upload prescription" />
      <Body>
        {sent ? (
          <Card className="demo-rise flex flex-col items-center py-8 text-center"><span className="grid size-12 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><BadgeCheck className="size-6" aria-hidden /></span><p className="mt-3 text-base font-semibold text-slate-900">Sent for review</p><p className="mt-1 text-xs text-slate-600">A pharmacist will verify it within 30 minutes.</p></Card>
        ) : (
          <>
            <button type="button" onClick={() => setSent(true)} className="flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)] p-6 text-center focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <span className="grid size-11 place-items-center rounded-full bg-white text-[color:var(--demo-accent)]"><Upload className="size-5" aria-hidden /></span>
              <span className="text-sm font-semibold text-slate-900">Take a photo or upload</span>
              <span className="text-[11px] text-slate-600">JPG, PNG or PDF, up to 10 MB</span>
            </button>
            <Card className="space-y-2 text-[11px] text-slate-600"><p className="font-semibold text-slate-900">Your doctor</p><p>Dr. Ines Costa · Riverside Clinic</p><p>Prescription RX-4411 · Amoxil 500</p></Card>
            <button type="button" onClick={() => setSent(true)} className={primary}>Send to pharmacy</button>
          </>
        )}
      </Body>
    </>
  );
}

export function CustomerCart({ onCheckout }: { onCheckout: () => void }) {
  const [cart, setCart] = useState<Record<string, number>>({ m4: 2, m7: 1 });
  const items = MEDICINES.filter((m) => (cart[m.id] ?? 0) > 0);
  const total = items.reduce((sum, m) => sum + (cart[m.id] ?? 0) * m.price, 0);
  const qty = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));
  return (
    <>
      <AppHeader subtitle={`${items.length} products`} title="Basket" />
      <Body>
        {items.length === 0 && <p className="py-8 text-center text-[12px] text-slate-500">Your basket is empty.</p>}
        {items.map((m) => (
          <Card key={m.id} className="flex items-center gap-3 p-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Droplets className="size-4" aria-hidden /></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold text-slate-900">{m.name}</span><span className="block text-[11px] font-semibold tabular-nums text-slate-700">${m.price.toFixed(2)}</span></span>
            <div className="flex items-center gap-1.5">
              <button type="button" aria-label={`Remove one ${m.name}`} onClick={() => qty(m.id, -1)} className="grid size-7 place-items-center rounded-full bg-slate-100 text-slate-700 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Minus className="size-3.5" aria-hidden /></button>
              <span className="w-4 text-center text-[12px] font-semibold tabular-nums">{cart[m.id]}</span>
              <button type="button" aria-label={`Add one ${m.name}`} onClick={() => qty(m.id, 1)} className="grid size-7 place-items-center rounded-full bg-[var(--demo-accent)] text-white focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Plus className="size-3.5" aria-hidden /></button>
            </div>
          </Card>
        ))}
        {items.length > 0 && <Card className="flex items-center justify-between"><span className="text-[12px] text-slate-700">Total</span><span className="text-[13px] font-semibold tabular-nums text-slate-900">${total.toFixed(2)}</span></Card>}
        <button type="button" disabled={!items.length} onClick={onCheckout} className={cn(primary, 'disabled:bg-slate-300')}><ShoppingBag className="size-4" aria-hidden /> Checkout</button>
      </Body>
    </>
  );
}

export function CustomerTrack() {
  return (
    <>
      <AppHeader subtitle="Order #7741" title="Order tracking" right={<Pill tone="amber">Out for delivery</Pill>} />
      <Body>
        <Card>
          <ol className="relative space-y-4 border-l border-slate-200 pl-4">
            {TRACK.map((s) => <li key={s.label} className="relative"><span className={cn('absolute -left-[1.2rem] top-0.5 size-3 rounded-full', s.done ? 'bg-[var(--demo-good)]' : 'bg-slate-200')} /><p className={cn('text-[12px] font-semibold', s.done ? 'text-slate-900' : 'text-slate-500')}>{s.label}</p><p className="text-[10px] text-slate-500">{s.note}</p></li>)}
          </ol>
        </Card>
        <Card><div className="flex justify-between text-[11px] text-slate-600"><span>Progress</span><span className="font-semibold text-slate-900">3 of 4</span></div><div className="mt-2"><ProgressBar value={75} tone="emerald" /></div></Card>
        <Card className="flex items-center gap-3"><Avatar name="Leon Park" size="sm" /><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Courier: Jordan M.</p><p className="text-[10px] text-slate-500">Signed handover at the door</p></div></Card>
      </Body>
    </>
  );
}

export function CustomerReminder() {
  return (
    <>
      <AppHeader subtitle="Doses and refills" title="Medicine reminders" />
      <Body>
        {REMINDERS.map((r) => (
          <Card key={r.medicine} className="space-y-2">
            <div className="flex items-center justify-between gap-2"><p className="text-[12px] font-semibold text-slate-900">{r.medicine}</p><Pill tone="blue">Active</Pill></div>
            <p className="text-[11px] text-slate-600">{r.dose}</p>
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-[color:var(--demo-accent-ink)]"><AlarmClock className="size-3.5" aria-hidden /> {r.time}</p>
            <p className="text-[10px] text-slate-500">{r.left}</p>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function CustomerProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [[ClipboardList, 'Prescriptions on file'], [AlarmClock, 'Medicine reminders'], [Bell, 'Notifications'], [Settings, 'Settings']];
  return (
    <>
      <AppHeader subtitle="Patient" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center"><Avatar name="Hannah Lindqvist" size="lg" /><p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p><p className="text-[11px] text-slate-500">Care Plus member · Riverside</p></Card>
        <Card className="divide-y divide-slate-100 p-0">{rows.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 px-3 py-3 text-[12px] text-slate-700"><Icon className="size-4 text-slate-500" aria-hidden />{label}<ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden /></div>)}</Card>
        <Card className="space-y-2"><p className="text-[12px] font-semibold text-slate-900">Allergies</p><div className="flex flex-wrap gap-1.5"><Pill tone="amber">Penicillin</Pill><Pill tone="slate">No other known</Pill></div></Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><LogOut className="size-4" aria-hidden /> Sign out</button>
      </Body>
    </>
  );
}

/* ---------------------------------- Staff app ---------------------------------- */

export function StaffDashboard({ go }: { go: (s: StaffScreen) => void }) {
  return (
    <>
      <AppHeader subtitle="Monday" title="Priya Shah" right={<Avatar name="Priya Shah" />} />
      <Body>
        <div className="grid grid-cols-2 gap-2">{[['Orders today', '64'], ['To verify', '2'], ['Low stock', '12'], ['Out for delivery', '7']].map(([l, v]) => <Card key={l}><p className="text-[10px] text-slate-500">{l}</p><p className="text-base font-semibold tabular-nums text-slate-900">{v}</p></Card>)}</div>
        <button type="button" onClick={() => go('review')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><ClipboardList className="size-4" aria-hidden /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">RX-4411 needs review</span><span className="block text-[10px] text-slate-500">Amoxil 500 · Dr. Ines Costa</span></span><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card></button>
      </Body>
    </>
  );
}

export function StaffOrders() {
  const [status, setStatus] = useState<Record<string, (typeof ORDERS)[number]['status']>>({});
  return (
    <>
      <AppHeader subtitle="Today" title="New orders" />
      <Body>
        {ORDERS.slice(0, 4).map((o) => {
          const current = status[o.id] ?? o.status;
          const next = current === 'Placed' ? 'Packed' : current === 'Packed' ? 'Out for delivery' : null;
          return (
            <Card key={o.id} className="space-y-2">
              <div className="flex items-center justify-between"><p className="text-[12px] font-semibold text-slate-900">{o.id} · {o.customer}</p><Pill tone={orderTone(current)}>{current}</Pill></div>
              <p className="text-[10px] text-slate-500">{o.items} items · {o.method} · ${o.total.toFixed(2)}</p>
              {next && <button type="button" onClick={() => setStatus((s) => ({ ...s, [o.id]: next }))} className="rounded-full bg-[var(--demo-accent)] px-3 py-1 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Mark {next.toLowerCase()}</button>}
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function StaffInventory() {
  return (
    <>
      <AppHeader subtitle="Reorder points" title="Stock" />
      <Body>
        {MEDICINES.slice(0, 6).map((m) => (
          <Card key={m.id} className="flex items-center gap-3">
            <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-slate-900">{m.name}</p><p className="text-[10px] text-slate-500">{m.stock} units · exp. {m.expiry}</p></div>
            <Pill tone={stockTone(m)}>{m.stock <= m.reorderAt ? 'Reorder' : 'OK'}</Pill>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function StaffReview() {
  const [done, setDone] = useState<string[]>([]);
  return (
    <>
      <AppHeader subtitle="Pharmacist check" title="Prescription review" />
      <Body>
        {PRESCRIPTIONS.filter((r) => r.status !== 'Dispensed').map((r) => {
          const verified = done.includes(r.id) || r.status === 'Verified';
          return (
            <Card key={r.id} className="space-y-2">
              <div className="flex items-center justify-between"><p className="text-[12px] font-semibold text-slate-900">{r.id} · {r.patient}</p><Pill tone={rxTone(verified ? 'Verified' : 'Pending')}>{verified ? 'Verified' : 'Pending'}</Pill></div>
              <p className="text-[10px] text-slate-500">{r.doctor} · {r.clinic}</p>
              <p className="text-[11px] text-slate-700">{r.items.join(', ')}</p>
              {!verified && <button type="button" onClick={() => setDone((d) => [...d, r.id])} className="rounded-full bg-[var(--demo-accent)] px-3 py-1 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Verify</button>}
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function StaffDelivery() {
  return (
    <>
      <AppHeader subtitle="Riders on the road" title="Delivery status" />
      <Body>
        {ORDERS.filter((o) => o.method === 'Delivery').map((o) => (
          <Card key={o.id} className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Truck className="size-4" aria-hidden /></span>
            <div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">{o.id} · {o.customer}</p><p className="text-[10px] text-slate-500">{o.eta}</p></div>
            <Pill tone={orderTone(o.status)}>{o.status}</Pill>
          </Card>
        ))}
        <Card className="flex items-center justify-center gap-2 text-[12px] font-semibold text-slate-600"><Check className="size-4" aria-hidden /> {NOTIFICATIONS.length} alerts today</Card>
      </Body>
    </>
  );
}
