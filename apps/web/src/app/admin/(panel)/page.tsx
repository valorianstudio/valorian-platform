import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ExternalLink, ShieldCheck, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { LeadRowCard } from '@/components/admin/leads/lead-row';
import type { LeadStats } from '@/components/admin/leads/shared';
import { getAdminJson, getCurrentAdmin, getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Dashboard' };

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

export default async function DashboardPage() {
  const [admin, settings, stats, inquiries] = await Promise.all([
    getCurrentAdmin(),
    getSiteSettings(),
    getAdminJson<LeadStats>('/admin/leads/stats'),
    getAdminJson<{ unread: number }>('/admin/inquiries'),
  ]);

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

      {stats && (
        <section className="mt-8" aria-labelledby="crm-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="crm-heading" className="text-lg font-semibold">Leads</h2>
            <Link href="/admin/leads" className="text-sm font-medium text-primary">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {[
              ['New leads', stats.byStatus.NEW ?? 0, '/admin/leads?status=NEW'],
              ['Active opportunities', stats.activeCount, '/admin/leads'],
              ['Proposal / negotiation', (stats.byStatus.PROPOSAL ?? 0) + (stats.byStatus.NEGOTIATION ?? 0), '/admin/leads?status=PROPOSAL'],
              ['Won', stats.byStatus.WON ?? 0, '/admin/leads?status=WON'],
              ['Unread inquiries', inquiries?.unread ?? 0, '/admin/inquiries'],
            ].map(([label, value, href]) => (
              <Link key={label as string} href={href as string} className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40">
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/admin/leads?followUp=overdue" className={`rounded-full border px-3 py-1 ${stats.followUps.overdue ? 'border-danger/40 bg-danger-soft text-danger' : 'border-border text-muted'}`}>Overdue follow-ups: <strong>{stats.followUps.overdue}</strong></Link>
            <Link href="/admin/leads?followUp=today" className="rounded-full border border-border px-3 py-1 text-muted">Today: <strong>{stats.followUps.today}</strong></Link>
            <Link href="/admin/leads?followUp=upcoming" className="rounded-full border border-border px-3 py-1 text-muted">Upcoming: <strong>{stats.followUps.upcoming}</strong></Link>
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted">Recent leads</h3>
              {stats.recent.length === 0 ? <p className="text-sm text-muted">No leads yet.</p> : <ul className="space-y-3">{stats.recent.map((lead) => <li key={lead.id}><LeadRowCard lead={lead} /></li>)}</ul>}
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted">Next follow-ups</h3>
              {stats.upcomingFollowUps.length === 0 ? <p className="text-sm text-muted">No follow-ups scheduled.</p> : <ul className="space-y-3">{stats.upcomingFollowUps.map((lead) => <li key={lead.id}><LeadRowCard lead={lead} /></li>)}</ul>}
            </div>
          </div>
        </section>
      )}

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
