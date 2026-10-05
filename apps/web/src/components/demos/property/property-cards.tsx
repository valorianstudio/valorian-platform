'use client';

import { Building2, Calendar, Droplets, Hammer, Paintbrush, Plug, Thermometer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, Pill } from '@/components/demos/shared/app-ui';
import type { MaintenanceRequest, Property, RentStatus, RequestPriority, RequestStatus, Tenant, UnitStatus, VisitorStatus } from '@/data/property/catalog';
import { cn } from '@/lib/cn';

type Tone = Parameters<typeof Pill>[0]['tone'];

const CATEGORY_ICONS: Record<MaintenanceRequest['category'], LucideIcon> = { Plumbing: Droplets, Electrical: Plug, HVAC: Thermometer, Appliance: Hammer, 'Common area': Paintbrush };

export function priorityTone(p: RequestPriority): Tone {
  return p === 'Urgent' ? 'red' : p === 'High' ? 'amber' : p === 'Normal' ? 'blue' : 'slate';
}

export function requestTone(s: RequestStatus): Tone {
  return s === 'Resolved' ? 'green' : s === 'In progress' ? 'blue' : 'amber';
}

export function rentTone(s: RentStatus): Tone {
  return s === 'Paid' ? 'green' : s === 'Pending' ? 'amber' : 'red';
}

export function unitTone(s: UnitStatus): Tone {
  return s === 'Occupied' ? 'green' : s === 'Vacant' ? 'slate' : 'amber';
}

export function visitorTone(s: VisitorStatus): Tone {
  return s === 'Checked in' ? 'green' : s === 'Expected' ? 'blue' : 'slate';
}

/** A property tile: the building name, type, address and an occupancy bar. Keyboard operable when `onOpen` is set. */
export function PropertyCard({ property, index = 0, onOpen, selected = false }: { property: Property; index?: number; onOpen?: () => void; selected?: boolean }) {
  const pct = Math.round((property.occupied / property.units) * 100);
  const body = (
    <>
      <div className={cn('flex h-20 items-end rounded-lg p-3', property.tone)}><Building2 className="size-6 text-[color:var(--demo-accent)]" aria-hidden /></div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{property.name}</p><p className="truncate text-xs text-slate-500">{property.address}</p></div>
        <Pill tone={property.type === 'Commercial' ? 'amber' : 'blue'}>{property.type}</Pill>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-600"><span className="tabular-nums">{property.occupied} of {property.units} units occupied</span><span className="tabular-nums font-semibold text-slate-900">{pct}%</span></div>
      <div role="progressbar" aria-label={`${property.name} occupancy`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[var(--demo-good)] transition-[width] duration-500" style={{ width: `${pct}%` }} /></div>
      <p className="mt-3 text-[11px] text-slate-500">{property.floors} floors · built {property.built} · {property.manager}</p>
    </>
  );
  const base = cn('demo-rise group block w-full rounded-xl border bg-white p-4 text-left shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-[0_14px_28px_-18px_rgb(15_23_42/0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', selected ? 'border-[color:var(--demo-accent)]' : 'border-slate-200');
  return onOpen ? (
    <button type="button" onClick={onOpen} aria-pressed={selected} className={base} style={{ ['--i' as string]: index }}>{body}</button>
  ) : (
    <article className={base} style={{ ['--i' as string]: index }}>{body}</article>
  );
}

/** A resident row: avatar, unit, lease end and the rent status, with the outstanding balance when there is one. */
export function TenantCard({ tenant, index = 0, selected = false, onOpen }: { tenant: Tenant; index?: number; selected?: boolean; onOpen?: () => void }) {
  const body = (
    <>
      <Avatar name={tenant.name} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-900">{tenant.name}</span>
        <span className="block truncate text-xs text-slate-500">Unit {tenant.unit} · {tenant.property}</span>
      </span>
      <span className="hidden text-right text-xs text-slate-500 sm:block">Lease ends<span className="block font-medium text-slate-700">{tenant.leaseEnd}</span></span>
      <Pill tone={rentTone(tenant.status)}>{tenant.status}</Pill>
    </>
  );
  const base = cn('demo-rise flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', selected ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent-soft)]' : 'border-slate-200 hover:border-slate-300');
  return onOpen ? (
    <button type="button" onClick={onOpen} aria-pressed={selected} className={base} style={{ ['--i' as string]: index }}>{body}</button>
  ) : (
    <article className={base} style={{ ['--i' as string]: index }}>{body}</article>
  );
}

/** A maintenance ticket: category icon, title, unit, priority and status, with an optional next-step action. */
export function MaintenanceCard({ request, index = 0, action }: { request: MaintenanceRequest; index?: number; action?: { label: string; onClick: () => void } }) {
  const Icon = CATEGORY_ICONS[request.category];
  return (
    <article className="demo-rise flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center" style={{ ['--i' as string]: index }}>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Icon className="size-4" aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900"><span className="tabular-nums">{request.id}</span> · {request.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">Unit {request.unit} · {request.category} · <Calendar className="inline size-3" aria-hidden /> {request.created} · {request.assignee}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={priorityTone(request.priority)}>{request.priority}</Pill>
        <Pill tone={requestTone(request.status)}>{request.status}</Pill>
        {action && <button type="button" onClick={action.onClick} className="h-8 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-[color:var(--demo-accent)] hover:text-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">{action.label}</button>}
      </div>
    </article>
  );
}
