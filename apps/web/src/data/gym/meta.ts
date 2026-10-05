import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Gym Management demo's overview, its experience bar, the catalog card and the sitemap. */

export const GYM_DEMO = {
  slug: 'gym-management',
  title: 'Gym Management System',
  basePath: '/demos/gym-management',
} as const;

/**
 * Brand variables read by the shared demo components: deep black #111827, strong blue #2563EB, fitness green #22C55E and warm
 * orange #F97316. Orange is used as a highlight and in its dark shade ("ink") for text, so contrast on white stays readable.
 */
export const GYM_THEME = {
  '--demo-accent': '#2563eb',
  '--demo-accent-soft': '#eff6ff',
  '--demo-accent-ink': '#1e40af',
  '--demo-accent-ring': '#bfdbfe',
  '--demo-good': '#22c55e',
  '--demo-good-soft': '#f0fdf4',
  '--demo-good-ink': '#15803d',
  '--demo-good-ring': '#bbf7d0',
  '--demo-good-light': '#86efac',
  '--demo-header': '#111827',
  '--demo-sidebar': '#111827',
  '--demo-nav-active': '#2563eb',
} as CSSProperties;

export type GymExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const GYM_EXPERIENCES: {
  key: GymExperienceKey;
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
    href: `${GYM_DEMO.basePath}/landing-page`,
    title: 'Gym marketing website',
    description: 'A full-screen preview of a premium gym website: a hero that sells the experience, memberships, trainers and online booking.',
    highlights: ['Hero with dashboard preview', 'Membership plans and trainers', 'Classes, results and testimonials', 'Trial sign-up form'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${GYM_DEMO.basePath}/website`,
    title: 'Gym dashboard and modules',
    description: 'The working gym platform. Switch between admin and trainer views and run members, classes, plans and payments.',
    highlights: ['Dashboard with live KPIs', 'Members, trainers and memberships', 'Class calendar and bookings', 'Workouts, attendance and payments'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${GYM_DEMO.basePath}/mobile-app`,
    title: 'Member and trainer mobile apps',
    description: 'Tap through realistic phone screens: a member home, workout plans, trainer chat, progress and class booking.',
    highlights: ['Member app: 8 screens', 'Trainer app: 4 screens', 'Class booking in three taps', 'Trainer chat and progress tracking'],
  },
];
