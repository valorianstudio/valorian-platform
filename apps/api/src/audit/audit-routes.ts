/**
 * Maps admin mutation routes to the entity they change, so the audit interceptor can
 * capture before/after values without every controller having to log by hand.
 * Routes that are not listed (users, roles, security, auth) log explicitly in their own services.
 */

export type BaseAction = 'create' | 'update' | 'delete' | 'archive' | 'restore' | 'status' | 'settings' | 'order' | 'collection';

export interface AuditTarget {
  module: string;
  entityType: string;
  entityId?: string;
  /** Singleton rows have a fixed primary key. */
  fixedId?: string;
  base: BaseAction;
  note?: string;
}

const CMS: Record<string, [module: string, entity: string]> = {
  services: ['services', 'Service'],
  solutions: ['solutions', 'Industry'],
  technologies: ['technologies', 'Technology'],
  process: ['website', 'ProcessStep'],
  values: ['website', 'ValueProp'],
  faqs: ['website', 'Faq'],
  ctas: ['website', 'Cta'],
  navigation: ['website', 'NavigationItem'],
  work: ['website', 'FeaturedWork'],
  'demo-categories': ['demos', 'DemoCategory'],
  'estimator-types': ['pricing', 'EstimatorProjectType'],
  'estimator-categories': ['pricing', 'EstimatorCategory'],
  'estimator-features': ['pricing', 'EstimatorFeature'],
  'estimator-integrations': ['pricing', 'EstimatorIntegration'],
  'estimator-complexity': ['pricing', 'EstimatorComplexity'],
  'estimator-rules': ['pricing', 'EstimatorPricingRule'],
  testimonials: ['testimonials', 'Testimonial'],
  'article-categories': ['insights', 'ArticleCategory'],
};

const SINGLETONS: Record<string, AuditTarget> = {
  seo: { module: 'seo', entityType: 'SeoSettings', fixedId: 'seo', base: 'settings' },
  settings: { module: 'settings', entityType: 'SiteSetting', fixedId: 'site', base: 'settings' },
  'settings/footer': { module: 'website', entityType: 'SiteSetting', fixedId: 'site', base: 'settings', note: 'footer' },
  'estimator/settings': { module: 'pricing', entityType: 'EstimatorSettings', fixedId: 'estimator', base: 'settings' },
  'analytics/settings': { module: 'settings', entityType: 'AnalyticsSettings', fixedId: 'analytics', base: 'settings' },
  'leads/settings': { module: 'settings', entityType: 'LeadSettings', fixedId: 'leads', base: 'settings' },
};

const methodBase = (method: string): BaseAction | null => (method === 'POST' ? 'create' : method === 'PATCH' || method === 'PUT' ? 'update' : method === 'DELETE' ? 'delete' : null);

export function resolveTarget(method: string, path: string): AuditTarget | null {
  const base = methodBase(method);
  if (!base) return null;
  let m: RegExpExecArray | null;

  if ((m = /^\/admin\/cms\/([a-z-]+)(?:\/(order)|\/([^/]+))?$/.exec(path))) {
    const entry = CMS[m[1]];
    if (!entry) return null;
    if (m[2]) return { module: entry[0], entityType: entry[1], base: 'order', note: m[1] };
    return { module: entry[0], entityType: entry[1], entityId: m[3], base };
  }

  if ((m = /^\/admin\/demos(?:\/(order)|\/([^/]+)(?:\/(platforms\/[a-z]+|features|modules|screenshots|points|duplicate))?)?$/.exec(path))) {
    if (m[1]) return { module: 'demos', entityType: 'Demo', base: 'order', note: 'demos' };
    if (m[3] === 'duplicate') return { module: 'demos', entityType: 'Demo', entityId: m[2], base: 'create', note: 'duplicated' };
    if (m[3]) return { module: 'demos', entityType: 'Demo', entityId: m[2], base: 'collection', note: m[3] };
    return { module: 'demos', entityType: 'Demo', entityId: m[2], base };
  }

  if ((m = /^\/admin\/(case-studies|articles)(?:\/([^/]+)(?:\/(media))?)?$/.exec(path))) {
    const study = m[1] === 'case-studies';
    const module = study ? 'case_studies' : 'insights';
    const entityType = study ? 'CaseStudy' : 'Article';
    return m[3] ? { module, entityType, entityId: m[2], base: 'collection', note: 'media' } : { module, entityType, entityId: m[2], base };
  }

  if ((m = /^\/admin\/pages\/([a-z_]+)(?:\/(order)|\/sections\/([a-zA-Z]+))?$/.exec(path))) {
    const key = m[1].toUpperCase();
    if (m[2]) return { module: 'website', entityType: 'Page', entityId: key, base: 'order', note: `${key.toLowerCase()} sections` };
    if (m[3]) return { module: 'website', entityType: 'PageSection', entityId: `${key}:${m[3]}`, base: 'update' };
    return { module: 'seo', entityType: 'Page', entityId: key, base: 'update' };
  }

  if ((m = /^\/admin\/leads\/(?:(settings)|notes\/[^/]+|([^/]+)(?:\/(status|notes|activities|archive|restore))?)$/.exec(path))) {
    if (m[1]) return SINGLETONS['leads/settings'];
    if (m[3] === 'notes' || m[3] === 'activities' || !m[2]) return null;
    if (m[3] === 'status') return { module: 'leads', entityType: 'Lead', entityId: m[2], base: 'status' };
    if (m[3] === 'archive' || m[3] === 'restore') return { module: 'leads', entityType: 'Lead', entityId: m[2], base: m[3] };
    return { module: 'leads', entityType: 'Lead', entityId: m[2], base };
  }

  if ((m = /^\/admin\/inquiries\/([^/]+)$/.exec(path))) return { module: 'inquiries', entityType: 'ContactInquiry', entityId: m[1], base: 'update' };
  if ((m = /^\/admin\/media(?:\/([^/]+))?$/.exec(path))) return { module: 'media', entityType: 'Media', entityId: m[1], base };

  if ((m = /^\/admin\/(seo|settings|settings\/footer|estimator\/settings|analytics\/settings)$/.exec(path))) return SINGLETONS[m[1]] ?? null;
  return null;
}

/** Field names whose change counts as a pricing change. */
export const PRICE_KEYS = ['websitePrice', 'mobilePrice', 'bothPrice', 'basePrice', 'baseWeeks', 'multiplier', 'timelineFactor', 'rangeLowPercent', 'rangeHighPercent', 'bothDiscountPercent', 'roundingStep', 'currency', 'effortDays'];

/** Prisma delegate names and key shape for each audited entity. */
export const ENTITY_DELEGATES: Record<string, { delegate: string; where?: (id: string) => object }> = {
  Service: { delegate: 'service' },
  Industry: { delegate: 'industry' },
  Technology: { delegate: 'technology' },
  ProcessStep: { delegate: 'processStep' },
  ValueProp: { delegate: 'valueProp' },
  Faq: { delegate: 'faq' },
  Cta: { delegate: 'cta' },
  NavigationItem: { delegate: 'navigationItem' },
  FeaturedWork: { delegate: 'featuredWork' },
  DemoCategory: { delegate: 'demoCategory' },
  EstimatorProjectType: { delegate: 'estimatorProjectType' },
  EstimatorCategory: { delegate: 'estimatorCategory' },
  EstimatorFeature: { delegate: 'estimatorFeature' },
  EstimatorIntegration: { delegate: 'estimatorIntegration' },
  EstimatorComplexity: { delegate: 'estimatorComplexity' },
  EstimatorPricingRule: { delegate: 'estimatorPricingRule' },
  Testimonial: { delegate: 'testimonial' },
  ArticleCategory: { delegate: 'articleCategory' },
  Demo: { delegate: 'demo' },
  CaseStudy: { delegate: 'caseStudy' },
  Article: { delegate: 'article' },
  Lead: { delegate: 'lead' },
  ContactInquiry: { delegate: 'contactInquiry' },
  Media: { delegate: 'media' },
  SeoSettings: { delegate: 'seoSettings' },
  SiteSetting: { delegate: 'siteSetting' },
  EstimatorSettings: { delegate: 'estimatorSettings' },
  AnalyticsSettings: { delegate: 'analyticsSettings' },
  LeadSettings: { delegate: 'leadSettings' },
  Page: { delegate: 'page', where: (id) => ({ key: id }) },
  PageSection: { delegate: 'pageSection', where: (id) => ({ pageKey_key: { pageKey: id.split(':')[0], key: id.split(':')[1] } }) },
};
