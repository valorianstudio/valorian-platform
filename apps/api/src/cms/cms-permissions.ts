import { ForbiddenException } from '@nestjs/common';
import type { AdminProfile } from '../admin-users/admin-users.service';

export interface ResourcePermissions {
  view: string;
  create: string;
  update: string;
  delete: string;
  /** Needed in addition to update when a request changes publication status. */
  publish?: string;
}

const simple = (view: string, manage: string): ResourcePermissions => ({ view, create: manage, update: manage, delete: manage });
const website = simple('website.view', 'website.manage');
const pricing = simple('estimator.view', 'pricing.manage');

/** Which permissions each generic CMS resource requires. */
export const CMS_PERMISSIONS: Record<string, ResourcePermissions> = {
  services: { view: 'services.view', create: 'services.create', update: 'services.update', delete: 'services.delete', publish: 'services.publish' },
  solutions: simple('solutions.view', 'solutions.manage'),
  technologies: simple('technologies.view', 'technologies.manage'),
  process: website,
  values: website,
  faqs: website,
  ctas: website,
  navigation: website,
  work: website,
  'demo-categories': simple('demos.view', 'demos.update'),
  'estimator-types': pricing,
  'estimator-categories': pricing,
  'estimator-features': pricing,
  'estimator-integrations': pricing,
  'estimator-complexity': pricing,
  'estimator-rules': pricing,
  testimonials: simple('testimonials.view', 'testimonials.manage'),
  'article-categories': simple('insights.view', 'insights.manage'),
};

export function requireResourcePermission(user: AdminProfile, resource: string, action: keyof ResourcePermissions): void {
  const key = CMS_PERMISSIONS[resource]?.[action];
  if (!key) return;
  if (!user.isSuper && !user.permissions.includes(key)) throw new ForbiddenException('You do not have permission to perform this action.');
}
