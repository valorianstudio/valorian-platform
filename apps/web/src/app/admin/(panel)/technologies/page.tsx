import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Technologies' };

export default function Page() {
  return <ResourcePage configKey="technologies" description="Your technology stack. Mark technologies as featured to show them on the homepage." />;
}
