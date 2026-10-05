import { Dumbbell, Flame } from 'lucide-react';
import { Avatar, Pill } from '@/components/demos/shared/app-ui';
import type { Member } from '@/data/gym/app';
import { cn } from '@/lib/cn';

type Tone = Parameters<typeof Pill>[0]['tone'];

const TONES: Record<string, Tone> = {
  Active: 'green',
  Expiring: 'amber',
  Expired: 'red',
  Paused: 'slate',
  Paid: 'green',
  Due: 'amber',
  Overdue: 'red',
  'In session': 'blue',
  Available: 'green',
  'Off today': 'slate',
  Basic: 'slate',
  Standard: 'blue',
  Premium: 'amber',
  Student: 'green',
  Full: 'red',
  Booked: 'blue',
  Open: 'green',
};

/** Colour of a status pill across the gym demo, so one status always looks the same. */
export const tone = (status: string): Tone => TONES[status] ?? 'slate';

/** A member as a card: avatar, plan, status, goal and a progress bar. Pass `onOpen` to make the whole card a button. */
export function MemberCard({ member, onOpen, index = 0 }: { member: Member; onOpen?: () => void; index?: number }) {
  const body = (
    <>
      <span className="flex items-center gap-3">
        <Avatar name={member.name} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-900">{member.name}</span>
          <span className="block truncate text-xs text-slate-500">
            {member.plan} · {member.trainer}
          </span>
        </span>
        <Pill tone={tone(member.status)}>{member.status}</Pill>
      </span>
      <span className="mt-4 block">
        <span className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
          <span>{member.goal}</span>
          <span className="font-medium tabular-nums text-slate-700">{member.progress}%</span>
        </span>
        <span className="block h-1.5 overflow-hidden rounded-full bg-slate-100">
          <span className="block h-full rounded-full bg-[var(--demo-accent)]" style={{ width: `${member.progress}%` }} />
        </span>
      </span>
      <span className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Dumbbell className="size-3.5" aria-hidden /> {member.checkIns} check-ins
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-[color:var(--demo-gold,#c2410c)]">
          <Flame className="size-3.5" aria-hidden /> {member.streak}-day streak
        </span>
      </span>
    </>
  );
  const className = 'demo-rise block w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[color:var(--demo-accent-ring)] hover:shadow-md';
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cn(className, 'focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]')} style={{ ['--i' as string]: index }}>
      {body}
    </button>
  ) : (
    <div className={className} style={{ ['--i' as string]: index }}>
      {body}
    </div>
  );
}
