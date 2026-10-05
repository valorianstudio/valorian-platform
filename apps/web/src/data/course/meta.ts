import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Course LMS demo's overview, its experience bar, the catalog card and the sitemap. */

export const COURSE_DEMO = {
  slug: 'course-learning',
  title: 'Course Learning Management System',
  basePath: '/demos/course-learning',
} as const;

/**
 * Brand variables read by the shared demo components: deep indigo #4338CA, blue #2563EB, emerald #10B981 and soft orange #F59E0B.
 * Indigo is the main accent (used sparingly, not everywhere); orange is a highlight with a dark "ink" shade for readable text.
 */
export const COURSE_THEME = {
  '--demo-accent': '#4338ca',
  '--demo-accent-soft': '#eef2ff',
  '--demo-accent-ink': '#3730a3',
  '--demo-accent-ring': '#c7d2fe',
  '--demo-good': '#10b981',
  '--demo-good-soft': '#ecfdf5',
  '--demo-good-ink': '#047857',
  '--demo-good-ring': '#a7f3d0',
  '--demo-good-light': '#6ee7b7',
  '--demo-header': '#4338ca',
  '--demo-sidebar': '#1e1b4b',
  '--demo-nav-active': '#4338ca',
} as CSSProperties;

export type CourseExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const COURSE_EXPERIENCES: {
  key: CourseExperienceKey;
  /** The Solutions & Demos showcase category this experience belongs to. */
  category: DemoCategoryId;
  label: string;
  href: string;
  title: string;
  description: string;
  highlights: string[];
}[] = [
  {
    key: 'landing-page',
    category: 'landing-page',
    label: 'Landing Page',
    href: `${COURSE_DEMO.basePath}/landing-page`,
    title: 'Education platform website',
    description: 'A full-screen preview of an education platform: course categories, featured instructors, pricing and a free-trial call to action.',
    highlights: ['Hero with course preview', 'Categories and featured instructors', 'Certificates, live classes and pricing', 'Free trial sign-up'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${COURSE_DEMO.basePath}/website`,
    title: 'LMS dashboard and modules',
    description: 'The working LMS. Switch between admin and instructor views and run courses, students, assessments and certificates.',
    highlights: ['Dashboard with learning analytics', 'Course and lesson management', 'Exams, assignments and results', 'Certificates and instructor earnings'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${COURSE_DEMO.basePath}/mobile-app`,
    title: 'Student and instructor mobile apps',
    description: 'Tap through realistic phone screens: course lessons, a video player, quizzes, progress and the instructor side.',
    highlights: ['Student app: 9 screens', 'Instructor app: 4 screens', 'Lesson player with progress', 'Quizzes and course uploads'],
  },
];
