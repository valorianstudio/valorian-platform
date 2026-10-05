import type { Metadata } from 'next';
import { ClinicDemoBar } from '@/components/demos/clinic/clinic-demo-bar';
import { ClinicHeroVisual } from '@/components/demos/clinic/clinic-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { CLINIC_DEMO, CLINIC_EXPERIENCES } from '@/data/clinic/meta';
import { getDemo } from '@/data/demos';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(CLINIC_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Clinic Management System Demo',
    description: 'Modern clinic and dental care management website, dashboard, and mobile app design.',
    path: CLINIC_DEMO.basePath,
  });
}

/** Overview of the Clinic Management demo and the way in to its three experiences. */
export default function ClinicManagementPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...CLINIC_DEMO, experiences: CLINIC_EXPERIENCES }}
      bar={<ClinicDemoBar active="overview" />}
      visual={<ClinicHeroVisual />}
      sectionTitle="Built for how clinics really run"
      closing={{ headline: 'Want clinic software like this?', description: 'Tell us about your clinic and we will shape the landing page, dashboard and mobile app around it.' }}
      disclaimer="This is a showcase concept, not a real clinic’s system. All names, figures and patient data are fictional dummy data."
    />
  );
}
