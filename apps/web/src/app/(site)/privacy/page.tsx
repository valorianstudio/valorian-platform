import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Valorian Studio handles personal information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We respect your privacy and collect only what we need to respond to you and improve our services."
      sections={[
        { heading: 'Information we collect', body: 'We collect information you choose to share with us, such as your name, email address and project details when you contact us.' },
        { heading: 'How we use it', body: 'We use your information to respond to enquiries, deliver our services and improve this website. We do not sell personal information.' },
        { heading: 'Your choices', body: 'You may ask us to access, correct or delete your personal information at any time by contacting us.' },
      ]}
    />
  );
}
