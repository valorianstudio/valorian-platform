export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.valorianstudio.com';

export const PUBLIC_ROUTES = ['/', '/services', '/solutions', '/demos', '/about', '/contact', '/estimate', '/case-studies', '/insights', '/privacy', '/terms'] as const;

/**
 * Keyword-friendly service URLs that map onto the slugs used in the CMS. A request for an alias is permanently redirected to the real
 * page only when no service owns the alias slug itself, so renaming a service to the alias in the admin panel can never cause a loop.
 */
export const SERVICE_ALIASES: Record<string, string> = {
  'web-development': 'web-application-development',
  'ai-solutions': 'ai-integration',
  'custom-software': 'custom-software-development',
};
