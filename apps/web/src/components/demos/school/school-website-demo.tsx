'use client';

import { CalendarCheck, CalendarClock, ClipboardList, FileBarChart, GraduationCap, LayoutDashboard, Megaphone, NotebookPen, School, UserRound, Users, Wallet } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { ANNOUNCEMENTS } from '@/data/school/app';
import { AdminDashboard, AttendanceView, ClassesView, ExamsView, FeesView, ReportsView, ResultsView, StudentsView, TeachersView } from './website-admin-views';
import { ParentAnnouncements, ParentAttendance, ParentOverview, TeacherDashboard } from './website-role-views';
import { SchoolLogo } from './school-logo';

type Role = 'Administrator' | 'Teacher' | 'Parent';
const ROLES: readonly Role[] = ['Administrator', 'Teacher', 'Parent'];

const NAV: Record<Role, ShellNavItem[]> = {
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

const USERS = {
  Administrator: { name: 'Amelia Hart', title: 'Principal' },
  Teacher: { name: 'Dr. Helen Brooks', title: 'Mathematics' },
  Parent: { name: 'Mark Bennett', title: 'Parent of Olivia' },
};

const NOTIFICATIONS = ANNOUNCEMENTS.slice(0, 3).map(({ id, title, date }) => ({ id, title, date }));

/** The interactive school website: the shared role-aware app shell around the school's dummy-data views. */
export function SchoolWebsiteDemo() {
  return <AppShell brand={<SchoolLogo tone="dark" />} domain="app.educore.school" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />;
}
