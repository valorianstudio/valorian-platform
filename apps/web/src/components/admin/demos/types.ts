export interface NamedRef {
  id: string;
  name: string;
}

export interface DemoRow {
  id: string;
  slug: string;
  name: string;
  internalName: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  statusLabel: string;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  badge: string | null;
  thumbnailUrl: string | null;
  categoryId: string | null;
  industryId: string | null;
  updatedAt: string;
  category: NamedRef | null;
  industry: NamedRef | null;
  platforms: { type: 'WEBSITE' | 'MOBILE'; enabled: boolean }[];
}

export interface DemoPlatformData {
  type: 'WEBSITE' | 'MOBILE';
  enabled: boolean;
  title: string | null;
  description: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  notes: string | null;
  android: boolean;
  ios: boolean;
  playStoreUrl: string | null;
  appStoreUrl: string | null;
  technologyIds: string[];
}

export interface DemoFull extends Record<string, unknown> {
  id: string;
  slug: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string | null;
  relatedIds: string[];
  platforms: DemoPlatformData[];
  features: Record<string, unknown>[];
  modules: Record<string, unknown>[];
  screenshots: Record<string, unknown>[];
  points: Record<string, unknown>[];
}
