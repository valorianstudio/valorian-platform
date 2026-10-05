'use client';

import { AlertTriangle, Check, Clock, Crown, Mail, Phone, Search, Star, Wallet, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AreaChart, BarChart, Donut, Ring } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { GUESTS, INVOICES, OCCUPANCY_WEEK, REVENUE_MONTHS, ROOM_MIX, STAFF, TASKS } from '@/data/hotel/rooms';
import type { Guest, Invoice } from '@/data/hotel/rooms';
import { cn } from '@/lib/cn';
import { tone } from './hotel-cards';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

/* ---------------------------------- Guests ---------------------------------- */

function GuestProfile({ guest, onClose }: { guest: Guest; onClose: () => void }) {
  const [tab, setTab] = useState<'history' | 'preferences'>('history');
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="absolute inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[1px]" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={`${guest.name} profile`} className="demo-slide flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Guest profile</h3>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close profile" className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]"><X className="size-4" aria-hidden /></button>
        </div>
        <div className="flex items-center gap-4 px-5 pt-5">
          <Avatar name={guest.name} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-900">{guest.name}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5"><Pill tone={tone(guest.tier === 'Gold' ? 'Paid' : 'Pending')}>{guest.tier} member</Pill><Pill tone="slate">{guest.stays} stays</Pill></div>
          </div>
        </div>
        <dl className="mt-5 space-y-2.5 px-5 text-sm">
          <div className="flex items-center gap-3 text-slate-700"><Mail className="size-4 text-slate-400" aria-hidden /> {guest.email}</div>
          <div className="flex items-center gap-3 text-slate-700"><Phone className="size-4 text-slate-400" aria-hidden /> {guest.phone}</div>
        </dl>
        <div className="mt-5 grid grid-cols-3 gap-2 px-5 text-center">
          {[['Nights', String(guest.nights)], ['Spend', money(guest.spend)], ['Tier', guest.tier]].map(([l, v]) => <div key={l} className="rounded-xl bg-slate-50 p-3"><p className="text-sm font-semibold tabular-nums text-slate-900">{v}</p><p className="text-[11px] text-slate-500">{l}</p></div>)}
        </div>
        <div className="mt-5 px-5"><Tabs label="Guest sections" value={tab} onChange={setTab} tabs={[{ id: 'history', label: 'Stay history' }, { id: 'preferences', label: 'Preferences' }]} className="w-full [&>button]:flex-1" /></div>
        <div className="px-5 py-5">
          {tab === 'history' ? (
            <ol className="space-y-4 border-l border-slate-200 pl-4">
              {guest.history.map((h) => <li key={h.date + h.room} className="relative"><span aria-hidden className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full bg-[var(--demo-good)] ring-4 ring-white" /><p className="text-xs text-slate-500">{h.date} · {h.room}</p><p className="text-sm text-slate-700">{h.note}</p></li>)}
            </ol>
          ) : (
            <div className="flex flex-wrap gap-1.5">{guest.preferences.map((p) => <span key={p} className="rounded-full bg-[var(--demo-accent-soft)] px-3 py-1 text-xs font-medium text-slate-800">{p}</span>)}</div>
          )}
        </div>
      </aside>
    </div>
  );
}

export function HotelGuestsView() {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<'All tiers' | 'Gold' | 'Silver' | 'New'>('All tiers');
  const [selected, setSelected] = useState<Guest | null>(null);
  const list = useMemo(() => GUESTS.filter((g) => (tier === 'All tiers' || g.tier === tier) && g.name.toLowerCase().includes(query.trim().toLowerCase())), [query, tier]);
  return (
    <>
      <PageHeading title="Guests" description={`${list.length} of ${GUESTS.length} guest profiles shown`} />
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search guests</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guests" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <div className="ml-auto"><SelectMenu label="Tier" value={tier} options={['All tiers', 'Gold', 'Silver', 'New'] as const} onChange={setTier} className="w-36" align="right" /></div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((g, i) => (
          <li key={g.id}>
            <button type="button" onClick={() => setSelected(g)} className="demo-rise block w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]" style={{ ['--i' as string]: i }}>
              <span className="flex items-center gap-3"><Avatar name={g.name} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{g.name}</span><span className="block text-xs text-slate-500">{g.stays} stays · {g.nights} nights</span></span>{g.tier === 'Gold' && <Crown className="size-4 text-[color:var(--demo-gold-ink)]" aria-label="Gold member" />}</span>
              <span className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs"><span className="text-slate-500">Lifetime spend</span><span className="font-semibold tabular-nums text-slate-900">{money(g.spend)}</span></span>
            </button>
          </li>
        ))}
      </ul>
      {selected && <GuestProfile guest={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ---------------------------------- Staff ---------------------------------- */

export function HotelStaffView() {
  const [tab, setTab] = useState<'schedule' | 'tasks'>('schedule');
  const [status, setStatus] = useState<Record<string, (typeof STAFF)[number]['status']>>({});
  const [done, setDone] = useState<Record<string, boolean>>(() => Object.fromEntries(TASKS.map((t) => [t.id, t.done])));
  const open = TASKS.filter((t) => !done[t.id]).length;
  return (
    <>
      <PageHeading title="Staff" description="Shifts for today and the tasks assigned to each team." />
      <Tabs label="Staff section" value={tab} onChange={setTab} tabs={[{ id: 'schedule', label: 'Schedules', count: STAFF.length }, { id: 'tasks', label: 'Tasks', count: open }]} />
      <div key={tab} className="demo-rise mt-4">
        {tab === 'schedule' ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {STAFF.map((s, i) => {
              const current = status[s.id] ?? s.status;
              return (
                <li key={s.id} className="rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
                  <div className="flex items-center gap-3"><Avatar name={s.name} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{s.name}</p><p className="text-xs text-slate-500">{s.role}</p></div><Pill tone={tone(current)}>{current}</Pill></div>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-600"><Clock className="size-3.5 text-slate-400" aria-hidden /> {s.shift}</p>
                  <div role="group" aria-label={`Status for ${s.name}`} className="mt-3 inline-flex rounded-lg bg-slate-100 p-0.5">
                    {(['On shift', 'On break', 'Off'] as const).map((o) => <button key={o} type="button" aria-pressed={current === o} onClick={() => setStatus((m) => ({ ...m, [s.id]: o }))} className={cn('rounded-md px-2.5 py-1 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', current === o ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}>{o}</button>)}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-2.5">
            {TASKS.map((t, i) => (
              <li key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5" style={{ ['--i' as string]: i }}>
                <button type="button" role="checkbox" aria-checked={!!done[t.id]} aria-label={t.title} onClick={() => setDone((d) => ({ ...d, [t.id]: !d[t.id] }))} className={cn('grid size-5 shrink-0 place-items-center rounded-md border focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', done[t.id] ? 'border-[color:var(--demo-good)] bg-[var(--demo-good)] text-white' : 'border-slate-300')}>{done[t.id] && <Check className="size-3.5" aria-hidden />}</button>
                <div className="min-w-0 flex-1"><p className={cn('text-sm font-medium', done[t.id] ? 'text-slate-400 line-through' : 'text-slate-900')}>{t.title}</p><p className="text-xs text-slate-500">{t.assignee} · due {t.due}</p></div>
                {t.priority === 'High' && !done[t.id] && <Pill tone="red">High</Pill>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/* ---------------------------------- Payments ---------------------------------- */

export function HotelPaymentsView() {
  const [tab, setTab] = useState<'All' | Invoice['status']>('All');
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const invoices: Invoice[] = INVOICES.map((i) => (paid[i.id] ? { ...i, status: 'Paid' } : i));
  const sum = (s: Invoice['status']) => invoices.filter((i) => i.status === s).reduce((t, i) => t + i.amount, 0);
  const list = invoices.filter((i) => tab === 'All' || i.status === tab);
  return (
    <>
      <PageHeading title="Payments" description="Folios and invoices, with payment status." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardCard index={0} label="Collected" value={money(sum('Paid'))} icon={Wallet} tone="emerald" />
        <DashboardCard index={1} label="Pending" value={money(sum('Pending'))} icon={Clock} />
        <DashboardCard index={2} label="Overdue" value={money(sum('Overdue'))} icon={AlertTriangle} tone="amber" />
      </div>
      <div className="mt-4"><Tabs label="Invoice status" value={tab} onChange={setTab} tabs={(['All', 'Paid', 'Pending', 'Overdue'] as const).map((t) => ({ id: t, label: t }))} /></div>
      <ul key={tab} className="mt-3 grid gap-2.5 md:grid-cols-2">
        {list.map((inv, i) => (
          <li key={inv.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs text-slate-500">{inv.id} · {inv.date}</p><p className="truncate text-sm font-semibold text-slate-900">{inv.guest}</p><p className="text-xs text-slate-500">Room {inv.room}</p></div><Pill tone={tone(inv.status)}>{inv.status}</Pill></div>
            <div className="mt-3 flex items-center justify-between gap-2"><p className="text-lg font-semibold tabular-nums text-slate-900">{money(inv.amount)}</p>{inv.status !== 'Paid' && <button type="button" onClick={() => setPaid((p) => ({ ...p, [inv.id]: true }))} className="rounded-lg bg-[var(--demo-accent)] px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Take payment</button>}</div>
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 md:col-span-2">Nothing here.</li>}
      </ul>
    </>
  );
}

/* ---------------------------------- Reports, analytics, settings ---------------------------------- */

const REPORTS = ['Occupancy report', 'Revenue by room type', 'Arrivals and departures', 'Housekeeping log', 'Staff hours', 'Channel performance'];

export function HotelReportsView() {
  const [ready, setReady] = useState<Record<string, boolean>>({});
  return (
    <>
      <PageHeading title="Reports" description="Printable reports for the owner and the accountant." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((name, i) => (
          <li key={name} className="demo-rise flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div><p className="text-sm font-semibold text-slate-900">{name}</p><p className="text-xs text-slate-500">PDF · October 2026</p></div>
            <button type="button" onClick={() => setReady((s) => ({ ...s, [name]: true }))} className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', ready[name] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-[var(--demo-accent)] text-white hover:bg-slate-700')}>{ready[name] ? <><Check className="size-3.5" aria-hidden /> Ready</> : 'Generate'}</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export function HotelAnalyticsView() {
  return (
    <>
      <PageHeading title="Analytics" description="Occupancy, rates and revenue, so decisions use real numbers." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="ADR (avg. rate)" value="$412" delta={{ value: '+$18', up: true }} icon={Star} />
        <DashboardCard index={1} label="RevPAR" value="$348" delta={{ value: '+7.4%', up: true }} icon={Wallet} tone="emerald" />
        <DashboardCard index={2} label="Repeat guests" value="46%" icon={Check} tone="amber" />
        <DashboardCard index={3} label="Cancellations" value="3.2%" delta={{ value: '-0.8 pts', up: true }} icon={X} tone="slate" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Occupancy by day (%)" className="lg:col-span-2"><AreaChart data={OCCUPANCY_WEEK} label="Occupancy by day" min={60} max={100} /></Panel>
        <Panel index={5} title="Revenue by month (USD thousands)"><BarChart data={REVENUE_MONTHS} label="Revenue by month" highlight={5} className="h-40" /></Panel>
        <Panel index={6} title="Room type mix" className="lg:col-span-1"><div className="flex items-center gap-4"><Donut label="Room type mix" segments={ROOM_MIX} size={96} /><p className="text-xs text-slate-600">Deluxe leads bookings, suites earn the most per night.</p></div></Panel>
        <Panel index={7} title="Target progress" className="lg:col-span-2">
          <div className="flex items-center gap-5"><Ring value={84.6} size={72} stroke={9} label="Occupancy target" /><div className="flex-1 space-y-3 text-xs text-slate-600"><div><div className="mb-1 flex justify-between"><span>Occupancy target 85%</span><span className="font-semibold text-slate-900">84.6%</span></div><ProgressBar value={84.6} tone="emerald" /></div><div><div className="mb-1 flex justify-between"><span>Revenue target $420k</span><span className="font-semibold text-slate-900">$413k</span></div><ProgressBar value={98} tone="blue" /></div></div></div>
        </Panel>
      </div>
    </>
  );
}

function Switch({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  const id = useId();
  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0"><p id={id} className="text-sm font-medium text-slate-900">{label}</p><p className="text-xs text-slate-500">{description}</p></div>
      <button type="button" role="switch" aria-checked={on} aria-labelledby={id} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'bg-[var(--demo-good)]' : 'bg-slate-300')}>
        <span aria-hidden className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', on && 'translate-x-5')} />
      </button>
    </li>
  );
}

export function HotelSettingsView() {
  const [check, setCheck] = useState('15:00');
  return (
    <>
      <PageHeading title="Settings" description="Hotel profile, check-in rules and guest messages." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Hotel profile" index={0}>
          <dl className="space-y-3 text-sm">
            {[['Name', 'Hôtel Azure'], ['Address', '24 Harbour Promenade'], ['Stars', '5']].map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><dt className="text-slate-500">{k}</dt><dd className="font-medium text-slate-900">{v}</dd></div>)}
          </dl>
          <div className="mt-4"><span className="mb-1.5 block text-xs font-medium text-slate-500">Check-in time</span><SelectMenu label="Check-in time" value={check} options={['14:00', '15:00', '16:00'] as const} onChange={setCheck} /></div>
        </Panel>
        <Panel title="Guest messages" index={1}>
          <ul className="divide-y divide-slate-100">
            <Switch label="Pre-arrival email" description="Send directions and check-in details 48 hours before." defaultOn />
            <Switch label="Early check-in offer" description="Offer early arrival when a room is ready." defaultOn />
            <Switch label="Post-stay survey" description="Ask for a review the morning after checkout." />
          </ul>
        </Panel>
      </div>
    </>
  );
}

