import { DemoBar } from '@/components/demos/shared/demo-bar';
import { SCHOOL_DEMO, SCHOOL_EXPERIENCES } from '@/data/school/meta';
import type { SchoolExperienceKey } from '@/data/school/meta';

/** Valorian's strip for the School Management demo, wired to its routes. `active` is the page it sits on. */
export function SchoolDemoBar({ active }: { active: SchoolExperienceKey | 'overview' }) {
  return <DemoBar title={SCHOOL_DEMO.title} slug={SCHOOL_DEMO.slug} overviewHref={SCHOOL_DEMO.basePath} experiences={SCHOOL_EXPERIENCES} active={active} />;
}
