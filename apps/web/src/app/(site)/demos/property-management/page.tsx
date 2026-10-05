import type { Metadata } from 'next';
import { PropertyDemoBar } from '@/components/demos/property/property-demo-bar';
import { PropertyHeroVisual } from '@/components/demos/property/property-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { PROPERTY_DEMO, PROPERTY_EXPERIENCES } from '@/data/property/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(PROPERTY_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'House & Building Management System Demo',
    description: 'Explore a modern property management website, building operations dashboard, and mobile application design created by Valorian Studio.',
    path: PROPERTY_DEMO.basePath,
  });
}

/** Overview of the Property demo and the way in to its three experiences. */
export default function PropertyManagementPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...PROPERTY_DEMO, experiences: PROPERTY_EXPERIENCES }}
      bar={<PropertyDemoBar active="overview" />}
      visual={<PropertyHeroVisual />}
      sectionTitle="Built for how property teams really run"
      closing={{ headline: 'Want property software like this?', description: 'Tell us how you manage buildings, rent and residents and we will shape the portal, back office and resident app around it.' }}
      disclaimer="This is a showcase concept, not a real property company’s system. All buildings, residents, rents and figures are fictional dummy data."
    />
  );
}
