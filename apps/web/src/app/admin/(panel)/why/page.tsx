import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Why Valorian' };

export default function Page() {
  return <ResourcePage configKey="values" description="Value propositions shown in the homepage Why Valorian section." />;
}
