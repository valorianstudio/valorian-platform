import { ApiUnavailable } from '@/components/ui/api-unavailable';
import type { Metadata } from 'next';
import { CtaBand, FaqSection, ProcessSection, ServiceGrid } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { Section } from '@/components/ui/section';
import { buildMetadata, findSection, getServices } from '@/lib/cms';
import type { CtaContent, PageHeroContent } from '@/lib/cms-types';

const FALLBACK = { title: 'Services', description: 'Custom software, web applications, SaaS, mobile apps, AI integration and backend engineering.', path: '/services' };

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata((await getServices())?.seo, FALLBACK);
}

export default async function ServicesPage() {
  const data = await getServices();
  if (!data) return <ApiUnavailable what="Services" />;
  const hero = findSection<PageHeroContent>(data.sections, 'hero');
  const cta = findSection<CtaContent>(data.sections, 'cta');

  return (
    <>
      <PageHero eyebrow={hero?.eyebrow ?? 'Services'} title={hero?.title ?? 'Services'} description={hero?.description ?? FALLBACK.description} />
      <Section>{data.services.length > 0 ? <ServiceGrid services={data.services} /> : <p className="text-muted">Services will be listed here soon.</p>}</Section>
      <ProcessSection intro={{ eyebrow: 'How we work', title: 'A clear path from idea to scale' }} steps={data.steps} />
      <FaqSection faqs={data.faqs} />
      {cta && <CtaBand content={cta} />}
    </>
  );
}
