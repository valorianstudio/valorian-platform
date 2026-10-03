import { ApiUnavailable } from '@/components/ui/api-unavailable';
import { SectionBoundary } from '@/components/ui/error-boundary';
import type { Metadata } from 'next';
import { CapabilitySection, CtaBand, DemoSection, ProcessSection, TechSection, WhySection } from '@/components/site/blocks';
import { CaseStudiesSection, InsightsSection, TestimonialsSection } from '@/components/site/editorial';
import { CapabilityBar } from '@/components/site/home/capability-bar';
import { Hero } from '@/components/site/home/hero';
import { buildMetadata, findSection, getHome } from '@/lib/cms';
import type { CtaContent, HeroContent, HomeData, IntroContent } from '@/lib/cms-types';
import { getSiteSettings } from '@/lib/server-api';

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  return buildMetadata(home?.seo, { title: `${settings.companyName} | Software Development Company`, description: settings.description, path: '/' });
}

function renderSection(key: string, home: HomeData) {
  const content = findSection<IntroContent & HeroContent & CtaContent>(home.sections, key);
  if (!content) return null;
  switch (key) {
    case 'hero':
      return <Hero content={content} />;
    case 'capabilities':
      return <CapabilitySection intro={content} services={home.services} />;
    case 'why':
      return <WhySection intro={content} values={home.values} />;
    case 'featuredWork':
      return <DemoSection intro={content} demos={home.demos} />;
    case 'process':
      return <ProcessSection intro={content} steps={home.steps} />;
    case 'technology':
      return <TechSection intro={content} technologies={home.technologies} />;
    case 'caseStudies':
      return <CaseStudiesSection intro={content} items={home.caseStudies} />;
    case 'testimonials':
      return <TestimonialsSection intro={content} items={home.testimonials} />;
    case 'insights':
      return <InsightsSection intro={content} items={home.articles} tone="surface" />;
    case 'cta':
      return <CtaBand content={content} />;
    default:
      return null;
  }
}

export default async function HomePage() {
  const home = await getHome();
  if (!home) return <ApiUnavailable what="The homepage" />;

  return (
    <>
      {home.sections.map((section) => (
        // One failing block (for example a bad image URL in a testimonial) must never take the whole homepage down.
        <SectionBoundary key={section.key}>
          {renderSection(section.key, home)}
          {section.key === 'hero' && <CapabilityBar />}
        </SectionBoundary>
      ))}
    </>
  );
}
