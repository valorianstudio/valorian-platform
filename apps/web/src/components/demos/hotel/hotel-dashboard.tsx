'use client';

import { BarChart3, BedDouble, CalendarDays, CreditCard, FileBarChart, LayoutDashboard, Settings, Sparkles, UsersRound, Users, Brush } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/hotel/rooms';
import { HOTEL_THEME } from '@/data/hotel/meta';
import { HotelDashboardHome, HotelHousekeepingView, HotelReservationsView, HotelRoomsView } from './hotel-views-a';
import { HotelAnalyticsView, HotelGuestsView, HotelPaymentsView, HotelReportsView, HotelSettingsView, HotelStaffView } from './hotel-views-b';
import { HotelLogo } from './hotel-logo';

type Role = 'Front desk manager' | 'Housekeeping lead';
const ROLES: readonly Role[] = ['Front desk manager', 'Housekeeping lead'];

const NAV: Record<Role, ShellNavItem[]> = {
  'Front desk manager': [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <HotelDashboardHome /> },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays, render: () => <HotelReservationsView /> },
    { id: 'rooms', label: 'Rooms', icon: BedDouble, render: () => <HotelRoomsView /> },
    { id: 'guests', label: 'Guests', icon: Users, render: () => <HotelGuestsView /> },
    { id: 'staff', label: 'Staff', icon: UsersRound, render: () => <HotelStaffView /> },
    { id: 'housekeeping', label: 'Housekeeping', icon: Brush, render: () => <HotelHousekeepingView /> },
    { id: 'payments', label: 'Payments', icon: CreditCard, render: () => <HotelPaymentsView /> },
    { id: 'reports', label: 'Reports', icon: FileBarChart, render: () => <HotelReportsView /> },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, render: () => <HotelAnalyticsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <HotelSettingsView /> },
  ],
  'Housekeeping lead': [
    { id: 'housekeeping', label: 'Housekeeping', icon: Brush, render: () => <HotelHousekeepingView /> },
    { id: 'rooms', label: 'Rooms', icon: BedDouble, render: () => <HotelRoomsView /> },
    { id: 'staff', label: 'Staff', icon: UsersRound, render: () => <HotelStaffView /> },
    { id: 'reservations', label: 'Arrivals', icon: Sparkles, render: () => <HotelReservationsView /> },
  ],
};

const USERS = {
  'Front desk manager': { name: 'Amelia Stone', title: 'Front desk manager' },
  'Housekeeping lead': { name: 'Lena Fischer', title: 'Housekeeping lead' },
};

/** The interactive hotel dashboard: the shared role-aware app shell with the hotel's modules and brand variables. */
export function HotelDashboard() {
  return (
    <div style={HOTEL_THEME}>
      <AppShell brand={<HotelLogo tone="dark" />} domain="app.azure.hotel" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
