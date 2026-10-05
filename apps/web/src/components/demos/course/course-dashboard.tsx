'use client';

import { Award, BarChart3, BookOpen, ClipboardList, FileBadge, GraduationCap, LayoutDashboard, MessageSquare, Settings, Users, Wallet } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/course/app';
import { COURSE_THEME } from '@/data/course/meta';
import { CourseLogo } from './course-logo';
import { CourseAnalyticsView, CourseAssessmentsView, CourseCertificatesView, CourseCoursesView, CourseDashboardHome, CourseInstructorsView, CourseMessagesView, CourseSettingsView, CourseStudentsView } from './course-views';

type Role = 'Administrator' | 'Instructor';
const ROLES: readonly Role[] = ['Administrator', 'Instructor'];

const NAV: Record<Role, ShellNavItem[]> = {
  Administrator: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <CourseDashboardHome /> },
    { id: 'courses', label: 'Courses', icon: BookOpen, render: () => <CourseCoursesView /> },
    { id: 'students', label: 'Students', icon: Users, render: () => <CourseStudentsView /> },
    { id: 'instructors', label: 'Instructors', icon: GraduationCap, render: () => <CourseInstructorsView /> },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, render: () => <CourseAssessmentsView /> },
    { id: 'exams', label: 'Exams', icon: FileBadge, render: () => <CourseAssessmentsView /> },
    { id: 'certificates', label: 'Certificates', icon: Award, render: () => <CourseCertificatesView /> },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, render: () => <CourseAnalyticsView /> },
    { id: 'messages', label: 'Messages', icon: MessageSquare, render: () => <CourseMessagesView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <CourseSettingsView /> },
  ],
  Instructor: [
    { id: 'dashboard', label: 'My dashboard', icon: LayoutDashboard, render: () => <CourseDashboardHome /> },
    { id: 'courses', label: 'My courses', icon: BookOpen, render: () => <CourseCoursesView /> },
    { id: 'students', label: 'Students', icon: Users, render: () => <CourseStudentsView /> },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, render: () => <CourseAssessmentsView /> },
    { id: 'messages', label: 'Messages', icon: MessageSquare, render: () => <CourseMessagesView /> },
  ],
};

const USERS = {
  Administrator: { name: 'Dr. Ada Kim', title: 'Academy director' },
  Instructor: { name: 'Lena Morales', title: 'Product design instructor' },
};

/** The interactive LMS dashboard: the shared role-aware app shell with the LMS modules and brand variables. */
export function CourseDashboard() {
  return (
    <div style={COURSE_THEME}>
      <AppShell brand={<CourseLogo tone="dark" />} domain="app.learnova.academy" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
