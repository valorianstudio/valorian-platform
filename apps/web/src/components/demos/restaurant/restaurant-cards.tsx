import { Bike, Clock, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { Pill } from '@/components/demos/shared/app-ui';
import { ORDER_FLOW } from '@/data/restaurant/app';
import type { Order, OrderStatus, OrderType } from '@/data/restaurant/app';
import { cn } from '@/lib/cn';

type Tone = Parameters<typeof Pill>[0]['tone'];

const TONES: Record<string, Tone> = {
  New: 'red',
  Preparing: 'amber',
  Ready: 'green',
  Served: 'slate',
  Available: 'green',
  Occupied: 'blue',
  Reserved: 'slate',
  Cleaning: 'amber',
  Confirmed: 'blue',
  Pending: 'amber',
  Seated: 'green',
  VIP: 'amber',
  Regular: 'blue',
  OK: 'green',
  Low: 'amber',
  Critical: 'red',
  'On shift': 'green',
  'On break': 'amber',
  Off: 'slate',
};

/** Colour of a status pill across the restaurant demo, so one status always looks the same. */
export const tone = (status: string): Tone => TONES[status] ?? 'slate';

const TYPE_ICON: Record<OrderType, typeof Clock> = { 'Dine-in': UtensilsCrossed, Takeaway: ShoppingBag, Delivery: Bike };
const BAR: Record<OrderStatus, string> = { New: 'bg-rose-500', Preparing: 'bg-amber-500', Ready: 'bg-[var(--demo-good)]', Served: 'bg-slate-300' };

/** A kitchen/floor order as a card: items, total, status and one button that moves it to its next step. */
export function OrderCard({ order, onAdvance, index = 0 }: { order: Order; onAdvance?: (order: Order) => void; index?: number }) {
  const Icon = TYPE_ICON[order.type];
  const next = ORDER_FLOW[order.status];
  return (
    <article className="demo-rise relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 pl-5 transition-shadow hover:shadow-md" style={{ ['--i' as string]: index }}>
      <span aria-hidden className={cn('absolute inset-y-0 left-0 w-1', BAR[order.status])} />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
            <Icon className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {order.id} · {order.table}
            </p>
            <p className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="size-3" aria-hidden /> {order.minutes} min ago · {order.server}
            </p>
          </div>
        </div>
        <Pill tone={tone(order.status)}>{order.status}</Pill>
      </div>
      <ul className="mt-3 flex-1 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-700">
        {order.items.map((item) => (
          <li key={item.name} className="flex justify-between gap-3">
            <span className="min-w-0 truncate">
              <span className="font-semibold tabular-nums text-slate-900">{item.qty}×</span> {item.name}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-base font-semibold tabular-nums text-slate-900">${order.total}</p>
        {next && onAdvance && (
          <button type="button" onClick={() => onAdvance(order)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
            {next.label}
          </button>
        )}
      </div>
    </article>
  );
}
