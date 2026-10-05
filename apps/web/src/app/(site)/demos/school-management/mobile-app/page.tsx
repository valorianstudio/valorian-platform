import type { Metadata } from 'next';
import { LazySchoolMobileDemo } from '@/components/demos/school/lazy';
import { SchoolDemoBar } from '@/components/demos/school/school-demo-bar';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { SCHOOL_DEMO, SCHOOL_EXPERIENCES } from '@/data/school/meta';
import { buildMetadata } from '@/lib/cms';

const experience = SCHOOL_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'School Management Mobile App Demo',
    description: 'Tap through realistic student and teacher mobile app screens: login, home, attendance, results, schedule, announcements and attendance marking. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a student app and a teacher app. */
export default function SchoolMobileAppPage() {
  return (
    <>
      <SchoolDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="School life, one tap away"
        description="A student app and a teacher app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Switch between the student and teacher apps with the tabs."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: SCHOOL_DEMO.title, href: SCHOOL_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazySchoolMobileDemo />
      </DemoExperienceIntro>
    </>
  );
}
