import type { Metadata } from 'next';
import { CourseDemoBar } from '@/components/demos/course/course-demo-bar';
import { LazyCourseMobileApp } from '@/components/demos/course/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { COURSE_DEMO, COURSE_EXPERIENCES, COURSE_THEME } from '@/data/course/meta';
import { buildMetadata } from '@/lib/cms';

const experience = COURSE_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Course LMS Mobile App Demo',
    description: 'Tap through realistic student and instructor mobile app screens: course list, video lessons, quizzes, progress and content upload.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a student app and an instructor app. */
export default function CourseMobileAppPage() {
  return (
    <div style={COURSE_THEME}>
      <CourseDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="Learning on the go"
        description="A student app and an instructor app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Try enrolling in a course, then play the lesson and answer the quiz."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: COURSE_DEMO.title, href: COURSE_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyCourseMobileApp />
      </DemoExperienceIntro>
    </div>
  );
}
