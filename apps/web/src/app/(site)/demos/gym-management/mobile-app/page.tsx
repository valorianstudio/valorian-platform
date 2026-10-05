import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { GymDemoBar } from '@/components/demos/gym/gym-demo-bar';
import { LazyGymMobileApp } from '@/components/demos/gym/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { GYM_DEMO, GYM_EXPERIENCES, GYM_THEME } from '@/data/gym/meta';
import { buildMetadata } from '@/lib/cms';

const experience = GYM_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Gym Management Mobile App Demo',
    description: 'Tap through realistic member and trainer mobile app screens: workouts, trainer chat, progress, class booking and workout assignment.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a member app and a trainer app. */
export default function GymMobileAppPage() {
  return (
    <div style={GYM_THEME}>
      <GymDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="Training, in your pocket"
        description="A member app and a trainer app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Try booking a class, then send a message to your trainer."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: GYM_DEMO.title, href: GYM_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyGymMobileApp />
      </DemoExperienceIntro>
      <DemoInterest slug={GYM_DEMO.slug} title={GYM_DEMO.title} />
    </div>
  );
}
