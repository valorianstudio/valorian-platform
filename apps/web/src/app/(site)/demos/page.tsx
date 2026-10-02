import type { Metadata } from 'next';
import { DemoPreviewSection } from '@/components/site/home/sections';
import { PageHero } from '@/components/site/page-hero';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Demos',
  description: 'Explore sample product experiences built by Valorian Studio.',
  alternates: { canonical: '/demos' },
};

export default function DemosPage() {
  return (
    <>
      <PageHero
        eyebrow="Demos"
        title="See what we can build for you"
        description="A growing showcase of product experiences. Interactive, customizable demos are on the way."
      >
        <ButtonLink href="/contact">Start a Project</ButtonLink>
      </PageHero>
      <DemoPreviewSection />
    </>
  );
}
