'use client';

import { Bell, BedDouble, Calendar, CalendarCheck, Check, ChevronRight, ClipboardList, CreditCard, House, Lock, LogOut, Mail, Search, Settings, Sparkles, Star, Users, Coffee, UserRound, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Pill, ProgressBar } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { RESERVATIONS, ROOMS, TASKS } from '@/data/hotel/rooms';
import type { Room, RoomCategory } from '@/data/hotel/rooms';
import { cn } from '@/lib/cn';
import { tone } from './hotel-cards';
import { RoomArt } from './room-art';
import { HotelLogo } from './hotel-logo';

/** Screens of the guest app and the staff app. Compact, touch-sized, and driven by dummy data. */

export type GuestScreen = 'splash' | 'login' | 'home' | 'search' | 'details' | 'booking' | 'payment' | 'history' | 'profile';
export type StaffScreen = 'dashboard' | 'reservations' | 'rooms' | 'tasks';

export const GUEST_NAV: { id: 'home' | 'search' | 'history' | 'profile'; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'search', label: 'Rooms', icon: BedDouble },
  { id: 'history', label: 'Stays', icon: Calendar },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

export const STAFF_NAV: { id: StaffScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'reservations', label: 'Arrivals', icon: CalendarCheck },
  { id: 'rooms', label: 'Rooms', icon: BedDouble },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--demo-accent)] text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';
const money = (n: number) => `$${n.toLocaleString('en-US')}`;

/* ---------------------------------- Guest app ---------------------------------- */

export function GuestSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--demo-accent)] px-6 pb-8 pt-20 text-center">
      <HotelLogo tone="dark" />
      <span className="mt-6 h-px w-16 bg-[var(--demo-gold)]" aria-hidden />
      <p className="mt-5 font-serif text-lg leading-snug text-white/90">Welcome home, away from home.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-full border border-[color:var(--demo-gold)] bg-[var(--demo-gold)] text-sm font-semibold text-[color:var(--demo-accent)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Begin</button>
    </div>
  );
}

export function GuestLogin({ onSignIn }: { onSignIn: () => void }) {
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <HotelLogo />
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">Welcome back</h3>
      <p className="mt-1 text-[13px] text-slate-500">Sign in to manage your stays and check in faster.</p>
      <div className="mt-6 space-y-3">
        <div className={field}><Mail className="size-4 text-slate-400" aria-hidden /> hannah.l@mail.example</div>
        <div className={field}><Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••</div>
      </div>
      <button type="button" onClick={onSignIn} className={cn(primary, 'mt-auto')}>Sign in</button>
      <p className="mt-3 text-center text-[11px] text-slate-500">Demo app: continue to explore the hotel.</p>
    </div>
  );
}

export function GuestHome({ go }: { go: (s: GuestScreen) => void }) {
  const stay = RESERVATIONS[0];
  return (
    <>
      <AppHeader subtitle="Good afternoon" title="Hannah" right={<Avatar name="Hannah Lindqvist" />} />
      <Body>
        <div className="overflow-hidden rounded-2xl bg-[var(--demo-accent)] p-4 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--demo-gold)]">Your stay</p>
          <p className="mt-1 text-base font-semibold">Suite {stay.room} · Harbour view</p>
          <p className="text-[11px] text-white/75">{stay.checkIn} – {stay.checkOut} · {stay.nights} nights</p>
          <div className="mt-3 flex items-center gap-2">
            <Pill tone="green">Checked in</Pill>
            <button type="button" onClick={() => go('history')} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-white">View folio</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['Book a room', BedDouble, 'search'], ['Dining', Coffee, 'home'], ['Spa', Waves, 'home']].map(([label, Icon, target]) => {
            const IconCmp = Icon as LucideIcon;
            return (
              <button key={label as string} type="button" onClick={() => go(target as GuestScreen)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 text-[10px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                <span className="grid size-8 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><IconCmp className="size-4" aria-hidden /></span>
                {label as string}
              </button>
            );
          })}
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Today at Azure</p>
        <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Waves className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Infinity pool, 07:00–21:00</p><p className="text-[10px] text-slate-500">Heated, with towels at the poolside</p></div></Card>
        <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Sparkles className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Spa: book a massage</p><p className="text-[10px] text-slate-500">Two slots left this evening</p></div><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card>
      </Body>
    </>
  );
}

export function GuestSearch({ onOpen }: { onOpen: (id: string) => void }) {
  const [cat, setCat] = useState<'All' | RoomCategory>('All');
  const [nights, setNights] = useState(2);
  const list = ROOMS.filter((r) => (cat === 'All' || r.category === cat) && r.status === 'Available');
  return (
    <>
      <AppHeader subtitle={`${nights} nights · 2 guests`} title="Find a room" />
      <div className="shrink-0 space-y-2.5 border-b border-slate-200 bg-white px-3.5 py-3">
        <div role="group" aria-label="Category" className="flex gap-1.5">
          {(['All', 'Deluxe', 'Suite', 'Family'] as const).map((c) => (
            <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)} className={cn('flex-1 rounded-full py-1.5 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', c === cat ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>{c}</button>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px]">
          <span className="inline-flex items-center gap-2 text-slate-700"><Search className="size-3.5" aria-hidden /> Nights</span>
          <span className="inline-flex items-center gap-2"><button type="button" aria-label="Fewer nights" onClick={() => setNights((n) => Math.max(1, n - 1))} className="grid size-6 place-items-center rounded-full bg-white ring-1 ring-slate-200 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">−</button><span className="w-4 text-center font-semibold tabular-nums">{nights}</span><button type="button" aria-label="More nights" onClick={() => setNights((n) => n + 1)} className="grid size-6 place-items-center rounded-full bg-white ring-1 ring-slate-200 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">+</button></span>
        </div>
      </div>
      <Body>
        <div key={cat} className="demo-slide space-y-2.5">
          {list.map((r) => (
            <button key={r.id} type="button" onClick={() => onOpen(r.id)} className="block w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <div className="flex gap-3 p-2">
                <span className="size-20 shrink-0 overflow-hidden rounded-lg"><RoomArt category={r.category} label={`${r.category} room ${r.number}`} className="size-full" /></span>
                <span className="min-w-0 flex-1 py-0.5"><span className="block truncate text-[13px] font-semibold text-slate-900">{r.category} · {r.beds}</span><span className="block text-[10px] text-slate-500">{r.size} m² · {r.view} view</span><span className="mt-1 block text-[13px] font-semibold tabular-nums text-slate-900">{money(r.rate)} <span className="text-[10px] font-normal text-slate-500">/ night</span></span></span>
              </div>
            </button>
          ))}
          {list.length === 0 && <p className="py-8 text-center text-xs text-slate-500">No rooms available for these dates.</p>}
        </div>
      </Body>
    </>
  );
}

export function GuestDetails({ id, onBook }: { id: string; onBook: () => void }) {
  const room = ROOMS.find((r) => r.id === id) ?? ROOMS[0];
  return (
    <>
      <div className="relative h-40 shrink-0 bg-[var(--demo-accent-soft)]"><RoomArt category={room.category} label={`${room.category} room ${room.number}`} className="size-full" /></div>
      <Body>
        <div><p className="text-[10px] uppercase tracking-wide text-slate-500">{room.category} · floor {room.floor}</p><h3 className="text-base font-semibold text-slate-900">Room {room.number}</h3></div>
        <p className="inline-flex items-center gap-1 text-[11px] text-slate-600"><Star className="size-3 fill-[color:var(--demo-gold)] text-[color:var(--demo-gold)]" aria-hidden /> 4.9 · 212 reviews</p>
        <div className="flex flex-wrap gap-1.5">{room.features.map((f) => <span key={f} className="rounded-full bg-[var(--demo-accent-soft)] px-2.5 py-1 text-[10px] font-medium text-slate-800">{f}</span>)}</div>
        <Card className="grid grid-cols-3 gap-2 text-center">
          {[['Beds', room.beds.split(' ')[0]], ['Size', `${room.size} m²`], ['View', room.view]].map(([l, v]) => <div key={l}><p className="text-[12px] font-semibold text-slate-900">{v}</p><p className="text-[10px] text-slate-500">{l}</p></div>)}
        </Card>
        <div className="flex items-center justify-between"><p className="text-[12px] text-slate-600">Per night</p><p className="text-base font-semibold tabular-nums text-slate-900">{money(room.rate)}</p></div>
        <button type="button" onClick={onBook} className={primary}>Select room</button>
      </Body>
    </>
  );
}

export function GuestBooking({ room, onPay }: { room: Room; onPay: () => void }) {
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);
  const total = room.rate * nights;
  return (
    <>
      <AppHeader subtitle={`Room ${room.number} · ${room.category}`} title="Your booking" />
      <Body>
        <Card className="space-y-3">
          <div className="flex items-center justify-between text-[12px]"><span className="text-slate-700">Nights</span><span className="inline-flex items-center gap-2"><button type="button" aria-label="Fewer nights" onClick={() => setNights((n) => Math.max(1, n - 1))} className="grid size-6 place-items-center rounded-full bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">−</button><span className="w-4 text-center font-semibold tabular-nums">{nights}</span><button type="button" aria-label="More nights" onClick={() => setNights((n) => n + 1)} className="grid size-6 place-items-center rounded-full bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">+</button></span></div>
          <div className="flex items-center justify-between text-[12px]"><span className="text-slate-700">Guests</span><span className="inline-flex items-center gap-2"><button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid size-6 place-items-center rounded-full bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">−</button><span className="w-4 text-center font-semibold tabular-nums">{guests}</span><button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(4, g + 1))} className="grid size-6 place-items-center rounded-full bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">+</button></span></div>
        </Card>
        <Card>
          <dl className="space-y-1.5 text-[12px]">
            <div className="flex justify-between text-slate-600"><dt>{money(room.rate)} × {nights} nights</dt><dd className="tabular-nums">{money(total)}</dd></div>
            <div className="flex justify-between text-slate-600"><dt>Taxes and fees</dt><dd className="tabular-nums">{money(Math.round(total * 0.12))}</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-[13px] font-semibold text-slate-900"><dt>Total</dt><dd className="tabular-nums">{money(Math.round(total * 1.12))}</dd></div>
          </dl>
        </Card>
        <p className="text-[10px] text-slate-500">Free cancellation until 48 hours before arrival. {guests} guests.</p>
        <button type="button" onClick={onPay} className={primary}>Continue to payment</button>
      </Body>
    </>
  );
}

export function GuestPayment({ room, nights, onConfirm }: { room: Room; nights: number; onConfirm: () => void }) {
  const [method, setMethod] = useState<'wallet' | 'card'>('wallet');
  const total = Math.round(room.rate * nights * 1.12);
  return (
    <>
      <AppHeader subtitle="Secure payment" title="Payment" />
      <Body>
        <div role="radiogroup" aria-label="Payment method" className="space-y-2">
          {([['wallet', 'Wallet pay', 'One tap, no card details'], ['card', 'Card ending 4242', 'Visa · pay at check-in']] as const).map(([id, label, note]) => (
            <button key={id} type="button" role="radio" aria-checked={method === id} onClick={() => setMethod(id)} className={cn('flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', method === id ? 'border-[color:var(--demo-accent)]' : 'border-slate-200')}>
              <CreditCard className="size-4 text-slate-500" aria-hidden />
              <span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">{label}</span><span className="block text-[10px] text-slate-500">{note}</span></span>
              {method === id && <Check className="size-4 text-[color:var(--demo-accent)]" aria-hidden />}
            </button>
          ))}
        </div>
        <Card className="flex justify-between text-[13px] font-semibold text-slate-900"><span>Total, {nights} nights</span><span className="tabular-nums">{money(total)}</span></Card>
        <p className="text-[10px] text-slate-500">Demo preview: no payment is taken.</p>
        <button type="button" onClick={onConfirm} className={primary}>Confirm booking</button>
      </Body>
    </>
  );
}

export function GuestHistory() {
  return (
    <>
      <AppHeader subtitle="Your stays" title="Booking history" />
      <Body>
        {RESERVATIONS.slice(0, 4).map((r) => (
          <Card key={r.id} className="space-y-1.5">
            <div className="flex items-center justify-between"><p className="text-[12px] font-semibold text-slate-900">{r.roomType} · Room {r.room}</p><Pill tone={tone(r.status)}>{r.status}</Pill></div>
            <p className="text-[10px] text-slate-500">{r.checkIn} – {r.checkOut} · {r.nights} nights · {r.id}</p>
            <p className="text-[12px] font-semibold tabular-nums text-slate-900">{money(r.total)}</p>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function GuestProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [[Star, 'Azure Gold · 9 stays'], [Bell, 'Notifications'], [Settings, 'Settings']];
  return (
    <>
      <AppHeader subtitle="Member" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center">
          <Avatar name="Hannah Lindqvist" size="lg" />
          <p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p>
          <p className="text-[11px] text-slate-500">Gold member · 31 nights</p>
        </Card>
        <Card className="divide-y divide-slate-100 p-0">
          {rows.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 px-3 py-3 text-[12px] text-slate-700"><Icon className="size-4 text-slate-500" aria-hidden />{label}<ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden /></div>)}
        </Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><LogOut className="size-4" aria-hidden /> Sign out</button>
      </Body>
    </>
  );
}

/* ---------------------------------- Staff app ---------------------------------- */

export function StaffDashboard({ go }: { go: (s: StaffScreen) => void }) {
  const open = TASKS.filter((t) => !t.done).length;
  return (
    <>
      <AppHeader subtitle="Front desk · Thursday" title="Amelia Stone" right={<Avatar name="Amelia Stone" />} />
      <Body>
        <div className="grid grid-cols-2 gap-2">
          {[['Arrivals', '12'], ['Occupancy', '84.6%'], ['Open tasks', String(open)], ['Rooms ready', '6']].map(([l, v]) => <Card key={l}><p className="text-[10px] text-slate-500">{l}</p><p className="text-base font-semibold tabular-nums text-slate-900">{v}</p></Card>)}
        </div>
        <button type="button" onClick={() => go('reservations')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Users className="size-4" aria-hidden /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">Daniel Osei · check-out</span><span className="block text-[10px] text-slate-500">Room 102 · 11:00</span></span><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card>
        </button>
        <Card><p className="text-[11px] font-semibold text-slate-900">Occupancy this week</p><div className="mt-2"><ProgressBar value={84.6} tone="emerald" /></div></Card>
      </Body>
    </>
  );
}

export function StaffReservations() {
  return (
    <>
      <AppHeader subtitle="Today" title="Arrivals" />
      <Body>
        {RESERVATIONS.slice(0, 5).map((r) => (
          <Card key={r.id} className="flex items-center gap-3">
            <Avatar name={r.guest} size="sm" />
            <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-slate-900">{r.guest}</p><p className="text-[10px] text-slate-500">Room {r.room} · {r.nights} nights</p></div>
            <Pill tone={tone(r.status)}>{r.status}</Pill>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function StaffRooms() {
  const [status, setStatus] = useState<Record<string, string>>({});
  return (
    <>
      <AppHeader subtitle="Tap a room to change it" title="Room status" />
      <Body>
        <div className="grid grid-cols-3 gap-2">
          {ROOMS.map((r) => {
            const s = status[r.id] ?? (r.status === 'Available' ? 'Ready' : r.status);
            const next = s === 'Ready' ? 'Occupied' : s === 'Occupied' ? 'Cleaning' : 'Ready';
            return (
              <button key={r.id} type="button" aria-label={`Room ${r.number}: ${s}. Tap to change`} onClick={() => setStatus((m) => ({ ...m, [r.id]: next }))} className={cn('flex aspect-square flex-col items-center justify-center rounded-xl border-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', s === 'Ready' ? 'border-[color:var(--demo-good)] bg-[var(--demo-good-soft)]' : s === 'Occupied' ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent)] text-white' : s === 'Cleaning' ? 'border-dashed border-slate-300 bg-slate-50 text-slate-600' : 'border-amber-500 bg-amber-50')}>
                <span className="text-sm font-semibold">{r.number}</span>
                <span className="text-[9px] opacity-80">{s}</span>
              </button>
            );
          })}
        </div>
      </Body>
    </>
  );
}

export function StaffTasks() {
  const [done, setDone] = useState<Record<string, boolean>>(() => Object.fromEntries(TASKS.map((t) => [t.id, t.done])));
  return (
    <>
      <AppHeader subtitle="Housekeeping and maintenance" title="Tasks" />
      <Body>
        {TASKS.map((t) => (
          <button key={t.id} type="button" aria-pressed={!!done[t.id]} onClick={() => setDone((d) => ({ ...d, [t.id]: !d[t.id] }))} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
            <Card className="flex items-center gap-3">
              <span className={cn('grid size-6 shrink-0 place-items-center rounded-full', done[t.id] ? 'bg-[var(--demo-good)] text-white' : 'bg-slate-100 text-slate-400')}><Check className="size-3.5" aria-hidden /></span>
              <span className="min-w-0 flex-1"><span className={cn('block truncate text-[12px] font-medium', done[t.id] ? 'text-slate-400 line-through' : 'text-slate-900')}>{t.title}</span><span className="block text-[10px] text-slate-500">{t.room ? `Room ${t.room} · ` : ''}due {t.due}</span></span>
            </Card>
          </button>
        ))}
      </Body>
    </>
  );
}

