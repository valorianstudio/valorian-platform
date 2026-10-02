import { ESTIMATOR_CONFIGS } from './estimator-configs';
import { ICON_OPTIONS } from '@/lib/icon-names';
import type { FieldDef, FormValues, Option } from './field-defs';

export type Item = Record<string, unknown> & { id: string };

export interface ResourceConfig {
  resource: string;
  singular: string;
  plural: string;
  title: (item: Item) => string;
  subtitle?: (item: Item) => string;
  /** Field that drives publish/enable state. */
  state?: { field: 'status' | 'active' | 'enabled'; kind: 'status' | 'boolean' };
  featured?: boolean;
  ordered: boolean;
  filterBy?: { field: string; label: string; options: Option[] };
  fields: FieldDef[];
  defaults: FormValues;
  relationSources?: Record<string, { resource: string; label: (item: Item) => string }>;
  viewHref?: (item: Item) => string | null;
}

const statusOptions: Option[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];
const techCategories: Option[] = ['FRONTEND', 'BACKEND', 'DATABASE', 'INFRASTRUCTURE', 'MOBILE', 'AI', 'DEVOPS'].map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));
const faqCategories: Option[] = ['GENERAL', 'DEVELOPMENT', 'PRICING', 'PROCESS', 'SUPPORT'].map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));
const navLocations: Option[] = [
  { value: 'HEADER', label: 'Header' },
  { value: 'FOOTER', label: 'Footer' },
  { value: 'LEGAL', label: 'Legal (footer bottom)' },
];

const seoFields: FieldDef[] = [
  { kind: 'heading', name: 'seo', label: 'SEO', hint: 'Leave blank to use the page title and summary.' },
  { kind: 'text', name: 'metaTitle', label: 'Meta title', max: 70 },
  { kind: 'textarea', name: 'metaDescription', label: 'Meta description', max: 180, rows: 2 },
  { kind: 'url', name: 'ogImageUrl', label: 'Social image URL', placeholder: 'https://…', half: true },
  { kind: 'url', name: 'canonicalUrl', label: 'Canonical URL', placeholder: 'https://…', half: true },
  { kind: 'switch', name: 'noindex', label: 'Hide from search engines', description: 'Adds a noindex tag and removes the page from the sitemap.' },
];
const seoDefaults: FormValues = { metaTitle: '', metaDescription: '', ogImageUrl: '', canonicalUrl: '', noindex: false };
const iconField = (def: string): FieldDef => ({ kind: 'select', name: 'icon', label: 'Icon', options: ICON_OPTIONS, half: true, hint: `Default: ${def}` });
const str = (value: unknown): string => (typeof value === 'string' ? value : '');

export const SEO_FIELDS = seoFields;

export const CONFIGS: Record<string, ResourceConfig> = {
  services: {
    resource: 'services',
    singular: 'service',
    plural: 'Services',
    title: (i) => str(i.title),
    subtitle: (i) => `/services/${str(i.slug)}`,
    state: { field: 'status', kind: 'status' },
    featured: true,
    ordered: true,
    viewHref: (i) => (i.status === 'PUBLISHED' ? `/services/${str(i.slug)}` : null),
    relationSources: {
      technologies: { resource: 'technologies', label: (i) => str(i.name) },
      projectTypes: { resource: 'estimator-types', label: (i) => str(i.name) },
    },
    defaults: { icon: 'code', estimatorTypeId: '', status: 'DRAFT', featured: false, features: [], benefits: '', technologyIds: [], ...seoDefaults },
    fields: [
      { kind: 'text', name: 'title', label: 'Title', required: true, max: 100 },
      { kind: 'text', name: 'slug', label: 'URL slug', hint: 'Leave empty to generate from the title. Changing it breaks existing links.', half: true },
      iconField('code'),
      { kind: 'select', name: 'status', label: 'Status', options: statusOptions, half: true },
      { kind: 'switch', name: 'featured', label: 'Featured on homepage', description: 'Featured, published services appear in the homepage capability section.' },
      { kind: 'textarea', name: 'shortDescription', label: 'Short description', required: true, max: 220, rows: 2, hint: 'Shown on cards.' },
      { kind: 'textarea', name: 'description', label: 'Full description', required: true, max: 4000, rows: 6 },
      { kind: 'heading', name: 'hero', label: 'Hero' },
      { kind: 'text', name: 'heroTitle', label: 'Hero title', max: 140, hint: 'Defaults to the title.' },
      { kind: 'textarea', name: 'heroSubtitle', label: 'Hero subtitle', max: 300, rows: 2 },
      { kind: 'heading', name: 'details', label: 'Details' },
      { kind: 'items', name: 'features', label: 'Key capabilities', addLabel: 'Add capability', fields: [{ name: 'title', label: 'Title', kind: 'text' }, { name: 'description', label: 'Description', kind: 'textarea' }] },
      { kind: 'lines', name: 'benefits', label: 'Benefits' },
      { kind: 'relations', name: 'technologyIds', label: 'Technologies', source: 'technologies' },
      { kind: 'select', name: 'estimatorTypeId', label: 'Estimator project type', options: [], optionsFrom: 'projectTypes', hint: 'Used by the Estimate Your Project button on this service page.' },
      { kind: 'heading', name: 'cta', label: 'Call to action', hint: 'Defaults to the global “Start a Project” CTA.' },
      { kind: 'text', name: 'ctaLabel', label: 'Button label', max: 60, half: true },
      { kind: 'url', name: 'ctaUrl', label: 'Button URL', placeholder: '/contact', half: true },
      ...seoFields,
    ],
  },
  solutions: {
    resource: 'solutions',
    singular: 'solution',
    plural: 'Solutions',
    title: (i) => str(i.name),
    subtitle: (i) => `/solutions/${str(i.slug)}`,
    state: { field: 'status', kind: 'status' },
    featured: true,
    ordered: true,
    viewHref: (i) => (i.status === 'PUBLISHED' ? `/solutions/${str(i.slug)}` : null),
    relationSources: {
      technologies: { resource: 'technologies', label: (i) => str(i.name) },
      services: { resource: 'services', label: (i) => str(i.title) },
    },
    defaults: { icon: 'briefcase', status: 'DRAFT', featured: false, problems: '', benefits: '', technologyIds: [], serviceIds: [], ...seoDefaults },
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, max: 100 },
      { kind: 'text', name: 'slug', label: 'URL slug', hint: 'Leave empty to generate from the name.', half: true },
      iconField('briefcase'),
      { kind: 'select', name: 'status', label: 'Status', options: statusOptions, half: true },
      { kind: 'switch', name: 'featured', label: 'Featured' },
      { kind: 'textarea', name: 'shortDescription', label: 'Short description', required: true, max: 220, rows: 2 },
      { kind: 'textarea', name: 'overview', label: 'Overview', required: true, max: 4000, rows: 5 },
      { kind: 'lines', name: 'problems', label: 'Industry problems' },
      { kind: 'textarea', name: 'approach', label: 'Valorian solution approach', required: true, max: 4000, rows: 5 },
      { kind: 'lines', name: 'benefits', label: 'Benefits' },
      { kind: 'url', name: 'coverImageUrl', label: 'Cover image URL', placeholder: 'https://…' },
      { kind: 'relations', name: 'serviceIds', label: 'Related services', source: 'services' },
      { kind: 'relations', name: 'technologyIds', label: 'Relevant technologies', source: 'technologies' },
      { kind: 'heading', name: 'cta', label: 'Call to action' },
      { kind: 'text', name: 'ctaLabel', label: 'Button label', max: 60, half: true },
      { kind: 'url', name: 'ctaUrl', label: 'Button URL', placeholder: '/contact', half: true },
      ...seoFields,
    ],
  },
  technologies: {
    resource: 'technologies',
    singular: 'technology',
    plural: 'Technologies',
    title: (i) => str(i.name),
    subtitle: (i) => str(i.category).toLowerCase(),
    state: { field: 'active', kind: 'boolean' },
    featured: true,
    ordered: true,
    filterBy: { field: 'category', label: 'Category', options: techCategories },
    defaults: { category: 'FRONTEND', featured: false, active: true },
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, max: 60, half: true },
      { kind: 'text', name: 'slug', label: 'Slug', hint: 'Optional.', half: true },
      { kind: 'select', name: 'category', label: 'Category', options: techCategories, half: true },
      { kind: 'text', name: 'logoUrl', label: 'Logo / icon URL', placeholder: 'https://…', half: true },
      { kind: 'url', name: 'websiteUrl', label: 'Official website', placeholder: 'https://…' },
      { kind: 'textarea', name: 'description', label: 'Description', max: 300, rows: 2 },
      { kind: 'switch', name: 'featured', label: 'Show on homepage', description: 'Featured, active technologies appear in the homepage technology section.' },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  process: {
    resource: 'process',
    singular: 'step',
    plural: 'Process steps',
    title: (i) => str(i.title),
    subtitle: (i) => str(i.label) || str(i.description),
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    defaults: { active: true },
    fields: [
      { kind: 'text', name: 'title', label: 'Title', required: true, max: 80, half: true },
      { kind: 'text', name: 'label', label: 'Short label', max: 40, half: true },
      { kind: 'textarea', name: 'description', label: 'Description', required: true, max: 400, rows: 3 },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  values: {
    resource: 'values',
    singular: 'reason',
    plural: 'Why Valorian',
    title: (i) => str(i.title),
    subtitle: (i) => str(i.description),
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    defaults: { icon: 'sparkles', active: true },
    fields: [
      { kind: 'text', name: 'title', label: 'Title', required: true, max: 80 },
      { kind: 'textarea', name: 'description', label: 'Description', required: true, max: 400, rows: 3 },
      iconField('sparkles'),
      { kind: 'text', name: 'highlight', label: 'Highlight badge', max: 60, half: true },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  faqs: {
    resource: 'faqs',
    singular: 'FAQ',
    plural: 'FAQs',
    title: (i) => str(i.question),
    subtitle: (i) => str(i.category).toLowerCase(),
    state: { field: 'active', kind: 'boolean' },
    featured: true,
    ordered: true,
    filterBy: { field: 'category', label: 'Category', options: faqCategories },
    defaults: { category: 'GENERAL', featured: false, active: true },
    fields: [
      { kind: 'text', name: 'question', label: 'Question', required: true, max: 200 },
      { kind: 'textarea', name: 'answer', label: 'Answer', required: true, max: 2000, rows: 5 },
      { kind: 'select', name: 'category', label: 'Category', options: faqCategories },
      { kind: 'switch', name: 'featured', label: 'Featured', description: 'Featured FAQs are listed first on public pages.' },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  ctas: {
    resource: 'ctas',
    singular: 'CTA',
    plural: 'CTAs',
    title: (i) => str(i.label),
    subtitle: (i) => `${str(i.key)} → ${str(i.url)}`,
    state: { field: 'active', kind: 'boolean' },
    ordered: false,
    defaults: { active: true },
    fields: [
      { kind: 'text', name: 'key', label: 'Key', required: true, max: 40, hint: '“start-project” powers the header button.', half: true },
      { kind: 'text', name: 'label', label: 'Button label', required: true, max: 60, half: true },
      { kind: 'url', name: 'url', label: 'URL', required: true, placeholder: '/contact' },
      { kind: 'textarea', name: 'description', label: 'Internal note', max: 240, rows: 2 },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  navigation: {
    resource: 'navigation',
    singular: 'link',
    plural: 'Navigation links',
    title: (i) => str(i.label),
    subtitle: (i) => str(i.url),
    state: { field: 'enabled', kind: 'boolean' },
    ordered: true,
    filterBy: { field: 'location', label: 'Location', options: navLocations },
    defaults: { location: 'HEADER', enabled: true, openInNewTab: false },
    fields: [
      { kind: 'text', name: 'label', label: 'Label', required: true, max: 40, half: true },
      { kind: 'url', name: 'url', label: 'URL', required: true, placeholder: '/services', half: true, hint: 'Site path or full URL. Admin routes are not allowed.' },
      { kind: 'select', name: 'location', label: 'Location', options: navLocations },
      { kind: 'switch', name: 'openInNewTab', label: 'Open in new tab' },
      { kind: 'switch', name: 'enabled', label: 'Enabled' },
    ],
  },
  'demo-categories': {
    resource: 'demo-categories',
    singular: 'category',
    plural: 'Demo categories',
    title: (i) => str(i.name),
    subtitle: (i) => str(i.description) || str(i.slug),
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    defaults: { active: true },
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, max: 60, half: true },
      { kind: 'text', name: 'slug', label: 'URL slug', hint: 'Leave empty to generate.', half: true },
      { kind: 'textarea', name: 'description', label: 'Description', max: 240, rows: 2 },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
};

Object.assign(CONFIGS, ESTIMATOR_CONFIGS);
