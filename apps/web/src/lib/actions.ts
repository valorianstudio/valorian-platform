'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { SETTINGS_TAG } from './server-api';

export async function refreshSiteSettings(): Promise<void> {
  updateTag(SETTINGS_TAG);
  revalidatePath('/', 'layout');
}
