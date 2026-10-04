/**
 * The technology ecosystem shown on the website: static content, rendered on the server with no API call. Each entry explains
 * the tool in plain language, because most visitors are decision makers rather than engineers.
 */

export type TechCategoryId = 'frontend' | 'backend' | 'database' | 'cloud' | 'devops' | 'mobile' | 'ai' | 'infrastructure';

export interface CatalogTech {
  slug: string;
  name: string;
  category: TechCategoryId;
  /** What it is and why a client should care, in one or two plain sentences. */
  summary: string;
  /** Short "good for" phrase shown as a tag on the card. */
  bestFor: string;
}

export interface TechCategoryInfo {
  id: TechCategoryId;
  label: string;
  blurb: string;
}

export const TECH_CATEGORIES: TechCategoryInfo[] = [
  { id: 'frontend', label: 'Frontend', blurb: 'What your customers see and touch: fast, accessible interfaces.' },
  { id: 'backend', label: 'Backend', blurb: 'The engine behind the screen: business logic, APIs and integrations.' },
  { id: 'database', label: 'Database', blurb: 'Where your data lives, kept safe, consistent and quick to query.' },
  { id: 'cloud', label: 'Cloud', blurb: 'Hosting that scales with demand and stays online.' },
  { id: 'devops', label: 'DevOps', blurb: 'Automation that ships updates safely and often.' },
  { id: 'mobile', label: 'Mobile', blurb: 'Android and iOS apps from a single, maintainable codebase.' },
  { id: 'ai', label: 'AI', blurb: 'Practical intelligence added to real workflows.' },
  { id: 'infrastructure', label: 'Infrastructure', blurb: 'Servers and networking tuned for speed and reliability.' },
];

export const TECH_CATALOG: CatalogTech[] = [
  // Frontend
  { slug: 'react', name: 'React', category: 'frontend', bestFor: 'Interactive web apps', summary: 'The most widely used library for building rich interfaces. A large talent pool means your product is easy to maintain and extend.' },
  { slug: 'nextjs', name: 'Next.js', category: 'frontend', bestFor: 'Fast, SEO-ready sites', summary: 'A React framework that renders pages on the server, so sites load quickly and are easy for Google to read.' },
  { slug: 'typescript', name: 'TypeScript', category: 'frontend', bestFor: 'Fewer bugs', summary: 'JavaScript with safety checks built in. It catches mistakes before customers do and keeps large codebases tidy.' },
  { slug: 'tailwind-css', name: 'Tailwind CSS', category: 'frontend', bestFor: 'Consistent design', summary: 'A utility-first styling system that keeps every screen visually consistent and makes redesigns quick.' },
  { slug: 'vuejs', name: 'Vue.js', category: 'frontend', bestFor: 'Approachable web apps', summary: 'A gentle, productive framework that suits teams who value simplicity and fast onboarding.' },
  { slug: 'angular', name: 'Angular', category: 'frontend', bestFor: 'Large enterprise apps', summary: 'A full framework with strong conventions, a good fit for big internal systems with many developers.' },

  // Backend
  { slug: 'nodejs', name: 'Node.js', category: 'backend', bestFor: 'Real-time & APIs', summary: 'JavaScript on the server. One language across the stack speeds delivery and handles many simultaneous users well.' },
  { slug: 'nestjs', name: 'NestJS', category: 'backend', bestFor: 'Structured, scalable APIs', summary: 'An organised Node.js framework that keeps large backends clean, testable and ready to grow.' },
  { slug: 'expressjs', name: 'Express.js', category: 'backend', bestFor: 'Lightweight services', summary: 'A minimal, battle-tested web server toolkit for small services and quick integrations.' },
  { slug: 'python', name: 'Python', category: 'backend', bestFor: 'Automation & data', summary: 'Readable and versatile. Our go-to for automation, data processing and machine-learning work.' },
  { slug: 'django', name: 'Django', category: 'backend', bestFor: 'Secure data-driven sites', summary: 'A "batteries included" Python framework with strong security defaults and a ready-made admin area.' },
  { slug: 'fastapi', name: 'FastAPI', category: 'backend', bestFor: 'High-speed Python APIs', summary: 'A modern Python framework that produces very fast APIs with automatic documentation.' },
  { slug: 'spring-boot', name: 'Java Spring Boot', category: 'backend', bestFor: 'Enterprise systems', summary: 'The enterprise standard for banking-grade reliability, long-lived systems and strict compliance needs.' },

  // Database
  { slug: 'postgresql', name: 'PostgreSQL', category: 'database', bestFor: 'Business-critical data', summary: 'A powerful, open-source relational database trusted for accuracy. Our default choice for most products.' },
  { slug: 'mongodb', name: 'MongoDB', category: 'database', bestFor: 'Flexible data shapes', summary: 'A document database that adapts easily when your data does not fit neat tables.' },
  { slug: 'mysql', name: 'MySQL', category: 'database', bestFor: 'Proven web workloads', summary: 'A dependable relational database that powers a huge share of the web, with wide hosting support.' },
  { slug: 'redis', name: 'Redis', category: 'database', bestFor: 'Speed & caching', summary: 'An in-memory store that makes pages and APIs respond in milliseconds and powers queues and sessions.' },
  { slug: 'supabase', name: 'Supabase', category: 'database', bestFor: 'Rapid backends', summary: 'Managed Postgres with authentication and file storage included, so MVPs reach launch sooner.' },
  { slug: 'neon', name: 'Neon', category: 'database', bestFor: 'Serverless Postgres', summary: 'Serverless Postgres that scales to zero when idle, keeping hosting costs low for new products.' },
  { slug: 'prisma', name: 'Prisma', category: 'database', bestFor: 'Safe database access', summary: 'A type-safe layer between your code and the database that prevents a whole class of data bugs.' },

  // Cloud
  { slug: 'aws', name: 'AWS', category: 'cloud', bestFor: 'Global scale', summary: 'The broadest cloud platform, suited to products that must scale worldwide and meet strict requirements.' },
  { slug: 'google-cloud', name: 'Google Cloud', category: 'cloud', bestFor: 'Data & AI workloads', summary: 'Strong in analytics, machine learning and containers, with excellent global networking.' },
  { slug: 'azure', name: 'Azure', category: 'cloud', bestFor: 'Microsoft environments', summary: 'The natural fit when your business already runs on Microsoft 365 or needs enterprise identity.' },
  { slug: 'cloudflare', name: 'Cloudflare', category: 'cloud', bestFor: 'Speed & protection', summary: 'A global network that speeds up your site and shields it from attacks and traffic spikes.' },

  // DevOps
  { slug: 'docker', name: 'Docker', category: 'devops', bestFor: 'Identical environments', summary: 'Packages your app so it runs exactly the same on a laptop, a test server and production.' },
  { slug: 'kubernetes', name: 'Kubernetes', category: 'devops', bestFor: 'Scaling many services', summary: 'Orchestrates containers across servers, restarting failures and scaling automatically under load.' },
  { slug: 'ci-cd', name: 'CI/CD', category: 'devops', bestFor: 'Safe, frequent releases', summary: 'Every change is tested and deployed automatically, so you get updates sooner and with less risk.' },
  { slug: 'github-actions', name: 'GitHub Actions', category: 'devops', bestFor: 'Automated pipelines', summary: 'Runs our tests, builds and deployments on every change, right next to the code.' },

  // Mobile
  { slug: 'react-native', name: 'React Native', category: 'mobile', bestFor: 'iOS + Android, one team', summary: 'Build native-feeling Android and iOS apps from one codebase, reducing cost and time to market.' },
  { slug: 'flutter', name: 'Flutter', category: 'mobile', bestFor: 'Polished custom UI', summary: 'Google’s toolkit for beautiful, smooth apps with pixel-perfect design on every device.' },

  // AI
  { slug: 'openai-api', name: 'OpenAI APIs', category: 'ai', bestFor: 'Chat & content', summary: 'Adds language understanding to your product: assistants, summaries, search and document processing.' },
  { slug: 'gemini', name: 'Gemini', category: 'ai', bestFor: 'Multimodal AI', summary: 'Google’s models that understand text, images and documents together, useful for rich automation.' },
  { slug: 'ai-agents', name: 'AI Agents', category: 'ai', bestFor: 'Automating workflows', summary: 'Assistants that can take actions: look things up, fill forms, call your systems and hand off to people.' },
  { slug: 'machine-learning', name: 'Machine Learning', category: 'ai', bestFor: 'Predictions & insight', summary: 'Models that forecast demand, flag anomalies and personalise experiences using your own data.' },

  // Infrastructure
  { slug: 'vps', name: 'VPS Hosting', category: 'infrastructure', bestFor: 'Predictable cost', summary: 'Dedicated virtual servers with full control and a flat monthly price, ideal for steady workloads.' },
  { slug: 'linux', name: 'Linux Servers', category: 'infrastructure', bestFor: 'Secure, stable hosting', summary: 'The backbone of the internet. We harden and maintain servers so they stay secure and fast.' },
  { slug: 'nginx', name: 'Nginx', category: 'infrastructure', bestFor: 'Fast web serving', summary: 'A high-performance web server and reverse proxy that handles heavy traffic with very little hardware.' },
  { slug: 'load-balancing', name: 'Load Balancing', category: 'infrastructure', bestFor: 'High availability', summary: 'Spreads traffic across servers so your product keeps running even if one machine fails.' },
];
