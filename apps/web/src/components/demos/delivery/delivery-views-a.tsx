'use client';

import { Bike, CheckCircle2, MapPin, Package, Search, Truck, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { PageHeading, Pill, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { DASHBOARD_STATS, DELIVERIES_HOUR, KIND_MIX, ORDERS, RIDERS, SUCCESS_WEEK } from '@/data/delivery/operations';
import type { Order, OrderStatus, Rider, RiderStatus } from '@/data/delivery/operations';
import { cn } from '@/lib/cn';
import { OrderCard, RiderCard, TrackingCard } from './delivery-cards';
import { MapView } from './map-view';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { Placed: 'Picked up', 'Picked up': 'On the way', 'On the way': 'Delivered' };

/* ---------------------------------- Dashboard ---------------------------------- */

export function DeliveryDashboardHome() {
  const { active, total, riders, revenue, success } = DASHBOARD_STATS;
  return (
    <>
      <PageHeading title="Dashboard" description="Good afternoon. 38 deliveries are on the road right now." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <DashboardCard index={0} label="Active deliveries" value={String(active)} delta={{ value: '+6 in the last hour', up: true }} icon={Truck} />
        <DashboardCard index={1} label="Total orders" value={total.toLocaleString('en-US')} delta={{ value: '+212 this week', up: true }} icon={Package} tone="emerald" />
        <DashboardCard index={2} label="Available riders" value={`${RIDERS.filter((r) => r.status === 'Available').length} / ${riders}`} icon={Bike} tone="slate" />
        <DashboardCard index={3} label="Revenue (Oct)" value={money(revenue)} delta={{ value: '+9.8% vs Sep', up: true }} icon={Wallet} tone="amber" />
        <DashboardCard index={4} label="Success rate" value={`${success}%`} delta={{ value: '+0.6 pts', up: true }} icon={CheckCircle2} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={5} title="Deliveries by hour" className="lg:col-span-2" action={<Pill tone="blue">Evening peak 18:00</Pill>}>
          <BarChart data={DELIVERIES_HOUR} label="Deliveries by hour" highlight={6} className="h-40" />
        </Panel>
        <Panel index={6} title="Mix by type">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Deliveries by type" segments={KIND_MIX} size={104}><span><span className="block text-lg font-semibold tabular-nums text-slate-900">38</span><span className="block text-[11px] text-slate-500">active</span></span></Donut>
            <ul className="space-y-2 text-sm">{KIND_MIX.map((k) => <li key={k.label} className="flex items-center gap-2 text-slate-600"><span aria-hidden className={cn('size-2.5 rounded-full', k.tone === 'blue' ? 'bg-[var(--demo-accent)]' : k.tone === 'emerald' ? 'bg-[var(--demo-good)]' : 'bg-[var(--demo-orange)]')} />{k.label}<span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{k.value}%</span></li>)}</ul>
          </div>
        </Panel>
        <Panel index={7} title="Delivery success, this week (%)" className="lg:col-span-2"><AreaChart data={SUCCESS_WEEK} label="Delivery success by day" min={90} max={100} /></Panel>
        <Panel index={8} title="Live now">
          <ul className="space-y-3">
            {ORDERS.filter((o) => o.status === 'On the way' || o.status === 'Picked up').map((o) => (
              <li key={o.id} className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Bike className="size-4" aria-hidden /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{o.id} · {o.rider}</span><span className="block text-xs text-slate-500">ETA {o.eta} min</span></span>
                <Pill tone={o.status === 'On the way' ? 'blue' : 'amber'}>{o.status}</Pill>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Orders ---------------------------------- */

export function DeliveryOrdersView() {
  const [status, setStatus] = useState<'All' | OrderStatus>('All');
  const [kind, setKind] = useState<'All types' | Order['kind']>('All types');
  const [query, setQuery] = useState('');
  const [advance, setAdvance] = useState<Record<string, OrderStatus>>({});
  const orders: Order[] = ORDERS.map((o) => ({ ...o, status: advance[o.id] ?? o.status }));
  const list = useMemo(() => orders.filter((o) => (status === 'All' || o.status === status) && (kind === 'All types' || o.kind === kind) && (o.id + o.customer + o.drop).toLowerCase().includes(query.trim().toLowerCase())), [orders, status, kind, query]);
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  return (
    <>
      <PageHeading title="Orders" description={`${list.length} of ${ORDERS.length} orders shown`} />
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search orders</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders, customers, drop-off" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <div className="ml-auto"><SelectMenu label="Order type" value={kind} options={['All types', 'Food', 'Parcel', 'Business'] as const} onChange={setKind} className="w-36" align="right" /></div>
      </div>
      <div className="mb-4">
        <Tabs label="Delivery status" value={status} onChange={setStatus} tabs={[{ id: 'All', label: 'All', count: orders.length }, ...(['Placed', 'Picked up', 'On the way', 'Delivered', 'Failed'] as const).map((s) => ({ id: s, label: s, count: count(s) }))]} />
      </div>
      <ul key={`${status}-${kind}`} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((o, i) => (
          <li key={o.id}>
            <OrderCard order={o} index={i} action={NEXT[o.status] ? { label: `Mark ${NEXT[o.status]!.toLowerCase()}`, onClick: () => setAdvance((a) => ({ ...a, [o.id]: NEXT[o.status]! })) } : undefined} />
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">No orders match these filters.</li>}
      </ul>
    </>
  );
}

/* ---------------------------------- Riders ---------------------------------- */

export function DeliveryRidersView() {
  const [zone, setZone] = useState<'All zones' | Rider['zone']>('All zones');
  const [status, setStatus] = useState<Record<string, RiderStatus>>({});
  const riders: Rider[] = RIDERS.map((r) => ({ ...r, status: status[r.id] ?? r.status }));
  const list = riders.filter((r) => zone === 'All zones' || r.zone === zone);
  const toggle = (r: Rider) => setStatus((s) => ({ ...s, [r.id]: r.status === 'Available' ? 'On break' : 'Available' }));
  return (
    <>
      <PageHeading title="Riders" description="Who is free, who is out, and how each rider performs.">
        <SelectMenu label="Zone" value={zone} options={['All zones', 'Old Town', 'North', 'Harbour', 'Quay'] as const} onChange={setZone} className="w-40" align="right" />
      </PageHeading>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((r, i) => (
          <li key={r.id}><RiderCard rider={r} index={i} onToggle={() => toggle(r)} /></li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------- Live tracking ---------------------------------- */

export function DeliveryTrackingView() {
  const [selected, setSelected] = useState(ORDERS[0].id);
  const active = ORDERS.filter((o) => o.status === 'On the way' || o.status === 'Picked up' || o.status === 'Placed');
  const current = ORDERS.find((o) => o.id === selected) ?? ORDERS[0];
  return (
    <>
      <PageHeading title="Live tracking" description="Every delivery on the map. Select one to see its route and progress." />
      <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <MapView from={current.from} to={current.to} progress={current.progress} label="Live delivery map" className="aspect-[16/10] w-full" />
          <Panel index={1} title={`${current.id} · ${current.customer}`} action={<Pill tone={current.status === 'Delivered' ? 'green' : 'blue'}>{current.status}</Pill>}>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              {[['Rider', current.rider], ['ETA', current.status === 'Delivered' ? 'Done' : `${current.eta} min`], ['Distance', `${current.distance} km`]].map(([l, v]) => <div key={l} className="rounded-lg bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-900">{v}</p><p className="text-slate-500">{l}</p></div>)}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-600"><MapPin className="size-3.5 text-[color:var(--demo-orange-ink)]" aria-hidden /> {current.pickup} → {current.drop}</div>
          </Panel>
        </div>
        <ul className="space-y-2.5">
          {active.map((o, i) => (
            <li key={o.id}>
              <button type="button" aria-pressed={o.id === selected} onClick={() => setSelected(o.id)} className={cn('block w-full rounded-xl text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', o.id === selected && 'ring-2 ring-[color:var(--demo-accent)] ring-offset-2 rounded-xl')}>
                <TrackingCard order={o} index={i} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

