/** Client-safe permission helpers. The API remains the source of truth; this only shapes the UI. */

export function can(permissions: readonly string[] | undefined, ...anyOf: string[]): boolean {
  if (!permissions) return false;
  return anyOf.some((key) => permissions.includes(key));
}

/** Which permission (any of) unlocks each admin area. First match wins, so list specific paths first. */
const ROUTES: [prefix: string, anyOf: string[]][] = [
  ['/admin/profile', []],
  ['/admin/change-password', []],
  ['/admin/website', ['website.view']],
  ['/admin/services', ['services.view']],
  ['/admin/solutions', ['solutions.view']],
  ['/admin/technologies', ['technologies.view']],
  ['/admin/process', ['website.view']],
  ['/admin/why', ['website.view']],
  ['/admin/faqs', ['website.view']],
  ['/admin/ctas', ['website.view']],
  ['/admin/demo-categories', ['demos.view']],
  ['/admin/demos', ['demos.view']],
  ['/admin/estimator', ['estimator.view']],
  ['/admin/leads/settings', ['settings.manage']],
  ['/admin/leads', ['leads.view']],
  ['/admin/inquiries', ['inquiries.view']],
  ['/admin/case-studies', ['case_studies.view']],
  ['/admin/testimonials', ['testimonials.view']],
  ['/admin/insight-categories', ['insights.view']],
  ['/admin/insights', ['insights.view']],
  ['/admin/media', ['media.view']],
  ['/admin/seo', ['seo.view']],
  ['/admin/analytics/settings', ['settings.manage']],
  ['/admin/analytics', ['analytics.view']],
  ['/admin/clients', ['clients.view']],
  ['/admin/projects/new', ['projects.manage']],
  ['/admin/projects', ['projects.view']],
  ['/admin/users', ['users.view']],
  ['/admin/roles', ['roles.manage']],
  ['/admin/audit', ['audit.view']],
  ['/admin/settings/security', ['security.manage']],
  ['/admin/settings', ['settings.view']],
  ['/admin/preview/case-studies', ['case_studies.view']],
  ['/admin/preview/insights', ['insights.view']],
];

/** Permissions (any of) required to open a path, or null when any signed-in admin may. */
export function permissionsForPath(path: string): string[] | null {
  if (path === '/admin') return ['dashboard.view'];
  const match = ROUTES.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  return match && match[1].length > 0 ? match[1] : null;
}

export interface ResourcePermissions {
  create: string;
  update: string;
  delete: string;
  publish?: string;
}

const simple = (manage: string): ResourcePermissions => ({ create: manage, update: manage, delete: manage });

/** Mirrors the API table for the generic CMS resources, to hide actions the admin cannot perform. */
export const RESOURCE_PERMISSIONS: Record<string, ResourcePermissions> = {
  services: { create: 'services.create', update: 'services.update', delete: 'services.delete', publish: 'services.publish' },
  solutions: simple('solutions.manage'),
  technologies: simple('technologies.manage'),
  process: simple('website.manage'),
  values: simple('website.manage'),
  faqs: simple('website.manage'),
  ctas: simple('website.manage'),
  navigation: simple('website.manage'),
  work: simple('website.manage'),
  'demo-categories': simple('demos.update'),
  'estimator-types': simple('pricing.manage'),
  'estimator-categories': simple('pricing.manage'),
  'estimator-features': simple('pricing.manage'),
  'estimator-integrations': simple('pricing.manage'),
  'estimator-complexity': simple('pricing.manage'),
  'estimator-rules': simple('pricing.manage'),
  testimonials: simple('testimonials.manage'),
  'article-categories': simple('insights.manage'),
};

export function resourceCan(permissions: readonly string[], resource: string, action: keyof ResourcePermissions): boolean {
  const key = RESOURCE_PERMISSIONS[resource]?.[action];
  return key === undefined ? true : permissions.includes(key);
}
