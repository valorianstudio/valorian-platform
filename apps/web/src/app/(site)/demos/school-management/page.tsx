import type { Metadata } from 'next';
import { DashboardPreview } from '@/components/demos/school/dashboard-preview';
import { SchoolDemoBar } from '@/components/demos/school/school-demo-bar';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { SCHOOL_DEMO, SCHOOL_EXPERIENCES } from '@/data/school/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(SCHOOL_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'School Management System Demo',
    description: 'Explore a modern school management website, dashboard, and mobile app design created by Valorian Studio.',
    path: SCHOOL_DEMO.basePath,
  });
}

/** Overview of the School Management demo and the way in to its three experiences. */
export default function SchoolManagementPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...SCHOOL_DEMO, experiences: SCHOOL_EXPERIENCES }}
      bar={<SchoolDemoBar active="overview" />}
      visual={<DashboardPreview />}
      sectionTitle="Built for how schools really run"
      closing={{ headline: 'Want a school platform like this?', description: 'Tell us about your school and we will shape the landing page, website and mobile app around it.' }}
      disclaimer="This is a showcase concept, not a real school’s system. All names, figures and content are fictional dummy data."
    />
  );
}
