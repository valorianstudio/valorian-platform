import type { Metadata } from 'next';
import { PharmacyDemoBar } from '@/components/demos/pharmacy/pharmacy-demo-bar';
import { PharmacyHeroVisual } from '@/components/demos/pharmacy/pharmacy-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { PHARMACY_DEMO, PHARMACY_EXPERIENCES } from '@/data/pharmacy/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(PHARMACY_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Pharmacy Management System Demo',
    description: 'Explore a modern pharmacy management website, healthcare dashboard, and mobile application design created by Valorian Studio.',
    path: PHARMACY_DEMO.basePath,
  });
}

/** Overview of the Pharmacy demo and the way in to its three experiences. */
export default function PharmacyManagementPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...PHARMACY_DEMO, experiences: PHARMACY_EXPERIENCES }}
      bar={<PharmacyDemoBar active="overview" />}
      visual={<PharmacyHeroVisual />}
      sectionTitle="Built for how pharmacies really run"
      closing={{ headline: 'Want pharmacy software like this?', description: 'Tell us how you dispense and serve patients and we will shape the pharmacy site, back office and customer app around it.' }}
      disclaimer="This is a showcase concept, not a real pharmacy’s system. All names, medicines, prescriptions, patients and figures are fictional dummy data."
    />
  );
}
