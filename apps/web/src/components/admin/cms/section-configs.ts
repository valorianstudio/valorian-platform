import type { FieldDef } from './field-defs';

export interface SectionConfig {
  label: string;
  description: string;
  fields: FieldDef[];
}

const intro: FieldDef[] = [
  { kind: 'text', name: 'eyebrow', label: 'Small label', max: 60, half: true },
  { kind: 'text', name: 'title', label: 'Heading', required: true, max: 140, half: true },
  { kind: 'textarea', name: 'subtitle', label: 'Intro text', max: 300, rows: 2 },
];

const cta: FieldDef[] = [
  { kind: 'text', name: 'headline', label: 'Headline', required: true, max: 140 },
  { kind: 'textarea', name: 'description', label: 'Description', max: 300, rows: 2 },
  { kind: 'text', name: 'primaryLabel', label: 'Primary button label', required: true, max: 40, half: true },
  { kind: 'url', name: 'primaryUrl', label: 'Primary button URL', required: true, placeholder: '/contact', half: true },
  { kind: 'text', name: 'secondaryLabel', label: 'Secondary button label', max: 40, half: true },
  { kind: 'url', name: 'secondaryUrl', label: 'Secondary button URL', half: true },
];

const pageHero: FieldDef[] = [
  { kind: 'text', name: 'eyebrow', label: 'Small label', max: 60 },
  { kind: 'text', name: 'title', label: 'Heading', required: true, max: 140 },
  { kind: 'textarea', name: 'description', label: 'Description', required: true, max: 400, rows: 3 },
];

export const SECTION_CONFIGS: Record<string, Record<string, SectionConfig>> = {
  home: {
    hero: {
      label: 'Hero',
      description: 'The first thing visitors see.',
      fields: [
        { kind: 'text', name: 'eyebrow', label: 'Small label', max: 60 },
        { kind: 'text', name: 'headline', label: 'Headline', required: true, max: 140, half: true },
        { kind: 'text', name: 'highlight', label: 'Highlighted text', max: 80, half: true, hint: 'Shown in the accent colour after the headline.' },
        { kind: 'textarea', name: 'description', label: 'Description', required: true, max: 400, rows: 3 },
        { kind: 'text', name: 'primaryLabel', label: 'Primary button label', required: true, max: 40, half: true },
        { kind: 'url', name: 'primaryUrl', label: 'Primary button URL', required: true, half: true },
        { kind: 'text', name: 'secondaryLabel', label: 'Secondary button label', max: 40, half: true },
        { kind: 'url', name: 'secondaryUrl', label: 'Secondary button URL', half: true },
        { kind: 'url', name: 'imageUrl', label: 'Custom hero image URL', placeholder: 'https://…', hint: 'Optional. Replaces the built-in product illustration.' },
      ],
    },
    capabilities: { label: 'Capabilities', description: 'Cards come from services marked “Featured” in Services.', fields: intro },
    why: { label: 'Why Valorian', description: 'Items are managed under Why Valorian.', fields: intro },
    featuredWork: { label: 'Featured demos', description: 'Shows demos marked Featured in Demos.', fields: intro },
    process: { label: 'Process', description: 'Steps are managed under Process.', fields: intro },
    technology: { label: 'Technology', description: 'Shows technologies marked “Show on homepage”.', fields: intro },
    caseStudies: { label: 'Case studies', description: 'Shows featured, published case studies. Hidden automatically when there are none.', fields: intro },
    testimonials: { label: 'Testimonials', description: 'Shows featured, active testimonials. Hidden automatically when there are none.', fields: intro },
    insights: { label: 'Insights', description: 'Shows the latest published articles. Hidden automatically when there are none.', fields: intro },
    cta: { label: 'Final call to action', description: 'Closing conversion block.', fields: cta },
  },
  about: {
    hero: { label: 'Page hero', description: 'Heading at the top of the page.', fields: pageHero },
    story: {
      label: 'Company story',
      description: 'Separate paragraphs with a blank line.',
      fields: [
        { kind: 'text', name: 'eyebrow', label: 'Small label', max: 60, half: true },
        { kind: 'text', name: 'title', label: 'Heading', required: true, max: 140, half: true },
        { kind: 'textarea', name: 'body', label: 'Story', required: true, max: 3000, rows: 8 },
      ],
    },
    purpose: {
      label: 'Mission & vision',
      description: 'Two highlighted statements.',
      fields: [
        { kind: 'text', name: 'missionTitle', label: 'Mission label', required: true, max: 60, half: true },
        { kind: 'text', name: 'visionTitle', label: 'Vision label', required: true, max: 60, half: true },
        { kind: 'textarea', name: 'mission', label: 'Mission', required: true, max: 800, rows: 3 },
        { kind: 'textarea', name: 'vision', label: 'Vision', required: true, max: 800, rows: 3 },
      ],
    },
    values: {
      label: 'Values',
      description: 'Principles shown as cards.',
      fields: [
        { kind: 'text', name: 'title', label: 'Heading', required: true, max: 140 },
        { kind: 'items', name: 'items', label: 'Values', addLabel: 'Add value', fields: [{ name: 'title', label: 'Title', kind: 'text' }, { name: 'description', label: 'Description', kind: 'textarea' }] },
      ],
    },
    philosophy: {
      label: 'Engineering philosophy & approach',
      description: 'How the studio builds software.',
      fields: [
        { kind: 'text', name: 'title', label: 'Heading', required: true, max: 140 },
        { kind: 'textarea', name: 'body', label: 'Text', required: true, max: 3000, rows: 6 },
        { kind: 'lines', name: 'points', label: 'Key points' },
      ],
    },
    stats: {
      label: 'Statistics',
      description: 'Optional. Leave empty (or disable) unless you have real figures to show.',
      fields: [
        { kind: 'text', name: 'title', label: 'Heading', required: true, max: 140 },
        { kind: 'items', name: 'items', label: 'Statistics', addLabel: 'Add statistic', fields: [{ name: 'value', label: 'Value', kind: 'text' }, { name: 'label', label: 'Label', kind: 'text' }] },
      ],
    },
    cta: { label: 'Call to action', description: 'FAQs appear above this block.', fields: cta },
  },
  services: {
    hero: { label: 'Page hero', description: 'Heading at the top of /services.', fields: pageHero },
    cta: { label: 'Call to action', description: 'Closing block.', fields: cta },
  },
  solutions: {
    hero: { label: 'Page hero', description: 'Heading at the top of /solutions.', fields: pageHero },
    cta: { label: 'Call to action', description: 'Closing block.', fields: cta },
  },
};
