import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Pet Shop demo's overview, experience bar, catalog card and sitemap. */

export const PETSHOP_DEMO = {
  slug: 'petshop-management',
  title: 'Pet Shop Management System',
  basePath: '/demos/petshop-management',
} as const;

/**
 * Brand variables read by the shared demo components: deep green #166534, soft blue #2563EB, warm orange #F97316, soft beige #FEF3C7
 * and surface #F8FAFC. Orange is the warm highlight; its dark "ink" shade is used for orange text.
 */
export const PETSHOP_THEME = {
  '--demo-accent': '#166534',
  '--demo-accent-soft': '#fef3c7',
  '--demo-accent-ink': '#14532d',
  '--demo-accent-ring': '#bbf7d0',
  '--demo-good': '#2563eb',
  '--demo-good-soft': '#eff6ff',
  '--demo-good-ink': '#1d4ed8',
  '--demo-good-ring': '#bfdbfe',
  '--demo-good-light': '#93c5fd',
  '--demo-orange': '#f97316',
  '--demo-orange-ink': '#c2410c',
  '--demo-header': '#14532d',
  '--demo-sidebar': '#14532d',
  '--demo-nav-active': '#f97316',
} as CSSProperties;

export type PetshopExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const PETSHOP_EXPERIENCES: {
  key: PetshopExperienceKey;
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
    href: `${PETSHOP_DEMO.basePath}/landing-page`,
    title: 'Pet shop website',
    description: 'A full-screen preview of a pet shop website: pet categories, grooming and vet services, offers and online ordering.',
    highlights: ['Hero with product preview', 'Dogs, cats, birds and accessories', 'Grooming, checkups and training', 'Offers and booking call to action'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${PETSHOP_DEMO.basePath}/website`,
    title: 'Pet shop dashboard and modules',
    description: 'The working shop platform. Switch between manager and groomer views and run pets, products, orders, appointments and stock.',
    highlights: ['Dashboard with sales and appointments', 'Pet profiles and owner records', 'Products, orders and low-stock alerts', 'Grooming and vet schedule'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${PETSHOP_DEMO.basePath}/mobile-app`,
    title: 'Pet care customer and staff apps',
    description: 'Tap through pet profiles, grooming and vet booking, shopping and order tracking, and run the day from the staff app.',
    highlights: ['Customer app: 10 screens', 'Staff app: 4 screens', 'Book grooming in three taps', 'Order tracking and vet records'],
  },
];
