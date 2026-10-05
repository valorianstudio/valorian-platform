import type { Metadata } from 'next';
import { CourseDemoBar } from '@/components/demos/course/course-demo-bar';
import { LazyCourseDashboard } from '@/components/demos/course/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { COURSE_DEMO, COURSE_EXPERIENCES, COURSE_THEME } from '@/data/course/meta';
import { buildMetadata } from '@/lib/cms';

const experience = COURSE_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Course LMS Dashboard Demo',
    description: 'Explore an LMS dashboard: courses, students, instructors, assignments, exams, certificates, analytics and messages. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working LMS. The interactive shell is a lazily loaded client component. */
export default function CourseWebsitePage() {
  return (
    <div style={COURSE_THEME}>
      <CourseDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Full website design"
        title="The learning platform, for admins and instructors"
        description="Courses, students, assessments, certificates and analytics in one clean interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Administrator and Instructor. Try sending a certificate or marking a submission.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: COURSE_DEMO.title, href: COURSE_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyCourseDashboard />
      </DemoExperienceIntro>
    </div>
  );
}
