import type { Metadata } from 'next';
import { HotelLandingPage } from '@/components/demos/hotel/hotel-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { HOTEL_DEMO, HOTEL_EXPERIENCES } from '@/data/hotel/meta';
import { buildMetadata } from '@/lib/cms';

const experience = HOTEL_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Hotel Management Landing Page Demo',
    description: 'A luxury hotel booking website: a booking widget, room categories, facilities, offers, location and a request-a-stay form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the hotel website as a standalone full-page preview (see the (preview) layout). */
export default function HotelLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: HOTEL_DEMO.title, href: HOTEL_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <HotelLandingPage />
    </>
  );
}
