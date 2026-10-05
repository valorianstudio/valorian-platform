import type { Metadata } from 'next';
import { DeliveryLandingPage } from '@/components/demos/delivery/delivery-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { DELIVERY_DEMO, DELIVERY_EXPERIENCES } from '@/data/delivery/meta';
import { buildMetadata } from '@/lib/cms';

const experience = DELIVERY_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Delivery Service Landing Page Demo',
    description: 'A professional delivery startup website: a live tracking hero, service categories, how it works, testimonials, pricing and a booking form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the delivery website as a standalone full-page preview (see the (preview) layout). */
export default function BikeDeliveryLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: DELIVERY_DEMO.title, href: DELIVERY_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <DeliveryLandingPage />
    </>
  );
}
