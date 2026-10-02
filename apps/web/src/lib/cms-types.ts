export interface Seo {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
}

export interface SectionRow<C = Record<string, unknown>> {
  key: string;
  content: C;
}

export interface AdminPage extends Seo {
  key: string;
  sections: (SectionRow & { id: string; enabled: boolean; displayOrder: number })[];
}

export interface IntroContent {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
}
export interface HeroContent {
  eyebrow?: string | null;
  headline: string;
  highlight?: string | null;
  description: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string | null;
  secondaryUrl?: string | null;
  imageUrl?: string | null;
}
export interface CtaContent {
  headline: string;
  description?: string | null;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string | null;
  secondaryUrl?: string | null;
}
export interface PageHeroContent {
  eyebrow?: string | null;
  title: string;
  description: string;
}

export interface ServiceCard {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  featured: boolean;
}
export interface TechnologyCard {
  id: string;
  slug: string;
  name: string;
  category: string;
  logoUrl: string | null;
  websiteUrl: string | null;
}
export interface ProcessStepItem {
  id: string;
  title: string;
  label: string | null;
  description: string;
}
export interface ValueItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight: string | null;
}
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
export interface WorkItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  badge: string | null;
  ctaUrl: string | null;
}
export interface CtaLink {
  label: string;
  url: string;
  description: string | null;
}

interface PageBase {
  seo: Seo | null;
  sections: SectionRow[];
}

export interface HomeData extends PageBase {
  services: ServiceCard[];
  values: ValueItem[];
  steps: ProcessStepItem[];
  technologies: TechnologyCard[];
  work: WorkItem[];
}
export interface AboutData extends PageBase {
  faqs: FaqItem[];
}
export interface ServicesData extends PageBase {
  services: (ServiceCard & { technologies: { id: string; name: string }[] })[];
  steps: ProcessStepItem[];
  faqs: FaqItem[];
}
export interface ServiceDetail extends ServiceCard, Seo {
  description: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
  features: { title: string; description: string }[];
  benefits: string[];
  ctaLabel: string | null;
  ctaUrl: string | null;
  technologies: TechnologyCard[];
  industries: { slug: string; name: string }[];
}
export interface ServiceDetailData {
  service: ServiceDetail;
  steps: ProcessStepItem[];
  faqs: FaqItem[];
  related: ServiceCard[];
  cta: CtaLink | null;
}
export interface SolutionCard {
  slug: string;
  name: string;
  shortDescription: string;
  icon: string;
  featured: boolean;
  coverImageUrl: string | null;
}
export interface SolutionsData extends PageBase {
  solutions: SolutionCard[];
}
export interface SolutionDetail extends SolutionCard, Seo {
  overview: string;
  problems: string[];
  approach: string;
  benefits: string[];
  ctaLabel: string | null;
  ctaUrl: string | null;
  technologies: TechnologyCard[];
  services: ServiceCard[];
}
export interface SolutionDetailData {
  solution: SolutionDetail;
  cta: CtaLink | null;
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  location: 'HEADER' | 'FOOTER' | 'LEGAL';
  openInNewTab: boolean;
}
export interface NavigationData {
  items: NavItem[];
  cta: CtaLink | null;
}
