import type { Metadata } from 'next';
import { HotelDemoBar } from '@/components/demos/hotel/hotel-demo-bar';
import { LazyHotelDashboard } from '@/components/demos/hotel/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { HOTEL_DEMO, HOTEL_EXPERIENCES, HOTEL_THEME } from '@/data/hotel/meta';
import { buildMetadata } from '@/lib/cms';

const experience = HOTEL_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Hotel Management Dashboard Demo',
    description: 'Explore a hotel management dashboard: reservations, rooms, guests, staff, housekeeping, payments and analytics. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working hotel platform. The interactive shell is a lazily loaded client component. */
export default function HotelWebsitePage() {
  return (
    <div style={HOTEL_THEME}>
      <HotelDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Hotel dashboard design"
        title="Every room, every guest, one screen"
        description="Reservations, room status, guest profiles, housekeeping and billing in one calm interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between the Front desk manager and the Housekeeping lead.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: HOTEL_DEMO.title, href: HOTEL_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyHotelDashboard />
      </DemoExperienceIntro>
    </div>
  );
}
