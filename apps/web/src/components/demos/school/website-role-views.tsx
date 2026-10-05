'use client';

import { CalendarCheck, ClipboardList, Clock, GraduationCap, Megaphone, Users } from 'lucide-react';
import { useState } from 'react';
import { Ring } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { ANNOUNCEMENTS, CLASSES, MONTH_ATTENDANCE, PARENT_CHILD, STUDENT_SCHEDULE, STUDENTS, TEACHER_SCHEDULE } from '@/data/school/app';
import type { Announcement } from '@/data/school/app';
import { cn } from '@/lib/cn';
import { Avatar, PageHeading, Pill, ProgressBar, Tabs } from './website-ui';

/* ---------------------------------- Teacher ---------------------------------- */

export function TeacherDashboard() {
  const mine = CLASSES.filter((c) => ['Grade 8-A', 'Grade 9-A', 'Grade 10-A'].includes(c.name));
  const ranked = [...STUDENTS].sort((a, b) => b.average - a.average).slice(0, 6);
  return (
    <>
      <PageHeading title="Teacher dashboard" description="Good morning, Dr. Brooks. You have 4 sessions today." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Sessions today" value="4" icon={Clock} />
        <DashboardCard index={1} label="My students" value="99" icon={Users} tone="emerald" />
        <DashboardCard index={2} label="Avg. attendance" value="95%" delta={{ value: '+1.2% this month', up: true }} icon={CalendarCheck} tone="slate" />
        <DashboardCard index={3} label="To mark" value="12" icon={ClipboardList} tone="amber" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_1fr]">
        <Panel index={4} title="Today's schedule" action={<span className="text-xs text-slate-500">Mon 5 Oct</span>}>
          <ol className="relative space-y-1 before:absolute before:bottom-3 before:left-[2.9rem] before:top-3 before:w-px before:bg-slate-200">
            {TEACHER_SCHEDULE.map((p, i) => (
              <li key={p.time} className={cn('relative flex items-center gap-4 rounded-lg px-1 py-2.5', i === 1 && 'bg-blue-50/70')}>
                <span className="w-10 shrink-0 text-xs font-medium tabular-nums text-slate-500">{p.time}</span>
                <span aria-hidden className={cn('relative z-10 size-2.5 shrink-0 rounded-full ring-4 ring-white', i === 1 ? 'bg-blue-600' : 'bg-slate-300')} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{p.subject}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {p.className} · {p.room}
                  </span>
                </span>
                {i === 1 && <Pill tone="blue">Now</Pill>}
              </li>
            ))}
          </ol>
        </Panel>
        <Panel index={5} title="Assigned classes">
          <ul className="space-y-4">
            {mine.map((c) => (
              <li key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{c.name}</span>
                  <span className="text-xs text-slate-500">
                    {c.students} students · avg <span className="font-semibold tabular-nums text-slate-700">{c.average}%</span>
                  </span>
                </div>
                <ProgressBar value={c.average} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel index={6} title="Student performance" className="lg:col-span-2" action={<Pill tone="green">Top 6</Pill>}>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {ranked.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="w-4 text-xs font-medium tabular-nums text-slate-400">{i + 1}</span>
                <Avatar name={s.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between text-sm">
                    <span className="truncate font-medium text-slate-900">{s.name}</span>
                    <span className="tabular-nums text-slate-600">{s.average}%</span>
                  </span>
                  <ProgressBar value={s.average} tone="emerald" />
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Parent ---------------------------------- */

export function ParentOverview() {
  return (
    <>
      <PageHeading title="Parent portal" description="Welcome back, Mark. Here is how Olivia is doing." />
      <div className="grid gap-3 lg:grid-cols-[1fr_1.3fr]">
        <Panel index={0}>
          <div className="flex items-center gap-4">
            <Avatar name={PARENT_CHILD.name} size="lg" />
            <div>
              <p className="text-lg font-semibold text-slate-900">{PARENT_CHILD.name}</p>
              <p className="text-sm text-slate-500">
                {PARENT_CHILD.className} · Roll {PARENT_CHILD.roll}
              </p>
              <p className="mt-1 text-xs text-slate-500">Class teacher: {PARENT_CHILD.homeroom}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Ring value={PARENT_CHILD.attendance} size={56} stroke={9} label="Attendance" />
              <span className="text-xs text-slate-500">Attendance</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Ring value={PARENT_CHILD.average} size={56} stroke={9} label="Average" />
              <span className="text-xs text-slate-500">Average</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-2xl font-semibold tabular-nums text-slate-900">#{PARENT_CHILD.rank}</span>
              <span className="text-xs text-slate-500">Class rank</span>
            </div>
          </div>
        </Panel>
        <Panel index={1} title="Today at school">
          <ul className="divide-y divide-slate-100">
            {STUDENT_SCHEDULE.map((p) => (
              <li key={p.time} className="flex items-center gap-4 py-2.5">
                <span className="w-10 text-xs font-medium tabular-nums text-slate-500">{p.time}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{p.subject}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {p.className} · {p.room}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel index={2} title="Latest announcement" className="lg:col-span-2">
          <AnnouncementItem item={ANNOUNCEMENTS[0]} />
        </Panel>
      </div>
    </>
  );
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const CELL = { Present: 'bg-emerald-500 text-white', Late: 'bg-amber-400 text-slate-900', Absent: 'bg-rose-500 text-white' } as const;

export function ParentAttendance() {
  const count = (s: keyof typeof CELL) => MONTH_ATTENDANCE.filter((x) => x === s).length;
  return (
    <>
      <PageHeading title="Attendance" description="Olivia Bennett · September and October" />
      <div className="grid gap-3 lg:grid-cols-[1fr_1.3fr]">
        <Panel index={0}>
          <div className="flex items-center gap-5">
            <Ring value={PARENT_CHILD.attendance} size={84} stroke={9} label="Attendance rate" />
            <ul className="space-y-1.5 text-sm">
              {(['Present', 'Late', 'Absent'] as const).map((s) => (
                <li key={s} className="flex items-center gap-2 text-slate-600">
                  <span aria-hidden className={cn('size-2.5 rounded-sm', CELL[s].split(' ')[0])} />
                  {s}
                  <span className="ml-auto pl-6 font-semibold tabular-nums text-slate-900">{count(s)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel index={1} title="Last four weeks">
          <div className="grid grid-cols-5 gap-2">
            {DAYS.map((d) => (
              <span key={d} className="text-center text-[11px] font-medium text-slate-500">
                {d}
              </span>
            ))}
            {MONTH_ATTENDANCE.map((status, i) => (
              <span key={i} title={status} className={cn('demo-rise grid aspect-square place-items-center rounded-lg text-xs font-semibold', CELL[status])} style={{ ['--i' as string]: i % 10 }}>
                <span className="sr-only">{status}, </span>
                {(i % 5) + 1 + Math.floor(i / 5) * 5}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function AnnouncementItem({ item }: { item: Announcement }) {
  return (
    <article className="flex gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
        {item.tag === 'Academic' ? <GraduationCap className="size-5" aria-hidden /> : <Megaphone className="size-5" aria-hidden />}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
          <Pill tone={item.tag === 'Event' ? 'green' : item.tag === 'Notice' ? 'amber' : 'blue'}>{item.tag}</Pill>
        </div>
        <p className="mt-1 text-sm text-slate-600">{item.body}</p>
        <p className="mt-1.5 text-xs text-slate-500">{item.date}</p>
      </div>
    </article>
  );
}

export function ParentAnnouncements() {
  const [tab, setTab] = useState<'All' | Announcement['tag']>('All');
  const list = ANNOUNCEMENTS.filter((a) => tab === 'All' || a.tag === tab);
  return (
    <>
      <PageHeading title="Announcements" description="News and notices from the school." />
      <Tabs label="Announcement type" value={tab} onChange={setTab} tabs={(['All', 'Event', 'Notice', 'Academic'] as const).map((id) => ({ id, label: id }))} />
      <ul key={tab} className="mt-4 space-y-3">
        {list.map((item, i) => (
          <li key={item.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <AnnouncementItem item={item} />
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">Nothing here yet.</li>}
      </ul>
    </>
  );
}
