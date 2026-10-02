import type { Metadata } from 'next';
import { ComingSoon } from '@/components/site/coming-soon';

export const metadata: Metadata = {
  title: 'About',
  description: 'Valorian Studio is a software engineering and digital product studio.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <ComingSoon
      eyebrow="About"
      title="A studio that cares how software is built"
      description="We are engineers and product thinkers who treat every project as if it were our own product."
      highlights={[
        { title: 'Craft', description: 'Clean code, careful design and attention to detail in everything we ship.' },
        { title: 'Clarity', description: 'Plain-language communication and honest timelines from day one.' },
        { title: 'Partnership', description: 'We stay invested long after launch, helping your product grow.' },
      ]}
    />
  );
}
