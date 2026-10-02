import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ExternalLink, ShieldCheck, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { getCurrentAdmin, getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Dashboard' };

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

export default async function DashboardPage() {
  const [admin, settings] = await Promise.all([getCurrentAdmin(), getSiteSettings()]);

  return (
    <>
      <PageHeader title={`Welcome back${admin ? `, ${admin.name.split(' ')[0]}` : ''}`} description={`Manage the ${settings.companyName} website.`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <ShieldCheck className="size-5 text-accent" aria-hidden />
          <p className="mt-3 text-sm text-muted">Last sign-in</p>
          <p className="mt-0.5 font-medium">{admin?.lastLoginAt ? dateFormat.format(new Date(admin.lastLoginAt)) : 'First session'}</p>
        </Card>
        <Card className="p-5">
          <Wrench className="size-5 text-primary" aria-hidden />
          <p className="mt-3 text-sm text-muted">Site status</p>
          <p className="mt-0.5">
            <Badge tone={settings.maintenanceMode ? 'danger' : 'accent'}>{settings.maintenanceMode ? 'Maintenance mode' : 'Live'}</Badge>
          </p>
        </Card>
        <Card className="p-5">
          <ExternalLink className="size-5 text-primary" aria-hidden />
          <p className="mt-3 text-sm text-muted">Public website</p>
          <Link href="/" target="_blank" className="mt-0.5 inline-block font-medium hover:text-primary">
            Open site
          </Link>
        </Card>
      </div>

      <Card className="mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Global site settings</h2>
          <p className="mt-1 text-sm text-muted">Update company details, contact information and social links shown across the website.</p>
        </div>
        <Link href="/admin/settings" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary">
          Edit settings <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Card>
    </>
  );
}
