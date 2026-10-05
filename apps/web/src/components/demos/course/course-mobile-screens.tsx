'use client';

import { Award, Bell, BookOpen, Check, ChevronRight, ChartColumn, Clock, GraduationCap, House, Layers, Lock, LogOut, Mail, Pause, Play, Settings, ShieldCheck, Star, Trophy, Upload, UserRound, Users, Video, ClipboardList } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Pill, ProgressBar } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { COURSES, LESSONS, PROGRESS_WEEKS, QUIZ, STUDENTS } from '@/data/course/app';
import { cn } from '@/lib/cn';
import { CourseLogo } from './course-logo';
import { tone } from './course-views';

/** Screens of the student and instructor mobile apps. Compact, touch-sized and driven by dummy data. */

export type StudentScreen = 'splash' | 'login' | 'home' | 'courses' | 'details' | 'lesson' | 'progress' | 'quiz' | 'profile';
export type InstructorScreen = 'dashboard' | 'courses' | 'analytics' | 'upload';

export const STUDENT_NAV: { id: Exclude<StudentScreen, 'splash' | 'login' | 'details' | 'lesson' | 'quiz'>; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'progress', label: 'Progress', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

export const INSTRUCTOR_NAV: { id: InstructorScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: ChartColumn },
  { id: 'upload', label: 'Upload', icon: Upload },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--demo-accent)] text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';

/* ---------------------------------- Student app ---------------------------------- */

export function StudentSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-course px-6 pb-8 pt-16 text-center">
      <span className="grid size-20 animate-pulse-soft place-items-center rounded-3xl bg-white text-course shadow-[0_20px_40px_-12px_rgb(0_0_0/0.4)]">
        <GraduationCap className="size-9" aria-hidden />
      </span>
      <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">Learnova</h3>
      <p className="mt-2 text-[13px] text-white/75">Learn without limits.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-xl bg-white text-sm font-semibold text-course hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        Get started
      </button>
    </div>
  );
}

export function StudentLogin({ onSignIn }: { onSignIn: () => void }) {
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <CourseLogo />
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">Welcome back</h3>
      <p className="mt-1 text-[13px] text-slate-500">Sign in to continue your courses.</p>
      <div className="mt-6 space-y-3">
        <div className={field}>
          <Mail className="size-4 text-slate-400" aria-hidden /> hannah.l@mail.example
        </div>
        <div className={field}>
          <Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••
        </div>
      </div>
      <button type="button" onClick={onSignIn} className={cn(primary, 'mt-auto')}>
        Sign in
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="size-3.5" aria-hidden /> Demo app: tap Sign in to continue.
      </p>
    </div>
  );
}

export function StudentHome({ go }: { go: (s: StudentScreen) => void }) {
  const current = COURSES[0];
  return (
    <>
      <AppHeader subtitle="Good morning" title="Hannah" right={<Avatar name="Hannah Lindqvist" />} />
      <Body>
        <button type="button" onClick={() => go('lesson')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Card className="border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)]">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--demo-accent-ink)]">Continue learning</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{current.title}</p>
            <p className="text-[11px] text-slate-600">Lesson 3 · Hooks with strict types</p>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1">
                <ProgressBar value={current.progress} tone="emerald" />
              </div>
              <span className="text-[11px] font-semibold tabular-nums text-slate-800">{current.progress}%</span>
            </div>
          </Card>
        </button>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Courses', 'courses'],
            ['Quiz', 'quiz'],
            ['Progress', 'progress'],
          ].map(([label, target]) => (
            <button key={label} type="button" onClick={() => go(target as StudentScreen)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-[10px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
                {target === 'quiz' ? <ClipboardList className="size-4" aria-hidden /> : target === 'progress' ? <Trophy className="size-4" aria-hidden /> : <BookOpen className="size-4" aria-hidden />}
              </span>
              {label}
            </button>
          ))}
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Due this week</p>
        <Card className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-[color:var(--demo-accent-ink)]">
            <Clock className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-900">Build a typed form</p>
            <p className="text-[11px] text-slate-500">Assignment · Fri 9 Oct</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]">
            <Award className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-900">New certificate earned</p>
            <p className="text-[11px] text-slate-500">UI Design Systems</p>
          </div>
        </Card>
      </Body>
    </>
  );
}

export function StudentCourses({ onOpen }: { onOpen: (id: string) => void }) {
  const [cat, setCat] = useState<'All' | 'Development' | 'Design' | 'Data'>('All');
  const list = COURSES.filter((c) => c.status === 'Published' && (cat === 'All' || c.category === cat));
  return (
    <>
      <AppHeader subtitle="Your catalogue" title="Courses" />
      <div role="group" aria-label="Category" className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-slate-200 bg-white px-3.5 py-2.5">
        {(['All', 'Development', 'Design', 'Data'] as const).map((c) => (
          <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)} className={cn('shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', c === cat ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>
            {c}
          </button>
        ))}
      </div>
      <Body>
        <div key={cat} className="demo-slide space-y-2.5">
          {list.map((c) => (
            <button key={c.id} type="button" onClick={() => onOpen(c.id)} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <Card className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
                  <BookOpen className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-slate-900">{c.title}</span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {c.instructor} · {c.lessons} lessons
                  </span>
                  <span className="mt-1.5 block">
                    <ProgressBar value={c.progress} tone="emerald" />
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-slate-300" aria-hidden />
              </Card>
            </button>
          ))}
        </div>
      </Body>
    </>
  );
}

export function StudentCourseDetails({ id, onPlay, onEnrol, enrolled }: { id: string; onPlay: () => void; onEnrol: () => void; enrolled: boolean }) {
  const course = COURSES.find((c) => c.id === id) ?? COURSES[0];
  return (
    <>
      <div className="flex h-36 shrink-0 items-end bg-[linear-gradient(135deg,var(--demo-accent),#6366f1)] p-4">
        <span className="grid size-11 place-items-center rounded-xl bg-white/20 text-white">
          <BookOpen className="size-5" aria-hidden />
        </span>
      </div>
      <Body>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{course.title}</h3>
          <p className="text-xs text-slate-500">
            {course.instructor} · {course.level}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 font-medium text-slate-800">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {course.rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3.5" aria-hidden /> {course.lessons} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden /> {course.duration}
          </span>
        </div>
        <Card className="space-y-2">
          {LESSONS.map((l, i) => (
            <div key={l.id} className="flex items-center gap-3 py-1">
              <span className={cn('grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold', l.done ? 'bg-[var(--demo-good)] text-white' : 'bg-slate-100 text-slate-500')}>{l.done ? <Check className="size-3" aria-hidden /> : i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-[12px] text-slate-800">{l.title}</span>
              <span className="text-[10px] text-slate-500">{l.length}</span>
            </div>
          ))}
        </Card>
        {enrolled ? (
          <button type="button" onClick={onPlay} className={primary}>
            <Play className="size-4" aria-hidden /> Continue lesson
          </button>
        ) : (
          <button type="button" onClick={onEnrol} className={primary}>
            Enrol for free
          </button>
        )}
      </Body>
    </>
  );
}

export function StudentLesson({ onQuiz }: { onQuiz: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(134);
  return (
    <>
      <AppHeader subtitle="Lesson 3 of 4" title="Hooks with strict types" />
      <div className="shrink-0 bg-slate-900 p-3">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,#312e81,#1e1b4b)]">
          <Video className="size-8 text-white/30" aria-hidden />
          <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)} className="absolute grid size-11 place-items-center rounded-full bg-white text-[color:var(--demo-accent)] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5 translate-x-0.5" aria-hidden />}
          </button>
          <div className="absolute inset-x-3 bottom-2 h-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-[var(--demo-good)] transition-[width] duration-700" style={{ width: `${Math.min(100, (time / 720) * 100)}%` }} />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-white/70">
          <span className="tabular-nums">
            {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')} / 12:00
          </span>
          <button type="button" onClick={() => setTime((t) => Math.min(720, t + 15))} className="rounded px-1.5 py-0.5 font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">
            +15s
          </button>
        </div>
      </div>
      <Body>
        <Card>
          <p className="text-[13px] font-semibold text-slate-900">About this lesson</p>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-600">Narrow unions with type guards, and see how strict mode catches mistakes before they reach production.</p>
        </Card>
        <button type="button" onClick={onQuiz} className={primary}>
          Take the lesson quiz
        </button>
      </Body>
    </>
  );
}

export function StudentQuiz() {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === QUIZ.answer;
  return (
    <>
      <AppHeader subtitle="Question 1 of 5" title="Lesson quiz" right={<Pill tone="blue">Timed</Pill>} />
      <Body>
        <Card>
          <p className="text-[13px] font-semibold leading-snug text-slate-900">{QUIZ.question}</p>
        </Card>
        <div role="radiogroup" aria-label="Answers" className="space-y-2">
          {QUIZ.options.map((opt, i) => {
            const chosen = picked === i;
            const right = picked !== null && i === QUIZ.answer;
            return (
              <button key={opt} type="button" role="radio" aria-checked={chosen} onClick={() => setPicked(i)} className={cn('flex w-full items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', right ? 'border-[color:var(--demo-good)] bg-[var(--demo-good-soft)]' : chosen ? 'border-[color:var(--demo-accent)]' : 'border-slate-200')}>
                <span className={cn('grid size-5 shrink-0 place-items-center rounded-full border text-[10px] font-semibold', chosen ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent)] text-white' : 'border-slate-300 text-slate-500')}>{String.fromCharCode(65 + i)}</span>
                <span className="text-slate-800">{opt}</span>
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p role="status" className={cn('demo-rise rounded-lg px-3 py-2 text-[12px]', correct ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-amber-50 text-amber-900')}>
            {correct ? 'Correct. A type guard narrows the union inside the branch.' : 'Not quite. Try again: look for the check that narrows at runtime.'}
          </p>
        )}
      </Body>
    </>
  );
}

export function StudentProgress() {
  const weekly = PROGRESS_WEEKS;
  return (
    <>
      <AppHeader subtitle="This week" title="Progress" />
      <Body>
        <Card className="flex items-center gap-4">
          <Ring value={68} />
          <div>
            <p className="text-[13px] font-semibold text-slate-900">Modern React and TypeScript</p>
            <p className="text-[11px] text-slate-500">Lesson 14 of 42 · 4.2 h this week</p>
          </div>
        </Card>
        <Card>
          <p className="mb-2 text-xs font-semibold text-slate-900">Minutes studied</p>
          <div className="flex h-24 items-end gap-1.5">
            {weekly.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="demo-grow w-full rounded-t-md bg-[var(--demo-accent)]" style={{ height: `${d.value}%` }} />
                <span className="text-[9px] text-slate-500">{d.label[0]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <Trophy className="size-5 text-[color:var(--demo-accent-ink)]" aria-hidden />
          <p className="text-[12px] text-slate-700">Streak: 9 days. Keep going to earn the Consistent learner badge.</p>
        </Card>
      </Body>
    </>
  );
}

function Ring({ value }: { value: number }) {
  const R = 40;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 100 100" role="img" aria-label={`Course progress ${value}%`} className="size-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--demo-good)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(value / 100) * C} ${C}`} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-semibold tabular-nums text-slate-900">{value}%</span>
    </div>
  );
}

export function StudentProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [
    [Award, 'My certificates'],
    [Bell, 'Notifications'],
    [Settings, 'Settings'],
  ];
  return (
    <>
      <AppHeader subtitle="Learner" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center">
          <Avatar name="Hannah Lindqvist" size="lg" />
          <p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p>
          <p className="text-xs text-slate-500">Front-end developer · 3 certificates</p>
        </Card>
        <Card className="divide-y divide-slate-100 p-0">
          {rows.map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3 text-[13px] text-slate-700">
              <Icon className="size-4 text-slate-500" aria-hidden />
              {label}
              <ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden />
            </div>
          ))}
        </Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </Body>
    </>
  );
}

/* ---------------------------------- Instructor app ---------------------------------- */

export function InstructorDashboard({ go }: { go: (s: InstructorScreen) => void }) {
  return (
    <>
      <AppHeader subtitle="Good morning" title="Dr. Ada Kim" right={<Avatar name="Dr. Ada Kim" />} />
      <Body>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Students', '2.8k'],
            ['Courses', '3'],
            ['Earnings', '$38k'],
          ].map(([label, value]) => (
            <Card key={label} className="text-center">
              <p className="text-base font-semibold tabular-nums text-slate-900">{value}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </Card>
          ))}
        </div>
        <button type="button" onClick={() => go('analytics')} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Card className="border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)]">
            <p className="text-[11px] font-medium text-[color:var(--demo-accent-ink)]">Students needing help</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">Daniel Osei is at risk</p>
            <p className="text-[11px] text-slate-600">Inactive for 6 days · 23% complete</p>
          </Card>
        </button>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Marking queue</p>
        <Card className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-course-amber-ink">
            <ClipboardList className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-900">Typed form assignment</p>
            <p className="text-[11px] text-slate-500">32 submissions to mark</p>
          </div>
          <Pill tone="amber">Marking</Pill>
        </Card>
      </Body>
    </>
  );
}

export function InstructorCourses() {
  const mine = COURSES.filter((c) => c.instructor === 'Dr. Ada Kim');
  return (
    <>
      <AppHeader subtitle={`${mine.length} courses`} title="My courses" />
      <Body>
        {mine.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[13px] font-semibold text-slate-900">{c.title}</p>
              <Pill tone={tone(c.status)}>{c.status}</Pill>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {c.students.toLocaleString('en-US')} students · {c.lessons} lessons
            </p>
            <div className="mt-2.5">
              <ProgressBar value={c.progress || 12} tone="emerald" />
            </div>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function InstructorAnalytics() {
  const top = [...STUDENTS].sort((a, b) => b.progress - a.progress).slice(0, 5);
  return (
    <>
      <AppHeader subtitle="Student engagement" title="Analytics" />
      <Body>
        <div className="grid grid-cols-2 gap-2.5">
          <Card>
            <p className="text-[11px] text-slate-500">Completion</p>
            <p className="text-lg font-semibold tabular-nums text-slate-900">62%</p>
          </Card>
          <Card>
            <p className="text-[11px] text-slate-500">Avg. score</p>
            <p className="text-lg font-semibold tabular-nums text-slate-900">84</p>
          </Card>
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Top learners</p>
        {top.map((s) => (
          <Card key={s.id} className="flex items-center gap-3">
            <Avatar name={s.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-slate-900">{s.name}</p>
              <div className="mt-1.5">
                <ProgressBar value={s.progress} tone="emerald" />
              </div>
            </div>
            <span className="text-[11px] font-semibold tabular-nums text-slate-700">{s.progress}%</span>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function InstructorUpload() {
  const [files, setFiles] = useState<string[]>(['Lesson 4 slides.pdf']);
  return (
    <>
      <AppHeader subtitle="Course content" title="Upload" />
      <Body>
        <button type="button" onClick={() => setFiles((f) => [...f, `Lesson ${f.length + 4} video.mp4`])} className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--demo-accent-ring)] bg-white px-4 py-7 text-center focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <span className="grid size-10 place-items-center rounded-full bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
            <Upload className="size-5" aria-hidden />
          </span>
          <span className="text-[13px] font-semibold text-slate-900">Add a lesson file</span>
          <span className="text-[11px] text-slate-500">Video, slides or a PDF</span>
        </button>
        {files.map((f) => (
          <Card key={f} className="flex items-center gap-3">
            <Video className="size-4 text-slate-400" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[13px] text-slate-900">{f}</span>
            <Pill tone="green">Ready</Pill>
          </Card>
        ))}
        <button type="button" className={primary}>
          <Users className="size-4" aria-hidden /> Publish to students
        </button>
      </Body>
    </>
  );
}

