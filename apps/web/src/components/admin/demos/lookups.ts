import 'server-only';
import { getAdminDemos, getAdminList } from '@/lib/server-api';
import type { NamedRef } from './types';

type Named = { id: string; name?: string; title?: string };
const toRef = (item: Named): NamedRef => ({ id: item.id, name: item.name ?? item.title ?? '' });

export async function loadDemoLookups() {
  const [categories, industries, technologies, demos, features] = await Promise.all([
    getAdminList<Named>('demo-categories'),
    getAdminList<Named>('solutions'),
    getAdminList<Named>('technologies'),
    getAdminDemos<Named>(),
    getAdminList<Named>('estimator-features'),
  ]);
  return { categories: categories.map(toRef), industries: industries.map(toRef), technologies: technologies.map(toRef), demos: demos.map(toRef), features: features.map(toRef) };
}
