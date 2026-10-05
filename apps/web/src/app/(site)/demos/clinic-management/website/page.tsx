import type { Metadata } from 'next';
import { ClinicDemoBar } from '@/components/demos/clinic/clinic-demo-bar';
import { LazyClinicDashboard } from '@/components/demos/clinic/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { CLINIC_DEMO, CLINIC_EXPERIENCES, CLINIC_THEME } from '@/data/clinic/meta';
import { buildMetadata } from '@/lib/cms';

const experience = CLINIC_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Clinic Management Dashboard Demo',
    description: 'Explore a clinic management dashboard: patients, appointments, doctors, dental chart, prescriptions, billing and reports. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working platform. The interactive shell is a lazily loaded client component. */
export default function ClinicWebsitePage() {
  return (
    <div style={CLINIC_THEME}>
      <ClinicDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Full website design"
        title="The clinic platform, for every role"
        description="Patients, appointments, doctors, a dental chart, prescriptions and billing in one clean interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Clinic admin and Doctor. Try the dental chart under Medical Records.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: CLINIC_DEMO.title, href: CLINIC_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyClinicDashboard />
      </DemoExperienceIntro>
    </div>
  );
}
