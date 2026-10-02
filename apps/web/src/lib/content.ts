import { Bot, Code2, Globe, Layers, Server, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Capability {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export const CAPABILITIES: Capability[] = [
  { title: 'Custom Software', description: 'Tailored systems that fit how your business actually operates, not the other way around.', Icon: Code2 },
  { title: 'Web Applications', description: 'Fast, accessible and SEO-ready web apps built with modern frameworks.', Icon: Globe },
  { title: 'SaaS Platforms', description: 'Multi-tenant products with billing, roles and the architecture to scale.', Icon: Layers },
  { title: 'Mobile Apps', description: 'Polished iOS and Android experiences backed by dependable APIs.', Icon: Smartphone },
  { title: 'AI Integration', description: 'Practical AI features, assistants and automation woven into your workflows.', Icon: Bot },
  { title: 'Backend & APIs', description: 'Secure, well-documented services and integrations that stay fast under load.', Icon: Server },
];

export const PRINCIPLES = [
  { title: 'Scalable engineering', description: 'Clean architecture and typed codebases that stay maintainable as your product grows.' },
  { title: 'Thoughtful product design', description: 'Interfaces designed around real users, with attention to every detail.' },
  { title: 'Modern technology', description: 'Proven, current stacks chosen for your goals, not for fashion.' },
  { title: 'Performance first', description: 'Fast load times and smooth interactions measured and protected from day one.' },
  { title: 'Reliable delivery', description: 'Clear milestones, honest communication and software that ships on schedule.' },
];

export const PROCESS_STEPS = [
  { title: 'Discover', description: 'We learn your goals, users and constraints.' },
  { title: 'Design', description: 'Flows, interfaces and architecture, agreed early.' },
  { title: 'Build', description: 'Iterative engineering with regular working releases.' },
  { title: 'Launch', description: 'Tested, monitored deployment to production.' },
  { title: 'Scale', description: 'Ongoing improvement as your product and audience grow.' },
];

export interface DemoPreview {
  slug: string;
  title: string;
  category: string;
  summary: string;
  accent: 'primary' | 'accent';
}

/** Phase 3 replaces this static list with database-managed demos behind the same shape. */
export const SAMPLE_DEMOS: DemoPreview[] = [
  { slug: 'analytics-dashboard', title: 'Analytics Dashboard', category: 'SaaS', summary: 'Real-time metrics, role-based access and exportable reports.', accent: 'primary' },
  { slug: 'storefront', title: 'Commerce Storefront', category: 'E-commerce', summary: 'Fast catalog, checkout and inventory sync for growing retailers.', accent: 'accent' },
  { slug: 'support-assistant', title: 'AI Support Assistant', category: 'AI', summary: 'An assistant that answers from your docs and hands off to your team.', accent: 'primary' },
];
