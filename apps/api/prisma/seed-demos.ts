import type { PrismaClient } from '@prisma/client';

const CATEGORIES: [slug: string, name: string][] = [
  ['business-software', 'Business Software'],
  ['saas', 'SaaS'],
  ['ecommerce', 'E-commerce'],
  ['healthcare', 'Healthcare'],
  ['education', 'Education'],
  ['hospitality', 'Hospitality'],
  ['fitness', 'Fitness'],
  ['ai', 'AI'],
];

type Pair = [title: string, description: string];

interface PlatformSeed {
  description: string;
  features: Pair[];
  modules: string[];
  tech: string[];
}

interface DemoSeed {
  slug: string;
  name: string;
  badge?: string;
  label: 'INTERACTIVE_CONCEPT' | 'PROTOTYPE' | 'DEMO_PRODUCT';
  category: string;
  industry: string;
  short: string;
  overview: string;
  problem: string;
  solution: string;
  users: string;
  outcomes: string[];
  benefits: string[];
  useCases: string[];
  web?: PlatformSeed;
  mobile?: PlatformSeed;
  related: string[];
}

const DEMOS: DemoSeed[] = [
  {
    slug: 'educore',
    name: 'EduCore',
    badge: 'School Management',
    label: 'PROTOTYPE',
    category: 'education',
    industry: 'education',
    short: 'School management for admissions, classes, attendance and fees.',
    overview: 'A concept for schools that want one system for students, teachers and parents instead of scattered spreadsheets.',
    problem: 'Admissions, attendance and fee records live in separate files, so staff waste time reconciling them.',
    solution: 'A single web platform with role-based dashboards for administrators, teachers and parents.',
    users: 'School administrators, teachers and parents.',
    outcomes: ['Less paperwork', 'Accurate attendance and fee records', 'Clearer communication with families'],
    benefits: ['Reduce manual administration', 'Give parents timely visibility'],
    useCases: ['Single campus', 'Multi-campus group'],
    web: {
      description: 'An administrator dashboard with class, student and fee management.',
      features: [
        ['Student records', 'Profiles, guardians and documents in one place.'],
        ['Attendance tracking', 'Daily attendance with automatic summaries.'],
        ['Fee management', 'Invoices, payments and reminders.'],
        ['Parent portal', 'Parents follow progress and announcements.'],
      ],
      modules: ['Admissions', 'Classes & timetable', 'Attendance', 'Fees & billing'],
      tech: ['nextjs', 'nestjs', 'postgresql'],
    },
    related: ['learnova'],
  },
  {
    slug: 'clinicos',
    name: 'ClinicOS',
    badge: 'Clinic Management',
    label: 'INTERACTIVE_CONCEPT',
    category: 'healthcare',
    industry: 'healthcare',
    short: 'Appointments, patients and billing for modern clinics.',
    overview: 'A concept that helps small clinics run scheduling, records and billing from one calm interface.',
    problem: 'Phone-based booking and paper records cause double bookings and slow front desks.',
    solution: 'An appointment-first system for staff, plus a simple mobile experience for patients.',
    users: 'Clinic staff, doctors and patients.',
    outcomes: ['Fewer missed appointments', 'Faster check-in', 'Cleaner billing'],
    benefits: ['Reduce front-desk workload', 'Improve patient experience'],
    useCases: ['Single clinic', 'Multi-branch practice'],
    web: {
      description: 'Staff dashboard for scheduling, patient records and invoicing.',
      features: [
        ['Appointment calendar', 'Scheduling by doctor and room.'],
        ['Patient profiles', 'History, notes and documents.'],
        ['Billing', 'Invoices and payment tracking.'],
        ['Reports', 'Daily and monthly operational reports.'],
      ],
      modules: ['Appointments', 'Patients', 'Doctors', 'Billing', 'Reports'],
      tech: ['nextjs', 'nestjs', 'postgresql'],
    },
    mobile: {
      description: 'A patient app for booking and reminders.',
      features: [
        ['Book appointments', 'Pick a doctor and time in a few taps.'],
        ['Reminders', 'Notifications before each visit.'],
        ['Visit history', 'Past appointments at a glance.'],
      ],
      modules: ['Booking', 'Reminders', 'Profile'],
      tech: ['react-native', 'typescript'],
    },
    related: ['educore', 'fitcore'],
  },
  {
    slug: 'tableflow',
    name: 'TableFlow',
    badge: 'Restaurant Management',
    label: 'PROTOTYPE',
    category: 'hospitality',
    industry: 'restaurant-hospitality',
    short: 'Reservations, orders and kitchen flow for restaurants.',
    overview: 'A concept that connects the dining room, kitchen and guests.',
    problem: 'Reservations and orders are handled on paper and across several apps.',
    solution: 'One system for reservations, table status, orders and daily sales, with a guest-facing mobile app.',
    users: 'Restaurant managers, staff and guests.',
    outcomes: ['Fewer service errors', 'Better table turnover', 'Clear sales insight'],
    benefits: ['Speed up service', 'Understand what sells'],
    useCases: ['Independent restaurant', 'Small chain'],
    web: {
      description: 'Floor and kitchen dashboard with live table status.',
      features: [
        ['Reservations', 'Online and walk-in booking in one view.'],
        ['Live table map', 'See status of every table.'],
        ['Order management', 'Orders flow from floor to kitchen.'],
        ['Sales reports', 'Daily and weekly performance.'],
      ],
      modules: ['Reservations', 'Orders', 'Menu', 'Reports'],
      tech: ['nextjs', 'nestjs', 'postgresql'],
    },
    mobile: {
      description: 'A guest app for reservations and ordering ahead.',
      features: [
        ['Reserve a table', 'Choose a time and party size.'],
        ['Browse the menu', 'Photos and dietary notes.'],
        ['Order ahead', 'Skip the queue for pickup.'],
      ],
      modules: ['Reservations', 'Menu', 'Orders'],
      tech: ['react-native', 'typescript'],
    },
    related: ['modeva'],
  },
  {
    slug: 'modeva',
    name: 'Modeva',
    badge: 'E-commerce',
    label: 'DEMO_PRODUCT',
    category: 'ecommerce',
    industry: 'retail-ecommerce',
    short: 'A fast storefront with catalog, checkout and inventory.',
    overview: 'A storefront concept focused on speed, clear merchandising and simple operations.',
    problem: 'Slow storefronts and out-of-sync stock lose sales.',
    solution: 'A lean storefront with real-time inventory and a straightforward back office.',
    users: 'Shoppers and store operators.',
    outcomes: ['Faster checkout', 'Accurate stock', 'Less manual order handling'],
    benefits: ['Increase conversion', 'Keep inventory accurate'],
    useCases: ['Boutique brand', 'Growing retailer'],
    web: {
      description: 'Storefront and merchandising back office.',
      features: [
        ['Product catalog', 'Variants, collections and search.'],
        ['Fast checkout', 'Streamlined payment flow.'],
        ['Inventory sync', 'Stock updates as orders arrive.'],
        ['Order management', 'Fulfilment status in one place.'],
      ],
      modules: ['Catalog', 'Checkout', 'Inventory', 'Orders'],
      tech: ['nextjs', 'nestjs', 'postgresql', 'cloudflare'],
    },
    mobile: {
      description: 'A shopping app with wishlists and order tracking.',
      features: [
        ['Wishlist', 'Save products for later.'],
        ['Order tracking', 'Follow every delivery.'],
        ['Push offers', 'Timely, relevant notifications.'],
      ],
      modules: ['Browse', 'Cart', 'Orders'],
      tech: ['react-native', 'typescript'],
    },
    related: ['tableflow'],
  },
  {
    slug: 'fitcore',
    name: 'FitCore',
    badge: 'Gym Management',
    label: 'INTERACTIVE_CONCEPT',
    category: 'fitness',
    industry: 'fitness',
    short: 'Memberships, class booking and engagement for gyms.',
    overview: 'A mobile-first concept for studios that want members to book and stay engaged.',
    problem: 'Class booking by message and manual membership tracking.',
    solution: 'A member app for classes and check-ins, backed by simple membership management.',
    users: 'Gym owners, trainers and members.',
    outcomes: ['Easier bookings', 'Predictable renewals', 'Better member engagement'],
    benefits: ['Improve retention', 'Reduce admin work'],
    useCases: ['Boutique studio', 'Multi-location gym'],
    mobile: {
      description: 'A member app for booking classes, check-ins and progress.',
      features: [
        ['Class booking', 'Reserve a spot in seconds.'],
        ['QR check-in', 'Fast entry at the door.'],
        ['Progress tracking', 'Workouts and milestones.'],
        ['Membership', 'Plans, renewals and payments.'],
      ],
      modules: ['Classes', 'Check-in', 'Membership', 'Progress'],
      tech: ['react-native', 'typescript', 'nestjs'],
    },
    related: ['clinicos'],
  },
  {
    slug: 'learnova',
    name: 'Learnova',
    badge: 'LMS',
    label: 'PROTOTYPE',
    category: 'education',
    industry: 'edtech-lms',
    short: 'A learning platform with courses, progress and subscriptions.',
    overview: 'A learning platform concept with structured content and clear learner progress.',
    problem: 'Course content and learner progress are hard to manage at scale.',
    solution: 'A scalable platform for courses, lessons, quizzes and subscriptions, with a companion learner app.',
    users: 'Course creators, learners and administrators.',
    outcomes: ['Engaging learning experience', 'Clear progress insight', 'Recurring revenue'],
    benefits: ['Scale content delivery', 'Track learner progress'],
    useCases: ['Training company', 'Online academy'],
    web: {
      description: 'Course builder and learner portal.',
      features: [
        ['Course builder', 'Lessons, media and quizzes.'],
        ['Progress tracking', 'Completion and scores per learner.'],
        ['Subscriptions', 'Plans and access control.'],
      ],
      modules: ['Courses', 'Learners', 'Assessments', 'Billing'],
      tech: ['nextjs', 'nestjs', 'postgresql'],
    },
    mobile: {
      description: 'A learner app for lessons on the go.',
      features: [
        ['Offline lessons', 'Keep learning without a connection.'],
        ['Streaks and reminders', 'Gentle nudges to stay on track.'],
      ],
      modules: ['Lessons', 'Progress'],
      tech: ['react-native', 'typescript'],
    },
    related: ['educore'],
  },
  {
    slug: 'flowdesk',
    name: 'FlowDesk',
    badge: 'CRM / SaaS',
    label: 'PROTOTYPE',
    category: 'saas',
    industry: 'business-operations',
    short: 'A lightweight CRM and workflow tool for growing teams.',
    overview: 'A SaaS concept that brings contacts, deals and tasks into one workspace.',
    problem: 'Customer data and follow-ups are scattered across spreadsheets and inboxes.',
    solution: 'A focused workspace for pipelines, tasks and reporting.',
    users: 'Sales and operations teams.',
    outcomes: ['No missed follow-ups', 'Clear pipeline visibility', 'Less manual reporting'],
    benefits: ['Single source of truth', 'Faster decisions'],
    useCases: ['Small team', 'Growing company'],
    web: {
      description: 'Pipeline, contacts and task workspace.',
      features: [
        ['Deal pipeline', 'Visual stages and forecasts.'],
        ['Contacts', 'Complete interaction history.'],
        ['Tasks and reminders', 'Never miss a follow-up.'],
        ['Reports', 'Pipeline and activity insight.'],
      ],
      modules: ['Contacts', 'Deals', 'Tasks', 'Reports'],
      tech: ['nextjs', 'nestjs', 'postgresql', 'redis'],
    },
    related: ['assistiq'],
  },
  {
    slug: 'assistiq',
    name: 'AssistIQ',
    badge: 'AI Business Platform',
    label: 'INTERACTIVE_CONCEPT',
    category: 'ai',
    industry: 'ai-solutions',
    short: 'An AI assistant that answers from your own business content.',
    overview: 'A concept for teams that want accurate answers from their documents, with human handoff.',
    problem: 'Staff spend hours answering the same questions and searching documents.',
    solution: 'An assistant grounded in your content, with guardrails, analytics and handoff to your team.',
    users: 'Support teams and internal staff.',
    outcomes: ['Faster answers', 'Fewer repetitive tickets', 'Measurable quality'],
    benefits: ['Save support time', 'Make knowledge searchable'],
    useCases: ['Customer support', 'Internal helpdesk'],
    web: {
      description: 'Admin console to manage knowledge sources and review conversations.',
      features: [
        ['Knowledge sources', 'Connect documents and pages.'],
        ['Answer review', 'Inspect and improve responses.'],
        ['Human handoff', 'Escalate to your team.'],
      ],
      modules: ['Knowledge', 'Conversations', 'Analytics'],
      tech: ['nextjs', 'python', 'openai-api', 'postgresql'],
    },
    related: ['flowdesk'],
  },
];

export async function seedDemos(prisma: PrismaClient): Promise<void> {
  if ((await prisma.demoCategory.count()) === 0) {
    await prisma.demoCategory.createMany({ data: CATEGORIES.map(([slug, name], displayOrder) => ({ slug, name, displayOrder })) });
  }
  if ((await prisma.demo.count()) > 0) return;

  const pick = (slugs: string[]) => slugs.map((slug) => ({ slug }));
  for (const [displayOrder, d] of DEMOS.entries()) {
    const platform = (type: 'WEBSITE' | 'MOBILE', p?: PlatformSeed) => ({
      type,
      enabled: Boolean(p),
      description: p?.description,
      android: type === 'MOBILE' && Boolean(p),
      ios: type === 'MOBILE' && Boolean(p),
      technologies: { connect: pick(p?.tech ?? []) },
    });
    const items = [
      ...(d.web ? [{ platform: 'WEBSITE' as const, p: d.web }] : []),
      ...(d.mobile ? [{ platform: 'MOBILE' as const, p: d.mobile }] : []),
    ];

    await prisma.demo.create({
      data: {
        slug: d.slug,
        name: d.name,
        badge: d.badge,
        statusLabel: d.label,
        shortDescription: d.short,
        fullDescription: d.overview,
        problem: d.problem,
        solution: d.solution,
        targetUsers: d.users,
        outcomes: d.outcomes,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        featured: displayOrder < 3,
        displayOrder,
        ctaLabel: 'Discuss this solution',
        ctaUrl: '/contact',
        category: { connect: { slug: d.category } },
        industry: { connect: { slug: d.industry } },
        platforms: { create: [platform('WEBSITE', d.web), platform('MOBILE', d.mobile)] },
        features: {
          create: items.flatMap(({ platform: pf, p }) => p.features.map(([title, description], i) => ({ platform: pf, title, description, displayOrder: i, featured: i === 0 }))),
        },
        modules: { create: items.flatMap(({ platform: pf, p }) => p.modules.map((title, i) => ({ platform: pf, title, displayOrder: i }))) },
        points: {
          create: [
            ...d.benefits.map((title, i) => ({ type: 'BENEFIT' as const, title, displayOrder: i })),
            ...d.useCases.map((title, i) => ({ type: 'USE_CASE' as const, title, displayOrder: i })),
          ],
        },
      },
    });
  }

  for (const d of DEMOS) {
    await prisma.demo.update({ where: { slug: d.slug }, data: { related: { connect: pick(d.related) } } });
  }
}
