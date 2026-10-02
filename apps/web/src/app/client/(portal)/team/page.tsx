import type { Metadata } from 'next';
import { forbidden } from 'next/navigation';
import { TeamManager } from '@/components/portal/team-manager';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminJson, getCurrentClient } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Company users' };

export default async function ClientTeamPage() {
  const client = await getCurrentClient();
  if (!client || client.role !== 'OWNER') forbidden();
  const members = await getAdminJson<{ id: string; name: string; email: string; role: 'OWNER' | 'MEMBER'; active: boolean; lastLoginAt: string | null }[]>('/client/team');
  if (!members) return <ErrorState title="Could not load your team" description="Reload the page to try again." />;
  return (
    <>
      <PageHeader title="Company users" description="Give colleagues access to your projects. Members can view progress, files and messages." />
      <TeamManager members={members} selfId={client.id} />
    </>
  );
}
