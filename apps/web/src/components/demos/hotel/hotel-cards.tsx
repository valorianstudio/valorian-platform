import { BedDouble, Calendar, Ruler } from 'lucide-react';
import { Avatar, Pill } from '@/components/demos/shared/app-ui';
import type { Reservation, Room } from '@/data/hotel/rooms';
import { cn } from '@/lib/cn';
import { RoomArt } from './room-art';

type Tone = Parameters<typeof Pill>[0]['tone'];

const TONES: Record<string, Tone> = {
  Available: 'green',
  Occupied: 'blue',
  Reserved: 'amber',
  Cleaning: 'slate',
  Maintenance: 'red',
  Confirmed: 'blue',
  'Checked in': 'green',
  'Checked out': 'slate',
  Pending: 'amber',
  Cancelled: 'red',
  Clean: 'green',
  Dirty: 'red',
  'In progress': 'amber',
  Inspected: 'green',
  Paid: 'green',
  Overdue: 'red',
  'On shift': 'green',
  'On break': 'amber',
  Off: 'slate',
};

/** Colour of a status pill across the hotel demo, so one status always looks the same. */
export const tone = (status: string): Tone => TONES[status] ?? 'slate';

/** A room as a card: art, number, type, size and the nightly rate, with its status. `onOpen` makes the card a button. */
export function RoomCard({ room, onOpen, index = 0, action }: { room: Room; onOpen?: () => void; index?: number; action?: { label: string; onClick: () => void } }) {
  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--demo-accent-soft)]">
        <RoomArt category={room.category} label={`${room.category} room ${room.number}`} className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        <span className="absolute left-2.5 top-2.5"><Pill tone={tone(room.status)}>{room.status}</Pill></span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Room {room.number} · {room.category}</p>
          <p className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><BedDouble className="size-3.5" aria-hidden /> {room.beds}</span>
            <span className="inline-flex items-center gap-1"><Ruler className="size-3.5" aria-hidden /> {room.size} m²</span>
          </p>
        </div>
        <p className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-900">${room.rate}<span className="block text-[10px] font-normal text-slate-500">per night</span></p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">Floor {room.floor} · {room.view} view · {room.clean}</span>
        {action && (
          <button type="button" onClick={(event) => { event.stopPropagation(); action.onClick(); }} className="rounded-lg bg-[var(--demo-accent)] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">{action.label}</button>
        )}
      </div>
    </>
  );
  const frame = 'demo-rise group block w-full rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-md';
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cn(frame, 'focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]')} style={{ ['--i' as string]: index }}>{body}</button>
  ) : (
    <div className={frame} style={{ ['--i' as string]: index }}>{body}</div>
  );
}

/** A reservation as a card: guest, room, dates, nights and status, with an optional action. */
export function BookingCard({ booking, index = 0, action }: { booking: Reservation; index?: number; action?: { label: string; onClick: () => void } }) {
  return (
    <article className="demo-rise flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center" style={{ ['--i' as string]: index }}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar name={booking.guest} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{booking.guest}</p>
          <p className="truncate text-xs text-slate-500">{booking.id} · Room {booking.room} · {booking.roomType}</p>
        </div>
      </div>
      <p className="inline-flex items-center gap-1.5 text-xs text-slate-600"><Calendar className="size-3.5 text-slate-400" aria-hidden /> {booking.checkIn} → {booking.checkOut} · {booking.nights} nights · {booking.guests} guests</p>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Pill tone={tone(booking.status)}>{booking.status}</Pill>
        <span className="text-sm font-semibold tabular-nums text-slate-900">${booking.total.toLocaleString('en-US')}</span>
        {action && <button type="button" onClick={action.onClick} className={cn('rounded-lg bg-[var(--demo-accent)] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]')}>{action.label}</button>}
      </div>
    </article>
  );
}

