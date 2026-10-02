import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';

export const metadata: Metadata = { title: 'Featured work' };

export default function Page() {
  return <ResourcePage configKey="work" description="Lightweight previews shown on the homepage and /demos. The full demo platform replaces these later." />;
}
