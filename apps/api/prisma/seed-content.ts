import type { Prisma, PrismaClient } from '@prisma/client';

type Tech = [slug: string, name: string, category: Prisma.TechnologyCreateInput['category'], featured: boolean];

const TECHNOLOGIES: Tech[] = [
  ['nextjs', 'Next.js', 'FRONTEND', true],
  ['react', 'React', 'FRONTEND', true],
  ['typescript', 'TypeScript', 'FRONTEND', true],
  ['tailwind-css', 'Tailwind CSS', 'FRONTEND', false],
  ['nestjs', 'NestJS', 'BACKEND', true],
  ['nodejs', 'Node.js', 'BACKEND', true],
  ['python', 'Python', 'BACKEND', false],
  ['postgresql', 'PostgreSQL', 'DATABASE', true],
  ['prisma', 'Prisma', 'DATABASE', true],
  ['redis', 'Redis', 'DATABASE', false],
  ['docker', 'Docker', 'DEVOPS', true],
  ['github-actions', 'GitHub Actions', 'DEVOPS', false],
  ['aws', 'AWS', 'INFRASTRUCTURE', true],
  ['cloudflare', 'Cloudflare', 'INFRASTRUCTURE', false],
  ['react-native', 'React Native', 'MOBILE', true],
  ['flutter', 'Flutter', 'MOBILE', false],
  ['openai-api', 'LLM APIs', 'AI', true],
];

type Feature = { title: string; description: string };
interface ServiceSeed {
  slug: string;
  title: string;
  icon: string;
  short: string;
  description: string;
  features: Feature[];
  benefits: string[];
  tech: string[];
  featured: boolean;
}

const SERVICES: ServiceSeed[] = [
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    icon: 'code',
    short: 'Tailored systems that fit how your business actually operates.',
    description:
      'Off-the-shelf tools rarely match the way your team works. We design and build software around your real workflows, so your people spend time on the business instead of working around the tools.',
    features: [
      { title: 'Workflow-first design', description: 'We model your process before writing code, so the software fits the work.' },
      { title: 'Clean, maintainable code', description: 'Typed, tested codebases your team or ours can extend for years.' },
      { title: 'Integrations', description: 'Connect payments, CRMs, ERPs and internal systems into one flow.' },
    ],
    benefits: ['Software that fits your process', 'Full ownership of your codebase', 'Room to grow without a rewrite'],
    tech: ['typescript', 'nestjs', 'postgresql', 'nextjs'],
    featured: true,
  },
  {
    slug: 'web-application-development',
    title: 'Web Application Development',
    icon: 'globe',
    short: 'Fast, accessible web apps built with modern frameworks.',
    description:
      'From customer portals to internal dashboards, we build responsive web applications that load quickly, work on every device and stay pleasant to use as they grow.',
    features: [
      { title: 'Performance by default', description: 'Server rendering, caching and lean bundles keep pages fast.' },
      { title: 'Accessible interfaces', description: 'Semantic, keyboard-friendly UI that works for everyone.' },
      { title: 'SEO-ready', description: 'Metadata, sitemaps and clean markup built in from day one.' },
    ],
    benefits: ['Quick load times on any device', 'Consistent, polished interface', 'Search-friendly architecture'],
    tech: ['nextjs', 'react', 'typescript', 'tailwind-css'],
    featured: true,
  },
  {
    slug: 'saas-development',
    title: 'SaaS Development',
    icon: 'layers',
    short: 'Multi-tenant products with billing, roles and room to scale.',
    description:
      'We take SaaS ideas from first release to a product that can onboard customers, manage subscriptions and keep growing without architectural rework.',
    features: [
      { title: 'Multi-tenant architecture', description: 'Isolated customer data and sensible tenancy boundaries.' },
      { title: 'Subscriptions & billing', description: 'Plans, trials and payments integrated cleanly.' },
      { title: 'Roles & permissions', description: 'Access control that grows with your customers.' },
    ],
    benefits: ['Launch an MVP quickly', 'Architecture ready for growth', 'Operational visibility from day one'],
    tech: ['nextjs', 'nestjs', 'postgresql', 'aws'],
    featured: true,
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    icon: 'smartphone',
    short: 'Polished iOS and Android apps backed by dependable APIs.',
    description:
      'We build mobile apps that feel native, perform smoothly and connect securely to the backend systems that power your business.',
    features: [
      { title: 'Cross-platform delivery', description: 'One codebase for iOS and Android where it makes sense.' },
      { title: 'Offline-friendly', description: 'Thoughtful handling of slow or unreliable connections.' },
      { title: 'Store-ready', description: 'Help with builds, review requirements and release.' },
    ],
    benefits: ['Consistent experience across devices', 'Faster time to market', 'Shared backend with your web product'],
    tech: ['react-native', 'flutter', 'typescript', 'nestjs'],
    featured: true,
  },
  {
    slug: 'ai-integration',
    title: 'AI Integration',
    icon: 'bot',
    short: 'Practical AI features and assistants woven into your workflows.',
    description:
      'We add AI where it solves a real problem: assistants that answer from your own content, automated classification, summarisation and search, with sensible guardrails.',
    features: [
      { title: 'Assistants on your content', description: 'Answers grounded in your documents and data.' },
      { title: 'Workflow automation', description: 'Remove repetitive review and data-entry work.' },
      { title: 'Guardrails & evaluation', description: 'Predictable behaviour and a clear way to measure quality.' },
    ],
    benefits: ['Save time on repetitive work', 'Better answers for customers and staff', 'Costs and quality you can monitor'],
    tech: ['openai-api', 'python', 'typescript', 'postgresql'],
    featured: true,
  },
  {
    slug: 'backend-and-api-development',
    title: 'Backend & API Development',
    icon: 'server',
    short: 'Secure, well-documented services that stay fast under load.',
    description:
      'The backend is the foundation of your product. We design APIs and services that are secure, observable and straightforward for other teams to build on.',
    features: [
      { title: 'API design', description: 'Consistent, versioned, well-documented endpoints.' },
      { title: 'Data modelling', description: 'Relational schemas that stay clean as features grow.' },
      { title: 'Security & reliability', description: 'Authentication, validation, rate limiting and monitoring.' },
    ],
    benefits: ['A dependable foundation', 'Easier integrations', 'Predictable performance'],
    tech: ['nestjs', 'nodejs', 'postgresql', 'redis'],
    featured: true,
  },
  {
    slug: 'ecommerce-development',
    title: 'E-commerce Development',
    icon: 'shopping-cart',
    short: 'Storefronts, catalogs and checkout built for conversion.',
    description:
      'We build fast, flexible online stores and the back-office systems behind them: catalogs, payments, inventory and fulfilment workflows.',
    features: [
      { title: 'Fast storefronts', description: 'Quick pages that keep shoppers moving to checkout.' },
      { title: 'Payments & inventory', description: 'Secure payments with stock and order management.' },
      { title: 'Custom workflows', description: 'Pricing, bundles and fulfilment rules that match your business.' },
    ],
    benefits: ['Smoother checkout experience', 'Control over your own platform', 'Integrations with your operations'],
    tech: ['nextjs', 'nestjs', 'postgresql', 'cloudflare'],
    featured: false,
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    icon: 'workflow',
    short: 'Internal tools and automations that remove manual work.',
    description:
      'We replace spreadsheets and repeated manual steps with reliable internal tools, scheduled jobs and integrations that keep your operations moving.',
    features: [
      { title: 'Internal dashboards', description: 'One place for your team to see and act on data.' },
      { title: 'Process automation', description: 'Approvals, notifications and reports handled automatically.' },
      { title: 'System integrations', description: 'Connect the tools you already use.' },
    ],
    benefits: ['Fewer manual errors', 'Time back for your team', 'Clear visibility into operations'],
    tech: ['typescript', 'nodejs', 'postgresql', 'docker'],
    featured: false,
  },
  {
    slug: 'business-websites',
    title: 'WordPress & Business Websites',
    icon: 'monitor',
    short: 'Professional, easy-to-manage websites for growing businesses.',
    description:
      'A clear, fast and credible website that your team can update without a developer, built on the platform that suits your needs.',
    features: [
      { title: 'Clear messaging', description: 'Structure and copy that explain what you do quickly.' },
      { title: 'Easy content updates', description: 'Edit pages yourself with a simple admin.' },
      { title: 'Fast and secure', description: 'Optimised hosting, caching and sensible security.' },
    ],
    benefits: ['A credible online presence', 'Edit content without code', 'Good search visibility'],
    tech: ['nextjs', 'react', 'tailwind-css', 'cloudflare'],
    featured: false,
  },
  {
    slug: 'maintenance-and-modernization',
    title: 'Maintenance & Modernization',
    icon: 'wrench',
    short: 'Keep existing software healthy, secure and ready to evolve.',
    description:
      'We take over, stabilise and modernise existing applications: upgrading frameworks, improving performance and paying down technical debt without disrupting your users.',
    features: [
      { title: 'Audit & stabilise', description: 'Understand the current state and fix the riskiest issues first.' },
      { title: 'Incremental modernisation', description: 'Upgrade piece by piece instead of a risky rewrite.' },
      { title: 'Ongoing support', description: 'Monitoring, updates and a dependable point of contact.' },
    ],
    benefits: ['Reduced operational risk', 'Better performance', 'A path forward for ageing systems'],
    tech: ['typescript', 'docker', 'github-actions', 'postgresql'],
    featured: false,
  },
];

const INDUSTRIES: { slug: string; name: string; icon: string; short: string; overview: string; problems: string[]; approach: string; benefits: string[]; services: string[]; tech: string[]; featured: boolean }[] = [
  {
    slug: 'education',
    name: 'Education',
    icon: 'graduation-cap',
    short: 'Digital tools for schools, institutes and training providers.',
    overview: 'Educational organisations need software that is simple for staff, students and parents alike, and dependable on busy days like admissions and exams.',
    problems: ['Paper-based or spreadsheet administration', 'Disconnected systems for admissions, fees and records', 'Limited visibility for parents and staff'],
    approach: 'We map your academic and administrative workflows, then build focused tools for admissions, records, communication and reporting that work on any device.',
    benefits: ['Less administrative overhead', 'Clear communication with families', 'Accurate, accessible records'],
    services: ['web-application-development', 'custom-software-development'],
    tech: ['nextjs', 'nestjs', 'postgresql'],
    featured: true,
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    icon: 'heart-pulse',
    short: 'Careful, secure software for clinics and care providers.',
    overview: 'Healthcare software demands reliability, privacy and clarity. We build tools that reduce admin burden so staff can focus on patients.',
    problems: ['Manual appointment and record handling', 'Sensitive data that must stay protected', 'Fragmented tools across departments'],
    approach: 'We start with security and data handling, then design scheduling, records and communication workflows that are simple under pressure.',
    benefits: ['Smoother scheduling', 'Stronger data protection', 'Less duplicated effort'],
    services: ['custom-software-development', 'backend-and-api-development'],
    tech: ['nestjs', 'postgresql', 'aws'],
    featured: false,
  },
  {
    slug: 'restaurant-hospitality',
    name: 'Restaurant & Hospitality',
    icon: 'utensils',
    short: 'Ordering, reservations and operations for hospitality teams.',
    overview: 'Hospitality runs on speed and detail. We build ordering, booking and back-of-house tools that keep service smooth and customers coming back.',
    problems: ['Missed or double-booked reservations', 'Slow, error-prone order handling', 'Little insight into what sells'],
    approach: 'We design around the service floor, with fast interfaces for staff and simple booking and ordering for guests.',
    benefits: ['Fewer service errors', 'Direct customer ordering', 'Clear sales insight'],
    services: ['web-application-development', 'mobile-app-development'],
    tech: ['nextjs', 'react-native', 'postgresql'],
    featured: true,
  },
  {
    slug: 'retail-ecommerce',
    name: 'Retail & E-commerce',
    icon: 'store',
    short: 'Online stores and operations for modern retailers.',
    overview: 'Retailers need to sell consistently across channels and keep stock accurate. We build storefronts and back-office tools that work together.',
    problems: ['Inventory out of sync across channels', 'Slow storefront and checkout', 'Manual order processing'],
    approach: 'We connect catalog, inventory, payments and fulfilment into one reliable flow, with a storefront tuned for speed.',
    benefits: ['Accurate stock', 'Faster checkout', 'Automated order handling'],
    services: ['ecommerce-development', 'business-automation'],
    tech: ['nextjs', 'nestjs', 'postgresql'],
    featured: true,
  },
  {
    slug: 'fitness',
    name: 'Fitness',
    icon: 'dumbbell',
    short: 'Memberships, scheduling and apps for studios and gyms.',
    overview: 'Fitness businesses grow on retention. We build membership, class booking and engagement tools that members actually enjoy using.',
    problems: ['Manual membership tracking', 'Class booking by message or phone', 'Low member engagement'],
    approach: 'We combine a simple mobile experience for members with an admin that makes plans, classes and payments easy to manage.',
    benefits: ['Easier bookings', 'Predictable recurring revenue', 'Better member experience'],
    services: ['mobile-app-development', 'saas-development'],
    tech: ['react-native', 'nestjs', 'postgresql'],
    featured: false,
  },
  {
    slug: 'edtech-lms',
    name: 'EdTech / LMS',
    icon: 'book-open',
    short: 'Learning platforms, courses and progress tracking.',
    overview: 'Learning products need engaging experiences and solid foundations for content, progress and payments.',
    problems: ['Hard-to-manage course content', 'No clear view of learner progress', 'Platforms that struggle as audiences grow'],
    approach: 'We build scalable learning platforms with structured content, progress tracking and subscriptions designed in from the start.',
    benefits: ['Engaging learning experience', 'Insight into progress', 'Room to scale'],
    services: ['saas-development', 'web-application-development'],
    tech: ['nextjs', 'nestjs', 'postgresql'],
    featured: false,
  },
  {
    slug: 'business-operations',
    name: 'Business Operations',
    icon: 'briefcase',
    short: 'Internal systems that keep operations organised.',
    overview: 'Growing companies outgrow spreadsheets. We build the internal systems that bring approvals, inventory, reporting and teams together.',
    problems: ['Data scattered across spreadsheets', 'Manual approvals and reporting', 'No single source of truth'],
    approach: 'We digitise your key workflows into one system, then automate the repetitive parts and surface the numbers that matter.',
    benefits: ['A single source of truth', 'Less repetitive work', 'Faster decisions'],
    services: ['business-automation', 'custom-software-development'],
    tech: ['typescript', 'nestjs', 'postgresql'],
    featured: true,
  },
  {
    slug: 'ai-solutions',
    name: 'AI Solutions',
    icon: 'sparkles',
    short: 'Applied AI for support, search and automation.',
    overview: 'AI is most useful when it is applied to a specific problem. We help you identify those opportunities and ship them safely.',
    problems: ['Staff buried in repetitive questions', 'Valuable knowledge that is hard to search', 'Uncertainty about where AI actually helps'],
    approach: 'We start with a narrow, measurable use case, build it with guardrails and evaluation, and expand once it proves its value.',
    benefits: ['Faster support and search', 'Reduced manual effort', 'Measurable results'],
    services: ['ai-integration', 'backend-and-api-development'],
    tech: ['openai-api', 'python', 'postgresql'],
    featured: true,
  },
];

const PROCESS = [
  ['Discover', 'Discovery', 'We learn your goals, users and constraints.'],
  ['Define', 'Requirements', 'Scope, priorities and success measures, written down and agreed.'],
  ['Design', 'Design', 'Flows, interfaces and architecture, reviewed early.'],
  ['Build', 'Engineering', 'Iterative engineering with regular working releases.'],
  ['Launch', 'Testing & Launch', 'Tested, monitored deployment to production.'],
  ['Scale', 'Support', 'Ongoing improvement as your product and audience grow.'],
] as const;

const VALUES = [
  ['Scalable engineering', 'gauge', 'Clean architecture and typed codebases that stay maintainable as your product grows.'],
  ['Product-focused thinking', 'lightbulb', 'We question features against user and business value, not just build to a list.'],
  ['Performance first', 'zap', 'Fast load times and smooth interactions, measured and protected from day one.'],
  ['Modern technology', 'cpu', 'Proven, current stacks chosen for your goals rather than for fashion.'],
  ['Reliable delivery', 'shield-check', 'Clear milestones, honest communication and software that ships when we say.'],
] as const;

const FAQS: [string, string, 'GENERAL' | 'DEVELOPMENT' | 'PRICING' | 'PROCESS' | 'SUPPORT', boolean][] = [
  ['What kinds of projects do you take on?', 'We build custom software, web applications, SaaS products, mobile apps, backend systems and AI-powered features. If you are unsure whether your idea fits, just ask.', 'GENERAL', true],
  ['How does a project usually start?', 'We begin with a discovery conversation to understand your goals, users and constraints, then propose a scope, approach and timeline for your review.', 'PROCESS', true],
  ['How do you price projects?', 'Pricing depends on scope and complexity. After discovery we provide a clear estimate, and we prefer working in defined milestones so you always know what to expect.', 'PRICING', true],
  ['Will I own the code?', 'Yes. Unless agreed otherwise, you own the source code and assets we build for you.', 'DEVELOPMENT', false],
  ['Do you offer support after launch?', 'Yes. We can provide monitoring, maintenance and ongoing development so your product keeps improving after release.', 'SUPPORT', true],
  ['Which technologies do you use?', 'We favour modern, well-supported tools such as TypeScript, Next.js, NestJS and PostgreSQL, and choose the stack that best fits your project.', 'DEVELOPMENT', false],
];

const NAV: [string, string, 'HEADER' | 'FOOTER' | 'LEGAL'][] = [
  ['Home', '/', 'HEADER'],
  ['Services', '/services', 'HEADER'],
  ['Solutions', '/solutions', 'HEADER'],
  ['Demos', '/demos', 'HEADER'],
  ['About', '/about', 'HEADER'],
  ['Contact', '/contact', 'HEADER'],
  ['Services', '/services', 'FOOTER'],
  ['Solutions', '/solutions', 'FOOTER'],
  ['Demos', '/demos', 'FOOTER'],
  ['About', '/about', 'FOOTER'],
  ['Contact', '/contact', 'FOOTER'],
  ['Privacy', '/privacy', 'LEGAL'],
  ['Terms', '/terms', 'LEGAL'],
];

const WORK = [
  ['Analytics Dashboard', 'SaaS', 'Real-time metrics, role-based access and exportable reports.'],
  ['Commerce Storefront', 'E-commerce', 'Fast catalog, checkout and inventory sync for growing retailers.'],
  ['AI Support Assistant', 'AI', 'An assistant that answers from your docs and hands off to your team.'],
] as const;

const CTAS = [
  ['start-project', 'Start a Project', '/contact', 'Primary call to action used in the header and across the site.'],
  ['explore-work', 'Explore Our Work', '/demos', 'Secondary call to action for browsing examples.'],
  ['contact', 'Contact Valorian', '/contact', 'General contact call to action.'],
] as const;

const cta = {
  headline: 'Have a product in mind? Let’s build it properly.',
  description: 'Tell us about your project and we’ll come back with a clear, honest plan.',
  primaryLabel: 'Start a Project',
  primaryUrl: '/contact',
};

const SECTIONS: Record<'HOME' | 'ABOUT' | 'SERVICES' | 'SOLUTIONS', [string, Record<string, unknown>][]> = {
  HOME: [
    ['hero', { eyebrow: 'Software Engineering & Digital Product Studio', headline: 'Engineering digital products', highlight: 'built to scale.', description: 'Valorian Studio designs and builds custom software, web applications, SaaS platforms, mobile apps and AI-powered solutions for businesses that plan to grow.', primaryLabel: 'Start a Project', primaryUrl: '/contact', secondaryLabel: 'Explore Our Work', secondaryUrl: '/demos' }],
    ['capabilities', { eyebrow: 'What we build', title: 'Software for every stage of your business', subtitle: 'From first release to platform scale, one team covering product, design and engineering.' }],
    ['why', { eyebrow: 'Why Valorian', title: 'Engineering rigor, with product sense', subtitle: 'The principles behind every product we build.' }],
    ['featuredWork', { eyebrow: 'Featured work', title: 'Product experiences that speak for themselves', subtitle: 'A preview of the kind of products we deliver. Interactive live demos are coming soon.' }],
    ['process', { eyebrow: 'How we work', title: 'A clear path from idea to scale', subtitle: 'A simple, transparent process that keeps you informed at every step.' }],
    ['technology', { eyebrow: 'Technology', title: 'Modern tools, chosen with care', subtitle: 'A proven stack that keeps products fast, secure and maintainable.' }],
    ['cta', cta],
  ],
  ABOUT: [
    ['hero', { eyebrow: 'About', title: 'A studio that cares how software is built', description: 'We are engineers and product thinkers who treat every project as if it were our own product.' }],
    ['story', { eyebrow: 'Our story', title: 'Built around craft and clarity', body: 'Valorian Studio is a software engineering and digital product studio. We work with businesses that want dependable, well-designed software and a team that communicates plainly.\n\nWe keep our process simple: understand the problem, design the right solution, build it carefully and support it after launch.' }],
    ['purpose', { missionTitle: 'Mission', mission: 'To help businesses turn ideas into reliable, well-crafted software products.', visionTitle: 'Vision', vision: 'To be a trusted engineering partner known for quality, clarity and long-term thinking.' }],
    ['values', { title: 'What we value', items: [{ title: 'Craft', description: 'Clean code, careful design and attention to detail in everything we ship.' }, { title: 'Clarity', description: 'Plain-language communication and honest timelines from day one.' }, { title: 'Partnership', description: 'We stay invested after launch, helping your product grow.' }] }],
    ['philosophy', { title: 'Engineering philosophy', body: 'Good software is simple to use, simple to change and safe to run. We favour proven tools, small steps and measurable results over complexity for its own sake.', points: ['Typed, tested, maintainable code', 'Performance and accessibility from the start', 'Security as a baseline, not an add-on', 'Documentation and handover you can rely on'] }],
    ['stats', { title: 'At a glance', items: [] }],
    ['cta', cta],
  ],
  SERVICES: [
    ['hero', { eyebrow: 'Services', title: 'Full-cycle software engineering', description: 'Strategy, design and engineering under one roof, from a first prototype to a platform serving thousands.' }],
    ['cta', cta],
  ],
  SOLUTIONS: [
    ['hero', { eyebrow: 'Solutions', title: 'Solutions shaped around your industry', description: 'Proven building blocks combined with custom engineering, so you launch faster without compromising on fit.' }],
    ['cta', cta],
  ],
};

export async function seedContent(prisma: PrismaClient): Promise<void> {
  for (const [key, label, url, description] of CTAS) {
    await prisma.cta.upsert({ where: { key }, update: {}, create: { key, label, url, description } });
  }

  for (const [pageKey, sections] of Object.entries(SECTIONS) as [keyof typeof SECTIONS, [string, Record<string, unknown>][]][]) {
    await prisma.page.upsert({ where: { key: pageKey }, update: {}, create: { key: pageKey } });
    for (const [index, [key, content]] of sections.entries()) {
      await prisma.pageSection.upsert({
        where: { pageKey_key: { pageKey, key } },
        update: {},
        create: { pageKey, key, displayOrder: index, content: content as Prisma.InputJsonObject },
      });
    }
  }

  if ((await prisma.technology.count()) === 0) {
    await prisma.technology.createMany({
      data: TECHNOLOGIES.map(([slug, name, category, featured], displayOrder) => ({ slug, name, category, featured, displayOrder })),
    });
  }

  if ((await prisma.service.count()) === 0) {
    for (const [displayOrder, s] of SERVICES.entries()) {
      await prisma.service.create({
        data: {
          slug: s.slug,
          title: s.title,
          icon: s.icon,
          shortDescription: s.short,
          description: s.description,
          features: s.features,
          benefits: s.benefits,
          featured: s.featured,
          status: 'PUBLISHED',
          displayOrder,
          technologies: { connect: s.tech.map((slug) => ({ slug })) },
        },
      });
    }
  }

  if ((await prisma.industry.count()) === 0) {
    for (const [displayOrder, i] of INDUSTRIES.entries()) {
      await prisma.industry.create({
        data: {
          slug: i.slug,
          name: i.name,
          icon: i.icon,
          shortDescription: i.short,
          overview: i.overview,
          problems: i.problems,
          approach: i.approach,
          benefits: i.benefits,
          featured: i.featured,
          status: 'PUBLISHED',
          displayOrder,
          services: { connect: i.services.map((slug) => ({ slug })) },
          technologies: { connect: i.tech.map((slug) => ({ slug })) },
        },
      });
    }
  }

  if ((await prisma.processStep.count()) === 0) {
    await prisma.processStep.createMany({ data: PROCESS.map(([title, label, description], displayOrder) => ({ title, label, description, displayOrder })) });
  }
  if ((await prisma.valueProp.count()) === 0) {
    await prisma.valueProp.createMany({ data: VALUES.map(([title, icon, description], displayOrder) => ({ title, icon, description, displayOrder })) });
  }
  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({ data: FAQS.map(([question, answer, category, featured], displayOrder) => ({ question, answer, category, featured, displayOrder })) });
  }
  if ((await prisma.navigationItem.count()) === 0) {
    await prisma.navigationItem.createMany({ data: NAV.map(([label, url, location], displayOrder) => ({ label, url, location, displayOrder })) });
  }
  if ((await prisma.featuredWork.count()) === 0) {
    await prisma.featuredWork.createMany({ data: WORK.map(([title, category, description], displayOrder) => ({ title, category, description, displayOrder })) });
  }
}
