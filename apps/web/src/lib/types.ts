export interface SiteSettings {
  brandName: string;
  companyName: string;
  tagline: string;
  description: string;
  primaryEmail: string;
  secondaryEmail: string | null;
  phone: string | null;
  whatsapp: string | null;
  websiteUrl: string | null;
  location: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  defaultCurrency: string;
  logoLightUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;
  maintenanceMode: boolean;
  copyrightText: string | null;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: { id: string; key: string; name: string } | null;
  isSuper: boolean;
  permissions: string[];
  mustChangePassword: boolean;
  totpEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'MEETING' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
export type LeadPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export const LEAD_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
export const LEAD_PRIORITIES: LeadPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
