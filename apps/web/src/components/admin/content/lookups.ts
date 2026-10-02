import 'server-only';
import { getAdminDemos, getAdminList } from '@/lib/server-api';

type Named = { id: string; name?: string; title?: string };
const toRef = (item: Named) => ({ id: item.id, name: item.name ?? item.title ?? '' });

export async function loadCaseLookups() {
  const [industries, services, technologies, demos] = await Promise.all([
    getAdminList<Named>('solutions'),
    getAdminList<Named>('services'),
    getAdminList<Named>('technologies'),
    getAdminDemos<Named>(),
  ]);
  return { industries: industries.map(toRef), services: services.map(toRef), technologies: technologies.map(toRef), demos: demos.map(toRef) };
}

export async function loadArticleLookups() {
  const [categories, services, industries] = await Promise.all([
    getAdminList<Named>('article-categories'),
    getAdminList<Named>('services'),
    getAdminList<Named>('solutions'),
  ]);
  return { categories: categories.map(toRef), services: services.map(toRef), industries: industries.map(toRef) };
}
