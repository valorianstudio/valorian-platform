import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/admin-shell';
import { getCurrentAdmin, getSiteSettings } from '@/lib/server-api';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const [admin, settings] = await Promise.all([getCurrentAdmin(), getSiteSettings()]);
  if (!admin) redirect('/admin/login');

  return (
    <AdminShell admin={admin} brandName={settings.brandName}>
      {children}
    </AdminShell>
  );
}
