import type { Metadata } from 'next';
import { PetshopDemoBar } from '@/components/demos/petshop/petshop-demo-bar';
import { PetshopHeroVisual } from '@/components/demos/petshop/petshop-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { PETSHOP_DEMO, PETSHOP_EXPERIENCES } from '@/data/petshop/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(PETSHOP_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Pet Shop Management System Demo',
    description: 'Explore a modern pet shop management website, business dashboard, and mobile application design created by Valorian Studio.',
    path: PETSHOP_DEMO.basePath,
  });
}

/** Overview of the Pet Shop demo and the way in to its three experiences. */
export default function PetShopManagementPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...PETSHOP_DEMO, experiences: PETSHOP_EXPERIENCES }}
      bar={<PetshopDemoBar active="overview" />}
      visual={<PetshopHeroVisual />}
      sectionTitle="Built for how pet shops really run"
      closing={{ headline: 'Want pet shop software like this?', description: 'Tell us how you sell and care for pets and we will shape the shop site, back office and mobile app around it.' }}
      disclaimer="This is a showcase concept, not a real pet shop’s system. All names, pets, customers and figures are fictional dummy data."
    />
  );
}
