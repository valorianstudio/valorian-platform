import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'CTAs' };

export default function Page() {
  return <ResourcePage configKey="ctas" description="Reusable calls to action. The start-project CTA powers the header button and service pages." />;
}
