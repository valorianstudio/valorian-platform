import { DemoBar } from '@/components/demos/shared/demo-bar';
import { COURSE_DEMO, COURSE_EXPERIENCES, COURSE_THEME } from '@/data/course/meta';
import type { CourseExperienceKey } from '@/data/course/meta';

/** Valorian's strip for the Course LMS demo, wired to its routes. `active` is the page it sits on. */
export function CourseDemoBar({ active }: { active: CourseExperienceKey | 'overview' }) {
  return (
    <div style={COURSE_THEME}>
      <DemoBar title={COURSE_DEMO.title} slug={COURSE_DEMO.slug} overviewHref={COURSE_DEMO.basePath} experiences={COURSE_EXPERIENCES} active={active} />
    </div>
  );
}
