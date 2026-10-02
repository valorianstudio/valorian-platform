import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { EstimatorWizard } from '@/components/site/estimator/wizard';
import { ButtonLink } from '@/components/ui/button';
import { getEstimatorConfig, getLeadConfig } from '@/lib/cms';
import { getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = {
  title: 'Estimate Your Project',
  description: 'Configure your project and get an instant estimate of the investment and timeline.',
  alternates: { canonical: '/estimate' },
};

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

export default async function EstimatePage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of ['demo', 'type', 'industry']) {
    const value = first(params[key]).slice(0, 80);
    if (value) query.set(key, value);
  }
  const [config, settings, leadConfig] = await Promise.all([getEstimatorConfig(query.toString()), getSiteSettings(), getLeadConfig()]);
  if (!config) throw new Error('Estimator is unavailable.');

  return (
    <>
      <PageHero eyebrow="Estimator" title="Estimate your project" description="Answer a few quick questions and get an indicative investment range and timeline. No sign-up needed." />
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        {config.enabled && config.projectTypes.length > 0 ? (
          <EstimatorWizard config={config} company={settings.companyName} whatsappNumber={settings.whatsapp} responseNote={leadConfig?.responseNote} />
        ) : (
          <div className="rounded-2xl border border-border p-10 text-center">
            <h2 className="text-xl font-semibold">The estimator is temporarily unavailable</h2>
            <p className="mt-2 text-muted">Tell us about your project directly and we will prepare a tailored quote.</p>
            <ButtonLink href="/contact" className="mt-6">Contact us</ButtonLink>
          </div>
        )}
      </div>
    </>
  );
}
