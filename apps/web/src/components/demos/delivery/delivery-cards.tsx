'use client';

import { Bike, Clock, MapPin, Star } from 'lucide-react';
import { Avatar, Pill, ProgressBar } from '@/components/demos/shared/app-ui';
import type { Order, Rider } from '@/data/delivery/operations';
import { cn } from '@/lib/cn';
import { MapView } from './map-view';

type Tone = Parameters<typeof Pill>[0]['tone'];

const TONES: Record<string, Tone> = {
  Placed: 'blue',
  'Picked up': 'amber',
  'On the way': 'blue',
  Delivered: 'green',
  Failed: 'red',
  Available: 'green',
  'On delivery': 'blue',
  'On break': 'amber',
  Offline: 'slate',
  Paid: 'green',
  Pending: 'amber',
  Refunded: 'slate',
  Plus: 'blue',
  Standard: 'slate',
  Business: 'amber',
  New: 'green',
};

/** Colour of a status pill across the delivery demo, so one status always looks the same. */
export const tone = (status: string): Tone => TONES[status] ?? 'slate';

/** An order as a card: kind, status, pickup and drop-off, ETA and fee, with an optional action. */
export function OrderCard({ order, index = 0, onOpen, action }: { order: Order; index?: number; onOpen?: () => void; action?: { label: string; onClick: () => void } }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{order.id} · {order.kind}</p>
          <p className="truncate text-sm font-semibold text-slate-900">{order.customer}</p>
        </div>
        <Pill tone={tone(order.status)}>{order.status}</Pill>
      </div>
      <ol className="mt-3 space-y-1.5 text-xs text-slate-600">
        <li className="flex items-center gap-2"><span aria-hidden className="size-2 rounded-full border-2 border-[color:var(--demo-accent)] bg-white" /><span className="truncate">{order.pickup}</span></li>
        <li className="flex items-center gap-2"><MapPin className="size-3 text-[color:var(--demo-orange-ink)]" aria-hidden /><span className="truncate">{order.drop}</span></li>
      </ol>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden /> {order.status === 'Delivered' ? 'Completed' : `${order.eta} min`}</span>
        <span className="inline-flex items-center gap-1"><Bike className="size-3.5" aria-hidden /> {order.rider}</span>
        <span className="font-semibold tabular-nums text-slate-900">${order.fee.toFixed(2)}</span>
      </div>
      {action && (
        <button type="button" onClick={(event) => { event.stopPropagation(); action.onClick(); }} className="mt-3 w-full rounded-lg bg-[var(--demo-accent)] py-1.5 text-xs font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          {action.label}
        </button>
      )}
    </>
  );
  const frame = 'demo-rise block w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-[border-color,box-shadow] hover:border-[color:var(--demo-accent-ring)] hover:shadow-md';
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cn(frame, 'focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]')} style={{ ['--i' as string]: index }}>{body}</button>
  ) : (
    <article className={frame} style={{ ['--i' as string]: index }}>{body}</article>
  );
}

/** A rider as a card: vehicle, zone, availability, on-time rate and rating. `onToggle` lets a dispatcher change availability. */
export function RiderCard({ rider, index = 0, onToggle }: { rider: Rider; index?: number; onToggle?: () => void }) {
  return (
    <article className="demo-rise rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md" style={{ ['--i' as string]: index }}>
      <div className="flex items-center gap-3">
        <Avatar name={rider.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{rider.name}</p>
          <p className="text-xs text-slate-500">{rider.vehicle} · {rider.zone}</p>
        </div>
        <Pill tone={tone(rider.status)}>{rider.status}</Pill>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-slate-500"><span>On-time</span><span className="font-medium tabular-nums text-slate-700">{rider.onTime}%</span></div>
        <ProgressBar value={rider.onTime} tone="emerald" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>{rider.deliveries.toLocaleString('en-US')} deliveries</span>
        <span className="inline-flex items-center gap-1 font-medium text-slate-700"><Star className="size-3.5 fill-[color:var(--demo-orange)] text-[color:var(--demo-orange)]" aria-hidden /> {rider.rating}</span>
      </div>
      {onToggle && rider.status !== 'Offline' && (
        <button type="button" onClick={onToggle} className="mt-3 w-full rounded-lg border border-slate-300 py-1.5 text-xs font-semibold text-slate-800 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          {rider.status === 'Available' ? 'Send on a break' : 'Mark available'}
        </button>
      )}
    </article>
  );
}

/** A live delivery as a card: the map, the progress and the next step. */
export function TrackingCard({ order, index = 0 }: { order: Order; index?: number }) {
  return (
    <article className="demo-rise overflow-hidden rounded-xl border border-slate-200 bg-white" style={{ ['--i' as string]: index }}>
      <MapView from={order.from} to={order.to} progress={order.progress} label={`${order.id} route`} className="aspect-[16/9] w-full" />
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{order.id} · {order.customer}</p>
          <Pill tone={tone(order.status)}>{order.status}</Pill>
        </div>
        <p className="mt-1 text-xs text-slate-500">{order.rider} · {order.distance} km · ETA {order.status === 'Delivered' ? 'done' : `${order.eta} min`}</p>
        <div className="mt-3"><ProgressBar value={order.progress} tone={order.progress === 100 ? 'emerald' : 'blue'} /></div>
      </div>
    </article>
  );
}
