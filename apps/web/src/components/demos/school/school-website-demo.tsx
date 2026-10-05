'use client';

import { Bell, CalendarCheck, CalendarClock, ClipboardList, Megaphone, Menu, NotebookPen, School, Users, Wallet, X, LayoutDashboard, GraduationCap, FileBarChart, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ANNOUNCEMENTS } from '@/data/school/app';
import { cn } from '@/lib/cn';
import { AdminDashboard, AttendanceView, ClassesView, ExamsView, FeesView, ReportsView, ResultsView, StudentsView, TeachersView } from './website-admin-views';
import { ParentAnnouncements, ParentAttendance, ParentOverview, TeacherDashboard } from './website-role-views';
import { SchoolLogo } from './school-logo';
import { Avatar, SelectMenu, useDismiss } from './website-ui';

type Role = 'Administrator' | 'Teacher' | 'Parent';
const ROLES: readonly Role[] = ['Administrator', 'Teacher', 'Parent'];

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  render: () => ReactNode;
}

const NAV: Record<Role, NavItem[]> = {
  Administrator: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <AdminDashboard /> },
    { id: 'students', label: 'Students', icon: Users, render: () => <StudentsView /> },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, render: () => <TeachersView /> },
    { id: 'classes', label: 'Classes', icon: School, render: () => <ClassesView /> },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, render: () => <AttendanceView /> },
    { id: 'exams', label: 'Exams', icon: NotebookPen, render: () => <ExamsView /> },
    { id: 'results', label: 'Results', icon: ClipboardList, render: () => <ResultsView /> },
    { id: 'fees', label: 'Fees', icon: Wallet, render: () => <FeesView /> },
    { id: 'reports', label: 'Reports', icon: FileBarChart, render: () => <ReportsView /> },
  ],
  Teacher: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <TeacherDashboard /> },
    { id: 'classes', label: 'My classes', icon: School, render: () => <ClassesView /> },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, render: () => <AttendanceView lockedClass="Grade 9-A" /> },
    { id: 'exams', label: 'Exams', icon: NotebookPen, render: () => <ExamsView /> },
    { id: 'schedule', label: 'Results', icon: ClipboardList, render: () => <ResultsView student="Grade 9-A class report" /> },
  ],
  Parent: [
    { id: 'overview', label: 'Overview', icon: UserRound, render: () => <ParentOverview /> },
    { id: 'attendance', label: 'Attendance', icon: CalendarClock, render: () => <ParentAttendance /> },
    { id: 'results', label: 'Results', icon: ClipboardList, render: () => <ResultsView /> },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, render: () => <ParentAnnouncements /> },
  ],
};

const USERS: Record<Role, { name: string; title: string }> = {
  Administrator: { name: 'Amelia Hart', title: 'Principal' },
  Teacher: { name: 'Dr. Helen Brooks', title: 'Mathematics' },
  Parent: { name: 'Mark Bennett', title: 'Parent of Olivia' },
};

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="true" aria-expanded={open} aria-label="Notifications, 3 new" onClick={() => setOpen((v) => !v)} className="relative grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-blue-600">
        <Bell className="size-4" aria-hidden />
        <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-emerald-500 ring-2 ring-white" />
      </button>
      {open && (
        <div role="region" aria-label="Notifications" className="demo-rise absolute right-0 top-11 z-30 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <p className="px-2 py-1.5 text-xs font-semibold text-slate-500">Notifications</p>
          <ul>
            {ANNOUNCEMENTS.slice(0, 3).map((item) => (
              <li key={item.id} className="rounded-lg px-2 py-2 hover:bg-slate-50">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * The interactive school website: a role-aware app shell (sidebar, top bar, dropdowns, tabs) around dummy-data views.
 * Switching "View as" changes the whole navigation, so one demo shows the administrator, teacher and parent experiences.
 */
export function SchoolWebsiteDemo() {
  const [role, setRole] = useState<Role>('Administrator');
  const [view, setView] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const items = NAV[role];
  const active = items.find((item) => item.id === view) ?? items[0];
  const user = USERS[role];

  function changeRole(next: Role) {
    setRole(next);
    setView(NAV[next][0].id);
    setMenuOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgb(15_23_42/0.35)]">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-4 py-2.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 hidden h-6 flex-1 items-center rounded-md bg-white px-3 text-xs text-slate-500 sm:flex">app.educore.school/{role.toLowerCase()}/{active.id}</span>
      </div>

      <div className="relative flex h-[40rem] bg-slate-50 sm:h-[44rem]">
        {menuOpen && <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 z-30 bg-slate-900/40 lg:hidden" />}
        <aside className={cn('absolute inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-[transform,visibility] duration-200 lg:static lg:visible lg:w-56 lg:translate-x-0 xl:w-60', menuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full')}>
          <div className="flex h-14 items-center justify-between px-4">
            <SchoolLogo tone="dark" />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400 lg:hidden">
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <nav aria-label={`${role} navigation`} className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
            {items.map((item) => {
              const Icon = item.icon;
              const current = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={current ? 'page' : undefined}
                  onClick={() => {
                    setView(item.id);
                    setMenuOpen(false);
                  }}
                  className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-400', current ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white')}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="m-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.title}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200 bg-white px-3 sm:px-5">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-600 lg:hidden">
              <Menu className="size-4" aria-hidden />
            </button>
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{active.label}</p>
            <SelectMenu label="View as" value={role} options={ROLES} onChange={changeRole} icon={UserRound} align="right" className="w-36 sm:w-48" />
            <Notifications />
          </div>
          <div key={`${role}-${active.id}`} className="demo-slide flex-1 overflow-y-auto p-3 sm:p-5">
            {active.render()}
          </div>
        </div>
      </div>
    </div>
  );
}
