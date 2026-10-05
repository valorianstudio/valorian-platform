'use client';

import { AlertTriangle, Building2, Home, Search, Users, Wallet, Wrench } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { DASHBOARD_STATS, MAINTENANCE, OCCUPANCY_MONTHS, PAYMENTS, PROPERTIES, REVENUE_MONTHS, TENANTS, UNIT_MIX, UNITS } from '@/data/property/catalog';
import type { MaintenanceRequest, PropertyType, RequestPriority, RequestStatus, Tenant, UnitStatus } from '@/data/property/catalog';
import { cn } from '@/lib/cn';
import { MaintenanceCard, PropertyCard, TenantCard, rentTone, unitTone } from './property-cards';

/* ---------------------------------- Dashboard ---------------------------------- */

export function PropertyDashboardHome() {
  const { properties, occupiedUnits, totalUnits, monthlyRevenue, pendingRequests, activeTenants } = DASHBOARD_STATS;
  const occupancy = Math.round((occupiedUnits / totalUnits) * 100);
  return (
    <>
      <PageHeading title="Dashboard" description="Good morning. 17 requests are open and rent is due for 3 units this week." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <DashboardCard index={0} label="Total properties" value={String(properties)} delta={{ value: '+1 this year', up: true }} icon={Building2} />
        <DashboardCard index={1} label="Occupied units" value={`${occupiedUnits}/${totalUnits}`} delta={{ value: `${occupancy}% occupancy`, up: true }} icon={Home} tone="emerald" />
        <DashboardCard index={2} label="Monthly revenue" value={`$${monthlyRevenue.toLocaleString('en-US')}`} delta={{ value: '+2.9% vs Sep', up: true }} icon={Wallet} tone="slate" />
        <DashboardCard index={3} label="Pending requests" value={String(pendingRequests)} delta={{ value: '1 urgent', up: false }} icon={Wrench} tone="amber" />
        <DashboardCard index={4} label="Active tenants" value={String(activeTenants)} delta={{ value: '+12 this month', up: true }} icon={Users} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={5} title="Revenue by month (USD, thousands)" className="lg:col-span-2"><BarChart data={REVENUE_MONTHS} label="Revenue by month" highlight={5} className="h-40" /></Panel>
        <Panel index={6} title="Unit availability">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Unit availability" segments={UNIT_MIX} size={104}><span><span className="block text-lg font-semibold tabular-nums text-slate-900">{totalUnits}</span><span className="block text-[11px] text-slate-500">units</span></span></Donut>
            <ul className="space-y-2 text-sm">{UNIT_MIX.map((s) => <li key={s.label} className="flex items-center gap-2 text-slate-600"><span aria-hidden className={cn('size-2.5 rounded-full', s.tone === 'emerald' ? 'bg-[var(--demo-good)]' : s.tone === 'amber' ? 'bg-[var(--demo-gold)]' : 'bg-slate-300')} />{s.label}<span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{s.value}%</span></li>)}</ul>
          </div>
        </Panel>
        <Panel index={7} title="Occupancy trend" className="lg:col-span-2" action={<Pill tone="green">92% this month</Pill>}><AreaChart data={OCCUPANCY_MONTHS} label="Occupancy per month, percent" min={80} max={100} /></Panel>
        <Panel index={8} title="Urgent and open requests">
          <ul className="space-y-3">
            {MAINTENANCE.filter((m) => m.status !== 'Resolved').slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-center gap-3"><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{m.title}</span><span className="block truncate text-xs text-slate-500">Unit {m.unit} · {m.assignee}</span></span><Pill tone={m.priority === 'Urgent' ? 'red' : m.priority === 'High' ? 'amber' : 'blue'}>{m.priority}</Pill></li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Properties ---------------------------------- */

const TYPE_OPTIONS = ['All types', 'Apartments', 'Residential', 'Commercial'] as const;

export function PropertyPropertiesView() {
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>('All types');
  const [selectedId, setSelectedId] = useState('pr1');
  const list = PROPERTIES.filter((p) => type === 'All types' || p.type === (type as PropertyType));
  const selected = PROPERTIES.find((p) => p.id === selectedId) ?? PROPERTIES[0];
  const units = UNITS.filter((u) => u.property === selected.name);
  return (
    <>
      <PageHeading title="Properties" description="Every building in the portfolio, with occupancy and unit availability.">
        <SelectMenu label="Type" value={type} options={TYPE_OPTIONS} onChange={setType} className="w-40" align="right" />
      </PageHeading>
      <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((p, i) => <li key={p.id}><PropertyCard property={p} index={i} selected={p.id === selected.id} onOpen={() => setSelectedId(p.id)} /></li>)}
        </ul>
        <Panel index={4} title="Building details">
          <div className="flex items-start gap-3"><span className={cn('grid size-12 place-items-center rounded-xl', selected.tone)}><Building2 className="size-5 text-[color:var(--demo-accent)]" aria-hidden /></span><div className="min-w-0"><p className="text-base font-semibold text-slate-900">{selected.name}</p><p className="text-xs text-slate-500">{selected.address}</p></div></div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">Floors</dt><dd className="font-semibold text-slate-900">{selected.floors}</dd></div>
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">Built</dt><dd className="font-semibold text-slate-900">{selected.built}</dd></div>
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">Units</dt><dd className="font-semibold text-slate-900">{selected.units}</dd></div>
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">Manager</dt><dd className="truncate font-semibold text-slate-900">{selected.manager}</dd></div>
          </dl>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Unit availability</p>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {units.length > 0 ? units.map((u) => <li key={u.id} className="flex items-center justify-between py-2.5"><span className="text-slate-700">Unit {u.number}</span><span className="flex items-center gap-2"><span className="tabular-nums text-slate-900">${u.rent.toLocaleString('en-US')}</span><Pill tone={unitTone(u.status)}>{u.status}</Pill></span></li>) : <li className="py-2.5 text-slate-500">No units listed in the demo.</li>}
          </ul>
          <div className="mt-5"><ProgressBar value={Math.round((selected.occupied / selected.units) * 100)} tone="emerald" /></div>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Units ---------------------------------- */

const UNIT_TABS = ['All', 'Occupied', 'Vacant', 'Notice given'] as const;
type UnitTab = (typeof UNIT_TABS)[number];

export function PropertyUnitsView() {
  const [tab, setTab] = useState<UnitTab>('All');
  const [property, setProperty] = useState<'All properties' | string>('All properties');
  const names = ['All properties', ...PROPERTIES.map((p) => p.name)];
  const list = UNITS.filter((u) => (tab === 'All' || u.status === (tab as UnitStatus)) && (property === 'All properties' || u.property === property));
  return (
    <>
      <PageHeading title="Units" description="Availability, rent and the tenant in each unit across the portfolio." />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1"><Tabs label="Unit status" value={tab} onChange={setTab} tabs={UNIT_TABS.map((t) => ({ id: t, label: t, count: t === 'All' ? UNITS.length : UNITS.filter((u) => u.status === t).length }))} /></div>
        <SelectMenu label="Property" value={property} options={names} onChange={setProperty} className="w-56" align="right" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">Units in the portfolio</caption>
          <thead className="bg-slate-50 text-xs text-slate-500"><tr><th scope="col" className="px-4 py-3 font-medium">Unit</th><th scope="col" className="px-4 py-3 font-medium">Property</th><th scope="col" className="px-4 py-3 font-medium">Layout</th><th scope="col" className="px-4 py-3 font-medium">Rent</th><th scope="col" className="px-4 py-3 font-medium">Tenant</th><th scope="col" className="px-4 py-3 font-medium">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-slate-50">
                <th scope="row" className="px-4 py-3 font-semibold text-slate-900">{u.number}</th>
                <td className="px-4 py-3 text-slate-600">{u.property}</td>
                <td className="px-4 py-3 text-slate-600">{u.bedrooms === 0 ? 'Commercial' : `${u.bedrooms} bed`} · {u.sqft} sq ft</td>
                <td className="px-4 py-3 tabular-nums text-slate-900">${u.rent.toLocaleString('en-US')}</td>
                <td className="px-4 py-3 text-slate-600">{u.tenant ?? '—'}</td>
                <td className="px-4 py-3"><Pill tone={unitTone(u.status)}>{u.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No units match these filters.</p>}
      </div>
    </>
  );
}

/* ---------------------------------- Tenants ---------------------------------- */

export function PropertyTenantsView() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(TENANTS[0].id);
  const list = useMemo(() => TENANTS.filter((t) => `${t.name} ${t.unit} ${t.property}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const selected: Tenant = TENANTS.find((t) => t.id === selectedId) ?? TENANTS[0];
  const history = PAYMENTS.filter((p) => p.tenant === selected.name);
  return (
    <>
      <PageHeading title="Tenants" description="Resident profiles, lease information and payment history." />
      <div className="mb-4">
        <label className="flex h-9 max-w-sm items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 focus-within:border-[color:var(--demo-accent)]">
          <Search className="size-4 text-slate-400" aria-hidden />
          <span className="sr-only">Search tenants</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, unit or building" className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none" />
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <ul className="space-y-2">
          {list.map((t, i) => <li key={t.id}><TenantCard tenant={t} index={i} selected={t.id === selected.id} onOpen={() => setSelectedId(t.id)} /></li>)}
          {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No tenants found.</li>}
        </ul>
        <Panel index={3} title="Tenant profile">
          <div className="flex items-center gap-3"><Avatar name={selected.name} size="lg" /><div className="min-w-0"><p className="text-base font-semibold text-slate-900">{selected.name}</p><p className="truncate text-xs text-slate-500">Unit {selected.unit} · {selected.property}</p></div></div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">Lease ends</dt><dd className="font-semibold text-slate-900">{selected.leaseEnd}</dd></div>
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">Monthly rent</dt><dd className="font-semibold tabular-nums text-slate-900">${selected.rent.toLocaleString('en-US')}</dd></div>
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">Phone</dt><dd className="font-medium text-slate-900">{selected.phone}</dd></div>
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">Balance</dt><dd className="font-semibold tabular-nums text-slate-900">${selected.balance.toLocaleString('en-US')}</dd></div>
          </dl>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Payment history</p>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {history.length > 0 ? history.map((p) => <li key={p.id} className="flex items-center justify-between py-2.5"><span className="text-slate-700">{p.date} · {p.method}</span><span className="flex items-center gap-2"><span className="tabular-nums text-slate-900">${p.amount.toLocaleString('en-US')}</span><Pill tone={rentTone(p.status)}>{p.status}</Pill></span></li>) : <li className="py-2.5 text-slate-500">No payments recorded this month.</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Maintenance ---------------------------------- */

const REQUEST_TABS = ['All', 'Open', 'In progress', 'Resolved'] as const;
type RequestTab = (typeof REQUEST_TABS)[number];
const PRIORITY_OPTIONS = ['All priorities', 'Urgent', 'High', 'Normal', 'Low'] as const;
const NEXT: Record<RequestStatus, RequestStatus | null> = { Open: 'In progress', 'In progress': 'Resolved', Resolved: null };

export function PropertyMaintenanceView() {
  const [tab, setTab] = useState<RequestTab>('All');
  const [priority, setPriority] = useState<(typeof PRIORITY_OPTIONS)[number]>('All priorities');
  const [status, setStatus] = useState<Record<string, RequestStatus>>({});
  const rows: MaintenanceRequest[] = MAINTENANCE.map((m) => ({ ...m, status: status[m.id] ?? m.status }));
  const list = rows.filter((m) => (tab === 'All' || m.status === tab) && (priority === 'All priorities' || m.priority === (priority as RequestPriority)));
  const order: Record<RequestPriority, number> = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
  const sorted = [...list].sort((a, b) => order[a.priority] - order[b.priority]);
  return (
    <>
      <PageHeading title="Maintenance" description="Service requests by priority, with status tracking from report to resolution." />
      {rows.some((m) => m.priority === 'Urgent' && m.status !== 'Resolved') && (
        <div role="status" className="demo-rise mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700"><AlertTriangle className="size-4" aria-hidden /></span>
          <p className="flex-1 text-sm text-amber-900"><span className="font-semibold">Urgent request:</span> no hot water in Maple Court 2C. Tomas Berg is on site.</p>
        </div>
      )}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1"><Tabs label="Request status" value={tab} onChange={setTab} tabs={REQUEST_TABS.map((t) => ({ id: t, label: t, count: t === 'All' ? rows.length : rows.filter((m) => m.status === t).length }))} /></div>
        <SelectMenu label="Priority" value={priority} options={PRIORITY_OPTIONS} onChange={setPriority} className="w-40" align="right" />
      </div>
      <div className="space-y-3">
        {sorted.map((m, i) => {
          const to = NEXT[m.status];
          return <MaintenanceCard key={m.id} request={m} index={i} action={to ? { label: to === 'Resolved' ? 'Mark resolved' : 'Start work', onClick: () => setStatus((s) => ({ ...s, [m.id]: to })) } : undefined} />;
        })}
        {sorted.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No requests match these filters.</p>}
      </div>
    </>
  );
}
