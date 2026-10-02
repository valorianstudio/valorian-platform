import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Process' };

export default function Page() {
  return <ResourcePage configKey="process" description="Development process steps used on the homepage, services page and service pages." />;
}
