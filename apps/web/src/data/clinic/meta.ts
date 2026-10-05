import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Clinic Management demo's overview, its experience bar, the catalog card and the sitemap. */

export const CLINIC_DEMO = {
  slug: 'clinic-management',
  title: 'Clinic Management System',
  basePath: '/demos/clinic-management',
} as const;

/**
 * Brand variables read by the shared demo components (components/demos/shared): medical blue #0F4C81, teal #0EA5A4 and health green
 * #22C55E. "ink" values are the darker shades used for text so contrast stays accessible on white.
 */
export const CLINIC_THEME = {
  '--demo-accent': '#0f4c81',
  '--demo-accent-soft': '#e8f1f9',
  '--demo-accent-ink': '#0a3a63',
  '--demo-accent-ring': '#b7d2ea',
  '--demo-good': '#22c55e',
  '--demo-good-soft': '#ecfdf3',
  '--demo-good-ink': '#15803d',
  '--demo-good-ring': '#bbf7d0',
  '--demo-good-light': '#86efac',
  '--demo-header': '#0f4c81',
  '--demo-sidebar': '#0a2a47',
  '--demo-nav-active': '#0b7f7e',
} as CSSProperties;

export type ClinicExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const CLINIC_EXPERIENCES: {
  key: ClinicExperienceKey;
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
    href: `${CLINIC_DEMO.basePath}/landing-page`,
    title: 'Marketing landing page',
    description: 'A premium healthcare website that explains the software, introduces the care team and turns clinic owners into demo requests.',
    highlights: ['Hero with product preview', 'Seven core modules and a dental chart', 'Doctors, testimonials and results', 'Demo request form'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${CLINIC_DEMO.basePath}/website`,
    title: 'Clinic dashboard and modules',
    description: 'The working clinic platform. Switch between clinic admin and doctor views and explore every module.',
    highlights: ['Dashboard with patient growth chart', 'Patients, appointments and doctors', 'Dental chart and treatment history', 'Prescriptions, billing and reports'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${CLINIC_DEMO.basePath}/mobile-app`,
    title: 'Patient and doctor mobile apps',
    description: 'Tap through realistic phone screens: book a visit, find a doctor and view records, or run a day as the doctor.',
    highlights: ['Patient app: 7 screens', 'Doctor app: 4 screens', 'Appointment booking in three taps', 'Bottom navigation and smooth transitions'],
  },
];
