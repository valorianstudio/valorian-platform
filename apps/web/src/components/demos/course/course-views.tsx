'use client';

import { Award, BadgeCheck, BookOpen, Check, ClipboardList, Download, GraduationCap, Layers, Search, Star, Users, Wallet, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AreaChart, BarChart, Donut, Ring } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { ASSIGNMENTS, CATEGORIES, CATEGORY_MIX, CERTIFICATES, COMPLETION_WEEK, COURSES, DASHBOARD_STATS, ENROLMENTS_MONTH, INSTRUCTORS, REVENUE_MONTHS, RESULTS, STUDENTS } from '@/data/course/app';
import type { Course, EnrolmentStatus } from '@/data/course/app';
import { cn } from '@/lib/cn';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

/** One place for status colours, so the same status always looks the same across the LMS. */
export const tone = (status: string) => {
  if (['Published', 'On track', 'Completed', 'Online', 'Paid'].includes(status)) return 'green' as const;
  if (['Draft', 'Behind', 'Away', 'Pending', 'Marking'].includes(status)) return 'amber' as const;
  if (['Archived', 'At risk', 'Offline'].includes(status)) return 'slate' as const;
  return 'blue' as const;
};

/* ---------------------------------- Dashboard ---------------------------------- */

export function CourseDashboardHome() {
  const { students, activeCourses, completionRate, revenue } = DASHBOARD_STATS;
  return (
    <>
      <PageHeading title="Dashboard" description="Good morning, Dr. Kim. Here is how your learners are doing today." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Total students" value={students.toLocaleString('en-US')} delta={{ value: '+412 this month', up: true }} icon={Users} />
        <DashboardCard index={1} label="Active courses" value={String(activeCourses)} delta={{ value: '+3 published', up: true }} icon={BookOpen} tone="emerald" />
        <DashboardCard index={2} label="Completion rate" value={`${completionRate}%`} delta={{ value: '+3.1% vs last month', up: true }} icon={Award} tone="amber" />
        <DashboardCard index={3} label="Revenue (Oct)" value={money(revenue)} delta={{ value: '+9.6% vs Sep', up: true }} icon={Wallet} tone="slate" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Learning analytics: enrolments" className="lg:col-span-2" action={<Pill tone="green">+620 since May</Pill>}>
          <AreaChart data={ENROLMENTS_MONTH} label="New enrolments per month" min={1000} max={1800} />
        </Panel>
        <Panel index={5} title="Course categories">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Enrolments by category" segments={CATEGORY_MIX} size={104}>
              <span>
                <span className="block text-lg font-semibold tabular-nums text-slate-900">46</span>
                <span className="block text-[11px] text-slate-500">courses</span>
              </span>
            </Donut>
            <ul className="space-y-2 text-sm">
              {CATEGORY_MIX.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-slate-600">
                  <span aria-hidden className={cn('size-2.5 rounded-full', item.tone === 'emerald' ? 'bg-[var(--demo-good)]' : item.tone === 'blue' ? 'bg-[var(--demo-accent)]' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-300')} />
                  {item.label}
                  <span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel index={6} title="Completion rate, by week" className="lg:col-span-2">
          <BarChart data={COMPLETION_WEEK} label="Completion rate by week" max={100} unit="%" highlight={5} className="h-36" />
        </Panel>
        <Panel index={7} title="Revenue (USD, thousands)">
          <BarChart data={REVENUE_MONTHS} label="Revenue by month" highlight={5} className="h-36" />
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Courses ---------------------------------- */

const COURSE_STATUS_OPTIONS = ['All', 'Published', 'Draft', 'Archived'] as const;

export function CourseCoursesView() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [status, setStatus] = useState<(typeof COURSE_STATUS_OPTIONS)[number]>('All');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Course | null>(null);
  const list = useMemo(
    () =>
      COURSES.filter(
        (c) =>
          (category === 'All' || c.category === category) &&
          (status === 'All' || c.status === status) &&
          c.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [category, status, query],
  );

  return (
    <>
      <PageHeading title="Courses" description={`${list.length} of ${COURSES.length} courses shown`}>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          + New course
        </button>
      </PageHeading>
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search courses</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <SelectMenu label="Category" value={category} options={CATEGORIES} onChange={setCategory} className="w-40" />
        <div className="ml-auto">
          <SelectMenu label="Status" value={status} options={COURSE_STATUS_OPTIONS} onChange={setStatus} className="w-36" align="right" />
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c, i) => (
          <li key={c.id} className="demo-rise flex flex-col rounded-xl border border-slate-200 bg-white transition-[border-color,box-shadow] hover:border-[color:var(--demo-accent-ring)] hover:shadow-md" style={{ ['--i' as string]: i }}>
            <button type="button" onClick={() => setOpen(c)} className="flex flex-1 flex-col p-4 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <div className="flex items-start justify-between gap-2">
                <span className="grid size-10 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
                  <BookOpen className="size-5" aria-hidden />
                </span>
                <Pill tone={tone(c.status)}>{c.status}</Pill>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{c.title}</p>
              <p className="text-xs text-slate-500">
                {c.category} · {c.level} · {c.instructor}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Layers className="size-3.5" aria-hidden /> {c.lessons} lessons
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden /> {c.duration}
                </span>
                <span className="ml-auto inline-flex items-center gap-1 font-medium text-slate-700">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {c.rating}
                </span>
              </div>
            </button>
            <div className="border-t border-slate-100 px-4 py-3">
              <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                <span>{c.students.toLocaleString('en-US')} students</span>
                <span className="font-medium text-slate-700">{c.status === 'Draft' ? 'Not published' : `${c.progress}% avg progress`}</span>
              </div>
              <ProgressBar value={c.progress} tone="emerald" />
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">No courses match these filters.</li>}
      </ul>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${open.title} lessons`} className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center" onClick={() => setOpen(null)}>
          <div className="demo-rise w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{open.title}</p>
                <p className="text-xs text-slate-500">
                  {open.lessons} lessons · {open.duration} · {open.level}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                Close
              </button>
            </div>
            <ol className="mt-4 space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <span className={cn('grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold', i < Math.round(open.progress / 20) ? 'bg-[var(--demo-good)] text-white' : 'bg-slate-100 text-slate-500')}>{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-800">Lesson {i + 1}: {['Introduction', 'Core concepts', 'Hands-on lab', 'Patterns', 'Final project'][i]}</span>
                  <span className="text-xs text-slate-500">{12 + i * 3} min</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------- Students ---------------------------------- */

export function CourseStudentsView() {
  const [tab, setTab] = useState<'All' | EnrolmentStatus>('All');
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('All courses');
  const courses = ['All courses', ...Array.from(new Set(COURSES.map((c) => c.title)))];
  const base = STUDENTS.filter((s) => (course === 'All courses' || s.course === course) && s.name.toLowerCase().includes(query.trim().toLowerCase()));
  const list = base.filter((s) => tab === 'All' || s.status === tab);
  const count = (s: EnrolmentStatus) => base.filter((x) => x.status === s).length;

  return (
    <>
      <PageHeading title="Students" description={`${list.length} of ${STUDENTS.length} learners shown`} />
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search students</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <div className="ml-auto">
          <SelectMenu label="Course" value={course} options={courses} onChange={setCourse} className="w-56" align="right" />
        </div>
      </div>
      <div className="mb-4">
        <Tabs label="Progress status" value={tab} onChange={setTab} tabs={[{ id: 'All', label: 'All', count: base.length }, { id: 'On track', label: 'On track', count: count('On track') }, { id: 'Behind', label: 'Behind', count: count('Behind') }, { id: 'At risk', label: 'At risk', count: count('At risk') }, { id: 'Completed', label: 'Completed', count: count('Completed') }]} />
      </div>
      <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Student</th>
              <th scope="col" className="px-4 py-3">Course</th>
              <th scope="col" className="px-4 py-3">Progress</th>
              <th scope="col" className="px-4 py-3">Score</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <Avatar name={s.name} />
                    <span>
                      <span className="block font-medium text-slate-900">{s.name}</span>
                      <span className="block text-xs text-slate-500">Last active {s.lastActive}</span>
                    </span>
                  </span>
                </td>
                <td className="max-w-[14rem] truncate px-4 py-3 text-slate-600">{s.course}</td>
                <td className="px-4 py-3">
                  <div className="flex w-32 items-center gap-2">
                    <div className="flex-1">
                      <ProgressBar value={s.progress} tone="emerald" />
                    </div>
                    <span className="w-9 text-right text-xs tabular-nums text-slate-700">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">{s.score}</td>
                <td className="px-4 py-3">
                  <Pill tone={tone(s.status)}>{s.status}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No students match these filters.</p>}
      </div>
    </>
  );
}

/* ---------------------------------- Instructors ---------------------------------- */

export function CourseInstructorsView() {
  const [selected, setSelected] = useState(INSTRUCTORS[0].id);
  const instructor = INSTRUCTORS.find((i) => i.id === selected) ?? INSTRUCTORS[0];
  const theirCourses = COURSES.filter((c) => c.instructor === instructor.name);
  return (
    <>
      <PageHeading title="Instructors" description="Select an instructor to see earnings, engagement and courses." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INSTRUCTORS.map((i, index) => (
          <li key={i.id}>
            <button type="button" aria-pressed={i.id === selected} onClick={() => setSelected(i.id)} className={cn('demo-rise block w-full rounded-xl border bg-white p-4 text-left transition-[border-color,box-shadow] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', i.id === selected ? 'border-[color:var(--demo-accent)] ring-1 ring-[color:var(--demo-accent)]' : 'border-slate-200')} style={{ ['--i' as string]: index }}>
              <span className="flex items-center gap-3">
                <Avatar name={i.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{i.name}</span>
                  <span className="block truncate text-xs text-slate-500">{i.specialty}</span>
                </span>
                <Pill tone={tone(i.status)}>{i.status}</Pill>
              </span>
              <span className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  {i.courses} courses · {i.students.toLocaleString('en-US')} students
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {i.rating}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={3} title={`${instructor.name}: earnings`} className="self-start">
          <p className="text-2xl font-semibold tabular-nums text-slate-900">{money(instructor.earnings)}</p>
          <p className="mb-4 text-xs text-slate-500">Lifetime earnings after the 30% platform share</p>
          <div className="flex items-center gap-4">
            <Ring value={instructor.engagement} size={68} stroke={9} label="Student engagement" />
            <div>
              <p className="text-sm font-medium text-slate-900">Engagement</p>
              <p className="text-xs text-slate-500">Lessons watched and questions answered</p>
            </div>
          </div>
        </Panel>
        <Panel index={4} title="Courses" className="lg:col-span-2">
          {theirCourses.length ? (
            <ul key={instructor.id} className="divide-y divide-slate-100">
              {theirCourses.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
                    <BookOpen className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{c.title}</p>
                    <p className="text-xs text-slate-500">
                      {c.students.toLocaleString('en-US')} students · {c.lessons} lessons
                    </p>
                  </div>
                  <Pill tone={tone(c.status)}>{c.status}</Pill>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">No published courses yet.</p>
          )}
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Assignments, exams, results ---------------------------------- */

export function CourseAssessmentsView() {
  const [tab, setTab] = useState<'Assignments' | 'Exams' | 'Results'>('Assignments');
  return (
    <>
      <PageHeading title="Assessments" description="Assignments and exams, with submissions and results." />
      <Tabs label="Assessment section" value={tab} onChange={setTab} tabs={[{ id: 'Assignments', label: 'Assignments', count: ASSIGNMENTS.filter((a) => a.kind !== 'Exam').length }, { id: 'Exams', label: 'Exams', count: ASSIGNMENTS.filter((a) => a.kind === 'Exam').length }, { id: 'Results', label: 'Results', count: RESULTS.length }]} />
      <div key={tab} className="demo-rise mt-4">
        {tab === 'Results' ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Student</th>
                  <th scope="col" className="px-4 py-3">Course</th>
                  <th scope="col" className="px-4 py-3">Score</th>
                  <th scope="col" className="px-4 py-3">Grade</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RESULTS.map((r) => (
                  <tr key={r.student + r.date} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.student}</td>
                    <td className="max-w-[12rem] truncate px-4 py-3 text-slate-600">{r.course}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">{r.score}</td>
                    <td className="px-4 py-3">
                      <Pill tone={r.score >= 85 ? 'green' : r.score >= 70 ? 'blue' : 'amber'}>{r.grade}</Pill>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {ASSIGNMENTS.filter((a) => (tab === 'Exams' ? a.kind === 'Exam' : a.kind !== 'Exam')).map((a, i) => (
              <li key={a.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{a.title}</p>
                    <p className="truncate text-xs text-slate-500">
                      {a.course} · Due {a.due}
                    </p>
                  </div>
                  <Pill tone={a.kind === 'Exam' ? 'amber' : 'blue'}>{a.kind}</Pill>
                </div>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                    <span>
                      <span className="font-semibold tabular-nums text-slate-900">{a.submitted}</span> of {a.total} submitted
                    </span>
                    <span>{Math.round((a.submitted / a.total) * 100)}%</span>
                  </div>
                  <ProgressBar value={(a.submitted / a.total) * 100} tone="emerald" />
                </div>
                <button type="button" className="mt-4 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
                  Review submissions
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/* ---------------------------------- Certificates, analytics, messages, settings ---------------------------------- */

export function CourseCertificatesView() {
  const [issued, setIssued] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState(CERTIFICATES[0].id);
  const cert = CERTIFICATES.find((c) => c.id === selected) ?? CERTIFICATES[0];
  return (
    <>
      <PageHeading title="Certificates" description="Issued on completion. Every certificate has a verification code." />
      <div className="grid gap-3 xl:grid-cols-[1fr_1.1fr]">
        <ul className="space-y-2.5">
          {CERTIFICATES.map((c, i) => (
            <li key={c.id}>
              <button type="button" aria-pressed={c.id === selected} onClick={() => setSelected(c.id)} className={cn('demo-rise flex w-full items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', c.id === selected ? 'border-[color:var(--demo-accent)] ring-1 ring-[color:var(--demo-accent)]' : 'border-slate-200 hover:border-slate-300')} style={{ ['--i' as string]: i }}>
                <Avatar name={c.student} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{c.student}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {c.course} · {c.issued}
                  </span>
                </span>
                {issued[c.id] && <Pill tone="green">Sent</Pill>}
              </button>
            </li>
          ))}
        </ul>
        <Panel index={3} title="Certificate preview" action={<span className="font-mono text-[11px] text-slate-500">{cert.code}</span>}>
          <div className="relative overflow-hidden rounded-xl border-[6px] border-double border-[color:var(--demo-accent-ring)] bg-[linear-gradient(180deg,#fff,#f8faff)] p-6 text-center sm:p-8">
            <BadgeCheck className="mx-auto size-9 text-[color:var(--demo-accent)]" aria-hidden />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Certificate of completion</p>
            <p className="mt-3 text-xs text-slate-600">This certifies that</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{cert.student}</p>
            <p className="mt-2 text-xs text-slate-600">has successfully completed</p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--demo-accent-ink)]">{cert.course}</p>
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-3 text-[11px] text-slate-500">
              <span>Issued {cert.issued}</span>
              <span>Learnova</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setIssued((s) => ({ ...s, [cert.id]: true }))} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-xs font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
              {issued[cert.id] ? <Check className="size-4" aria-hidden /> : <Award className="size-4" aria-hidden />}
              {issued[cert.id] ? 'Sent to learner' : 'Send to learner'}
            </button>
            <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 px-3.5 text-xs font-semibold text-slate-800 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <Download className="size-4" aria-hidden /> Download PDF
            </button>
          </div>
        </Panel>
      </div>
    </>
  );
}

export function CourseAnalyticsView() {
  return (
    <>
      <PageHeading title="Analytics" description="How learners move through your courses." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Avg. time per week" value="4.2 h" delta={{ value: '+0.6 h', up: true }} icon={Clock} />
        <DashboardCard index={1} label="Quiz pass rate" value="81%" delta={{ value: '+4%', up: true }} icon={Check} tone="emerald" />
        <DashboardCard index={2} label="Certificates issued" value="1,284" icon={Award} tone="amber" />
        <DashboardCard index={3} label="Active learners" value="6,910" icon={GraduationCap} tone="slate" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Completion rate, by week" className="lg:col-span-2">
          <AreaChart data={COMPLETION_WEEK} label="Completion rate by week" min={40} max={70} />
        </Panel>
        <Panel index={5} title="Drop-off by lesson">
          <BarChart data={[{ label: 'L1', value: 4 }, { label: 'L2', value: 9 }, { label: 'L3', value: 17 }, { label: 'L4', value: 12 }, { label: 'L5', value: 6 }]} label="Learners who stopped at each lesson (%)" unit="%" highlight={2} className="h-40" />
        </Panel>
      </div>
    </>
  );
}

export function CourseMessagesView() {
  const threads = [
    { id: 't1', name: 'Hannah Lindqvist', text: 'Could you explain the type guard example again?', time: '09:12', unread: true },
    { id: 't2', name: 'Marcus Reed', text: 'Thanks, the midterm practice set helped a lot.', time: 'Yesterday', unread: false },
    { id: 't3', name: 'Daniel Osei', text: 'I am stuck on the final project setup.', time: 'Yesterday', unread: true },
  ];
  const [active, setActive] = useState(threads[0].id);
  const current = threads.find((t) => t.id === active) ?? threads[0];
  return (
    <>
      <PageHeading title="Messages" description="Questions from learners, answered in one place." />
      <div className="grid gap-3 lg:grid-cols-[1fr_1.6fr]">
        <ul className="space-y-2">
          {threads.map((t) => (
            <li key={t.id}>
              <button type="button" aria-pressed={t.id === active} onClick={() => setActive(t.id)} className={cn('flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', t.id === active ? 'border-[color:var(--demo-accent)]' : 'border-slate-200 hover:border-slate-300')}>
                <Avatar name={t.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{t.name}</span>
                  <span className="block truncate text-xs text-slate-500">{t.text}</span>
                </span>
                {t.unread && <span aria-label="Unread" className="size-2 rounded-full bg-[var(--demo-accent)]" />}
              </button>
            </li>
          ))}
        </ul>
        <Panel title={current.name} index={3}>
          <div key={current.id} className="demo-rise space-y-3">
            <p className="max-w-[80%] rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 text-sm text-slate-800">{current.text}</p>
            <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[var(--demo-accent)] px-3.5 py-2.5 text-sm text-white">Of course. Watch the lesson on narrowing from 3:10, then try the example again.</p>
          </div>
        </Panel>
      </div>
    </>
  );
}

function Switch({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'bg-[var(--demo-accent)]' : 'bg-slate-300')}>
        <span aria-hidden className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', on && 'translate-x-5')} />
      </button>
    </li>
  );
}

export function CourseSettingsView() {
  return (
    <>
      <PageHeading title="Settings" description="Academy profile, enrolment and certificate rules." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Academy profile" index={0}>
          <dl className="space-y-3 text-sm">
            {[
              ['Academy', 'Learnova Academy'],
              ['Domain', 'learn.learnova.example'],
              ['Support email', 'help@learnova.example'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title="Preferences" index={1}>
          <ul className="divide-y divide-slate-100">
            <Switch label="Open enrolment" description="Let anyone join published courses." defaultOn />
            <Switch label="Automatic certificates" description="Issue a certificate as soon as a course is complete." defaultOn />
            <Switch label="Quiz feedback" description="Show learners the right answer after each quiz." defaultOn />
            <Switch label="Weekly progress emails" description="Send learners a summary every Monday." />
          </ul>
        </Panel>
      </div>
    </>
  );
}

