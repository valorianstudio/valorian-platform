import type { PrismaClient } from '@prisma/client';

type Platform = 'WEBSITE' | 'MOBILE' | 'BOTH';

const TYPES: [name: string, platform: Platform, base: number, weeks: number, description: string][] = [
  ['Website', 'WEBSITE', 35000, 3, 'A professional marketing or business website.'],
  ['Web Application', 'WEBSITE', 90000, 8, 'A custom web app with accounts, dashboards and workflows.'],
  ['Mobile App', 'MOBILE', 120000, 10, 'An iOS and Android app backed by an API.'],
  ['Website + Mobile App', 'BOTH', 190000, 14, 'A web platform and companion mobile app delivered together.'],
  ['SaaS Platform', 'WEBSITE', 180000, 14, 'A multi-tenant subscription product.'],
  ['System Upgrade', 'WEBSITE', 70000, 6, 'Modernise or extend an existing system.'],
];

const CATEGORIES = ['Core Pages', 'User Management', 'Dashboard', 'Business Features', 'Mobile Features', 'AI Features'];

type Feature = {
  name: string;
  category: string;
  web: number | null;
  mobile: number | null;
  both?: number;
  days: number;
  required?: boolean;
  recommended?: boolean;
  description?: string;
  industries?: string[];
};

const FEATURES: Feature[] = [
  { name: 'Homepage', category: 'Core Pages', web: 6000, mobile: null, days: 2, required: true, description: 'A polished landing page.' },
  { name: 'About Page', category: 'Core Pages', web: 3000, mobile: null, days: 1 },
  { name: 'Service Pages', category: 'Core Pages', web: 8000, mobile: null, days: 3 },
  { name: 'Contact Form', category: 'Core Pages', web: 3500, mobile: null, days: 1, recommended: true },
  { name: 'Blog', category: 'Core Pages', web: 15000, mobile: null, days: 5 },
  { name: 'SEO Setup', category: 'Core Pages', web: 10000, mobile: null, days: 3, recommended: true },
  { name: 'Authentication', category: 'User Management', web: 12000, mobile: 15000, days: 4, recommended: true, description: 'Sign up, login and password reset.' },
  { name: 'User Roles & Permissions', category: 'User Management', web: 15000, mobile: 18000, days: 5 },
  { name: 'User Profile', category: 'User Management', web: 6000, mobile: 8000, days: 2 },
  { name: 'Admin Dashboard', category: 'Dashboard', web: 25000, mobile: null, days: 8, recommended: true },
  { name: 'Reports & Exports', category: 'Dashboard', web: 18000, mobile: 20000, days: 6 },
  { name: 'Notifications', category: 'Dashboard', web: 8000, mobile: 12000, days: 3 },
  { name: 'Analytics Dashboard', category: 'Dashboard', web: 22000, mobile: 25000, days: 6 },
  { name: 'Appointment Booking', category: 'Business Features', web: 20000, mobile: 25000, both: 40000, days: 7, industries: ['healthcare', 'fitness', 'restaurant-hospitality'], description: 'Online scheduling with reminders.' },
  { name: 'Customer & Patient Management', category: 'Business Features', web: 18000, mobile: 20000, days: 6, industries: ['healthcare', 'business-operations'] },
  { name: 'Billing & Invoicing', category: 'Business Features', web: 22000, mobile: 25000, days: 7, industries: ['healthcare', 'education', 'business-operations'] },
  { name: 'Inventory Management', category: 'Business Features', web: 25000, mobile: 28000, days: 8, industries: ['retail-ecommerce', 'restaurant-hospitality'] },
  { name: 'Online Payments', category: 'Business Features', web: 15000, mobile: 18000, days: 5, industries: ['retail-ecommerce', 'education', 'fitness'] },
  { name: 'Multi-language Support', category: 'Business Features', web: 10000, mobile: 12000, days: 4 },
  { name: 'Search & Filters', category: 'Business Features', web: 8000, mobile: 9000, days: 3 },
  { name: 'Course & Content Management', category: 'Business Features', web: 24000, mobile: 26000, days: 8, industries: ['education', 'edtech-lms'] },
  { name: 'Push Notifications', category: 'Mobile Features', web: null, mobile: 10000, days: 3, recommended: true },
  { name: 'Offline Support', category: 'Mobile Features', web: null, mobile: 18000, days: 6 },
  { name: 'Biometric Login', category: 'Mobile Features', web: null, mobile: 6000, days: 2 },
  { name: 'App Store Publishing', category: 'Mobile Features', web: null, mobile: 12000, days: 3, recommended: true },
  { name: 'AI Chat Assistant', category: 'AI Features', web: 30000, mobile: 32000, days: 10, industries: ['ai-solutions'] },
  { name: 'AI Recommendations', category: 'AI Features', web: 35000, mobile: 38000, days: 10, industries: ['ai-solutions', 'retail-ecommerce'] },
];

const INTEGRATIONS: [name: string, web: number | null, mobile: number | null, description: string][] = [
  ['Payment Gateway', 15000, 18000, 'Cards and mobile wallets through a payment provider.'],
  ['SMS', 8000, 10000, 'Transactional and reminder text messages.'],
  ['Email Automation', 10000, 10000, 'Automated transactional and campaign emails.'],
  ['WhatsApp', 12000, 12000, 'WhatsApp messaging and notifications.'],
  ['Google Maps', 8000, 10000, 'Maps, location search and directions.'],
  ['AI API', 20000, 20000, 'Connect a large language model or other AI service.'],
  ['Third-party API', 15000, 15000, 'Integrate an external system or service.'],
];

const COMPLEXITY: [name: string, multiplier: number, factor: number, description: string][] = [
  ['Basic', 1, 1, 'Standard business solution with proven patterns.'],
  ['Professional', 1.25, 1.3, 'Custom workflows and dashboards.'],
  ['Advanced', 1.6, 1.7, 'Large-scale systems, automation, AI and deep integrations.'],
];

const RULES: ['SCALE' | 'URGENCY', key: string, label: string, multiplier: number, factor: number][] = [
  ['SCALE', 'under-100', 'Under 100 users', 1, 1],
  ['SCALE', '100-1000', '100 – 1,000 users', 1.1, 1.05],
  ['SCALE', '1000-10000', '1,000 – 10,000 users', 1.25, 1.15],
  ['SCALE', '10000-plus', '10,000+ users', 1.5, 1.3],
  ['URGENCY', 'flexible', 'Flexible timeline', 0.95, 1.2],
  ['URGENCY', 'normal', 'Normal timeline', 1, 1],
  ['URGENCY', 'urgent', 'Urgent timeline', 1.25, 0.75],
];

const slug = (name: string) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const DEMO_FEATURES: Record<string, string[]> = {
  clinicos: ['Appointment Booking', 'Customer & Patient Management', 'Billing & Invoicing', 'Analytics Dashboard', 'Authentication'],
  educore: ['Customer & Patient Management', 'Billing & Invoicing', 'Notifications', 'Admin Dashboard', 'Authentication'],
  tableflow: ['Appointment Booking', 'Inventory Management', 'Reports & Exports', 'Authentication'],
  modeva: ['Online Payments', 'Inventory Management', 'Search & Filters', 'Authentication'],
  fitcore: ['Appointment Booking', 'Online Payments', 'Push Notifications', 'User Profile', 'Authentication'],
  learnova: ['Course & Content Management', 'Online Payments', 'Notifications', 'Authentication'],
  flowdesk: ['Customer & Patient Management', 'Reports & Exports', 'Notifications', 'User Roles & Permissions', 'Authentication'],
  assistiq: ['AI Chat Assistant', 'Analytics Dashboard', 'Admin Dashboard', 'Authentication'],
};

/** Runs once: when estimator settings do not exist yet. Never overwrites admin edits. */
export async function seedEstimator(prisma: PrismaClient): Promise<void> {
  if (await prisma.estimatorSettings.findUnique({ where: { id: 'estimator' } })) return;
  await prisma.estimatorSettings.create({ data: { id: 'estimator' } });

  await prisma.estimatorProjectType.createMany({
    data: TYPES.map(([name, platform, basePrice, baseWeeks, description], displayOrder) => ({ name, slug: slug(name), platform, basePrice, baseWeeks, description, displayOrder })),
  });
  await prisma.estimatorCategory.createMany({ data: CATEGORIES.map((name, displayOrder) => ({ name, slug: slug(name), displayOrder })) });
  const categories = new Map((await prisma.estimatorCategory.findMany()).map((c) => [c.name, c.id]));

  for (const [displayOrder, f] of FEATURES.entries()) {
    await prisma.estimatorFeature.create({
      data: {
        name: f.name,
        slug: slug(f.name),
        description: f.description,
        categoryId: categories.get(f.category),
        websitePrice: f.web,
        mobilePrice: f.mobile,
        bothPrice: f.both ?? null,
        effortDays: f.days,
        required: f.required ?? false,
        recommended: f.recommended ?? false,
        displayOrder,
        industries: { connect: (f.industries ?? []).map((s) => ({ slug: s })) },
      },
    });
  }
  await prisma.estimatorIntegration.createMany({
    data: INTEGRATIONS.map(([name, websitePrice, mobilePrice, description], displayOrder) => ({ name, slug: slug(name), websitePrice, mobilePrice, description, displayOrder })),
  });
  await prisma.estimatorComplexity.createMany({
    data: COMPLEXITY.map(([name, multiplier, timelineFactor, description], displayOrder) => ({ name, slug: slug(name), multiplier, timelineFactor, description, displayOrder })),
  });
  await prisma.estimatorPricingRule.createMany({
    data: RULES.map(([kind, key, label, multiplier, timelineFactor], displayOrder) => ({ kind, key, label, multiplier, timelineFactor, displayOrder })),
  });

  for (const [demo, names] of Object.entries(DEMO_FEATURES)) {
    const record = await prisma.demo.findUnique({ where: { slug: demo }, select: { id: true } });
    if (record) await prisma.demo.update({ where: { id: record.id }, data: { estimatorFeatures: { connect: names.map((name) => ({ slug: slug(name) })) } } });
  }

  const SERVICE_TYPES: Record<string, string> = {
    'saas-development': 'saas-platform',
    'web-application-development': 'web-application',
    'mobile-app-development': 'mobile-app',
    'business-websites': 'website',
    'maintenance-and-modernization': 'system-upgrade',
    'custom-software-development': 'web-application',
    'ai-integration': 'web-application',
    'backend-and-api-development': 'web-application',
    'ecommerce-development': 'web-application',
    'business-automation': 'web-application',
  };
  for (const [service, type] of Object.entries(SERVICE_TYPES)) {
    await prisma.service.updateMany({ where: { slug: service, estimatorTypeId: null }, data: { estimatorTypeId: (await prisma.estimatorProjectType.findUnique({ where: { slug: type } }))?.id } });
  }

  const nav = await prisma.navigationItem.count({ where: { url: '/estimate' } });
  if (nav === 0) {
    const last = await prisma.navigationItem.findFirst({ where: { location: 'HEADER' }, orderBy: { displayOrder: 'desc' } });
    await prisma.navigationItem.createMany({
      data: [
        { label: 'Estimate', url: '/estimate', location: 'HEADER', displayOrder: (last?.displayOrder ?? 0) + 1 },
        { label: 'Estimate', url: '/estimate', location: 'FOOTER', displayOrder: 20 },
      ],
    });
  }
}
