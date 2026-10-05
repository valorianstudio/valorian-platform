'use client';

import { BarChart3, CalendarDays, CreditCard, Dumbbell, LayoutDashboard, ListChecks, Settings, UserRound, Users, Wallet, ClipboardCheck, Activity } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/gym/app';
import { GYM_THEME } from '@/data/gym/meta';
import { GymLogo } from './gym-logo';
import { GymMembersView, GymTrainersView, GymClassesView, GymDashboardHome } from './gym-views-a';
import { GymAttendanceView, GymMembershipsView, GymPaymentsView, GymReportsView, GymSettingsView, GymWorkoutsView } from './gym-views-b';

type Role = 'Gym admin' | 'Trainer';
const ROLES: readonly Role[] = ['Gym admin', 'Trainer'];

const NAV: Record<Role, ShellNavItem[]> = {
  'Gym admin': [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <GymDashboardHome /> },
    { id: 'members', label: 'Members', icon: Users, render: () => <GymMembersView /> },
    { id: 'trainers', label: 'Trainers', icon: UserRound, render: () => <GymTrainersView /> },
    { id: 'memberships', label: 'Memberships', icon: CreditCard, render: () => <GymMembershipsView /> },
    { id: 'workouts', label: 'Workout Plans', icon: ListChecks, render: () => <GymWorkoutsView /> },
    { id: 'classes', label: 'Classes', icon: CalendarDays, render: () => <GymClassesView /> },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, render: () => <GymAttendanceView /> },
    { id: 'payments', label: 'Payments', icon: Wallet, render: () => <GymPaymentsView /> },
    { id: 'reports', label: 'Reports', icon: BarChart3, render: () => <GymReportsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <GymSettingsView /> },
  ],
  Trainer: [
    { id: 'dashboard', label: 'My clients', icon: Activity, render: () => <GymTrainersView /> },
    { id: 'members', label: 'Members', icon: Users, render: () => <GymMembersView /> },
    { id: 'workouts', label: 'Workout Plans', icon: Dumbbell, render: () => <GymWorkoutsView /> },
    { id: 'classes', label: 'Classes', icon: CalendarDays, render: () => <GymClassesView /> },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, render: () => <GymAttendanceView /> },
  ],
};

const USERS = {
  'Gym admin': { name: 'Coach Rivera', title: 'Gym owner' },
  Trainer: { name: 'Jordan Blake', title: 'Strength coach' },
};

/** The interactive gym dashboard: the shared role-aware app shell with the gym's modules and brand variables. */
export function GymDashboard() {
  return (
    <div style={GYM_THEME}>
      <AppShell brand={<GymLogo tone="dark" />} domain="app.forge.gym" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
