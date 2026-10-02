import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Services' };

export default function Page() {
  return <ResourcePage configKey="services" description="Services shown at /services and on the homepage. Only published services are public." />;
}
