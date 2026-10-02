import type { Metadata } from 'next';
import { WorkSection } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { ButtonLink } from '@/components/ui/button';
import { getHome } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Demos',
  description: 'Explore sample product experiences built by Valorian Studio.',
  alternates: { canonical: '/demos' },
};

export default async function DemosPage() {
  const home = await getHome();

  return (
    <>
      <PageHero eyebrow="Demos" title="See what we can build for you" description="A growing showcase of product experiences. Interactive, customizable demos are on the way.">
        <ButtonLink href="/contact">Start a Project</ButtonLink>
      </PageHero>
      <WorkSection intro={{ eyebrow: 'Preview', title: 'Selected work' }} work={home?.work ?? []} />
    </>
  );
}
