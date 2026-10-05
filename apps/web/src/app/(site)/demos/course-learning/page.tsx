import type { Metadata } from 'next';
import { CourseDemoBar } from '@/components/demos/course/course-demo-bar';
import { CourseHeroVisual } from '@/components/demos/course/course-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { COURSE_DEMO, COURSE_EXPERIENCES } from '@/data/course/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(COURSE_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Course Learning Management System Demo',
    description: 'Explore a modern LMS website, learning dashboard, and mobile application design created by Valorian Studio.',
    path: COURSE_DEMO.basePath,
  });
}

/** Overview of the Course LMS demo and the way in to its three experiences. */
export default function CourseLearningPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...COURSE_DEMO, experiences: COURSE_EXPERIENCES }}
      bar={<CourseDemoBar active="overview" />}
      visual={<CourseHeroVisual />}
      sectionTitle="Built for how learning really works"
      closing={{ headline: 'Want a learning platform like this?', description: 'Tell us what you teach and we will shape the landing page, dashboard and student app around it.' }}
      disclaimer="This is a showcase concept, not a real academy’s platform. All names, courses, learners and figures are fictional dummy data."
    />
  );
}
