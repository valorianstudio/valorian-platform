import type { Metadata } from 'next';
import { ComingSoon } from '@/components/site/coming-soon';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Industry-ready software solutions for e-commerce, operations, SaaS and business automation.',
  alternates: { canonical: '/solutions' },
};

export default function SolutionsPage() {
  return (
    <ComingSoon
      eyebrow="Solutions"
      title="Solutions shaped around your industry"
      description="Proven building blocks combined with custom engineering, so you launch faster without compromising on fit."
      highlights={[
        { title: 'E-commerce systems', description: 'Storefronts, catalogs, payments and fulfilment workflows.' },
        { title: 'Business automation', description: 'Internal tools and automations that remove manual work.' },
        { title: 'SaaS platforms', description: 'Multi-tenant products ready for subscriptions and growth.' },
      ]}
    />
  );
}
