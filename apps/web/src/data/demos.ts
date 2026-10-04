import type { IconName } from '@/lib/icon-names';

/**
 * The single source of truth for the Solutions & Demos showcase: the home page section, the /demos page and every demo
 * detail page read from this file, and every card is drawn by one component (components/site/demos/demo-card.tsx).
 *
 * Entries are placeholders until each demo is built. Set `status: 'available'` when it is ready and add a real screenshot
 * through `image`. A demo whose `slug` matches an interactive demo managed in the admin panel (educore, clinicos, ...) opens
 * that demo at /demos/<slug>; any other slug opens the placeholder page generated from the entry below.
 */

export type DemoCategoryId = 'landing-page' | 'full-stack' | 'mobile-app';
export type DemoPlatform = 'Website' | 'Mobile App' | 'Landing Page';
export type DemoStatus = 'available' | 'in-development' | 'coming-soon';
export type PlaceholderTone = 'cream' | 'coral' | 'slate' | 'mist';

export interface Demo {
  slug: string;
  title: string;
  /** Primary category. */
  category: DemoCategoryId;
  /** Every category the demo is offered in (always includes `category`). One demo, shown once per tab it belongs to. */
  offerings: DemoCategoryId[];
  industry: string;
  description: string;
  features: string[];
  technologies: string[];
  platforms: DemoPlatform[];
  /** Real screenshot URL, once there is one. */
  image?: string;
  /** Drawn in code until `image` exists. */
  placeholder: { icon: IconName; tone: PlaceholderTone };
  status: DemoStatus;
}

export interface DemoCategory {
  id: DemoCategoryId;
  label: string;
  short: string;
  tagline: string;
  description: string;
  platform: DemoPlatform;
  icon: IconName;
  bestFor: string[];
}

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: 'landing-page',
    label: 'Landing Page Solutions',
    short: 'Landing Pages',
    tagline: 'Marketing & advertisement',
    description: 'Fast, conversion-focused pages that turn campaign traffic into enquiries, bookings and sales.',
    platform: 'Landing Page',
    icon: 'rocket',
    bestFor: ['Ad campaigns', 'Product launches', 'Lead generation'],
  },
  {
    id: 'full-stack',
    label: 'Full Stack Website Solutions',
    short: 'Full Stack Websites',
    tagline: 'Complete business systems',
    description: 'End-to-end web platforms with dashboards, user roles, databases and integrations that run your operations.',
    platform: 'Website',
    icon: 'layers',
    bestFor: ['Business operations', 'Customer portals', 'SaaS products'],
  },
  {
    id: 'mobile-app',
    label: 'Mobile App Solutions',
    short: 'Mobile Apps',
    tagline: 'Android & iOS applications',
    description: 'Polished native-feeling apps for your customers and staff, shipped to both stores from one codebase.',
    platform: 'Mobile App',
    icon: 'smartphone',
    bestFor: ['Customer engagement', 'Field teams', 'On-the-go services'],
  },
];

export const DEMO_STATUS_LABEL: Record<DemoStatus, string> = {
  available: 'Demo available',
  'in-development': 'In development',
  'coming-soon': 'Coming soon',
};

export const DEMOS: Demo[] = [
  {
    slug: 'educore',
    title: 'School Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Education',
    description: 'A complete school administration platform covering admissions, classes, attendance, fees and parent communication, with a mobile app and an admissions landing page.',
    features: ['Student and guardian records', 'Daily attendance with summaries', 'Fee invoicing and payment tracking', 'Timetables and class management', 'Parent and teacher portals', 'Admissions landing page with enquiry form'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'React Native'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'graduation-cap', tone: 'cream' },
    status: 'available',
  },
  {
    slug: 'clinicos',
    title: 'Clinic Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Healthcare',
    description: 'Appointments, patient records and billing in one calm interface, with a patient booking app and a marketing landing page to attract new patients.',
    features: ['Appointment calendar by doctor and room', 'Patient profiles and visit history', 'Invoicing and payment tracking', 'Automated appointment reminders', 'Patient booking app', 'Clinic marketing landing page'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'React Native'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'heart-pulse', tone: 'mist' },
    status: 'available',
  },
  {
    slug: 'tableflow',
    title: 'Restaurant Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Restaurant & Hospitality',
    description: 'Reservations, table status, orders and daily sales connected across the dining room and kitchen, plus a guest ordering app and a restaurant landing page.',
    features: ['Reservations and table management', 'Order and kitchen display flow', 'Menu and pricing management', 'Daily sales reporting', 'Guest ordering and booking app', 'Restaurant landing page with online booking'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Flutter'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'utensils', tone: 'coral' },
    status: 'available',
  },
  {
    slug: 'fitcore',
    title: 'Gym Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Fitness',
    description: 'Memberships, class schedules, check-ins and trainer management for gyms and studios, with a member app and a sign-up landing page.',
    features: ['Membership plans and renewals', 'Class and trainer scheduling', 'QR check-in and attendance', 'Payment tracking and reminders', 'Member progress and workout plans', 'Membership landing page'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'React Native'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'dumbbell', tone: 'slate' },
    status: 'available',
  },
  {
    slug: 'learnova',
    title: 'Course Learning Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'EdTech',
    description: 'Create, sell and deliver online courses with lessons, quizzes, progress tracking and certificates, for academies and independent instructors.',
    features: ['Course builder with video and documents', 'Quizzes and assignments', 'Student progress and certificates', 'Payments and enrolment', 'Instructor and admin dashboards', 'Course sales landing page'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'book-open', tone: 'cream' },
    status: 'available',
  },
  {
    slug: 'flowdesk',
    title: 'Business Operations Management System',
    category: 'full-stack',
    offerings: ['full-stack'],
    industry: 'Business Operations',
    description: 'One workspace for tasks, teams, approvals, documents and reporting, so a growing business runs on a single source of truth instead of spreadsheets.',
    features: ['Task and project tracking', 'Role-based access and approvals', 'Document management', 'Customer and vendor records', 'Automated workflows and notifications', 'Management reports and dashboards'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis'],
    platforms: ['Website'],
    placeholder: { icon: 'briefcase', tone: 'slate' },
    status: 'available',
  },
  {
    slug: 'modeva',
    title: 'E-commerce Storefront',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Retail & E-commerce',
    description: 'A fast online store with catalog, cart, checkout and inventory management, plus a shopping app and campaign landing pages.',
    features: ['Product catalog with search', 'Cart and secure checkout', 'Inventory and order management', 'Discounts and campaigns', 'Shopping mobile app', 'Campaign landing pages'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Cloudflare', 'React Native'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'shopping-cart', tone: 'coral' },
    status: 'available',
  },
  {
    slug: 'assistiq',
    title: 'AI Business Assistant',
    category: 'full-stack',
    offerings: ['full-stack'],
    industry: 'AI Solutions',
    description: 'An AI assistant that answers customer and staff questions from your own business content, with human hand-off when needed.',
    features: ['Answers grounded in your documents', 'Website chat widget', 'Human hand-off and conversation history', 'Usage and quality analytics', 'Role-based admin console', 'Integrations with your existing tools'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'OpenAI APIs', 'AI Agents'],
    platforms: ['Website'],
    placeholder: { icon: 'bot', tone: 'slate' },
    status: 'available',
  },
  {
    slug: 'waste-management-system',
    title: 'Waste Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app'],
    industry: 'Environment & Utilities',
    description: 'Plan collection routes, track pickups and bins, and report on recycling for councils and waste collection companies, with a driver app in the field.',
    features: ['Route planning and scheduling', 'Pickup requests and tracking', 'Driver mobile app with proof of collection', 'Bin and vehicle management', 'Billing and customer accounts', 'Recycling and volume reports'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'React Native'],
    platforms: ['Website', 'Mobile App'],
    placeholder: { icon: 'wrench', tone: 'mist' },
    status: 'coming-soon',
  },
  {
    slug: 'salon-management-system',
    title: 'Salon Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Beauty & Wellness',
    description: 'Online booking, staff schedules, services and client history for salons and spas, with a booking app and a landing page that fills the calendar.',
    features: ['Online booking and calendar', 'Staff schedules and commissions', 'Service menu and packages', 'Client history and preferences', 'Reminders by SMS or email', 'Salon landing page with booking widget'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Flutter'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'sparkles', tone: 'coral' },
    status: 'coming-soon',
  },
  {
    slug: 'student-attendance-system',
    title: 'Student Attendance System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app'],
    industry: 'Education',
    description: 'Fast, accurate attendance for schools and training centres, with instant parent notifications and clear reports for administrators.',
    features: ['One-tap and QR attendance', 'Instant absence alerts to parents', 'Class, term and student reports', 'Leave requests and approvals', 'Teacher mobile app', 'Exportable records'],
    technologies: ['React', 'NestJS', 'PostgreSQL', 'React Native'],
    platforms: ['Website', 'Mobile App'],
    placeholder: { icon: 'users', tone: 'cream' },
    status: 'coming-soon',
  },
  {
    slug: 'job-finder-platform',
    title: 'Job Finder Platform',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app'],
    industry: 'Recruitment',
    description: 'A job marketplace connecting candidates and employers, with search, applications, company profiles and alerts, plus a candidate app.',
    features: ['Job search with smart filters', 'Candidate profiles and CV upload', 'Employer posting and applicant tracking', 'Job alerts and notifications', 'Company pages', 'Admin moderation tools'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'React Native'],
    platforms: ['Website', 'Mobile App'],
    placeholder: { icon: 'briefcase', tone: 'mist' },
    status: 'coming-soon',
  },
  {
    slug: 'exercise-tracker-application',
    title: 'Exercise Tracker Application',
    category: 'mobile-app',
    offerings: ['mobile-app', 'landing-page'],
    industry: 'Health & Fitness',
    description: 'A mobile-first workout companion for logging exercises, following plans and watching progress, with a landing page to drive downloads.',
    features: ['Workout and exercise logging', 'Custom plans and routines', 'Progress charts and personal records', 'Reminders and streaks', 'Offline-friendly logging', 'App download landing page'],
    technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
    platforms: ['Mobile App', 'Landing Page'],
    placeholder: { icon: 'dumbbell', tone: 'coral' },
    status: 'coming-soon',
  },
  {
    slug: 'hotel-management-system',
    title: 'Hotel Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Hospitality',
    description: 'Reservations, room inventory, housekeeping and billing for hotels and guest houses, with a guest app and a direct-booking landing page.',
    features: ['Room inventory and availability calendar', 'Reservations and check-in/out', 'Housekeeping task board', 'Billing and invoices', 'Guest app for bookings and requests', 'Direct-booking landing page'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Flutter'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'store', tone: 'slate' },
    status: 'coming-soon',
  },
  {
    slug: 'delivery-management-platform',
    title: 'Delivery Management Platform',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app'],
    industry: 'Logistics',
    description: 'Dispatch, track and prove deliveries across fleets and couriers, with live status for customers and a driver app.',
    features: ['Order intake and dispatch board', 'Driver app with navigation and proof of delivery', 'Live tracking and status updates', 'Zone and fee management', 'Customer notifications', 'Performance and cost reports'],
    technologies: ['React', 'NestJS', 'PostgreSQL', 'Redis', 'React Native'],
    platforms: ['Website', 'Mobile App'],
    placeholder: { icon: 'zap', tone: 'mist' },
    status: 'coming-soon',
  },
  {
    slug: 'event-management-system',
    title: 'Event Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Events',
    description: 'Plan events, sell tickets and check guests in, with an attendee app and a landing page for each event.',
    features: ['Event creation and scheduling', 'Ticketing and registration', 'QR check-in', 'Speaker, vendor and sponsor management', 'Attendee app with agenda', 'Event landing page builder'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'React Native'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'lightbulb', tone: 'coral' },
    status: 'coming-soon',
  },
  {
    slug: 'muslim-daily-life-application',
    title: 'Muslim Daily Life Management Application',
    category: 'mobile-app',
    offerings: ['mobile-app', 'landing-page'],
    industry: 'Lifestyle & Faith',
    description: 'A respectful daily companion for prayer times, Qibla direction, Quran reading, habit tracking and reminders, built for everyday use.',
    features: ['Accurate prayer times and reminders', 'Qibla direction', 'Quran reading with bookmarks', 'Daily habit and dhikr tracker', 'Calendar and key dates', 'App download landing page'],
    technologies: ['Flutter', 'Firebase', 'Node.js', 'PostgreSQL'],
    platforms: ['Mobile App', 'Landing Page'],
    placeholder: { icon: 'book-open', tone: 'slate' },
    status: 'coming-soon',
  },
  {
    slug: 'pet-shop-management-system',
    title: 'Pet Shop Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Retail',
    description: 'Inventory, sales, pet profiles and appointments for pet shops and grooming services, with an ordering app and a storefront landing page.',
    features: ['Product and stock management', 'Point of sale and invoices', 'Pet profiles and vaccination records', 'Grooming and vet appointments', 'Customer ordering app', 'Shop landing page'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Flutter'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'store', tone: 'cream' },
    status: 'coming-soon',
  },
  {
    slug: 'online-exam-tracker',
    title: 'Online Exam Tracker',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app'],
    industry: 'Education',
    description: 'Create and run timed exams online, grade them automatically and track results across classes, with a student app for practice and results.',
    features: ['Question bank and exam builder', 'Timed online exams with auto-grading', 'Randomised questions', 'Result analytics by student and class', 'Student mobile app', 'Anti-cheating safeguards'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis'],
    platforms: ['Website', 'Mobile App'],
    placeholder: { icon: 'shield-check', tone: 'mist' },
    status: 'coming-soon',
  },
  {
    slug: 'pharmacy-management-system',
    title: 'Pharmacy Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Healthcare',
    description: 'Stock, expiry tracking, prescriptions and sales for pharmacies, with an ordering app for customers and a pharmacy landing page.',
    features: ['Inventory with batch and expiry alerts', 'Point of sale and invoicing', 'Prescription records', 'Supplier and purchase management', 'Customer reorder app', 'Pharmacy landing page'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'React Native'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'heart-pulse', tone: 'coral' },
    status: 'coming-soon',
  },
  {
    slug: 'local-store-management-system',
    title: 'Local Store Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app', 'landing-page'],
    industry: 'Retail',
    description: 'Inventory, sales and customer credit for neighbourhood shops, with an online ordering app and a storefront landing page.',
    features: ['Product and stock tracking', 'Fast point of sale', 'Customer accounts and credit ledger', 'Supplier purchasing', 'Online ordering app', 'Store landing page'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Flutter'],
    platforms: ['Website', 'Mobile App', 'Landing Page'],
    placeholder: { icon: 'shopping-cart', tone: 'slate' },
    status: 'coming-soon',
  },
  {
    slug: 'building-management-system',
    title: 'House & Building Management System',
    category: 'full-stack',
    offerings: ['full-stack', 'mobile-app'],
    industry: 'Real Estate & Property',
    description: 'Manage tenants, rent, maintenance requests and shared services for apartment buildings, landlords and property managers, with a resident app.',
    features: ['Unit and tenant records', 'Rent invoicing and payment tracking', 'Maintenance request tickets', 'Notices and resident messaging', 'Resident mobile app', 'Owner and manager reports'],
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'React Native'],
    platforms: ['Website', 'Mobile App'],
    placeholder: { icon: 'server', tone: 'mist' },
    status: 'coming-soon',
  },
];


export function getDemo(slug: string): Demo | undefined {
  return DEMOS.find((demo) => demo.slug === slug);
}

export function demosIn(category: DemoCategoryId): Demo[] {
  return DEMOS.filter((demo) => demo.offerings.includes(category));
}

export const DEMO_SLUGS = DEMOS.map((demo) => demo.slug);
