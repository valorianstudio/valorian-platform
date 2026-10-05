import type { Metadata } from 'next';
import { PharmacyLandingPage } from '@/components/demos/pharmacy/pharmacy-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { PHARMACY_DEMO, PHARMACY_EXPERIENCES } from '@/data/pharmacy/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PHARMACY_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Pharmacy Landing Page Demo',
    description: 'A digital pharmacy website: online medicine ordering, prescription management, categories, featured products, delivery information and a contact form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the pharmacy website as a standalone full-page preview (see the (preview) layout). */
export default function PharmacyLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PHARMACY_DEMO.title, href: PHARMACY_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <PharmacyLandingPage />
    </>
  );
}
