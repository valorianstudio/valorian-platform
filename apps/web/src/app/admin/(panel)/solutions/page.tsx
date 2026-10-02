import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Solutions' };

export default function Page() {
  return <ResourcePage configKey="solutions" description="Industries and solutions shown at /solutions. Only published entries are public." />;
}
