import type { Metadata } from 'next';
import { RestaurantDemoBar } from '@/components/demos/restaurant/restaurant-demo-bar';
import { RestaurantHeroVisual } from '@/components/demos/restaurant/restaurant-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { RESTAURANT_DEMO, RESTAURANT_EXPERIENCES } from '@/data/restaurant/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(RESTAURANT_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Restaurant Management System Demo',
    description: 'Explore a modern restaurant management website, dashboard, and mobile application design.',
    path: RESTAURANT_DEMO.basePath,
  });
}

/** Overview of the Restaurant Management demo and the way in to its three experiences. */
export default function RestaurantManagementPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...RESTAURANT_DEMO, experiences: RESTAURANT_EXPERIENCES }}
      bar={<RestaurantDemoBar active="overview" />}
      visual={<RestaurantHeroVisual />}
      sectionTitle="Built for how restaurants really run"
      closing={{ headline: 'Want restaurant software like this?', description: 'Tell us about your restaurant and we will shape the website, dashboard and mobile app around it.' }}
      disclaimer="This is a showcase concept, not a real restaurant’s system. All names, figures and menu items are fictional dummy data."
    />
  );
}
