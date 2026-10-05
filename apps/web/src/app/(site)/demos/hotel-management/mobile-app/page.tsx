import type { Metadata } from 'next';
import { HotelDemoBar } from '@/components/demos/hotel/hotel-demo-bar';
import { LazyHotelMobileApp } from '@/components/demos/hotel/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { HOTEL_DEMO, HOTEL_EXPERIENCES, HOTEL_THEME } from '@/data/hotel/meta';
import { buildMetadata } from '@/lib/cms';

const experience = HOTEL_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Hotel Management Mobile App Demo',
    description: 'Tap through a hotel guest app: room search, room details, booking, payment preview and stay history, plus the staff app.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a guest app and a staff app. */
export default function HotelMobileAppPage() {
  return (
    <div style={HOTEL_THEME}>
      <HotelDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Guest app design"
        title="Your stay, in your pocket"
        description="A guest app and a staff app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Choose a room, book it, then confirm the payment."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: HOTEL_DEMO.title, href: HOTEL_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyHotelMobileApp />
      </DemoExperienceIntro>
    </div>
  );
}
