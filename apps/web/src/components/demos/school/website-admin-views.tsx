'use client';

import { BookOpen, CalendarCheck, Check, CheckCircle2, Download, GraduationCap, LayoutGrid, List, Mail, Phone, School, Search, Star, Users, Wallet, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AreaChart, BarChart, Donut, Ring } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import {
  ANNOUNCEMENTS,
  CLASS_NAMES,
  CLASSES,
  DASHBOARD_STATS,
  EXAMS,
  FEE_BREAKDOWN,
  FEE_MONTHS,
  RESULTS,
  STUDENTS,
  SUBJECT_SCORES,
  TEACHERS,
  TERM_TREND,
  WEEK_ATTENDANCE,
} from '@/data/school/app';
import type { AttendanceStatus, FeeStatus, Student } from '@/data/school/app';
import { cn } from '@/lib/cn';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs, statusTone } from './website-ui';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

/* ---------------------------------- Dashboard ---------------------------------- */

export function AdminDashboard() {
  const { students, teachers, classes, attendance, collected, target } = DASHBOARD_STATS;
  return (
    <>
      <PageHeading title="Dashboard" description="Good morning, Principal Hart. Here is how the school is doing today." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Total students" value={students.toLocaleString('en-US')} delta={{ value: '+42 this term', up: true }} icon={Users} />
        <DashboardCard index={1} label="Teachers" value={String(teachers)} delta={{ value: '+3 new hires', up: true }} icon={GraduationCap} tone="emerald" />
        <DashboardCard index={2} label="Classes" value={String(classes)} icon={School} tone="slate" />
        <DashboardCard index={3} label="Attendance today" value={`${attendance}%`} delta={{ value: '-0.4% vs last week', up: false }} icon={CalendarCheck} tone="amber" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Fee collection (USD, thousands)" className="lg:col-span-2" action={<Pill tone="green">{Math.round((collected / target) * 100)}% of target</Pill>}>
          <BarChart data={FEE_MONTHS} label="Fee collection by month" highlight={4} />
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 text-sm">
            <span className="text-slate-500">Collected this term</span>
            <span className="font-semibold tabular-nums text-slate-900">
              {money(collected)} <span className="font-normal text-slate-500">of {money(target)}</span>
            </span>
          </div>
        </Panel>
        <Panel index={5} title="Fee status">
          <div className="flex items-center gap-5 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Fee status" segments={FEE_BREAKDOWN} size={120}>
              <span>
                <span className="block text-xl font-semibold tabular-nums text-slate-900">78%</span>
                <span className="block text-[11px] text-slate-500">paid</span>
              </span>
            </Donut>
            <ul className="space-y-2 text-sm">
              {FEE_BREAKDOWN.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-slate-600">
                  <span aria-hidden className={cn('size-2.5 rounded-full', item.tone === 'emerald' ? 'bg-emerald-500' : item.tone === 'blue' ? 'bg-blue-600' : 'bg-amber-500')} />
                  {item.label}
                  <span className="ml-auto font-medium tabular-nums text-slate-900">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel index={6} title="Attendance this week" className="lg:col-span-2">
          <AreaChart data={WEEK_ATTENDANCE} label="Attendance this week" min={85} max={100} />
        </Panel>
        <Panel index={7} title="Latest announcements">
          <ul className="space-y-3">
            {ANNOUNCEMENTS.slice(0, 3).map((item) => (
              <li key={item.id} className="border-l-2 border-blue-200 pl-3">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Students ---------------------------------- */

function StudentProfile({ student, onClose }: { student: Student; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'results'>('overview');
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[1px]" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={`${student.name} profile`} className="demo-slide flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Student profile</h3>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close profile" className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600">
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="flex flex-col items-center px-5 pt-6 text-center">
          <Avatar name={student.name} size="lg" />
          <p className="mt-3 text-lg font-semibold text-slate-900">{student.name}</p>
          <p className="text-sm text-slate-500">
            {student.className} · Roll {student.roll}
          </p>
          <div className="mt-3 flex gap-2">
            <Pill tone={statusTone(student.today)}>{student.today} today</Pill>
            <Pill tone={statusTone(student.fees)}>Fees {student.fees.toLowerCase()}</Pill>
          </div>
        </div>
        <div className="mt-5 px-5">
          <Tabs label="Profile sections" value={tab} onChange={setTab} tabs={[{ id: 'overview', label: 'Overview' }, { id: 'results', label: 'Results' }]} className="w-full [&>button]:flex-1" />
        </div>
        <div className="space-y-5 px-5 py-5">
          {tab === 'overview' ? (
            <>
              <div className="flex items-center gap-5">
                <Ring value={student.attendance} label="Attendance" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Attendance</p>
                  <p className="text-xs text-slate-500">Term to date</p>
                </div>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <dt className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600">
                    <Users className="size-4" aria-hidden />
                    <span className="sr-only">Guardian</span>
                  </dt>
                  <dd className="text-slate-700">{student.guardian}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600">
                    <Phone className="size-4" aria-hidden />
                    <span className="sr-only">Phone</span>
                  </dt>
                  <dd className="text-slate-700">{student.phone}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600">
                    <Mail className="size-4" aria-hidden />
                    <span className="sr-only">Email</span>
                  </dt>
                  <dd className="text-slate-700">{student.guardian.split(' ')[0].toLowerCase()}@family.example</dd>
                </div>
              </dl>
            </>
          ) : (
            <div>
              <p className="mb-3 text-sm text-slate-500">Term average</p>
              <p className="mb-4 text-3xl font-semibold tabular-nums text-slate-900">{student.average}%</p>
              <BarChart data={SUBJECT_SCORES.slice(0, 5).map((s, i) => ({ ...s, value: Math.max(40, Math.min(99, s.value - 12 + student.average - 80 + i * 2)) }))} label="Subject scores" max={100} className="h-32" />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export function StudentsView() {
  const [query, setQuery] = useState('');
  const [className, setClassName] = useState<(typeof CLASS_NAMES)[number]>('All classes');
  const [layout, setLayout] = useState<'table' | 'cards'>('table');
  const [selected, setSelected] = useState<Student | null>(null);

  const list = useMemo(() => STUDENTS.filter((s) => (className === 'All classes' || s.className === className) && s.name.toLowerCase().includes(query.trim().toLowerCase())), [query, className]);

  return (
    <>
      <PageHeading title="Students" description={`${list.length} of ${STUDENTS.length} students shown`}>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          + Add student
        </button>
      </PageHeading>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search students</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-2 focus:outline-blue-600/30" />
        </label>
        <SelectMenu label="Class" value={className} options={CLASS_NAMES} onChange={setClassName} className="w-40" />
        <div role="group" aria-label="Layout" className="ml-auto inline-flex rounded-lg bg-slate-100 p-1">
          {[
            ['table', List, 'Table'],
            ['cards', LayoutGrid, 'Cards'],
          ].map(([id, Icon, text]) => {
            const IconCmp = Icon as typeof List;
            return (
              <button key={id as string} type="button" aria-pressed={layout === id} onClick={() => setLayout(id as 'table' | 'cards')} className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600', layout === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}>
                <IconCmp className="size-4" aria-hidden />
                <span className="hidden sm:inline">{text as string}</span>
                <span className="sr-only sm:hidden">{text as string}</span>
              </button>
            );
          })}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">No students match your search.</p>
      ) : layout === 'table' ? (
        <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Student</th>
                <th scope="col" className="px-4 py-3">Class</th>
                <th scope="col" className="px-4 py-3">Attendance</th>
                <th scope="col" className="px-4 py-3">Today</th>
                <th scope="col" className="px-4 py-3">Fees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(s)} className="flex items-center gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-blue-600">
                      <Avatar name={s.name} />
                      <span className="font-medium text-slate-900">{s.name}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.className}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-700">{s.attendance}%</td>
                  <td className="px-4 py-3">
                    <Pill tone={statusTone(s.today)}>{s.today}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={statusTone(s.fees)}>{s.fees}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((s, i) => (
            <li key={s.id} className="demo-rise" style={{ ['--i' as string]: i }}>
              <button type="button" onClick={() => setSelected(s)} className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-[border-color,box-shadow] hover:border-blue-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="flex items-center gap-3">
                  <Avatar name={s.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900">{s.name}</span>
                    <span className="block text-xs text-slate-500">{s.className}</span>
                  </span>
                  <span className="ml-auto">
                    <Pill tone={statusTone(s.today)}>{s.today}</Pill>
                  </span>
                </span>
                <span className="mt-4 block">
                  <span className="mb-1.5 flex justify-between text-xs text-slate-500">
                    <span>Attendance</span>
                    <span className="font-medium tabular-nums text-slate-700">{s.attendance}%</span>
                  </span>
                  <ProgressBar value={s.attendance} tone="emerald" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected && <StudentProfile student={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ---------------------------------- Teachers & classes ---------------------------------- */

export function TeachersView() {
  return (
    <>
      <PageHeading title="Teachers" description={`${TEACHERS.length} teachers shown. 86 on staff in total.`} />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {TEACHERS.map((t, i) => (
          <li key={t.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div className="flex items-center gap-3">
              <Avatar name={t.name} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.subject}</p>
              </div>
              <span className="ml-auto">
                <Pill tone={statusTone(t.status)}>{t.status}</Pill>
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {t.classes.map((c) => (
                <span key={c} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{t.experience}</span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {t.rating}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ClassesView() {
  return (
    <>
      <PageHeading title="Classes" description="Class groups, form teachers and average performance." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CLASSES.map((c, i) => (
          <li key={c.name} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">
                  {c.teacher} · {c.room}
                </p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <BookOpen className="size-4" aria-hidden />
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold tabular-nums text-slate-900">{c.students}</p>
                <p className="text-xs text-slate-500">students</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums text-slate-900">{c.average}%</p>
                <p className="text-xs text-slate-500">class average</p>
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar value={c.average} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------- Attendance ---------------------------------- */

const STATUSES: AttendanceStatus[] = ['Present', 'Late', 'Absent'];

export function AttendanceView({ lockedClass }: { lockedClass?: string }) {
  const [className, setClassName] = useState<(typeof CLASS_NAMES)[number]>((lockedClass as (typeof CLASS_NAMES)[number]) ?? 'Grade 8-A');
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>(() => Object.fromEntries(STUDENTS.map((s) => [s.id, s.today === 'Absent' ? 'Absent' : s.today])));
  const [saved, setSaved] = useState(false);
  const list = STUDENTS.filter((s) => className === 'All classes' || s.className === className);
  const count = (status: AttendanceStatus) => list.filter((s) => marks[s.id] === status).length;

  function mark(id: string, status: AttendanceStatus) {
    setMarks((current) => ({ ...current, [id]: status }));
    setSaved(false);
  }

  return (
    <>
      <PageHeading title="Attendance" description="Mark today's register. Parents are notified of absences automatically.">
        {!lockedClass && <SelectMenu label="Class" value={className} options={CLASS_NAMES} onChange={setClassName} className="w-40" />}
      </PageHeading>
      <div className="mb-3 grid grid-cols-3 gap-3">
        {STATUSES.map((status, i) => (
          <DashboardCard key={status} index={i} label={status} value={String(count(status))} icon={status === 'Present' ? CheckCircle2 : status === 'Late' ? CalendarCheck : X} tone={status === 'Present' ? 'emerald' : status === 'Late' ? 'amber' : 'slate'} />
        ))}
      </div>
      <Panel title={`${className === 'All classes' ? 'All classes' : className} register`} action={<span className="text-xs text-slate-500">Mon 5 Oct</span>}>
        {list.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No students in this class in the demo data.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                <Avatar name={s.name} size="sm" />
                <span className="min-w-0 flex-1 text-sm font-medium text-slate-900">{s.name}</span>
                <div role="group" aria-label={`Attendance for ${s.name}`} className="inline-flex rounded-lg bg-slate-100 p-0.5">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={marks[s.id] === status}
                      onClick={() => mark(s.id, status)}
                      className={cn(
                        'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600',
                        marks[s.id] === status ? (status === 'Present' ? 'bg-emerald-600 text-white' : status === 'Late' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white') : 'text-slate-600 hover:text-slate-900',
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          {saved && (
            <span role="status" className="demo-rise inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Check className="size-4" aria-hidden /> Register saved
            </span>
          )}
          <button type="button" onClick={() => setSaved(true)} className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Save register
          </button>
        </div>
      </Panel>
    </>
  );
}

/* ---------------------------------- Exams & results ---------------------------------- */

export function ExamsView() {
  const [tab, setTab] = useState<'Scheduled' | 'Marking' | 'Published'>('Scheduled');
  const rows = EXAMS.filter((e) => e.status === tab);
  return (
    <>
      <PageHeading title="Exams" description="Mid-term examinations, October 2026." />
      <Tabs label="Exam status" value={tab} onChange={setTab} tabs={(['Scheduled', 'Marking', 'Published'] as const).map((id) => ({ id, label: id, count: EXAMS.filter((e) => e.status === id).length }))} />
      <ul key={tab} className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((e, i) => (
          <li key={e.subject} className="demo-rise flex gap-4 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-blue-50 text-center text-blue-700">
              <span className="text-[11px] font-semibold leading-tight">
                {e.date.split(' ')[1]}
                <br />
                {e.date.split(' ')[2]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{e.subject}</p>
              <p className="text-xs text-slate-500">
                {e.className} · {e.room}
              </p>
              <p className="mt-2 text-xs font-medium text-slate-700">{e.time}</p>
            </div>
            <span className="ml-auto self-start">
              <Pill tone={statusTone(e.status)}>{e.status}</Pill>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ResultsView({ student = 'Olivia Bennett · Grade 8-A' }: { student?: string }) {
  const [tab, setTab] = useState<'subjects' | 'trend'>('subjects');
  const average = Math.round(RESULTS.reduce((sum, r) => sum + r.score, 0) / RESULTS.length);
  return (
    <>
      <PageHeading title="Results" description={`${student} · Term 1 report`}>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-blue-600">
          <Download className="size-4" aria-hidden /> Report card
        </button>
      </PageHeading>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <Panel>
          <div className="flex items-center gap-5">
            <Ring value={average} size={84} stroke={9} label="Term average" />
            <div>
              <p className="text-sm font-medium text-slate-900">Term average</p>
              <p className="text-xs text-slate-500">Rank 3 of 32 in class</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-700">Up 5 points on last term</p>
            </div>
          </div>
          <div className="mt-5">
            <Tabs label="Result view" value={tab} onChange={setTab} tabs={[{ id: 'subjects', label: 'By subject' }, { id: 'trend', label: 'Term trend' }]} />
          </div>
          <div className="mt-4" key={tab}>
            {tab === 'subjects' ? <BarChart data={SUBJECT_SCORES} label="Scores by subject" max={100} unit="%" className="h-36" highlight={4} /> : <AreaChart data={TERM_TREND} label="Average by term" min={70} max={100} />}
          </div>
        </Panel>
        <Panel title="Subject results">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[22rem] text-left text-sm">
              <thead className="text-xs font-medium text-slate-500">
                <tr>
                  <th scope="col" className="pb-2">Subject</th>
                  <th scope="col" className="pb-2">Teacher</th>
                  <th scope="col" className="pb-2 text-right">Score</th>
                  <th scope="col" className="pb-2 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RESULTS.map((r) => (
                  <tr key={r.subject}>
                    <td className="py-2.5 font-medium text-slate-900">{r.subject}</td>
                    <td className="py-2.5 text-slate-600">{r.teacher}</td>
                    <td className="py-2.5 text-right tabular-nums text-slate-700">{r.score}</td>
                    <td className="py-2.5 text-right">
                      <Pill tone={r.score >= 90 ? 'green' : 'blue'}>{r.grade}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Fees & reports ---------------------------------- */

export function FeesView() {
  const [filter, setFilter] = useState<'All' | FeeStatus>('All');
  const rows = STUDENTS.filter((s) => filter === 'All' || s.fees === filter);
  const amount = (s: Student) => (s.fees === 'Paid' ? 1250 : s.fees === 'Due' ? 1250 : 1875);
  return (
    <>
      <PageHeading title="Fees" description="Term 1 invoices and payments." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardCard index={0} label="Collected" value={money(DASHBOARD_STATS.collected)} delta={{ value: '86% of target', up: true }} icon={Wallet} tone="emerald" />
        <DashboardCard index={1} label="Pending" value={money(54200)} icon={CalendarCheck} />
        <DashboardCard index={2} label="Overdue" value={money(23200)} delta={{ value: '12 families', up: false }} icon={X} tone="amber" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <Panel index={3} title="Monthly collection (USD, thousands)">
          <BarChart data={FEE_MONTHS} label="Monthly fee collection" highlight={4} className="h-36" />
        </Panel>
        <Panel index={4} title="Invoices">
          <Tabs label="Invoice status" value={filter} onChange={setFilter} tabs={(['All', 'Paid', 'Due', 'Overdue'] as const).map((id) => ({ id, label: id }))} />
          <ul key={filter} className="mt-3 divide-y divide-slate-100">
            {rows.map((s) => (
              <li key={s.id} className="demo-rise flex items-center gap-3 py-2.5">
                <Avatar name={s.name} size="sm" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">{s.name}</span>
                <span className="text-sm tabular-nums text-slate-600">{money(amount(s))}</span>
                <Pill tone={statusTone(s.fees)}>{s.fees}</Pill>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

const REPORTS = ['Attendance summary', 'Fee statement', 'Term report cards', 'Enrolment trends', 'Teacher workload', 'Exam analysis'];

export function ReportsView() {
  const [ready, setReady] = useState<Record<string, boolean>>({});
  return (
    <>
      <PageHeading title="Reports" description="Generate printable reports for staff, governors and parents." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((name, i) => (
          <li key={name} className="demo-rise flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div>
              <p className="text-sm font-semibold text-slate-900">{name}</p>
              <p className="text-xs text-slate-500">PDF · Term 1</p>
            </div>
            <button
              type="button"
              onClick={() => setReady((current) => ({ ...current, [name]: true }))}
              className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-blue-600', ready[name] ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-900 text-white hover:bg-slate-800')}
            >
              {ready[name] ? (
                <>
                  <Check className="size-3.5" aria-hidden /> Ready
                </>
              ) : (
                'Generate'
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
