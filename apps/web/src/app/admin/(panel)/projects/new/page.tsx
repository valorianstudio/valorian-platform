import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProjectForm } from '@/components/admin/portal/project-form';
import type { LeadOption } from '@/components/admin/portal/project-form';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'New project' };

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const [clients, leads] = await Promise.all([getAdminJson<{ id: string; companyName: string }[]>('/admin/clients/options'), getAdminJson<LeadOption[]>('/admin/projects/lead-options')]);

  return (
    <>
      <Link href="/admin/projects" className="mb-3 inline-flex items-center gap-1 py-2 text-sm text-muted transition-colors hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Projects
      </Link>
      <PageHeader title="New project" description="Assign a client and set the starting point. You can add milestones, files and updates next." />
      {(clients ?? []).length === 0 ? (
        <p className="rounded-lg border border-border bg-background p-5 text-sm text-muted">
          Create a client first from the <Link href="/admin/clients" className="text-primary">Clients</Link> page.
        </p>
      ) : (
        <ProjectForm clients={clients ?? []} leads={leads ?? []} presetClient={first(params.client)} presetLead={first(params.lead)} canManage />
      )}
    </>
  );
}
