import { forbidden, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { AdminShell } from '@/components/admin/admin-shell';
import { can, permissionsForPath } from '@/lib/permissions';
import { getCurrentAdmin, getSiteSettings } from '@/lib/server-api';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const [admin, settings, requestHeaders] = await Promise.all([getCurrentAdmin(), getSiteSettings(), headers()]);
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword) redirect('/admin/change-password');

  // Page-level authorization. The API enforces the same rules on every request.
  const required = permissionsForPath(requestHeaders.get('x-pathname') ?? '/admin');
  if (required && !can(admin.permissions, ...required)) forbidden();

  return (
    <AdminShell admin={admin} brandName={settings.brandName}>
      {children}
    </AdminShell>
  );
}
