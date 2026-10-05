import { DemoBar } from '@/components/demos/shared/demo-bar';
import { GYM_DEMO, GYM_EXPERIENCES, GYM_THEME } from '@/data/gym/meta';
import type { GymExperienceKey } from '@/data/gym/meta';

/** Valorian's strip for the Gym Management demo, wired to its routes. `active` is the page it sits on. */
export function GymDemoBar({ active }: { active: GymExperienceKey | 'overview' }) {
  return (
    <div style={GYM_THEME}>
      <DemoBar title={GYM_DEMO.title} slug={GYM_DEMO.slug} overviewHref={GYM_DEMO.basePath} experiences={GYM_EXPERIENCES} active={active} />
    </div>
  );
}
