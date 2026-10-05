'use client';

import { Bell, CalendarCheck, CalendarClock, Check, ChevronRight, ClipboardList, FileText, GraduationCap, House, Lock, LogOut, Mail, Megaphone, School, Settings, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Ring } from '@/components/demos/shared/charts';
import { ANNOUNCEMENTS, CLASSES, MONTH_ATTENDANCE, PARENT_CHILD, RESULTS, STUDENT_SCHEDULE, STUDENTS } from '@/data/school/app';
import type { AttendanceStatus } from '@/data/school/app';
import { cn } from '@/lib/cn';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { SchoolLogo } from './school-logo';
import { Avatar, Pill, ProgressBar, statusTone } from '@/components/demos/shared/app-ui';

/** Screens of the student and teacher mobile apps. Compact, touch-sized and driven by dummy data. */

export type StudentScreen = 'login' | 'home' | 'attendance' | 'results' | 'schedule' | 'announcements' | 'profile';
export type TeacherScreen = 'dashboard' | 'classes' | 'attendance' | 'reports';
type Go<T extends string> = (screen: T) => void;

export const STUDENT_NAV: { id: StudentScreen; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'results', label: 'Results', icon: ClipboardList },
  { id: 'schedule', label: 'Schedule', icon: CalendarClock },
  { id: 'announcements', label: 'Alerts', icon: Bell },
];

export const TEACHER_NAV: { id: TeacherScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'classes', label: 'Classes', icon: School },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'reports', label: 'Reports', icon: FileText },
];

/* ---------------------------------- Student app ---------------------------------- */

export function StudentLogin({ onSignIn }: { onSignIn: () => void }) {
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <SchoolLogo />
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">Welcome back</h3>
      <p className="mt-1 text-[13px] text-slate-500">Sign in with your school account.</p>
      <div className="mt-6 space-y-3">
        <div className={field}>
          <Mail className="size-4 text-slate-400" aria-hidden /> olivia.bennett@northfield.edu
        </div>
        <div className={field}>
          <Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••
        </div>
      </div>
      <p className="mt-3 text-right text-xs font-medium text-blue-600">Forgot password?</p>
      <button type="button" onClick={onSignIn} className="mt-auto h-11 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        Sign in
      </button>
      <p className="mt-3 text-center text-[11px] text-slate-500">Demo app: tap Sign in to continue.</p>
    </div>
  );
}

export function StudentHome({ go }: { go: Go<StudentScreen> }) {
  const next = STUDENT_SCHEDULE[1];
  const actions: { id: StudentScreen; label: string; icon: LucideIcon }[] = [
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'results', label: 'Results', icon: ClipboardList },
    { id: 'schedule', label: 'Schedule', icon: CalendarClock },
    { id: 'announcements', label: 'Alerts', icon: Megaphone },
  ];
  return (
    <>
      <AppHeader
        subtitle="Good morning"
        title="Olivia Bennett"
        right={
          <button type="button" onClick={() => go('profile')} aria-label="Open profile" className="rounded-full focus-visible:outline-2 focus-visible:outline-white">
            <Avatar name="Olivia Bennett" />
          </button>
        }
      />
      <Body>
        <div className="grid grid-cols-2 gap-2.5">
          <Card className="flex items-center gap-2.5">
            <Ring value={98} size={44} stroke={10} label="Attendance" />
            <div>
              <p className="text-[11px] text-slate-500">Attendance</p>
              <p className="text-xs font-semibold text-slate-900">Excellent</p>
            </div>
          </Card>
          <Card>
            <p className="text-[11px] text-slate-500">Term average</p>
            <p className="text-xl font-semibold tabular-nums text-slate-900">91%</p>
          </Card>
        </div>
        <Card className="border-blue-200 bg-blue-50/60">
          <p className="text-[11px] font-medium text-blue-700">Next class · {next.time}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{next.subject}</p>
          <p className="text-xs text-slate-600">
            {next.className} · {next.room}
          </p>
        </Card>
        <div className="grid grid-cols-4 gap-2">
          {actions.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => go(id)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-[10px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600">
              <span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="size-4" aria-hidden />
              </span>
              {label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go('announcements')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-blue-600">
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-900">{ANNOUNCEMENTS[0].title}</p>
              <ChevronRight className="size-4 text-slate-400" aria-hidden />
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">{ANNOUNCEMENTS[0].body}</p>
          </Card>
        </button>
      </Body>
    </>
  );
}

const CELL = { Present: 'bg-emerald-500', Late: 'bg-amber-400', Absent: 'bg-rose-500' } as const;

export function StudentAttendance() {
  return (
    <>
      <AppHeader subtitle="Olivia Bennett" title="Attendance" />
      <Body>
        <Card className="flex items-center gap-4">
          <Ring value={PARENT_CHILD.attendance} size={64} stroke={9} label="Attendance rate" />
          <ul className="space-y-1 text-xs">
            {(['Present', 'Late', 'Absent'] as const).map((s) => (
              <li key={s} className="flex items-center gap-2 text-slate-600">
                <span aria-hidden className={cn('size-2.5 rounded-sm', CELL[s])} />
                {s}
                <span className="ml-3 font-semibold tabular-nums text-slate-900">{MONTH_ATTENDANCE.filter((x) => x === s).length}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="mb-2 text-xs font-semibold text-slate-900">Last four weeks</p>
          <div className="grid grid-cols-5 gap-1.5">
            {MONTH_ATTENDANCE.map((status, i) => (
              <span key={i} className={cn('grid aspect-square place-items-center rounded-md text-[10px] font-semibold', CELL[status], status === 'Late' ? 'text-slate-900' : 'text-white')}>
                <span className="sr-only">{status}</span>
                {i + 1}
              </span>
            ))}
          </div>
        </Card>
      </Body>
    </>
  );
}

export function StudentResults() {
  return (
    <>
      <AppHeader subtitle="Term 1" title="Results" right={<Pill tone="green">91% avg</Pill>} />
      <Body>
        {RESULTS.map((r) => (
          <Card key={r.subject}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-900">{r.subject}</span>
              <span className="text-xs font-semibold tabular-nums text-slate-700">
                {r.score} · {r.grade}
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={r.score} tone={r.score >= 90 ? 'emerald' : 'blue'} />
            </div>
          </Card>
        ))}
      </Body>
    </>
  );
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function StudentSchedule() {
  const [day, setDay] = useState(0);
  const periods = [...STUDENT_SCHEDULE.slice(day), ...STUDENT_SCHEDULE.slice(0, day)].map((p, i) => ({ ...p, time: STUDENT_SCHEDULE[i].time }));
  return (
    <>
      <AppHeader subtitle="Week of 5 October" title="Class schedule" />
      <div role="tablist" aria-label="Day" className="flex shrink-0 gap-1.5 border-b border-slate-200 bg-white px-3.5 py-2.5">
        {DAYS.map((d, i) => (
          <button key={d} role="tab" type="button" aria-selected={day === i} onClick={() => setDay(i)} className={cn('flex-1 rounded-lg py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-blue-600', day === i ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600')}>
            {d}
          </button>
        ))}
      </div>
      <Body>
        <div key={day} className="demo-slide space-y-2">
          {periods.map((p) => (
            <Card key={p.time} className="flex items-center gap-3">
              <span className="w-10 text-xs font-semibold tabular-nums text-blue-700">{p.time}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{p.subject}</p>
                <p className="truncate text-[11px] text-slate-500">
                  {p.className} · {p.room}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Body>
    </>
  );
}

export function StudentAnnouncements() {
  return (
    <>
      <AppHeader subtitle="From the school" title="Announcements" />
      <Body>
        {ANNOUNCEMENTS.map((a) => (
          <Card key={a.id}>
            <div className="flex items-center justify-between gap-2">
              <Pill tone={a.tag === 'Event' ? 'green' : a.tag === 'Notice' ? 'amber' : 'blue'}>{a.tag}</Pill>
              <span className="text-[11px] text-slate-500">{a.date}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{a.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{a.body}</p>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function StudentProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [
    [Users, 'Guardian contacts'],
    [Bell, 'Notifications'],
    [Settings, 'Settings'],
  ];
  return (
    <>
      <AppHeader subtitle="Student" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center">
          <Avatar name="Olivia Bennett" size="lg" />
          <p className="mt-3 text-base font-semibold text-slate-900">Olivia Bennett</p>
          <p className="text-xs text-slate-500">Grade 8-A · Roll 1 · ID NA-2041</p>
        </Card>
        <Card className="divide-y divide-slate-100 p-0">
          {rows.map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3 text-sm text-slate-700">
              <Icon className="size-4 text-slate-500" aria-hidden />
              {label}
              <ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden />
            </div>
          ))}
        </Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </Body>
    </>
  );
}

/* ---------------------------------- Teacher app ---------------------------------- */

export function TeacherDashboardScreen({ go }: { go: Go<TeacherScreen> }) {
  return (
    <>
      <AppHeader subtitle="Good morning" title="Dr. Helen Brooks" right={<Avatar name="Dr. Helen Brooks" />} />
      <Body>
        <div className="grid grid-cols-2 gap-2.5">
          <Card>
            <p className="text-[11px] text-slate-500">Sessions today</p>
            <p className="text-xl font-semibold tabular-nums text-slate-900">4</p>
          </Card>
          <Card>
            <p className="text-[11px] text-slate-500">To mark</p>
            <p className="text-xl font-semibold tabular-nums text-amber-700">12</p>
          </Card>
        </div>
        <p className="px-0.5 pt-1 text-xs font-semibold text-slate-900">Today</p>
        {[
          ['08:30', 'Grade 8-A', 'Room 101'],
          ['09:30', 'Grade 9-A', 'Room 201'],
          ['12:00', 'Grade 10-A', 'Room 301'],
        ].map(([time, cls, room], i) => (
          <Card key={time} className={cn('flex items-center gap-3', i === 1 && 'border-blue-200 bg-blue-50/60')}>
            <span className="w-10 text-xs font-semibold tabular-nums text-blue-700">{time}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">Mathematics · {cls}</p>
              <p className="text-[11px] text-slate-500">{room}</p>
            </div>
            {i === 1 && <Pill tone="blue">Now</Pill>}
          </Card>
        ))}
        <button type="button" onClick={() => go('attendance')} className="h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Take attendance
        </button>
      </Body>
    </>
  );
}

export function TeacherClasses({ go }: { go: Go<TeacherScreen> }) {
  return (
    <>
      <AppHeader subtitle="3 assigned" title="My classes" />
      <Body>
        {CLASSES.filter((c) => ['Grade 8-A', 'Grade 9-A', 'Grade 10-A'].includes(c.name)).map((c) => (
          <button key={c.name} type="button" onClick={() => go('attendance')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-blue-600">
            <Card>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                <ChevronRight className="size-4 text-slate-400" aria-hidden />
              </div>
              <p className="text-[11px] text-slate-500">
                {c.students} students · {c.room}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1">
                  <ProgressBar value={c.average} />
                </div>
                <span className="text-[11px] font-semibold tabular-nums text-slate-700">{c.average}%</span>
              </div>
            </Card>
          </button>
        ))}
      </Body>
    </>
  );
}

const NEXT_STATUS: Record<AttendanceStatus, AttendanceStatus> = { Present: 'Late', Late: 'Absent', Absent: 'Present' };

export function TeacherAttendance() {
  const roster = STUDENTS.filter((s) => s.className === 'Grade 9-A' || s.className === 'Grade 8-A');
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>(() => Object.fromEntries(roster.map((s) => [s.id, 'Present' as AttendanceStatus])));
  const [done, setDone] = useState(false);
  const absent = roster.filter((s) => marks[s.id] === 'Absent').length;
  return (
    <>
      <AppHeader subtitle="Grade 9-A · Mathematics" title="Take attendance" right={<Pill tone="blue">{roster.length - absent}/{roster.length}</Pill>} />
      <Body>
        <p className="px-0.5 text-[11px] text-slate-500">Tap a status to change it.</p>
        {roster.map((s) => (
          <Card key={s.id} className="flex items-center gap-3 py-2.5">
            <Avatar name={s.name} size="sm" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">{s.name}</span>
            <button
              type="button"
              aria-label={`${s.name}: ${marks[s.id]}. Tap to change`}
              onClick={() => {
                setMarks((m) => ({ ...m, [s.id]: NEXT_STATUS[m[s.id]] }));
                setDone(false);
              }}
              className="min-w-[4.5rem] rounded-full focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <Pill tone={statusTone(marks[s.id])}>{marks[s.id]}</Pill>
            </button>
          </Card>
        ))}
        <button type="button" onClick={() => setDone(true)} className={cn('flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600', done ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700')}>
          {done ? (
            <>
              <Check className="size-4" aria-hidden /> Register submitted
            </>
          ) : (
            'Submit register'
          )}
        </button>
      </Body>
    </>
  );
}

export function TeacherReports() {
  const ranked = [...STUDENTS].sort((a, b) => b.average - a.average).slice(0, 6);
  return (
    <>
      <AppHeader subtitle="Grade 9-A" title="Student reports" right={<GraduationCap className="size-5 text-slate-300" aria-hidden />} />
      <Body>
        {ranked.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center gap-3">
              <Avatar name={s.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{s.name}</p>
                <p className="text-[11px] text-slate-500">Attendance {s.attendance}%</p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-slate-900">{s.average}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={s.average} tone={s.average >= 85 ? 'emerald' : 'blue'} />
            </div>
          </Card>
        ))}
      </Body>
    </>
  );
}
