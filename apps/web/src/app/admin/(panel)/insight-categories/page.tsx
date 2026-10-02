import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Insight categories' };

export default function Page() {
  return <ResourcePage configKey="article-categories" description="Categories used to group and filter articles." />;
}
