import type { Metadata } from 'next';
import { PropertyLandingPage } from '@/components/demos/property/property-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { PROPERTY_DEMO, PROPERTY_EXPERIENCES } from '@/data/property/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PROPERTY_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Property Management Landing Page Demo',
    description: 'A property management website: smart living features, property types, a building gallery, testimonials, pricing and an enquiry form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the property website as a standalone full-page preview (see the (preview) layout). */
export default function PropertyLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PROPERTY_DEMO.title, href: PROPERTY_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <PropertyLandingPage />
    </>
  );
}
