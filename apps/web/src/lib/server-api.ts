import 'server-only';
import { cookies } from 'next/headers';
import type { AdminPage } from './cms-types';
import type { AdminProfile, SiteSettings } from './types';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export const SETTINGS_TAG = 'site-settings';
export const CMS_TAG = 'cms';

export const defaultSettings: SiteSettings = {
  brandName: 'Valorian',
  companyName: 'Valorian Studio',
  tagline: 'Software Engineering & Digital Product Studio',
  description:
    'We design and engineer custom software, web applications, SaaS platforms, mobile apps and AI-powered solutions.',
  primaryEmail: 'hello@valorian.studio',
  secondaryEmail: null,
  phone: null,
  whatsapp: null,
  websiteUrl: null,
  location: null,
  linkedinUrl: null,
  githubUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  twitterUrl: null,
  defaultCurrency: 'USD',
  logoLightUrl: null,
  logoDarkUrl: null,
  faviconUrl: null,
  maintenanceMode: false,
  copyrightText: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60, tags: [SETTINGS_TAG] } });
    if (!response.ok) return defaultSettings;
    return (await response.json()) as SiteSettings;
  } catch {
    return defaultSettings;
  }
}

export async function authedFetch(path: string): Promise<Response | null> {
  const cookie = (await cookies()).toString();
  if (!cookie) return null;
  try {
    return await fetch(`${API_URL}/api${path}`, { headers: { cookie }, cache: 'no-store' });
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  const response = await authedFetch('/auth/me');
  return response?.ok ? ((await response.json()) as AdminProfile) : null;
}

export async function getAdminSettings(): Promise<SiteSettings | null> {
  const response = await authedFetch('/admin/settings');
  return response?.ok ? ((await response.json()) as SiteSettings) : null;
}

export async function getAdminList<T>(resource: string): Promise<T[]> {
  const response = await authedFetch(`/admin/cms/${resource}`);
  return response?.ok ? ((await response.json()) as T[]) : [];
}

export async function getAdminPage(key: string): Promise<AdminPage | null> {
  const response = await authedFetch(`/admin/pages/${key}`);
  return response?.ok ? ((await response.json()) as AdminPage) : null;
}
