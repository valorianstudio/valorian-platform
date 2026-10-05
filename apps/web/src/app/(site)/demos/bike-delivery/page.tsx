import type { Metadata } from 'next';
import { DeliveryDemoBar } from '@/components/demos/delivery/delivery-demo-bar';
import { DeliveryHeroVisual } from '@/components/demos/delivery/delivery-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { DELIVERY_DEMO, DELIVERY_EXPERIENCES } from '@/data/delivery/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(DELIVERY_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Bike Ride & Delivery Management System Demo',
    description: 'Explore a modern delivery management website, logistics dashboard, and rider mobile application design created by Valorian Studio.',
    path: DELIVERY_DEMO.basePath,
  });
}

/** Overview of the Bike Delivery demo and the way in to its three experiences. */
export default function BikeDeliveryPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...DELIVERY_DEMO, experiences: DELIVERY_EXPERIENCES }}
      bar={<DeliveryDemoBar active="overview" />}
      visual={<DeliveryHeroVisual />}
      sectionTitle="Built for how delivery businesses really run"
      closing={{ headline: 'Want delivery software like this?', description: 'Tell us how you deliver and we will shape the booking site, dispatch dashboard and rider app around it.' }}
      disclaimer="This is a showcase concept, not a real delivery company’s system. All names, riders, routes and figures are fictional dummy data."
    />
  );
}
