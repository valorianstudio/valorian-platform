import { DemoBar } from '@/components/demos/shared/demo-bar';
import { CLOTHING_DEMO, CLOTHING_EXPERIENCES, CLOTHING_THEME } from '@/data/clothing/meta';
import type { ClothingExperienceKey } from '@/data/clothing/meta';

/** Valorian's strip for the Clothing E-commerce demo, wired to its routes. `active` is the page it sits on. */
export function ClothingDemoBar({ active }: { active: ClothingExperienceKey | 'overview' }) {
  return (
    <div style={CLOTHING_THEME}>
      <DemoBar title={CLOTHING_DEMO.title} slug={CLOTHING_DEMO.slug} overviewHref={CLOTHING_DEMO.basePath} experiences={CLOTHING_EXPERIENCES} active={active} />
    </div>
  );
}
