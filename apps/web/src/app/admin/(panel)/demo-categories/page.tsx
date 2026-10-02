import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Demo categories' };

export default function Page() {
  return <ResourcePage configKey="demo-categories" description="Categories used to group and filter demos." />;
}
