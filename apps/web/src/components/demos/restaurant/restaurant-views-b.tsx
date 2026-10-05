'use client';

import { AlertTriangle, Check, PackageCheck, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { CUSTOMERS, INVENTORY, RESERVATIONS, STAFF, stockLevel } from '@/data/restaurant/app';
import type { Customer, Reservation, StaffMember } from '@/data/restaurant/app';
import { cn } from '@/lib/cn';
import { tone } from './restaurant-cards';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

/* ---------------------------------- Reservations ---------------------------------- */

const MONTH_OFFSET = 3; // 1 October 2026 is a Thursday; weeks start on Monday.
const isClosed = (date: number) => (date - 1 + MONTH_OFFSET) % 7 === 0; // Mondays are closed.
const PARTY = ['Any party size', '2 guests', '3–4 guests', '5+ guests'] as const;

export function RestaurantReservationsView() {
  const [date, setDate] = useState(9);
  const [tab, setTab] = useState<'All' | 'Lunch' | 'Dinner'>('All');
  const [party, setParty] = useState<(typeof PARTY)[number]>('Any party size');
  const [seated, setSeated] = useState<Record<string, boolean>>({});
  const cells = [...Array(MONTH_OFFSET).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];

  const day: Reservation[] = isClosed(date) ? [] : RESERVATIONS.filter((_, i) => (i + date) % 5 !== 0).map((r) => (seated[r.id] ? { ...r, status: 'Seated' } : r));
  const list = day.filter((r) => (tab === 'All' || (tab === 'Lunch' ? r.time < '17:00' : r.time >= '17:00')) && (party === 'Any party size' || (party === '2 guests' ? r.party === 2 : party === '3–4 guests' ? r.party >= 3 && r.party <= 4 : r.party >= 5)));
  const covers = day.reduce((sum, r) => sum + r.party, 0);

  return (
    <>
      <PageHeading title="Reservations" description={isClosed(date) ? 'The restaurant is closed on Mondays.' : `${day.length} bookings · ${covers} covers on ${date} October`}>
        <SelectMenu label="Party size" value={party} options={PARTY} onChange={setParty} className="w-44" align="right" />
      </PageHeading>
      <div className="grid gap-3 xl:grid-cols-[17rem_1fr]">
        <Panel title="October 2026" index={0} className="self-start">
          <div className="grid grid-cols-7 gap-1 text-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="pb-1 text-[11px] font-medium text-slate-500">
                {d}
              </span>
            ))}
            {cells.map((d, i) =>
              d === null ? (
                <span key={`b${i}`} />
              ) : (
                <button key={d} type="button" aria-pressed={d === date} aria-label={`${d} October${isClosed(d) ? ', closed' : ''}`} disabled={isClosed(d)} onClick={() => setDate(d)} className={cn('relative grid aspect-square place-items-center rounded-lg text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', d === date ? 'bg-[var(--demo-accent)] text-white' : isClosed(d) ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100')}>
                  {d}
                  {!isClosed(d) && d !== date && <span aria-hidden className="absolute bottom-1 size-1 rounded-full bg-amber-500" />}
                </button>
              ),
            )}
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Mondays are closed.</p>
        </Panel>

        <div className="min-w-0">
          <Tabs label="Service" value={tab} onChange={setTab} tabs={(['All', 'Lunch', 'Dinner'] as const).map((t) => ({ id: t, label: t }))} />
          <ul key={`${tab}-${date}-${party}`} className="mt-3 space-y-2.5">
            {list.map((r, i) => (
              <li key={r.id} className="demo-rise flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5" style={{ ['--i' as string]: i }}>
                <span className="grid w-14 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] py-2 text-sm font-semibold tabular-nums text-[color:var(--demo-accent)]">{r.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{r.name}</p>
                  <p className="inline-flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3" aria-hidden /> {r.party}
                    </span>
                    <span>Table {r.table}</span>
                    {r.note && <span className="text-amber-700">· {r.note}</span>}
                  </p>
                </div>
                <Pill tone={tone(r.status)}>{r.status}</Pill>
                {r.status !== 'Seated' && (
                  <button type="button" onClick={() => setSeated((c) => ({ ...c, [r.id]: true }))} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
                    Seat
                  </button>
                )}
              </li>
            ))}
            {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">{isClosed(date) ? 'Closed today.' : 'No bookings for this selection.'}</li>}
          </ul>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------- Customers ---------------------------------- */

export function RestaurantCustomersView() {
  const [tab, setTab] = useState<'All' | Customer['tier']>('All');
  const [query, setQuery] = useState('');
  const list = CUSTOMERS.filter((c) => (tab === 'All' || c.tier === tab) && c.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <PageHeading title="Customers" description="Your regulars, their favourites and what they spend." />
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardCard index={0} label="Guests this month" value="1,310" delta={{ value: '+5.6%', up: true }} icon={Users} />
        <DashboardCard index={1} label="Returning guests" value="68%" icon={Check} tone="emerald" />
        <DashboardCard index={2} label="Avg. spend per guest" value="$38" icon={PackageCheck} tone="amber" />
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <Tabs label="Customer tier" value={tab} onChange={setTab} tabs={(['All', 'VIP', 'Regular', 'New'] as const).map((t) => ({ id: t, label: t }))} />
        <label className="relative ml-auto min-w-44 flex-1 sm:max-w-56">
          <span className="sr-only">Search customers</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
      </div>
      <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Guest</th>
              <th scope="col" className="px-4 py-3">Tier</th>
              <th scope="col" className="px-4 py-3">Visits</th>
              <th scope="col" className="px-4 py-3">Total spend</th>
              <th scope="col" className="px-4 py-3">Favourite</th>
              <th scope="col" className="px-4 py-3">Last visit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <span className="font-medium text-slate-900">{c.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Pill tone={tone(c.tier)}>{c.tier}</Pill>
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">{c.visits}</td>
                <td className="px-4 py-3 tabular-nums text-slate-700">{money(c.spend)}</td>
                <td className="px-4 py-3 text-slate-600">{c.favourite}</td>
                <td className="px-4 py-3 text-slate-600">{c.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No guests match your search.</p>}
      </div>
    </>
  );
}

/* ---------------------------------- Inventory ---------------------------------- */

export function RestaurantInventoryView() {
  const [tab, setTab] = useState<'All' | 'Alerts'>('All');
  const [ordered, setOrdered] = useState<Record<string, boolean>>({});
  const items = INVENTORY.map((i) => ({ ...i, level: ordered[i.id] ? ('OK' as const) : stockLevel(i) }));
  const alerts = items.filter((i) => i.level !== 'OK');
  const list = tab === 'All' ? items : alerts;

  return (
    <>
      <PageHeading title="Inventory" description="Stock against par levels, with alerts before you run out." />
      {alerts.length > 0 && (
        <div role="status" className="demo-rise mb-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            <span className="font-semibold">{alerts.length} items need attention:</span> {alerts.map((a) => a.name).join(', ')}.
          </p>
        </div>
      )}
      <Tabs label="Stock view" value={tab} onChange={setTab} tabs={[{ id: 'All', label: 'All stock', count: items.length }, { id: 'Alerts', label: 'Alerts', count: alerts.length }]} />
      <ul key={tab} className="mt-3 grid gap-3 md:grid-cols-2">
        {list.map((item, i) => (
          <li key={item.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.category} · {item.supplier}
                </p>
              </div>
              <Pill tone={tone(item.level)}>{item.level}</Pill>
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                <span>
                  <span className="font-semibold tabular-nums text-slate-900">{ordered[item.id] ? item.par : item.stock}</span> {item.unit} in stock
                </span>
                <span>Par {item.par}</span>
              </div>
              <ProgressBar value={Math.min(100, ((ordered[item.id] ? item.par : item.stock) / item.par) * 100)} tone={item.level === 'OK' ? 'emerald' : 'blue'} />
            </div>
            {item.level !== 'OK' && (
              <button type="button" onClick={() => setOrdered((c) => ({ ...c, [item.id]: true }))} className="mt-3 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
                Reorder from {item.supplier}
              </button>
            )}
            {ordered[item.id] && <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--demo-good-ink)]"><Check className="size-3.5" aria-hidden /> Order placed</p>}
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 md:col-span-2">Everything is stocked.</li>}
      </ul>
    </>
  );
}

/* ---------------------------------- Staff, reports, settings ---------------------------------- */

const SHIFT: StaffMember['status'][] = ['On shift', 'On break', 'Off'];

export function RestaurantStaffView() {
  const [status, setStatus] = useState<Record<string, StaffMember['status']>>({});
  return (
    <>
      <PageHeading title="Staff" description="Who is on the floor and in the kitchen tonight." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {STAFF.map((s, i) => {
          const current = status[s.id] ?? s.status;
          return (
            <li key={s.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
              <div className="flex items-center gap-3">
                <Avatar name={s.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.role}</p>
                </div>
                <Pill tone={tone(current)}>{current}</Pill>
              </div>
              <p className="mt-3 text-xs text-slate-500">Shift {s.shift}</p>
              <div role="group" aria-label={`Status for ${s.name}`} className="mt-3 inline-flex rounded-lg bg-slate-100 p-0.5">
                {SHIFT.map((option) => (
                  <button key={option} type="button" aria-pressed={current === option} onClick={() => setStatus((c) => ({ ...c, [s.id]: option }))} className={cn('rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', current === option ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900')}>
                    {option}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const REPORTS = ['Daily sales', 'Menu performance', 'Table turnover', 'Staff hours', 'Stock usage', 'Guest retention'];

export function RestaurantReportsView() {
  const [ready, setReady] = useState<Record<string, boolean>>({});
  return (
    <>
      <PageHeading title="Reports" description="Printable reports for the owner, the chef and the accountant." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((name, i) => (
          <li key={name} className="demo-rise flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div>
              <p className="text-sm font-semibold text-slate-900">{name}</p>
              <p className="text-xs text-slate-500">PDF · October 2026</p>
            </div>
            <button type="button" onClick={() => setReady((c) => ({ ...c, [name]: true }))} className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', ready[name] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-slate-900 text-white hover:bg-slate-700')}>
              {ready[name] ? (
                <>
                  <Check className="size-3.5" aria-hidden /> Ready
                </>
              ) : (
                'Generate'
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Switch({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'bg-[var(--demo-good)]' : 'bg-slate-300')}>
        <span aria-hidden className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', on && 'translate-x-5')} />
      </button>
    </li>
  );
}

const SERVICE = ['No service charge', '10% service charge', '12.5% service charge'] as const;

export function RestaurantSettingsView() {
  const [service, setService] = useState<(typeof SERVICE)[number]>(SERVICE[2]);
  return (
    <>
      <PageHeading title="Settings" description="Restaurant profile, ordering and notifications." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Restaurant profile" index={0}>
          <dl className="space-y-3 text-sm">
            {[
              ['Name', 'Ember & Oak'],
              ['Address', '8 Market Lane, Old Town'],
              ['Hours', 'Tue – Sun · 12:00 – 23:00'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Service charge</span>
            <SelectMenu label="Service charge" value={service} options={SERVICE} onChange={setService} />
          </div>
        </Panel>
        <Panel title="Preferences" index={1}>
          <ul className="divide-y divide-slate-100">
            <Switch label="Online ordering" description="Take pickup and delivery orders from the website." defaultOn />
            <Switch label="Table reservations" description="Let guests book from the website and app." defaultOn />
            <Switch label="Kitchen display" description="Send new orders to the kitchen screen." defaultOn />
            <Switch label="Low-stock alerts" description="Email the chef when an item falls below par." />
          </ul>
        </Panel>
      </div>
    </>
  );
}
