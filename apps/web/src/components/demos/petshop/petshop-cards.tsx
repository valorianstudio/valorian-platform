'use client';

import { Bird, Bone, Cat, Clock, Dog, Rabbit, Scissors, Stethoscope, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, Pill } from '@/components/demos/shared/app-ui';
import type { Appointment, Pet, Product, Species } from '@/data/petshop/catalog';
import { cn } from '@/lib/cn';

type Tone = Parameters<typeof Pill>[0]['tone'];

const TONES: Record<string, Tone> = {
  Booked: 'blue',
  'Checked in': 'amber',
  'In progress': 'amber',
  Done: 'green',
  Placed: 'blue',
  Packed: 'amber',
  Shipped: 'blue',
  Delivered: 'green',
  Gold: 'amber',
  Regular: 'blue',
  New: 'green',
  'In stock': 'green',
  Low: 'red',
  OK: 'green',
};

/** Colour of a status pill across the pet shop demo, so one status always looks the same. */
export const tone = (status: string): Tone => TONES[status] ?? 'slate';

const SPECIES_ICON: Record<Species, LucideIcon> = { Dog, Cat, Bird, Rabbit };
const KIND_ICON: Record<Product['kind'], LucideIcon> = { food: Bone, toy: Star, care: Scissors, bed: Dog, bird: Bird, 'cat-litter': Cat };

/** A pet as a card: the species icon, name, breed, age and owner, with the next visit. `onOpen` makes the card a button. */
export function PetCard({ pet, index = 0, onOpen }: { pet: Pet; index?: number; onOpen?: () => void }) {
  const Icon = SPECIES_ICON[pet.species];
  const body = (
    <>
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Icon className="size-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{pet.name}</p>
          <p className="truncate text-xs text-slate-500">{pet.breed} · {pet.age} yrs</p>
        </div>
        <Pill tone={pet.vaccinated ? 'green' : 'red'}>{pet.vaccinated ? 'Vaccinated' : 'Due'}</Pill>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-slate-600"><Avatar name={pet.owner} size="sm" /><span className="truncate">{pet.owner}</span></span>
        <span className="inline-flex shrink-0 items-center gap-1 font-medium text-slate-700"><Clock className="size-3.5" aria-hidden /> {pet.next.split(' · ')[0]}</span>
      </div>
    </>
  );
  const frame = 'demo-rise block w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-md';
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cn(frame, 'focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]')} style={{ ['--i' as string]: index }}>{body}</button>
  ) : (
    <div className={frame} style={{ ['--i' as string]: index }}>{body}</div>
  );
}

/** A product as a card: its icon tile, name, category, price, rating and stock status. */
export function ProductCard({ product, index = 0, action }: { product: Product; index?: number; action?: { label: string; onClick: () => void } }) {
  const Icon = KIND_ICON[product.kind];
  const low = product.stock <= product.reorderAt;
  return (
    <article className="demo-rise group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md" style={{ ['--i' as string]: index }}>
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-12 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)] transition-transform duration-300 group-hover:scale-105"><Icon className="size-5" aria-hidden /></span>
        {product.tag && <Pill tone={product.tag === 'New' ? 'blue' : 'green'}>{product.tag}</Pill>}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900">{product.name}</p>
      <p className="text-xs text-slate-500">{product.category} · <span className="inline-flex items-center gap-0.5"><Star className="size-3 fill-[color:var(--demo-orange)] text-[color:var(--demo-orange)]" aria-hidden /> {product.rating} ({product.reviews})</span></p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="text-base font-semibold tabular-nums text-slate-900">${product.price}</span>
        <Pill tone={low ? 'red' : 'green'}>{low ? `Low: ${product.stock}` : `${product.stock} in stock`}</Pill>
      </div>
      {action && <button type="button" onClick={action.onClick} className="mt-3 rounded-lg bg-[var(--demo-accent)] py-1.5 text-xs font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">{action.label}</button>}
    </article>
  );
}

/** An appointment as a card: time, pet and owner, service, staff, and the status with an optional next step. */
export function AppointmentCard({ appointment, index = 0, action }: { appointment: Appointment; index?: number; action?: { label: string; onClick: () => void } }) {
  const Icon = appointment.kind === 'Grooming' ? Scissors : appointment.kind === 'Training' ? Star : Stethoscope;
  return (
    <article className="demo-rise flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-shadow hover:shadow-md" style={{ ['--i' as string]: index }}>
      <span className="grid w-14 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] py-2 text-sm font-semibold tabular-nums text-[color:var(--demo-accent)]">{appointment.time}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{appointment.pet} <span className="font-normal text-slate-500">· {appointment.species}</span></p>
        <p className="inline-flex items-center gap-1.5 truncate text-xs text-slate-500"><Icon className="size-3.5 shrink-0" aria-hidden /> {appointment.kind} · {appointment.staff} · {appointment.minutes} min</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <Pill tone={tone(appointment.status)}>{appointment.status}</Pill>
        {action && <button type="button" onClick={action.onClick} className="rounded-md bg-[var(--demo-accent)] px-2 py-0.5 text-[11px] font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">{action.label}</button>}
      </div>
    </article>
  );
}
