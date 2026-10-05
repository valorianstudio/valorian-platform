import type { Metadata } from 'next';
import { CourseLandingPage } from '@/components/demos/course/course-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { COURSE_DEMO, COURSE_EXPERIENCES } from '@/data/course/meta';
import { buildMetadata } from '@/lib/cms';

const experience = COURSE_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Course LMS Landing Page Demo',
    description: 'A premium education platform website: course categories, featured instructors, student stories, pricing and a free-trial form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the education website as a standalone full-page preview (see the (preview) layout). */
export default function CourseLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: COURSE_DEMO.title, href: COURSE_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <CourseLandingPage />
    </>
  );
}
