import { Wrench } from 'lucide-react';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { getSiteSettings } from '@/lib/server-api';

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <SiteHeader brandName={settings.brandName} />
      <main id="main" className="min-h-[70vh]">
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
      <SiteFooter settings={settings} />
    </>
  );
}
