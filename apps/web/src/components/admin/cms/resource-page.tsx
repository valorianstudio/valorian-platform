import { PageHeader } from '@/components/ui/page-header';
import { getAdminList } from '@/lib/server-api';
import { ResourceManager } from './resource-manager';
import { CONFIGS } from './resource-configs';
import type { Item } from './resource-configs';

interface ResourcePageProps {
  configKey: string;
  title?: string;
  description?: string;
  lockedFilter?: string;
  hideHeader?: boolean;
}

export async function ResourcePage({ configKey, title, description, lockedFilter, hideHeader }: ResourcePageProps) {
  const config = CONFIGS[configKey];
  const sources = Object.values(config.relationSources ?? {}).map((source) => source.resource);
  const [items, ...related] = await Promise.all([getAdminList<Item>(config.resource), ...sources.map((resource) => getAdminList<Item>(resource))]);
  const relationItems = Object.fromEntries(sources.map((resource, index) => [resource, related[index]]));
  const filterField = config.filterBy?.field;
  const initial = lockedFilter && filterField ? items.filter((item) => item[filterField] === lockedFilter) : items;

  return (
    <>
      {!hideHeader && <PageHeader title={title ?? config.plural} description={description} />}
      <ResourceManager configKey={configKey} initialItems={initial} relationItems={relationItems} lockedFilter={lockedFilter} />
    </>
  );
}
