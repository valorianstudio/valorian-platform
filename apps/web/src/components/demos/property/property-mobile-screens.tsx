'use client';

import { Bell, BadgeCheck, Building2, Check, ChevronRight, CreditCard, DoorOpen, House, Lock, LogOut, Mail, Megaphone, Settings, Upload, User, Users, Wrench, Wallet, Key } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Pill, ProgressBar } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { ANNOUNCEMENTS, MAINTENANCE, PAYMENTS, PROPERTIES, TENANTS, TRACK, UNITS, VISITORS } from '@/data/property/catalog';
import { cn } from '@/lib/cn';
import { PropertyLogo } from './property-logo';
import { priorityTone, requestTone, rentTone, visitorTone } from './property-cards';

/** Screens of the resident app and the manager app. Compact, touch-sized and driven by dummy data. */

export type ResidentScreen = 'splash' | 'login' | 'home' | 'property' | 'maintenance' | 'rent' | 'announcements' | 'visitors' | 'profile';
export type ManagerScreen = 'dashboard' | 'properties' | 'tenants' | 'requests' | 'payments';

export const RESIDENT_NAV: { id: 'home' | 'maintenance' | 'rent' | 'visitors' | 'profile'; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'maintenance', label: 'Repairs', icon: Wrench },
  { id: 'rent', label: 'Rent', icon: Wallet },
  { id: 'visitors', label: 'Visitors', icon: DoorOpen },
  { id: 'profile', label: 'Profile', icon: User },
];

export const MANAGER_NAV: { id: ManagerScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'tenants', label: 'Tenants', icon: Users },
  { id: 'requests', label: 'Requests', icon: Wrench },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--demo-accent)] text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';
const iconBtn = 'grid size-9 place-items-center rounded-full bg-white/10 focus-visible:outline-2 focus-visible:outline-white';

/* ---------------------------------- Resident app ---------------------------------- */

export function ResidentSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--demo-header)] px-6 pb-8 pt-20 text-center">
      <span className="grid size-20 place-items-center rounded-3xl bg-[var(--demo-gold)] text-[color:var(--demo-header)] shadow-[0_20px_40px_-12px_rgb(212_175_55/0.5)]"><Building2 className="size-9" strokeWidth={2.25} aria-hidden /></span>
      <h3 className="mt-7 text-2xl font-bold tracking-[0.12em] text-white">KEYSTONE</h3>
      <p className="mt-2 text-[13px] text-white/75">Smart living, managed for you.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-xl bg-white text-sm font-semibold text-[color:var(--demo-accent)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get started</button>
    </div>
  );
}

export function ResidentLogin({ onSignIn }: { onSignIn: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <PropertyLogo />
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">{mode === 'in' ? 'Welcome home' : 'Join your building'}</h3>
      <div role="tablist" aria-label="Sign in or register" className="mt-4 grid grid-cols-2 rounded-full bg-slate-100 p-1">
        {(['in', 'up'] as const).map((m) => <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => setMode(m)} className={cn('rounded-full py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}>{m === 'in' ? 'Sign in' : 'Register'}</button>)}
      </div>
      <div className="mt-5 space-y-3">
        {mode === 'up' && <div className={field}>Hannah Lindqvist · Unit 4B</div>}
        <div className={field}><Mail className="size-4 text-slate-400" aria-hidden /> hannah.l@mail.example</div>
        <div className={field}><Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••</div>
      </div>
      <button type="button" onClick={onSignIn} className={cn(primary, 'mt-auto')}>{mode === 'in' ? 'Sign in' : 'Create account'}</button>
      <p className="mt-3 text-center text-[11px] text-slate-500">Demo app: continue to your home.</p>
    </div>
  );
}

export function ResidentHome({ go }: { go: (s: ResidentScreen) => void }) {
  return (
    <>
      <AppHeader subtitle="Good morning" title="Hannah" right={<button type="button" aria-label="Notifications" className={iconBtn}><Bell className="size-4" aria-hidden /></button>} />
      <Body>
        <button type="button" onClick={() => go('property')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Card className="flex items-center gap-3 border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)]">
            <span className="grid size-11 place-items-center rounded-xl bg-white text-[color:var(--demo-accent)]"><Building2 className="size-5" aria-hidden /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">Harbor View · Unit 4B</span><span className="block text-[11px] text-slate-600">2 bed · 980 sq ft · lease to Mar 2027</span></span>
            <ChevronRight className="size-4 text-slate-400" aria-hidden />
          </Card>
        </button>
        <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Check className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Rent paid for October</p><p className="text-[10px] text-slate-500">$2,350 by direct debit on 1 Oct</p></div></Card>
        <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-700"><Wrench className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Kitchen tap repair</p><p className="text-[10px] text-slate-500">In progress · Tomas Berg</p></div><Pill tone="blue">Active</Pill></Card>
        <div className="grid grid-cols-3 gap-2">
          {([['Report issue', Wrench, 'maintenance'], ['Pay rent', Wallet, 'rent'], ['Visitors', DoorOpen, 'visitors']] as const).map(([label, Icon, target]) => {
            const IconCmp = Icon as LucideIcon;
            return <button key={label} type="button" onClick={() => go(target as ResidentScreen)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 text-[10px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><span className="grid size-8 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><IconCmp className="size-4" aria-hidden /></span>{label}</button>;
          })}
        </div>
        <button type="button" onClick={() => go('announcements')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Card className="flex items-center gap-3"><Megaphone className="size-4 text-[color:var(--demo-accent)]" aria-hidden /><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-slate-900">{ANNOUNCEMENTS[0].title}</p><p className="text-[10px] text-slate-500">{ANNOUNCEMENTS[0].date}</p></div><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card></button>
      </Body>
    </>
  );
}

export function ResidentProperty() {
  const property = PROPERTIES[0];
  const unit = UNITS[0];
  return (
    <>
      <AppHeader subtitle={property.address} title={property.name} />
      <Body>
        <Card className="grid grid-cols-3 gap-2 text-center">{[['Unit', unit.number], ['Bedrooms', String(unit.bedrooms)], ['Size', `${unit.sqft} ft²`]].map(([l, v]) => <div key={l}><p className="text-[12px] font-semibold text-slate-900">{v}</p><p className="text-[10px] text-slate-500">{l}</p></div>)}</Card>
        <Card className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-900">Smart home</p>
          {[['Leak sensors', 'All clear', 'green'], ['Heating', '21 °C, eco schedule', 'blue'], ['Front door', 'Locked', 'slate']].map(([l, v, t]) => (
            <div key={l} className="flex items-center justify-between text-[12px]"><span className="text-slate-700">{l}</span><span className="flex items-center gap-2 text-slate-600">{v}<span aria-hidden className={cn('size-2 rounded-full', t === 'green' ? 'bg-[var(--demo-good)]' : t === 'blue' ? 'bg-sky-500' : 'bg-slate-400')} /></span></div>
          ))}
        </Card>
        <Card className="space-y-2"><p className="text-[11px] font-semibold text-slate-900">Lease</p><ProgressBar value={58} tone="emerald" /><p className="text-[10px] text-slate-500">Ends 31 Mar 2027 · renewal opens in 4 months</p></Card>
        <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Key className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Keyless entry</p><p className="text-[10px] text-slate-500">Lobby and building doors</p></div><Pill tone="green">On</Pill></Card>
      </Body>
    </>
  );
}

export function ResidentMaintenance() {
  const [sent, setSent] = useState(false);
  const [category, setCategory] = useState<'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance'>('Plumbing');
  const categories = ['Plumbing', 'Electrical', 'HVAC', 'Appliance'] as const;
  return (
    <>
      <AppHeader subtitle="Report a repair" title="Maintenance" />
      <Body>
        {sent ? (
          <Card className="demo-rise flex flex-col items-center py-6 text-center"><span className="grid size-12 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><BadgeCheck className="size-6" aria-hidden /></span><p className="mt-3 text-base font-semibold text-slate-900">Request MR-2211 sent</p><p className="mt-1 text-xs text-slate-600">We will confirm the visit time within 2 hours.</p></Card>
        ) : (
          <Card className="space-y-3">
            <p className="text-[11px] font-semibold text-slate-900">What needs fixing?</p>
            <div role="radiogroup" aria-label="Category" className="grid grid-cols-2 gap-1.5">
              {categories.map((c) => <button key={c} type="button" role="radio" aria-checked={category === c} onClick={() => setCategory(c)} className={cn('rounded-lg py-2 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', category === c ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-700')}>{c}</button>)}
            </div>
            <div className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-[11px] text-slate-500"><Upload className="mr-2 size-4" aria-hidden /> Add photos</div>
            <button type="button" onClick={() => setSent(true)} className={primary}>Send request</button>
          </Card>
        )}
        <p className="px-0.5 pt-1 text-xs font-semibold text-slate-900">Your requests</p>
        {MAINTENANCE.slice(0, 2).map((m) => (
          <Card key={m.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2"><p className="text-[12px] font-semibold text-slate-900">{m.title}</p><Pill tone={requestTone(m.status)}>{m.status}</Pill></div>
            <p className="text-[10px] text-slate-500">{m.id} · {m.created} · {m.assignee}</p>
            <div className="pt-1"><ProgressBar value={m.status === 'Resolved' ? 100 : m.status === 'In progress' ? 55 : 15} tone="blue" /></div>
          </Card>
        ))}
        <Card className="space-y-2"><p className="text-[11px] font-semibold text-slate-900">Tracking</p>{TRACK.map((s) => <p key={s.label} className={cn('text-[11px]', s.done ? 'text-slate-900' : 'text-slate-400')}>{s.done ? '✓' : '·'} {s.label}</p>)}</Card>
      </Body>
    </>
  );
}

export function ResidentRent() {
  const [paid, setPaid] = useState(false);
  return (
    <>
      <AppHeader subtitle="Due 1 November" title="Rent" />
      <Body>
        <Card className="flex flex-col items-center py-6 text-center">
          <p className="text-[11px] text-slate-500">Monthly rent</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">$2,350</p>
          <p className="mt-2 text-[11px] text-slate-600">{paid ? 'Paid by direct debit. Thank you.' : 'Next payment in 26 days.'}</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-900">Pay with</p>
          {[['Direct debit', 'Active · Ending 4421', CreditCard], ['Bank transfer', 'Reference 4B-OCT', Wallet]].map(([label, note, Icon]) => {
            const IconCmp = Icon as LucideIcon;
            return <div key={label as string} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><IconCmp className="size-4 text-[color:var(--demo-accent)]" aria-hidden /><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">{label as string}</p><p className="text-[10px] text-slate-500">{note as string}</p></div></div>;
          })}
        </Card>
        <button type="button" disabled={paid} onClick={() => setPaid(true)} className={cn(primary, 'disabled:bg-slate-300')}>{paid ? <><Check className="size-4" aria-hidden /> Paid</> : 'Pay $2,350'}</button>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Recent payments</p>
        {PAYMENTS.slice(0, 3).map((p) => <Card key={p.id} className="flex items-center justify-between"><div><p className="text-[12px] font-medium text-slate-900">{p.date}</p><p className="text-[10px] text-slate-500">{p.method}</p></div><span className="flex items-center gap-2 text-[12px] font-semibold tabular-nums text-slate-900">${p.amount.toLocaleString('en-US')}<Pill tone={rentTone(p.status)}>{p.status}</Pill></span></Card>)}
      </Body>
    </>
  );
}

export function ResidentAnnouncements() {
  return (
    <>
      <AppHeader subtitle="From your building team" title="Announcements" />
      <Body>
        {ANNOUNCEMENTS.map((a) => (
          <Card key={a.id} className="space-y-1.5">
            <div className="flex items-start gap-2"><Megaphone className="mt-0.5 size-4 shrink-0 text-[color:var(--demo-accent)]" aria-hidden /><p className="text-[12px] font-semibold text-slate-900">{a.title}</p></div>
            <p className="text-[11px] leading-relaxed text-slate-600">{a.body}</p>
            <p className="text-[10px] text-slate-500">{a.date}</p>
          </Card>
        ))}
        <Card className="flex items-center gap-3"><Settings className="size-4 text-slate-500" aria-hidden /><p className="text-[11px] text-slate-600">Notification settings</p><ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden /></Card>
      </Body>
    </>
  );
}

export function ResidentVisitors() {
  const [approved, setApproved] = useState<string[]>([]);
  const pending = VISITORS.filter((v) => v.status === 'Expected');
  return (
    <>
      <AppHeader subtitle="Approve guests in one tap" title="Visitors" />
      <Body>
        {pending.map((v) => {
          const done = approved.includes(v.id);
          return (
            <Card key={v.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2"><p className="text-[12px] font-semibold text-slate-900">{v.name}</p><Pill tone={done ? 'green' : visitorTone(v.status)}>{done ? 'Approved' : v.status}</Pill></div>
              <p className="text-[10px] text-slate-500">{v.purpose} · {v.time}</p>
              {!done && <button type="button" onClick={() => setApproved((a) => [...a, v.id])} className="rounded-full bg-[var(--demo-accent)] px-3 py-1 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Approve entry</button>}
            </Card>
          );
        })}
        <p className="px-0.5 pt-1 text-xs font-semibold text-slate-900">Today</p>
        {VISITORS.filter((v) => v.status !== 'Expected').map((v) => <Card key={v.id} className="flex items-center justify-between"><div><p className="text-[12px] font-medium text-slate-900">{v.name}</p><p className="text-[10px] text-slate-500">{v.time} · Unit {v.unit}</p></div><Pill tone={visitorTone(v.status)}>{v.status}</Pill></Card>)}
      </Body>
    </>
  );
}

export function ResidentProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [[Building2, 'My lease and documents'], [CreditCard, 'Payment methods'], [Bell, 'Notifications'], [Settings, 'Settings']];
  return (
    <>
      <AppHeader subtitle="Resident" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center"><Avatar name="Hannah Lindqvist" size="lg" /><p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p><p className="text-[11px] text-slate-500">Unit 4B · Harbor View Residences</p></Card>
        <Card className="divide-y divide-slate-100 p-0">{rows.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 px-3 py-3 text-[12px] text-slate-700"><Icon className="size-4 text-slate-500" aria-hidden />{label}<ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden /></div>)}</Card>
        <Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Users className="size-4" aria-hidden /></span><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-900">Household</p><p className="text-[10px] text-slate-500">2 residents · 1 guest pass</p></div></Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><LogOut className="size-4" aria-hidden /> Sign out</button>
      </Body>
    </>
  );
}

/* ---------------------------------- Manager app ---------------------------------- */

export function ManagerDashboard({ go }: { go: (s: ManagerScreen) => void }) {
  return (
    <>
      <AppHeader subtitle="Monday" title="Priya Shah" right={<Avatar name="Priya Shah" />} />
      <Body>
        <div className="grid grid-cols-2 gap-2">{[['Occupied', '318'], ['Open requests', '17'], ['Rent this month', '$286k'], ['Visitors today', '9']].map(([l, v]) => <Card key={l}><p className="text-[10px] text-slate-500">{l}</p><p className="text-base font-semibold tabular-nums text-slate-900">{v}</p></Card>)}</div>
        <button type="button" onClick={() => go('requests')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-700"><Wrench className="size-4" aria-hidden /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">Urgent: no hot water, 2C</span><span className="block text-[10px] text-slate-500">Maple Court · Tomas Berg</span></span><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card></button>
        <button type="button" onClick={() => go('payments')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><Card className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Wallet className="size-4" aria-hidden /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-slate-900">1 rent payment overdue</span><span className="block text-[10px] text-slate-500">Marcus Reed, unit 2C</span></span><ChevronRight className="size-4 text-slate-300" aria-hidden /></Card></button>
      </Body>
    </>
  );
}

export function ManagerProperties() {
  return (
    <>
      <AppHeader subtitle="Portfolio" title="Properties" />
      <Body>
        {PROPERTIES.map((p) => {
          const pct = Math.round((p.occupied / p.units) * 100);
          return (
            <Card key={p.id} className="space-y-2">
              <div className="flex items-center gap-3"><span className={cn('grid size-10 shrink-0 place-items-center rounded-lg', p.tone)}><Building2 className="size-4 text-[color:var(--demo-accent)]" aria-hidden /></span><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-slate-900">{p.name}</p><p className="truncate text-[10px] text-slate-500">{p.occupied}/{p.units} units · {p.type}</p></div><span className="text-[12px] font-semibold tabular-nums text-slate-900">{pct}%</span></div>
              <ProgressBar value={pct} tone="emerald" />
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function ManagerTenants() {
  return (
    <>
      <AppHeader subtitle="Residents" title="Tenants" />
      <Body>
        {TENANTS.map((t) => (
          <Card key={t.id} className="flex items-center gap-3">
            <Avatar name={t.name} size="sm" />
            <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-slate-900">{t.name}</p><p className="truncate text-[10px] text-slate-500">Unit {t.unit} · lease to {t.leaseEnd}</p></div>
            <Pill tone={rentTone(t.status)}>{t.status}</Pill>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function ManagerRequests() {
  const [done, setDone] = useState<string[]>([]);
  return (
    <>
      <AppHeader subtitle="Open tickets" title="Requests" />
      <Body>
        {MAINTENANCE.filter((m) => m.status !== 'Resolved').map((m) => {
          const resolved = done.includes(m.id);
          return (
            <Card key={m.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2"><p className="text-[12px] font-semibold text-slate-900">{m.title}</p><Pill tone={priorityTone(m.priority)}>{m.priority}</Pill></div>
              <p className="text-[10px] text-slate-500">Unit {m.unit} · {m.assignee}</p>
              {resolved ? <Pill tone="green">Resolved</Pill> : <button type="button" onClick={() => setDone((d) => [...d, m.id])} className="rounded-full bg-[var(--demo-accent)] px-3 py-1 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Mark resolved</button>}
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function ManagerPayments() {
  const overdue = PAYMENTS.filter((p) => p.status !== 'Paid');
  return (
    <>
      <AppHeader subtitle="October" title="Payments" />
      <Body>
        <Card className="flex items-center justify-between"><span className="text-[12px] text-slate-600">Collected</span><span className="text-base font-semibold tabular-nums text-slate-900">$9,630</span></Card>
        {overdue.map((p) => (
          <Card key={p.id} className="flex items-center gap-3">
            <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-slate-900">{p.tenant}</p><p className="text-[10px] text-slate-500">Unit {p.unit} · {p.date}</p></div>
            <span className="text-[12px] font-semibold tabular-nums text-slate-900">${p.amount.toLocaleString('en-US')}</span>
            <Pill tone={rentTone(p.status)}>{p.status}</Pill>
          </Card>
        ))}
        <Card className="flex items-center gap-2 text-[12px] font-semibold text-slate-600"><Check className="size-4" aria-hidden /> {UNITS.filter((u) => u.status === 'Occupied').length} units paid up</Card>
      </Body>
    </>
  );
}
