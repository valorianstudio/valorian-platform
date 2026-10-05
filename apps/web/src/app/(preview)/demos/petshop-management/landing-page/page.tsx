import type { Metadata } from 'next';
import { PetshopLandingPage } from '@/components/demos/petshop/petshop-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { PETSHOP_DEMO, PETSHOP_EXPERIENCES } from '@/data/petshop/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PETSHOP_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Pet Shop Landing Page Demo',
    description: 'A pet shop website: pet categories, grooming and vet services, offers, reviews, pricing and a booking form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the pet shop website as a standalone full-page preview (see the (preview) layout). */
export default function PetShopLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PETSHOP_DEMO.title, href: PETSHOP_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <PetshopLandingPage />
    </>
  );
}
