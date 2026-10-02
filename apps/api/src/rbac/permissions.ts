export interface PermissionDef {
  key: string;
  module: string;
  label: string;
}

const def = (module: string, action: string, label: string): PermissionDef => ({ key: `${module}.${action}`, module, label });

/** Practical, module-level permissions. Services and demos are granular; the rest are view/manage. */
export const PERMISSIONS: PermissionDef[] = [
  def('dashboard', 'view', 'View dashboard'),
  def('website', 'view', 'View website content'),
  def('website', 'manage', 'Edit homepage, about, navigation, footer, process, FAQs and CTAs'),
  def('services', 'view', 'View services'),
  def('services', 'create', 'Create services'),
  def('services', 'update', 'Edit services'),
  def('services', 'delete', 'Delete services'),
  def('services', 'publish', 'Publish and unpublish services'),
  def('solutions', 'view', 'View solutions'),
  def('solutions', 'manage', 'Manage solutions'),
  def('technologies', 'view', 'View technologies'),
  def('technologies', 'manage', 'Manage technologies'),
  def('demos', 'view', 'View demos'),
  def('demos', 'create', 'Create demos'),
  def('demos', 'update', 'Edit demos'),
  def('demos', 'delete', 'Delete demos'),
  def('demos', 'publish', 'Publish and unpublish demos'),
  def('estimator', 'view', 'View estimator data'),
  def('pricing', 'manage', 'Change estimator pricing and rules'),
  def('leads', 'view', 'View leads'),
  def('leads', 'update', 'Update leads, notes and follow-ups'),
  def('leads', 'export', 'Export leads'),
  def('leads', 'archive', 'Archive and restore leads'),
  def('inquiries', 'view', 'View inquiries'),
  def('inquiries', 'manage', 'Manage inquiries'),
  def('case_studies', 'view', 'View case studies'),
  def('case_studies', 'manage', 'Manage case studies'),
  def('testimonials', 'view', 'View testimonials'),
  def('testimonials', 'manage', 'Manage testimonials'),
  def('insights', 'view', 'View insights'),
  def('insights', 'manage', 'Manage insights'),
  def('media', 'view', 'View media library'),
  def('media', 'manage', 'Upload, edit and delete media'),
  def('seo', 'view', 'View SEO settings'),
  def('seo', 'manage', 'Manage SEO settings'),
  def('analytics', 'view', 'View analytics'),
  def('clients', 'view', 'View clients and their portal users'),
  def('clients', 'manage', 'Create and manage clients and portal access'),
  def('projects', 'view', 'View client projects'),
  def('projects', 'manage', 'Manage client projects, milestones, files, updates and messages'),
  def('users', 'view', 'View admin users'),
  def('users', 'manage', 'Manage admin users'),
  def('roles', 'manage', 'Manage roles and permissions'),
  def('settings', 'view', 'View site settings'),
  def('settings', 'manage', 'Manage site settings'),
  def('security', 'manage', 'Manage security settings'),
  def('audit', 'view', 'View the audit log'),
];

export const ALL_PERMISSION_KEYS = PERMISSIONS.map((p) => p.key);

/** Permissions that only a Super Admin can ever hold, regardless of role configuration. */
export const SUPER_ONLY = ['roles.manage', 'security.manage'];

export const SUPER_ROLE_KEY = 'SUPER_ADMIN';

export interface RoleDefault {
  key: string;
  name: string;
  description: string;
  permissions: string[];
}

const group = (module: string, ...actions: string[]) => actions.map((a) => `${module}.${a}`);

export const ROLE_DEFAULTS: RoleDefault[] = [
  { key: SUPER_ROLE_KEY, name: 'Super Admin', description: 'Full access, including roles, security and the audit log.', permissions: ALL_PERMISSION_KEYS },
  {
    key: 'ADMIN',
    name: 'Admin',
    description: 'Runs the website, demos, pricing, leads and content. Cannot change roles or security.',
    permissions: ALL_PERMISSION_KEYS.filter((k) => !SUPER_ONLY.includes(k) && k !== 'audit.view'),
  },
  {
    key: 'SALES',
    name: 'Sales',
    description: 'Works leads, inquiries and follow-ups. Read-only access to demos, services and estimates.',
    permissions: [
      'dashboard.view',
      ...group('leads', 'view', 'update', 'export'),
      ...group('inquiries', 'view', 'manage'),
      'estimator.view',
      'demos.view',
      'services.view',
      'solutions.view',
      'analytics.view',
      'clients.view',
      'projects.view',
    ],
  },
  {
    key: 'CONTENT_MANAGER',
    name: 'Content Manager',
    description: 'Manages website content, services, demos, case studies, insights, media and SEO. No pricing or CRM access.',
    permissions: [
      'dashboard.view',
      ...group('website', 'view', 'manage'),
      ...group('services', 'view', 'create', 'update', 'publish'),
      ...group('solutions', 'view', 'manage'),
      'technologies.view',
      ...group('demos', 'view', 'create', 'update', 'publish'),
      ...group('case_studies', 'view', 'manage'),
      ...group('testimonials', 'view', 'manage'),
      ...group('insights', 'view', 'manage'),
      ...group('media', 'view', 'manage'),
      ...group('seo', 'view', 'manage'),
    ],
  },
  {
    key: 'DEVELOPER',
    name: 'Developer',
    description: 'Maintains demo technical content, technologies and media. No CRM or pricing access.',
    permissions: ['dashboard.view', ...group('demos', 'view', 'update'), ...group('technologies', 'view', 'manage'), ...group('media', 'view', 'manage'), 'services.view', 'estimator.view', 'settings.view'],
  },
  {
    key: 'SUPPORT',
    name: 'Support',
    description: 'Handles general and support inquiries with read-only access to lead contact details.',
    permissions: ['dashboard.view', ...group('inquiries', 'view', 'manage'), 'leads.view'],
  },
];
