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
export type PlatformType = 'WEBSITE' | 'MOBILE';

export interface DemoCardData {
  slug: string;
  name: string;
  shortDescription: string;
  thumbnailUrl: string | null;
  coverImageUrl: string | null;
  badge: string | null;
  statusLabel: 'INTERACTIVE_CONCEPT' | 'PROTOTYPE' | 'DEMO_PRODUCT' | 'PRODUCTION_EXAMPLE';
  featured: boolean;
  category: { name: string; slug: string } | null;
  industry: { name: string; slug: string } | null;
  platforms: { type: PlatformType; technologies?: { name: string }[] }[];
  /** First active mobile screenshot, used for the phone preview on cards. */
  screenshots?: { url: string }[];
}
export interface DemoDetail extends DemoCardData, Seo {
  fullDescription: string;
  problem: string | null;
  solution: string | null;
  targetUsers: string | null;
  targetBusinesses: string | null;
  outcomes: string[];
  highlight: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  platforms: {
    type: PlatformType;
    title: string | null;
    description: string | null;
    demoUrl: string | null;
    videoUrl: string | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
    android: boolean;
    ios: boolean;
    playStoreUrl: string | null;
    appStoreUrl: string | null;
    technologies: { id: string; name: string; category: string; logoUrl: string | null }[];
  }[];
  features: { id: string; platform: PlatformType | 'BOTH'; title: string; description: string | null; icon: string | null; featured: boolean }[];
  modules: { id: string; platform: PlatformType | 'BOTH'; title: string; description: string | null; icon: string | null }[];
  screenshots: { id: string; platform: PlatformType; kind: string; url: string; altText: string; caption: string | null; featured: boolean }[];
  points: { id: string; type: 'BENEFIT' | 'USE_CASE'; title: string; description: string | null }[];
  related: DemoCardData[];
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

export interface TestimonialItem {
  id: string;
  clientName: string;
  companyName: string | null;
  position: string | null;
  quote: string;
  imageUrl: string | null;
  companyLogoUrl: string | null;
  rating: number | null;
  verified: boolean;
}
export interface CaseCard {
  slug: string;
  title: string;
  shortDescription: string;
  coverImageUrl: string | null;
  clientName: string | null;
  featured: boolean;
  publishedAt: string | null;
  industry: { name: string; slug: string } | null;
  challenge?: string | null;
  solution?: string | null;
  results?: { label: string; value: string; description?: string | null }[];
  technologies?: { name: string }[];
}
export interface CaseDetail extends CaseCard, Seo {
  fullOverview: string;
  clientLogoUrl: string | null;
  projectType: string | null;
  challenge: string | null;
  solution: string | null;
  approach: string | null;
  keyFeatures: string[];
  results: { label: string; value: string; description?: string | null }[];
  featuredImageUrl: string | null;
  videoUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  updatedAt: string;
  services: ServiceCard[];
  technologies: TechnologyCard[];
  demos: DemoCardData[];
  media: { id: string; kind: 'DESKTOP' | 'MOBILE' | 'DIAGRAM' | 'PRODUCT'; url: string; altText: string; caption: string | null; featured: boolean }[];
  testimonials: TestimonialItem[];
}
export interface CaseListData {
  items: CaseCard[];
  total: number;
  page: number;
  pageSize: number;
  industries: { name: string; slug: string }[];
}
export interface ArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  authorName: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  featured: boolean;
  category: { name: string; slug: string } | null;
}
export interface ArticleDetail extends ArticleCard, Seo {
  content: string;
  authorAvatarUrl: string | null;
  authorBio: string | null;
  updatedAt: string;
  tags: { name: string; slug: string }[];
  services: { slug: string; title: string }[];
}
export interface ArticleListData {
  items: ArticleCard[];
  total: number;
  page: number;
  pageSize: number;
  categories: { name: string; slug: string }[];
  featured: ArticleCard | null;
}
export interface SeoConfig {
  siteName: string | null;
  titleTemplate: string;
  defaultTitle: string | null;
  defaultDescription: string | null;
  defaultOgImageUrl: string | null;
  canonicalBaseUrl: string | null;
  twitterHandle: string | null;
  allowIndexing: boolean;
}

export interface HomeData extends PageBase {
  caseStudies: CaseCard[];
  testimonials: TestimonialItem[];
  articles: ArticleCard[];
  services: ServiceCard[];
  values: ValueItem[];
  steps: ProcessStepItem[];
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
  estimatorType: { slug: string } | null;
}
export interface ServiceDetailData {
  caseStudies: CaseCard[];
  testimonials: TestimonialItem[];
  articles: ArticleCard[];
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
  demos: DemoCardData[];
}
export interface SolutionDetailData {
  caseStudies: CaseCard[];
  articles: ArticleCard[];
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

export type EstimatorPlatform = 'WEBSITE' | 'MOBILE' | 'BOTH';
export interface EstimatorConfig {
  currency: 'BDT' | 'USD';
  disclaimer: string;
  enabled: boolean;
  projectTypes: { slug: string; name: string; description: string | null; platform: EstimatorPlatform }[];
  industries: { slug: string; name: string; icon: string }[];
  categories: { id: string; name: string }[];
  features: { id: string; name: string; description: string | null; categoryId: string | null; required: boolean; recommended: boolean; platforms: ('WEBSITE' | 'MOBILE')[]; industries: string[] }[];
  integrations: { id: string; name: string; description: string | null; platforms: ('WEBSITE' | 'MOBILE')[] }[];
  complexities: { slug: string; name: string; description: string | null }[];
  scales: { key: string; label: string; description: string | null }[];
  urgencies: { key: string; label: string; description: string | null }[];
  preset: { demo: { slug: string; name: string } | null; projectType: string | null; industry: string | null; featureIds: string[] };
}
export interface EstimateResult {
  id: string;
  currency: 'BDT' | 'USD';
  disclaimer: string;
  min: number;
  max: number;
  weeks: { min: number; max: number };
  projectType: string;
  platform: EstimatorPlatform;
  features: { id: string; name: string; category: string | null; required: boolean }[];
  integrations: { id: string; name: string }[];
  complexity: string;
  scale: string;
  urgency: string;
}
