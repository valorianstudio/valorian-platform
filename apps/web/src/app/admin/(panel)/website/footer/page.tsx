import type { Metadata } from 'next';
import { FooterForm } from '@/components/admin/cms/footer-form';
import { ResourcePage } from '@/components/admin/cms/resource-page';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Footer' };

export default async function Page() {
  const settings = await getAdminSettings();

  return (
    <div className="space-y-10">
      <PageHeader title="Footer" description="Company details and social links are managed under Settings." />
      <FooterForm copyrightText={settings?.copyrightText ?? null} />
      <section>
        <h2 className="mb-4 text-lg font-semibold">Footer links</h2>
        <ResourcePage configKey="navigation" hideHeader lockedFilter="FOOTER" />
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold">Legal links</h2>
        <ResourcePage configKey="navigation" hideHeader lockedFilter="LEGAL" />
      </section>
    </div>
  );
}
