import type { FieldDef, Option } from './field-defs';
import type { ResourceConfig } from './resource-configs';

const str = (value: unknown): string => (typeof value === 'string' ? value : '');
const num = (value: unknown): string => (typeof value === 'number' ? value.toLocaleString('en') : '—');
const platformOptions: Option[] = [
  { value: 'WEBSITE', label: 'Website' },
  { value: 'MOBILE', label: 'Mobile App' },
  { value: 'BOTH', label: 'Website + Mobile' },
];

const prices: FieldDef[] = [
  { kind: 'number', name: 'websitePrice', label: 'Website price', nullable: true, half: true },
  { kind: 'number', name: 'mobilePrice', label: 'Mobile price', nullable: true, half: true },
  { kind: 'number', name: 'bothPrice', label: 'Website + Mobile price', nullable: true, half: true },
];
const priceLine = (i: Record<string, unknown>) => `Web ${num(i.websitePrice)} · Mobile ${num(i.mobilePrice)} · Both ${i.bothPrice === null ? 'auto' : num(i.bothPrice)}`;

export const ESTIMATOR_CONFIGS: Record<string, ResourceConfig> = {
  'estimator-types': {
    resource: 'estimator-types',
    singular: 'project type',
    plural: 'Project types',
    title: (i) => str(i.name),
    subtitle: (i) => `${str(i.platform).toLowerCase()} · base ${num(i.basePrice)} · ${num(i.baseWeeks)} weeks`,
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    defaults: { platform: 'WEBSITE', basePrice: '0', baseWeeks: '4', active: true },
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, max: 60, half: true },
      { kind: 'text', name: 'slug', label: 'Slug', hint: 'Leave empty to generate.', half: true },
      { kind: 'textarea', name: 'description', label: 'Description', max: 240, rows: 2 },
      { kind: 'select', name: 'platform', label: 'Platform', options: platformOptions, half: true, hint: 'Decides whether website, mobile or combined pricing applies.' },
      { kind: 'number', name: 'basePrice', label: 'Base price', half: true, hint: 'For combined types, enter the package price.' },
      { kind: 'number', name: 'baseWeeks', label: 'Base timeline (weeks)', half: true },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  'estimator-categories': {
    resource: 'estimator-categories',
    singular: 'category',
    plural: 'Feature categories',
    title: (i) => str(i.name),
    subtitle: (i) => str(i.slug),
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    defaults: { active: true },
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, max: 60, half: true },
      { kind: 'text', name: 'slug', label: 'Slug', half: true },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  'estimator-features': {
    resource: 'estimator-features',
    singular: 'feature',
    plural: 'Features',
    title: (i) => str(i.name),
    subtitle: (i) => `${priceLine(i)}${i.required ? ' · required' : ''}${i.recommended ? ' · recommended' : ''}`,
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    relationSources: {
      categories: { resource: 'estimator-categories', label: (i) => str(i.name) },
      industries: { resource: 'solutions', label: (i) => str(i.name) },
    },
    defaults: { categoryId: '', effortDays: '2', required: false, recommended: false, active: true, industryIds: [] },
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, max: 80, half: true },
      { kind: 'text', name: 'slug', label: 'Slug', half: true },
      { kind: 'textarea', name: 'description', label: 'Description', max: 300, rows: 2 },
      { kind: 'select', name: 'categoryId', label: 'Category', options: [], optionsFrom: 'categories', half: true },
      { kind: 'number', name: 'effortDays', label: 'Effort (days)', half: true, hint: 'Feeds the timeline estimate.' },
      { kind: 'heading', name: 'prices', label: 'Platform pricing', hint: 'Leave a price empty if the feature is unavailable on that platform. If the combined price is empty it is the sum minus the combined-package discount.' },
      ...prices,
      { kind: 'relations', name: 'industryIds', label: 'Suggested for industries', source: 'industries' },
      { kind: 'switch', name: 'required', label: 'Required', description: 'Always included in every estimate.' },
      { kind: 'switch', name: 'recommended', label: 'Recommended' },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  'estimator-integrations': {
    resource: 'estimator-integrations',
    singular: 'integration',
    plural: 'Integrations',
    title: (i) => str(i.name),
    subtitle: priceLine,
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    defaults: { active: true },
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, max: 80, half: true },
      { kind: 'text', name: 'slug', label: 'Slug', half: true },
      { kind: 'textarea', name: 'description', label: 'Description', max: 300, rows: 2 },
      ...prices,
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  'estimator-complexity': {
    resource: 'estimator-complexity',
    singular: 'level',
    plural: 'Complexity levels',
    title: (i) => str(i.name),
    subtitle: (i) => `Cost ×${num(i.multiplier)} · Timeline ×${num(i.timelineFactor)}`,
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    defaults: { multiplier: '1', timelineFactor: '1', active: true },
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, max: 40, half: true },
      { kind: 'text', name: 'slug', label: 'Slug', half: true },
      { kind: 'textarea', name: 'description', label: 'Description', max: 240, rows: 2 },
      { kind: 'number', name: 'multiplier', label: 'Cost multiplier', step: '0.01', half: true },
      { kind: 'number', name: 'timelineFactor', label: 'Timeline factor', step: '0.01', half: true },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
  'estimator-rules': {
    resource: 'estimator-rules',
    singular: 'rule',
    plural: 'Pricing rules',
    title: (i) => str(i.label),
    subtitle: (i) => `${str(i.kind).toLowerCase()} · key ${str(i.key)} · Cost ×${num(i.multiplier)} · Timeline ×${num(i.timelineFactor)}`,
    state: { field: 'active', kind: 'boolean' },
    ordered: true,
    filterBy: { field: 'kind', label: 'Type', options: [{ value: 'SCALE', label: 'Project scale' }, { value: 'URGENCY', label: 'Timeline urgency' }] },
    defaults: { kind: 'SCALE', multiplier: '1', timelineFactor: '1', active: true },
    fields: [
      { kind: 'select', name: 'kind', label: 'Rule type', options: [{ value: 'SCALE', label: 'Project scale (expected users)' }, { value: 'URGENCY', label: 'Timeline urgency' }], half: true },
      { kind: 'text', name: 'key', label: 'Key', required: true, max: 40, half: true, hint: 'Lowercase identifier, e.g. under-100.' },
      { kind: 'text', name: 'label', label: 'Label shown to visitors', required: true, max: 60 },
      { kind: 'textarea', name: 'description', label: 'Description', max: 240, rows: 2 },
      { kind: 'number', name: 'multiplier', label: 'Cost multiplier', step: '0.01', half: true },
      { kind: 'number', name: 'timelineFactor', label: 'Timeline factor', step: '0.01', half: true },
      { kind: 'switch', name: 'active', label: 'Active' },
    ],
  },
};
