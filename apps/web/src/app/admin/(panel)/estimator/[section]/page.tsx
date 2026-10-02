import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResourcePage } from '@/components/admin/cms/resource-page';
import { EstimatorSettingsForm } from '@/components/admin/estimator/settings-form';
import { ErrorState } from '@/components/ui/states';
import { authedFetch } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Estimator' };

const RESOURCES: Record<string, string> = {
  types: 'estimator-types',
  features: 'estimator-features',
  categories: 'estimator-categories',
  integrations: 'estimator-integrations',
  complexity: 'estimator-complexity',
  rules: 'estimator-rules',
};

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;

  if (section === 'settings') {
    const response = await authedFetch('/admin/estimator/settings');
    if (!response?.ok) return <ErrorState title="Could not load settings" description="Reload the page to try again." />;
    return <EstimatorSettingsForm initial={(await response.json()) as Record<string, unknown>} />;
  }
  const configKey = Object.hasOwn(RESOURCES, section) ? RESOURCES[section] : undefined;
  if (!configKey) notFound();
  return <ResourcePage configKey={configKey} hideHeader />;
}
