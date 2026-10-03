import { LazyAnalyticsTracker } from '@/components/site/lazy';
import { JsonLd } from '@/components/site/seo';
import { SiteFooter } from '@/components/site/site-footer';
import { Skeleton } from '@/components/ui/skeleton';
import { getAnalyticsConfig, getNavigation, getSeoConfig, getServices, getSolutions } from '@/lib/cms';
import { getSiteSettings } from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';

/**
 * Parts of the page chrome that are not needed for first paint. Each is its own async component so the layout can
 * stream the header and page content first and let these resolve behind <Suspense> boundaries.
 */

const KNOWLEDGE = ['Custom software development', 'Web application development', 'SaaS development', 'AI solutions', 'Mobile app development', 'Cloud and DevOps'];

export async function SiteSchema() {
  const [settings, seo, services] = await Promise.all([getSiteSettings(), getSeoConfig(), getServices()]);
  const base = seo?.canonicalBaseUrl || SITE_URL;
  const name = seo?.siteName || settings.companyName;
  const absolute = (url: string | null | undefined) => (url ? (url.startsWith('/') ? `${base}${url}` : url) : undefined);
  const sameAs = [settings.linkedinUrl, settings.githubUrl, settings.twitterUrl, settings.facebookUrl, settings.instagramUrl].filter(Boolean);
  const logo = absolute(settings.logoLightUrl) ?? `${base}/branding/valorian-logo.png`;
  const image = absolute(seo?.defaultOgImageUrl) ?? `${base}/brand/og.png`;
  const catalog = (services?.services ?? []).slice(0, 12).map((service) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: service.title, description: service.shortDescription, url: `${base}/services/${service.slug}` },
  }));

  return (
    <JsonLd
      data={[
        {
          // schema.org has no "SoftwareCompany" type: a software firm is an Organization offering a ProfessionalService,
          // and additionalType links the more specific concept so search engines can still classify it.
          '@context': 'https://schema.org',
          '@type': ['Organization', 'ProfessionalService'],
          '@id': `${base}/#organization`,
          name,
          alternateName: settings.brandName,
          url: base,
          description: settings.description,
          slogan: settings.tagline,
          additionalType: 'https://en.wikipedia.org/wiki/Software_company',
          logo: { '@type': 'ImageObject', url: logo, width: 1190, height: 321 },
          image,
          email: settings.primaryEmail,
          telephone: settings.phone ?? undefined,
          address: settings.location ? { '@type': 'PostalAddress', addressLocality: settings.location } : undefined,
          areaServed: 'Worldwide',
          knowsAbout: KNOWLEDGE,
          priceRange: '$$',
          contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: settings.primaryEmail, availableLanguage: ['English'] }],
          sameAs: sameAs.length ? sameAs : undefined,
          hasOfferCatalog: catalog.length ? { '@type': 'OfferCatalog', name: `${name} services`, itemListElement: catalog } : undefined,
        },
        { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${base}/#website`, name, url: base, publisher: { '@id': `${base}/#organization` }, inLanguage: 'en' },
      ]}
    />
  );
}

export async function AnalyticsGate() {
  const analytics = await getAnalyticsConfig();
  return analytics.enabled ? <LazyAnalyticsTracker /> : null;
}

export async function FooterLoader() {
  const [settings, navigation, services, solutions] = await Promise.all([getSiteSettings(), getNavigation(), getServices(), getSolutions()]);
  return (
    <SiteFooter
      settings={settings}
      items={navigation.items}
      services={(services?.services ?? []).slice(0, 6).map((item) => ({ label: item.title, href: `/services/${item.slug}` }))}
      solutions={(solutions?.solutions ?? []).slice(0, 6).map((item) => ({ label: item.name, href: `/solutions/${item.slug}` }))}
    />
  );
}

/** Same height as the real footer on desktop, so content below the fold does not jump when it arrives. */
export function FooterSkeleton() {
  return (
    <div aria-hidden className="bg-slate">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-32 bg-white/10" />
            <Skeleton className="h-4 w-40 bg-white/10" />
            <Skeleton className="h-4 w-36 bg-white/10" />
            <Skeleton className="h-4 w-28 bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
