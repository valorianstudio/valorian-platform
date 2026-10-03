import { Wrench } from 'lucide-react';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { AnalyticsTracker } from '@/components/site/analytics-tracker';
import { JsonLd } from '@/components/site/seo';
import { getAnalyticsConfig, getNavigation, getSeoConfig, getServices, getSolutions } from '@/lib/cms';
import { SITE_URL } from '@/lib/site';
import { getSiteSettings } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, navigation, seo, analytics, services, solutions] = await Promise.all([getSiteSettings(), getNavigation(), getSeoConfig(), getAnalyticsConfig(), getServices(), getSolutions()]);
  const base = seo?.canonicalBaseUrl || SITE_URL;
  const absolute = (url: string | null) => (url ? (url.startsWith('/') ? `${base}${url}` : url) : undefined);
  const sameAs = [settings.linkedinUrl, settings.githubUrl, settings.twitterUrl, settings.facebookUrl, settings.instagramUrl].filter(Boolean);
  const headerItems = navigation.items.filter((item) => item.location === 'HEADER');

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: seo?.siteName || settings.companyName,
            url: base,
            description: settings.description,
            logo: absolute(settings.logoLightUrl),
            email: settings.primaryEmail,
            telephone: settings.phone ?? undefined,
            sameAs: sameAs.length ? sameAs : undefined,
          },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: seo?.siteName || settings.companyName, url: base },
        ]}
      />
      {analytics.enabled && <AnalyticsTracker />}
      <SiteHeader brandName={settings.brandName} items={headerItems} cta={navigation.cta} />
      <main id="main" className="min-h-[70vh] pt-16 lg:pt-[4.5rem]">
        {settings.maintenanceMode ? (
          <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
              <Wrench className="size-5" aria-hidden />
            </span>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">We&rsquo;ll be right back</h1>
            <p className="mt-3 text-muted">
              {settings.companyName} is undergoing scheduled maintenance. Reach us any time at{' '}
              <a className="font-medium text-foreground underline underline-offset-4" href={`mailto:${settings.primaryEmail}`}>
                {settings.primaryEmail}
              </a>
              .
            </p>
          </div>
        ) : (
          children
        )}
      </main>
      <SiteFooter
        settings={settings}
        items={navigation.items}
        services={(services?.services ?? []).slice(0, 6).map((item) => ({ label: item.title, href: `/services/${item.slug}` }))}
        solutions={(solutions?.solutions ?? []).slice(0, 6).map((item) => ({ label: item.name, href: `/solutions/${item.slug}` }))}
      />
    </>
  );
}
