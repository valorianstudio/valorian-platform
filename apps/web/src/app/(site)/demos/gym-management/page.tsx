import type { Metadata } from 'next';
import { GymDemoBar } from '@/components/demos/gym/gym-demo-bar';
import { GymHeroVisual } from '@/components/demos/gym/gym-hero-visual';
import { DemoOverview } from '@/components/demos/shared/demo-overview';
import { getDemo } from '@/data/demos';
import { GYM_DEMO, GYM_EXPERIENCES } from '@/data/gym/meta';
import { buildMetadata } from '@/lib/cms';

const demo = getDemo(GYM_DEMO.slug)!;

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Gym Management System Demo',
    description: 'Explore a modern gym management website, dashboard, and mobile application design created by Valorian Studio.',
    path: GYM_DEMO.basePath,
  });
}

/** Overview of the Gym Management demo and the way in to its three experiences. */
export default function GymManagementPage() {
  return (
    <DemoOverview
      demo={demo}
      config={{ ...GYM_DEMO, experiences: GYM_EXPERIENCES }}
      bar={<GymDemoBar active="overview" />}
      visual={<GymHeroVisual />}
      sectionTitle="Built for how gyms really run"
      closing={{ headline: 'Want gym software like this?', description: 'Tell us about your gym and we will shape the landing page, dashboard and member app around it.' }}
      disclaimer="This is a showcase concept, not a real gym’s system. All names, figures and member data are fictional dummy data."
    />
  );
}
