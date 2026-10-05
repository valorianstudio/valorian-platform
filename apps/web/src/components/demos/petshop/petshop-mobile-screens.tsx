'use client';

import { Bell, Bone, Calendar, Check, ChevronRight, Clock, CreditCard, House, Lock, LogOut, Mail, PawPrint, Scissors, Search, Settings, ShoppingBag, Stethoscope, Truck, User, Users, Plus, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Pill, ProgressBar } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { APPOINTMENTS, PETS, PRODUCTS, TRACK } from '@/data/petshop/catalog';
import type { Appointment } from '@/data/petshop/catalog';
import { cn } from '@/lib/cn';
import { PetshopLogo } from './petshop-logo';
import { tone } from './petshop-cards';

/** Screens of the customer app and the staff app. Compact, touch-sized, and driven by dummy data. */

export type CustomerScreen = 'splash' | 'login' | 'home' | 'pet' | 'grooming' | 'vet' | 'shop' | 'track' | 'notifications' | 'profile';
export type StaffScreen = 'dashboard' | 'appointments' | 'customers' | 'services';

export const CUSTOMER_NAV: { id: 'home' | 'shop' | 'pet' | 'track' | 'profile'; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'pet', label: 'My pets', icon: PawPrint },
  { id: 'track', label: 'Orders', icon: Truck },
  { id: 'profile', label: 'Profile', icon: User },
];

export const STAFF_NAV: { id: StaffScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'appointments', label: 'Visits', icon: Calendar },
  { id: 'customers', label: 'Records', icon: Users },
  { id: 'services', label: 'Services', icon: Settings },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--demo-accent)] text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';

/* ---------------------------------- Customer app ---------------------------------- */

export function CustomerSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--demo-accent)] px-6 pb-8 pt-20 text-center">
      <span className="grid size-20 animate-pulse-soft place-items-center rounded-3xl bg-[var(--demo-orange)] text-white shadow-[0_20px_40px_-12px_rgb(249_115_22/0.6)]"><PawPrint className="size-9" aria-hidden /></span>
      <h3 className="mt-7 text-2xl font-bold tracking-tight text-white">PAWSOME</h3>
      <p className="mt-2 text-[13px] text-white/80">Complete care for the pets you love.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-xl bg-[var(--demo-beige,#fef3c7)] text-sm font-semibold text-[color:var(--demo-accent)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get started</button>
    </div>
  );
}

export function CustomerLogin({ onSignIn }: { onSignIn: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <PetshopLogo />
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
      <p className="mt-3 text-center text-[11px] text-slate-500">Demo app: continue to your pets.</p>
    </div>
  );
}

export function CustomerHome({ go }: { go: (s: CustomerScreen) => void }) {
  const next = APPOINTMENTS[0];
  return (
    <>
      <AppHeader subtitle="Good morning" title="Hannah" right={<button type="button" aria-label="Notifications" onClick={() => go('notifications')} className="grid size-9 place-items-center rounded-full bg-white/10 focus-visible:outline-2 focus-visible:outline-white"><Bell className="size-4" aria-hidden /></button>} />
      <Body>
        <button type="button" onClick={() => go('pet')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Card className="flex items-center gap-3 border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)]">
            <span className="grid size-12 place-items-center rounded-full bg-white text-[color:var(--demo-accent)]"><Bone className="size-5" aria-hidden /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">Biscuit</span><span className="block text-[11px] text-slate-600">Golden retriever · 4 yrs · all vaccines up to date</span></span>
            <ChevronRight className="size-4 text-slate-400" aria-hidden />
          </Card>
        </button>
        <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Clock className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Grooming, {next.time}</p><p className="text-[10px] text-slate-500">{next.pet} with {next.staff}</p></div></Card>
        <div className="grid grid-cols-3 gap-2">
          {[['Grooming', Scissors, 'grooming'], ['Vet visit', Stethoscope, 'vet'], ['Shop', ShoppingBag, 'shop']].map(([label, Icon, target]) => {
            const IconCmp = Icon as LucideIcon;
            return <button key={label as string} type="button" onClick={() => go(target as CustomerScreen)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 text-[10px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><span className="grid size-8 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><IconCmp className="size-4" aria-hidden /></span>{label as string}</button>;
          })}
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Recommended for you</p>
        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
          {PRODUCTS.filter((p) => p.tag).slice(0, 4).map((p) => <div key={p.id} className="w-32 shrink-0 rounded-xl border border-slate-200 bg-white p-2.5"><p className="truncate text-[11px] font-semibold text-slate-900">{p.name}</p><p className="mt-1 text-[11px] font-semibold tabular-nums text-slate-700">${p.price}</p></div>)}
        </div>
      </Body>
    </>
  );
}

export function CustomerPet() {
  const pet = PETS[0];
  return (
    <>
      <AppHeader subtitle={`${pet.breed} · ${pet.age} yrs`} title={pet.name} />
      <Body>
        <Card className="grid grid-cols-3 gap-2 text-center">{[['Weight', `${pet.weight} kg`], ['Vaccines', 'Up to date'], ['Next', 'Grooming']].map(([l, v]) => <div key={l}><p className="text-[12px] font-semibold text-slate-900">{v}</p><p className="text-[10px] text-slate-500">{l}</p></div>)}</Card>
        <div className="flex flex-wrap gap-1.5">{pet.allergies.map((a) => <Pill key={a} tone="amber">Allergy: {a}</Pill>)}</div>
        <Card><p className="text-[11px] font-semibold text-slate-900">Visit history</p><ol className="mt-2 space-y-3 border-l border-slate-200 pl-3">{pet.visits.map((v) => <li key={v.date} className="relative"><span aria-hidden className="absolute -left-[0.95rem] top-1 size-2 rounded-full bg-[var(--demo-accent)]" /><p className="text-[10px] text-slate-500">{v.date}</p><p className="text-[12px] text-slate-700">{v.note}</p></li>)}</ol></Card>
      </Body>
    </>
  );
}

export function CustomerBook({ kind, onBook }: { kind: 'grooming' | 'vet'; onBook: () => void }) {
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const days = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'];
  const slots = ['09:00', '10:30', '13:00', '14:30', '16:00'];
  return (
    <>
      <AppHeader subtitle={kind === 'grooming' ? 'Full groom, 90 min' : 'Vet checkup, 30 min'} title={kind === 'grooming' ? 'Book grooming' : 'Vet appointment'} />
      <Body>
        {done ? (
          <Card className="demo-rise flex flex-col items-center py-8 text-center"><span className="grid size-12 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Check className="size-6" aria-hidden /></span><p className="mt-3 text-base font-semibold text-slate-900">Booked for Biscuit</p><p className="mt-1 text-xs text-slate-600">{days[day]} · {slot}</p></Card>
        ) : (
          <>
            <div role="radiogroup" aria-label="Day" className="grid grid-cols-5 gap-1.5">{days.map((d, i) => <button key={d} type="button" role="radio" aria-checked={day === i} onClick={() => setDay(i)} className={cn('rounded-lg py-1.5 text-[10px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', day === i ? 'bg-[var(--demo-accent)] text-white' : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200')}>{d}</button>)}</div>
            <div role="radiogroup" aria-label="Time" className="grid grid-cols-3 gap-1.5">{slots.map((s) => <button key={s} type="button" role="radio" aria-checked={slot === s} onClick={() => setSlot(s)} className={cn('rounded-lg py-2 text-[11px] font-semibold tabular-nums focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', slot === s ? 'bg-[var(--demo-accent)] text-white' : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200')}>{s}</button>)}</div>
            <button type="button" disabled={!slot} onClick={() => { setDone(true); onBook(); }} className={cn(primary, 'disabled:bg-slate-300')}>Confirm appointment</button>
          </>
        )}
      </Body>
    </>
  );
}

export function CustomerShop() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState<'All' | 'Dogs' | 'Cats' | 'Birds' | 'Accessories'>('All');
  const list = PRODUCTS.filter((p) => cat === 'All' || p.category === cat);
  const items = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);
  return (
    <>
      <AppHeader subtitle="Pet shop" title="Shop" right={<Pill tone={items ? 'amber' : 'slate'}>{items} in bag</Pill>} />
      <div role="group" aria-label="Category" className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-slate-200 bg-white px-3.5 py-2.5">
        {(['All', 'Dogs', 'Cats', 'Birds', 'Accessories'] as const).map((c) => <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)} className={cn('shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', c === cat ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>{c}</button>)}
      </div>
      <Body>
        <div key={cat} className="demo-slide space-y-2.5">
          {list.map((p) => (
            <Card key={p.id} className="flex items-center gap-3 p-2.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Bone className="size-4" aria-hidden /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold text-slate-900">{p.name}</span><span className="block text-[11px] font-semibold tabular-nums text-slate-700">${p.price}</span></span>
              <div className="flex items-center gap-1.5">
                <button type="button" aria-label={`Remove one ${p.name}`} disabled={!cart[p.id]} onClick={() => setCart((c) => ({ ...c, [p.id]: Math.max(0, (c[p.id] ?? 0) - 1) }))} className="grid size-7 place-items-center rounded-full bg-slate-100 text-slate-700 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Minus className="size-3.5" aria-hidden /></button>
                <span className="w-4 text-center text-[12px] font-semibold tabular-nums">{cart[p.id] ?? 0}</span>
                <button type="button" aria-label={`Add ${p.name}`} onClick={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))} className="grid size-7 place-items-center rounded-full bg-[var(--demo-accent)] text-white focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Plus className="size-3.5" aria-hidden /></button>
              </div>
            </Card>
          ))}
        </div>
        {items > 0 && <Card className="flex items-center justify-between"><span className="text-[12px] text-slate-700">{items} items</span><span className="text-[13px] font-semibold tabular-nums text-slate-900">${total}</span></Card>}
        <button type="button" disabled={!items} className={cn(primary, 'disabled:bg-slate-300')}><CreditCard className="size-4" aria-hidden /> Checkout</button>
      </Body>
    </>
  );
}

export function CustomerTrack() {
  return (
    <>
      <AppHeader subtitle="Order #2201" title="Order tracking" right={<Pill tone="blue">Out soon</Pill>} />
      <Body>
        <Card>
          <ol className="relative space-y-4 border-l border-slate-200 pl-4">
            {TRACK.map((s) => <li key={s.label} className="relative"><span className={cn('absolute -left-[1.2rem] top-0.5 grid size-3 place-items-center rounded-full', s.done ? 'bg-[var(--demo-good)]' : 'bg-slate-200')} /><p className={cn('text-[12px] font-semibold', s.done ? 'text-slate-900' : 'text-slate-500')}>{s.label}</p><p className="text-[10px] text-slate-500">{s.note}</p></li>)}
          </ol>
        </Card>
        <Card><div className="flex justify-between text-[11px] text-slate-600"><span>Progress</span><span className="font-semibold text-slate-900">2 of 4</span></div><div className="mt-2"><ProgressBar value={50} tone="blue" /></div></Card>
      </Body>
    </>
  );
}

export function CustomerNotifications() {
  const items = [['Vaccination due soon', 'Pepper’s booster is due 9 Oct.', 'Today'], ['Grooming confirmed', 'Biscuit, Mon 12 Oct at 09:00.', 'Yesterday'], ['Order shipped', 'Order #2203 is on its way.', '4 Oct']];
  return (
    <>
      <AppHeader subtitle="Your updates" title="Notifications" />
      <Body>{items.map(([t, b, d]) => <Card key={t} className="space-y-1"><div className="flex justify-between gap-2"><p className="text-[12px] font-semibold text-slate-900">{t}</p><span className="text-[10px] text-slate-500">{d}</span></div><p className="text-[11px] text-slate-600">{b}</p></Card>)}</Body>
    </>
  );
}

export function CustomerProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [[PawPrint, 'My pets: 1'], [CreditCard, 'Payment methods'], [Bell, 'Notifications'], [Settings, 'Settings']];
  return (
    <>
      <AppHeader subtitle="Customer" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center"><Avatar name="Hannah Lindqvist" size="lg" /><p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p><p className="text-[11px] text-slate-500">Pet Plus member · Gold</p></Card>
        <Card className="divide-y divide-slate-100 p-0">{rows.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 px-3 py-3 text-[12px] text-slate-700"><Icon className="size-4 text-slate-500" aria-hidden />{label}<ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden /></div>)}</Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><LogOut className="size-4" aria-hidden /> Sign out</button>
      </Body>
    </>
  );
}

/* ---------------------------------- Staff app ---------------------------------- */

export function StaffDashboard({ go }: { go: (s: StaffScreen) => void }) {
  return (
    <>
      <AppHeader subtitle="Saturday" title="Ana Ruiz" right={<Avatar name="Ana Ruiz" />} />
      <Body>
        <div className="grid grid-cols-2 gap-2">{[['Visits today', '14'], ['Checked in', '3'], ['Low stock', '2'], ['Orders', '12']].map(([l, v]) => <Card key={l}><p className="text-[10px] text-slate-500">{l}</p><p className="text-base font-semibold tabular-nums text-slate-900">{v}</p></Card>)}</div>
        <button type="button" onClick={() => go('appointments')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Stethoscope className="size-4" aria-hidden /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">Luna is in progress</span><span className="block text-[10px] text-slate-500">Vet checkup with Dr. Ines Costa</span></span><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card></button>
      </Body>
    </>
  );
}

export function StaffAppointments() {
  const [status, setStatus] = useState<Record<string, Appointment['status']>>({});
  return (
    <>
      <AppHeader subtitle="Today" title="Pet appointments" />
      <Body>
        {APPOINTMENTS.map((a) => {
          const current = status[a.id] ?? a.status;
          const next = current === 'Booked' ? 'Checked in' : current === 'Checked in' ? 'In progress' : current === 'In progress' ? 'Done' : null;
          return (
            <Card key={a.id} className="space-y-2">
              <div className="flex items-center justify-between"><p className="text-[12px] font-semibold text-slate-900">{a.time} · {a.pet}</p><Pill tone={tone(current)}>{current}</Pill></div>
              <p className="text-[10px] text-slate-500">{a.kind} · {a.staff}</p>
              {next && <button type="button" onClick={() => setStatus((s) => ({ ...s, [a.id]: next }))} className="rounded-full bg-[var(--demo-accent)] px-3 py-1 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Move to {next.toLowerCase()}</button>}
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function StaffCustomers() {
  return (
    <>
      <AppHeader subtitle="Pet records" title="Customers" />
      <Body>
        {PETS.map((p) => <Card key={p.id} className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><PawPrint className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-slate-900">{p.name} · {p.owner}</p><p className="text-[10px] text-slate-500">{p.breed} · next {p.next}</p></div><Pill tone={p.vaccinated ? 'green' : 'red'}>{p.vaccinated ? 'OK' : 'Due'}</Pill></Card>)}
      </Body>
    </>
  );
}

export function StaffServices() {
  const services = [['Full grooming', '90 min', 'Available'], ['Vet checkup', '30 min', 'Available'], ['Vaccination', '20 min', 'Vet only'], ['Training session', '60 min', 'Paused']] as const;
  return (
    <>
      <AppHeader subtitle="Manage what you offer" title="Services" />
      <Body>
        {services.map(([name, time, state]) => <Card key={name} className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Scissors className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">{name}</p><p className="text-[10px] text-slate-500">{time}</p></div><Pill tone={state === 'Available' ? 'green' : state === 'Paused' ? 'amber' : 'blue'}>{state}</Pill></Card>)}
        <Card className="flex items-center justify-center gap-2 text-[12px] font-semibold text-slate-600"><Users className="size-4" aria-hidden /> Staff roster: 6 on shift</Card>
      </Body>
    </>
  );
}

