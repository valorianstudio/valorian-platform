'use client';

import { Boxes, CalendarClock, Droplets, Package, Pill as PillIcon, Sparkles, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Pill } from '@/components/demos/shared/app-ui';
import type { Medicine, MedicineForm, Order, OrderStatus, Prescription, PrescriptionStatus } from '@/data/pharmacy/catalog';
import { cn } from '@/lib/cn';

type Tone = Parameters<typeof Pill>[0]['tone'];

const FORM_ICONS: Record<MedicineForm, LucideIcon> = { Tablet: PillIcon, Capsule: PillIcon, Syrup: Droplets, Cream: Sparkles, Inhaler: Wind, Sachet: Package };

const ORDER_TONES: Record<OrderStatus, Tone> = { Placed: 'slate', Packed: 'blue', 'Out for delivery': 'amber', Delivered: 'green' };
const RX_TONES: Record<PrescriptionStatus, Tone> = { Pending: 'amber', Verified: 'blue', Dispensed: 'green' };

/** Days-to-expiry proxy for the dummy data: the batch's month and year are compared with October 2026, the demo's current month. */
export function expiryTone(expiry: string): Tone {
  if (expiry === 'Oct 2026' || expiry === 'Nov 2026') return 'red';
  if (expiry === 'Dec 2026' || expiry === 'Jan 2027') return 'amber';
  return 'green';
}

export function stockTone(m: Medicine): Tone {
  if (m.stock <= m.reorderAt / 2) return 'red';
  if (m.stock <= m.reorderAt) return 'amber';
  return 'green';
}

export function stockLabel(m: Medicine) {
  if (m.stock <= m.reorderAt / 2) return 'Critical';
  if (m.stock <= m.reorderAt) return 'Low stock';
  return 'In stock';
}

export function orderTone(status: OrderStatus): Tone {
  return ORDER_TONES[status];
}

export function rxTone(status: PrescriptionStatus): Tone {
  return RX_TONES[status];
}

/** A medicine tile: form icon, name, strength, price and the stock and expiry chips. Fully keyboard operable when `onOpen` is set. */
export function MedicineCard({ medicine, index = 0, onOpen }: { medicine: Medicine; index?: number; onOpen?: () => void }) {
  const Icon = FORM_ICONS[medicine.form];
  const body = (
    <>
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)] transition-colors group-hover:bg-[var(--demo-accent)] group-hover:text-white"><Icon className="size-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{medicine.name}</p>
          <p className="truncate text-xs text-slate-500">{medicine.generic} · {medicine.strength}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">${medicine.price.toFixed(2)}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Pill tone={stockTone(medicine)}>{medicine.stock} in stock</Pill>
        <Pill tone={expiryTone(medicine.expiry)}>Exp. {medicine.expiry}</Pill>
        {medicine.rx && <Pill tone="blue">Rx only</Pill>}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">{medicine.category} · {medicine.supplier} · Batch {medicine.batch}</p>
    </>
  );
  const base = cn('demo-rise group block w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-[0_14px_28px_-18px_rgb(15_76_129/0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]');
  return onOpen ? (
    <button type="button" onClick={onOpen} className={base} style={{ ['--i' as string]: index }}>{body}</button>
  ) : (
    <article className={base} style={{ ['--i' as string]: index }}>{body}</article>
  );
}

/** An order row: customer, items, total, delivery method, status and an optional next-step action. */
export function OrderCard({ order, index = 0, action }: { order: Order; index?: number; action?: { label: string; onClick: () => void } }) {
  return (
    <article className="demo-rise flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center" style={{ ['--i' as string]: index }}>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900"><span className="tabular-nums">{order.id}</span> · {order.customer}</p>
        <p className="mt-0.5 text-xs text-slate-500">{order.items} items · {order.method} · <CalendarClock className="inline size-3 align-[-1px]" aria-hidden /> {order.eta}</p>
      </div>
      <p className="text-sm font-semibold tabular-nums text-slate-900">${order.total.toFixed(2)}</p>
      <Pill tone={orderTone(order.status)}>{order.status}</Pill>
      {action && <button type="button" onClick={action.onClick} className="h-8 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-[color:var(--demo-accent)] hover:text-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">{action.label}</button>}
    </article>
  );
}

/** A stock row with the quantity bar, reorder point and an optional reorder action. */
export function InventoryCard({ medicine, index = 0, onReorder }: { medicine: Medicine; index?: number; onReorder?: () => void }) {
  const pct = Math.min(100, Math.round((medicine.stock / (medicine.reorderAt * 3)) * 100));
  return (
    <article className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: index }}>
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Boxes className="size-4" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{medicine.name}</p>
          <p className="truncate text-xs text-slate-500">{medicine.supplier} · Batch {medicine.batch}</p>
        </div>
        <Pill tone={stockTone(medicine)}>{stockLabel(medicine)}</Pill>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
        <span className="tabular-nums">{medicine.stock} units · reorder at {medicine.reorderAt}</span>
        <span>Expires {medicine.expiry}</span>
      </div>
      <div role="progressbar" aria-label={`${medicine.name} stock level`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={cn('h-full rounded-full transition-[width] duration-500', stockTone(medicine) === 'red' ? 'bg-red-500' : stockTone(medicine) === 'amber' ? 'bg-[var(--demo-orange)]' : 'bg-[var(--demo-good)]')} style={{ width: `${pct}%` }} />
      </div>
      {onReorder && <button type="button" onClick={onReorder} className="mt-4 h-8 w-full rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:border-[color:var(--demo-accent)] hover:text-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">Create reorder</button>}
    </article>
  );
}

/** A prescription record: patient, doctor and clinic, the items to dispense and the status with an optional action. */
export function PrescriptionCard({ rx, index = 0, action }: { rx: Prescription; index?: number; action?: { label: string; onClick: () => void } }) {
  return (
    <article className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: index }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900"><span className="tabular-nums">{rx.id}</span> · {rx.patient}, {rx.age}</p>
        <Pill tone={rxTone(rx.status)}>{rx.status}</Pill>
      </div>
      <p className="mt-1 text-xs text-slate-500">{rx.doctor} · {rx.clinic} · {rx.date}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-700">{rx.items.map((item) => <li key={item} className="flex items-start gap-2"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--demo-accent)]" />{item}</li>)}</ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-500">{rx.refillsLeft} refills left</span>
        {action && <button type="button" onClick={action.onClick} className="h-8 rounded-lg bg-[var(--demo-accent)] px-3 text-xs font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">{action.label}</button>}
      </div>
    </article>
  );
}
