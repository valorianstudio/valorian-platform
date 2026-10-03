import { Suspense } from 'react';
import { Wrench } from 'lucide-react';
import { AnalyticsGate, FooterLoader, FooterSkeleton, SiteSchema } from '@/components/site/site-chrome';
import { SiteHeader } from '@/components/site/site-header';
import { Splash } from '@/components/site/splash';
import { getNavigation } from '@/lib/cms';
import { getSiteSettings } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Only what the header and maintenance gate need blocks the first byte. Footer, structured data and analytics stream in behind Suspense.
  const [settings, navigation] = await Promise.all([getSiteSettings(), getNavigation()]);
  const headerItems = navigation.items.filter((item) => item.location === 'HEADER');

  return (
    <>
      <Splash />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <Suspense fallback={null}>
        <SiteSchema />
        <AnalyticsGate />
      </Suspense>
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
      <Suspense fallback={<FooterSkeleton />}>
        <FooterLoader />
      </Suspense>
    </>
  );
}
