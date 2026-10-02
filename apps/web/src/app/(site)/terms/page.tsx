import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of the Valorian Studio website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="By using this website you agree to the following terms."
      sections={[
        { heading: 'Use of the website', body: 'You may use this website for lawful purposes only and must not attempt to disrupt or gain unauthorised access to it.' },
        { heading: 'Intellectual property', body: 'All content on this website is owned by or licensed to us and may not be reproduced without permission.' },
        { heading: 'Engagements', body: 'Project work is governed by a separate written agreement. Information on this website is not a binding offer.' },
      ]}
    />
  );
}
