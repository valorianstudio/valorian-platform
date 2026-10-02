import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PermissionMatrix } from '@/components/admin/team/permission-matrix';
import type { PermissionDef } from '@/components/admin/team/shared';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Role' };

export default async function RolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [role, catalogue] = await Promise.all([
    getAdminJson<{ id: string; key: string; name: string; description: string | null; isSystem: boolean; active: boolean; permissions: string[]; userCount: number }>(`/admin/roles/${encodeURIComponent(id)}`),
    getAdminJson<PermissionDef[]>('/admin/roles/permissions'),
  ]);
  if (!role || !catalogue) notFound();

  return (
    <>
      <Link href="/admin/roles" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Roles
      </Link>
      <PageHeader title={role.name} description="Edit the role and choose its permissions." actions={role.isSystem ? <Badge>Built-in</Badge> : undefined} />
      <PermissionMatrix key={`${role.id}-${role.permissions.length}-${role.active}`} role={role} catalogue={catalogue} />
    </>
  );
}
