import type { DemoCategoryId } from '@/data/demos';

/** Routing and copy shared by the School Management demo's hub page, its experience bar, the catalog card and the sitemap. */

export const SCHOOL_DEMO = {
  slug: 'school-management',
  title: 'School Management System',
  basePath: '/demos/school-management',
} as const;

export type SchoolExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const SCHOOL_EXPERIENCES: {
  key: SchoolExperienceKey;
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
    href: `${SCHOOL_DEMO.basePath}/landing-page`,
    title: 'Marketing landing page',
    description: 'A conversion-focused site that explains the product, builds trust and turns visitors into admission and demo requests.',
    highlights: ['Hero with product preview', 'Features, results and pricing', 'Testimonials and FAQ', 'Admission and demo request form'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${SCHOOL_DEMO.basePath}/website`,
    title: 'Full website and dashboards',
    description: 'The working school platform. Switch between administrator, teacher and parent views and explore every module.',
    highlights: ['Admin dashboard with live charts', 'Student and teacher management', 'Attendance, exams, results and fees', 'Teacher dashboard and parent portal'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${SCHOOL_DEMO.basePath}/mobile-app`,
    title: 'Student and teacher mobile apps',
    description: 'Tap through realistic phone screens for students and teachers, from sign-in to attendance and results.',
    highlights: ['Student app: 7 screens', 'Teacher app: 4 screens', 'Bottom navigation and smooth transitions', 'Attendance marking in two taps'],
  },
];
