'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { CMS_TAG, SETTINGS_TAG } from './server-api';

export async function refreshSiteSettings(): Promise<void> {
  updateTag(SETTINGS_TAG);
  revalidatePath('/', 'layout');
}

export async function refreshContent(): Promise<void> {
  updateTag(CMS_TAG);
  updateTag(SETTINGS_TAG);
  revalidatePath('/', 'layout');
}
