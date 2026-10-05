'use client';

import { BarChart3, CalendarDays, ClipboardList, CreditCard, FileHeart, LayoutDashboard, Pill, Settings, Stethoscope, Users } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/clinic/app';
import { CLINIC_THEME } from '@/data/clinic/meta';
import { ClinicAppointmentsView, ClinicDashboardHome, ClinicDoctorsView, ClinicPatientsView } from './clinic-views-a';
import { ClinicBillingView, ClinicDoctorDay, ClinicPrescriptionsView, ClinicRecordsView, ClinicReportsView, ClinicSettingsView } from './clinic-views-b';
import { ClinicLogo } from './clinic-logo';

type Role = 'Clinic admin' | 'Doctor';
const ROLES: readonly Role[] = ['Clinic admin', 'Doctor'];

const NAV: Record<Role, ShellNavItem[]> = {
  'Clinic admin': [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <ClinicDashboardHome /> },
    { id: 'patients', label: 'Patients', icon: Users, render: () => <ClinicPatientsView /> },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays, render: () => <ClinicAppointmentsView /> },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, render: () => <ClinicDoctorsView /> },
    { id: 'records', label: 'Medical Records', icon: FileHeart, render: () => <ClinicRecordsView /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, render: () => <ClinicPrescriptionsView /> },
    { id: 'billing', label: 'Billing', icon: CreditCard, render: () => <ClinicBillingView /> },
    { id: 'reports', label: 'Reports', icon: BarChart3, render: () => <ClinicReportsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <ClinicSettingsView /> },
  ],
  Doctor: [
    { id: 'my-day', label: 'My day', icon: ClipboardList, render: () => <ClinicDoctorDay /> },
    { id: 'patients', label: 'Patients', icon: Users, render: () => <ClinicPatientsView /> },
    { id: 'records', label: 'Medical Records', icon: FileHeart, render: () => <ClinicRecordsView /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, render: () => <ClinicPrescriptionsView /> },
  ],
};

const USERS = {
  'Clinic admin': { name: 'Dr. Rafael Costa', title: 'Clinic director' },
  Doctor: { name: 'Dr. Amara Okoye', title: 'Lead dentist' },
};

/** The interactive clinic dashboard: the shared role-aware app shell with the clinic's modules and brand variables. */
export function ClinicDashboard() {
  return (
    <div style={CLINIC_THEME}>
      <AppShell brand={<ClinicLogo tone="dark" />} domain="app.clinicos.health" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
