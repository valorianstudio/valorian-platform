import type { ResourceConfig } from './resource-configs';

const str = (value: unknown): string => (typeof value === 'string' ? value : '');

export const EDITORIAL_CONFIGS: Record<string, ResourceConfig> = {
  testimonials: {
    resource: 'testimonials',
    singular: 'testimonial',
    plural: 'Testimonials',
    title: (i) => `${str(i.clientName)}${i.companyName ? `, ${str(i.companyName)}` : ''}`,
    subtitle: (i) => str(i.quote),
    state: { field: 'active', kind: 'boolean' },
    featured: true,
    ordered: true,
    relationSources: {
      caseStudies: { resource: 'case-studies-options', label: (i) => str(i.title) },
      services: { resource: 'services', label: (i) => str(i.title) },
    },
    defaults: { featured: false, active: true, verified: false, caseStudyId: '', serviceId: '' },
    fields: [
      { kind: 'text', name: 'clientName', label: 'Client name', required: true, max: 100, half: true },
      { kind: 'text', name: 'position', label: 'Position / title', max: 100, half: true },
      { kind: 'text', name: 'companyName', label: 'Company', max: 100 },
      { kind: 'textarea', name: 'quote', label: 'Testimonial', required: true, max: 1200, rows: 5, hint: 'Only add words the client has actually said and approved.' },
      { kind: 'image', name: 'imageUrl', label: 'Client photo', half: true },
      { kind: 'image', name: 'companyLogoUrl', label: 'Company logo', half: true },
      { kind: 'number', name: 'rating', label: 'Rating (1–5)', nullable: true, half: true, hint: 'Leave empty to show no rating.' },
      { kind: 'select', name: 'caseStudyId', label: 'Related case study', options: [], optionsFrom: 'caseStudies', half: true },
      { kind: 'select', name: 'serviceId', label: 'Related service', options: [], optionsFrom: 'services', half: true },
      { kind: 'switch', name: 'verified', label: 'Verified', description: 'You have confirmed this testimonial with the client.' },
      { kind: 'switch', name: 'featured', label: 'Featured on homepage' },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  'article-categories': {
    resource: 'article-categories',
    singular: 'category',
    plural: 'Insight categories',
    title: (i) => str(i.name),
    subtitle: (i) => str(i.slug),
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
