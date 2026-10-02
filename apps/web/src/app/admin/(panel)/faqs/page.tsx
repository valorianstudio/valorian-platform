import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'FAQs' };

export default function Page() {
  return <ResourcePage configKey="faqs" description="Questions shown on the services, service detail and about pages." />;
}
