import type { Metadata } from 'next';
import { ClothingDemoBar } from '@/components/demos/clothing/clothing-demo-bar';
import { ClothingHeroVisual } from '@/components/demos/clothing/clothing-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { CLOTHING_DEMO, CLOTHING_EXPERIENCES } from '@/data/clothing/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(CLOTHING_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Clothing E-commerce Platform Demo',
    description: 'Explore a modern fashion e-commerce website, shopping dashboard, and mobile application design created by Valorian Studio.',
    path: CLOTHING_DEMO.basePath,
  });
}

/** Overview of the Clothing E-commerce demo and the way in to its three experiences. */
export default function ClothingEcommercePage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...CLOTHING_DEMO, experiences: CLOTHING_EXPERIENCES }}
      bar={<ClothingDemoBar active="overview" />}
      visual={<ClothingHeroVisual />}
      sectionTitle="Built for how fashion brands really sell"
      closing={{ headline: 'Want an online store like this?', description: 'Tell us about your brand and we will shape the landing page, store and shopping app around it.' }}
      disclaimer="This is a showcase concept, not a real brand’s store. All names, collections, prices and reviews are fictional dummy data."
    />
  );
}
