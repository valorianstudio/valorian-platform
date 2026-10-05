import type { Metadata } from 'next';
import { HotelDemoBar } from '@/components/demos/hotel/hotel-demo-bar';
import { HotelHeroVisual } from '@/components/demos/hotel/hotel-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { HOTEL_DEMO, HOTEL_EXPERIENCES } from '@/data/hotel/meta';
import { getDemo } from '@/data/demos';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(HOTEL_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Hotel Management System Demo',
    description: 'Explore a modern hotel management website, reservation dashboard, and mobile application design created by Valorian Studio.',
    path: HOTEL_DEMO.basePath,
  });
}

/** Overview of the Hotel Management demo and the way in to its three experiences. */
export default function HotelManagementPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...HOTEL_DEMO, experiences: HOTEL_EXPERIENCES }}
      bar={<HotelDemoBar active="overview" />}
      visual={<HotelHeroVisual />}
      sectionTitle="Built for how hotels really run"
      closing={{ headline: 'Want hotel software like this?', description: 'Tell us about your property and we will shape the booking site, dashboard and guest app around it.' }}
      disclaimer="This is a showcase concept, not a real hotel’s system. All names, rooms, rates and guest data are fictional dummy data."
    />
  );
}
