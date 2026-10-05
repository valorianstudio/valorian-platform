import type { Metadata } from 'next';
import { ClinicDemoBar } from '@/components/demos/clinic/clinic-demo-bar';
import { LazyClinicMobileApp } from '@/components/demos/clinic/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { CLINIC_DEMO, CLINIC_EXPERIENCES, CLINIC_THEME } from '@/data/clinic/meta';
import { buildMetadata } from '@/lib/cms';

const experience = CLINIC_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Clinic Management Mobile App Demo',
    description: 'Tap through realistic patient and doctor mobile app screens: booking, doctor search, records, prescriptions, schedule and notes.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a patient app and a doctor app. */
export default function ClinicMobileAppPage() {
  return (
    <div style={CLINIC_THEME}>
      <ClinicDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="Healthcare in your pocket"
        description="A patient app and a doctor app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Try booking an appointment, then switch to the doctor app."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: CLINIC_DEMO.title, href: CLINIC_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyClinicMobileApp />
      </DemoExperienceIntro>
    </div>
  );
}
