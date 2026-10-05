import type { Metadata } from 'next';
import { ClinicDemoBar } from '@/components/demos/clinic/clinic-demo-bar';
import { ClinicLandingPage } from '@/components/demos/clinic/clinic-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { CLINIC_DEMO, CLINIC_EXPERIENCES } from '@/data/clinic/meta';
import { buildMetadata } from '@/lib/cms';

const experience = CLINIC_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Clinic Management Landing Page Demo',
    description: 'A premium healthcare landing page for clinic and dental management software: features, dental chart, doctors, results and a demo request form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the marketing site. Server-rendered end to end; the only client code is the small demo form. */
export default function ClinicLandingPageRoute() {
  return (
    <>
      <ClinicDemoBar active="landing-page" />
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: CLINIC_DEMO.title, href: CLINIC_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <ClinicLandingPage />
    </>
  );
}
