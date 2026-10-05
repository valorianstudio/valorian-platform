import type { Metadata } from 'next';
import { LazyGymDashboard } from '@/components/demos/gym/lazy';
import { GymDemoBar } from '@/components/demos/gym/gym-demo-bar';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { GYM_DEMO, GYM_EXPERIENCES, GYM_THEME } from '@/data/gym/meta';
import { buildMetadata } from '@/lib/cms';

const experience = GYM_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Gym Management Dashboard Demo',
    description: 'Explore a gym management dashboard: members, trainers, workout plans, classes, attendance, payments and reports. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working platform. The interactive shell is a lazily loaded client component. */
export default function GymWebsitePage() {
  return (
    <div style={GYM_THEME}>
      <GymDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Full website design"
        title="The gym platform, for admins and trainers"
        description="Members, classes, plans, attendance and payments in one clean interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Gym admin and Trainer. Try booking a class or changing a plan price.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: GYM_DEMO.title, href: GYM_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyGymDashboard />
      </DemoExperienceIntro>
    </div>
  );
}
