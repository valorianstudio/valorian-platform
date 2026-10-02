import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Navigation' };

export default function Page() {
  return <ResourcePage configKey="navigation" title="Header navigation" description="Links in the site header and mobile menu." lockedFilter="HEADER" />;
}
