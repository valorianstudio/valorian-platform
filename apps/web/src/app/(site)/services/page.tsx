import type { Metadata } from 'next';
import { ComingSoon } from '@/components/site/coming-soon';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Custom software, web applications, SaaS, mobile apps, AI integration and backend engineering.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <ComingSoon
      eyebrow="Services"
      title="Full-cycle software engineering"
      description="Strategy, design and engineering under one roof, from a first prototype to a platform serving thousands."
      highlights={[
        { title: 'Product engineering', description: 'Web, mobile and SaaS products built on clean, scalable architecture.' },
        { title: 'Backend & integrations', description: 'APIs, data pipelines and third-party integrations you can rely on.' },
        { title: 'AI & automation', description: 'Practical AI features and workflow automation that save real time.' },
      ]}
    />
  );
}
