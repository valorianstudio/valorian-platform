import type { Metadata } from 'next';
import { LazySchoolWebsiteDemo } from '@/components/demos/school/lazy';
import { SchoolDemoBar } from '@/components/demos/school/school-demo-bar';
import { SchoolExperienceIntro } from '@/components/demos/school/school-experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { SCHOOL_DEMO, SCHOOL_EXPERIENCES } from '@/data/school/meta';
import { buildMetadata } from '@/lib/cms';

const experience = SCHOOL_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'School Management Website & Dashboard Demo',
    description: 'Explore a modern school management website: admin dashboard, student and teacher management, attendance, exams, results, fees, plus teacher and parent portals. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working platform. The interactive shell is a lazily loaded client component. */
export default function SchoolWebsitePage() {
  return (
    <>
      <SchoolDemoBar active="website" />
      <SchoolExperienceIntro
        eyebrow="Full website design"
        title="The school platform, for every role"
        description="Dashboards, student records, attendance, exams, results and fees in one clean interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Administrator, Teacher and Parent.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: SCHOOL_DEMO.title, href: SCHOOL_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazySchoolWebsiteDemo />
      </SchoolExperienceIntro>
    </>
  );
}
