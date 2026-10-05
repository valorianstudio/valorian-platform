import { CalendarClock, Clock } from 'lucide-react';
import { Avatar, Pill } from '@/components/demos/shared/app-ui';
import type { Appointment, Patient } from '@/data/clinic/app';
import { cn } from '@/lib/cn';

type Tone = Parameters<typeof Pill>[0]['tone'];

const TONES: Record<string, Tone> = {
  Completed: 'slate',
  'In progress': 'green',
  'Checked in': 'green',
  Confirmed: 'blue',
  Pending: 'amber',
  Paid: 'green',
  Overdue: 'red',
  Active: 'green',
  New: 'blue',
  'Follow-up': 'amber',
  'In clinic': 'green',
  'In surgery': 'amber',
  'Off today': 'slate',
};

/** Colour of a status pill across the clinic demo, so one status always looks the same. */
export const tone = (status: string): Tone => TONES[status] ?? 'slate';

/** A patient as a card: used in the patients grid and the doctor's queue. Pass `onOpen` to make it a button. */
export function PatientCard({ patient, onOpen, index = 0 }: { patient: Patient; onOpen?: () => void; index?: number }) {
  const body = (
    <>
      <span className="flex items-center gap-3">
        <Avatar name={patient.name} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-900">{patient.name}</span>
          <span className="block text-xs text-slate-500">
            {patient.age} yrs · {patient.gender}
          </span>
        </span>
        <Pill tone={tone(patient.status)}>{patient.status}</Pill>
      </span>
      <span className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
        <span>
          <span className="block text-slate-500">Dentist</span>
          <span className="block truncate font-medium text-slate-800">{patient.doctor}</span>
        </span>
        <span>
          <span className="block text-slate-500">Next visit</span>
          <span className="block font-medium text-slate-800">{patient.nextVisit}</span>
        </span>
      </span>
    </>
  );
  const className = 'demo-rise block w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring,#bfdbfe)] hover:shadow-md';
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cn(className, 'focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]')} style={{ ['--i' as string]: index }}>
      {body}
    </button>
  ) : (
    <div className={className} style={{ ['--i' as string]: index }}>
      {body}
    </div>
  );
}

/** An appointment as a card. `action` adds a small button, for example "Check in". */
export function AppointmentCard({ appointment, action, index = 0 }: { appointment: Appointment; action?: { label: string; onClick: () => void }; index?: number }) {
  return (
    <article className="demo-rise flex gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-shadow hover:shadow-md sm:gap-4 sm:p-4" style={{ ['--i' as string]: index }}>
      <div className="grid w-14 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft,#eff6ff)] py-2 text-[color:var(--demo-accent,#2563eb)]">
        <Clock className="size-3.5" aria-hidden />
        <span className="text-sm font-semibold tabular-nums">{appointment.time}</span>
        <span className="text-[10px] text-slate-500">{appointment.minutes} min</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{appointment.patient}</p>
            <p className="truncate text-xs text-slate-500">{appointment.type}</p>
          </div>
          <Pill tone={tone(appointment.status)}>{appointment.status}</Pill>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <CalendarClock className="size-3.5 text-slate-400" aria-hidden />
            {appointment.doctor} · {appointment.room}
          </p>
          {action && (
            <button type="button" onClick={action.onClick} className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
              {action.label}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
