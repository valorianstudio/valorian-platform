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
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN';
  lastLoginAt: string | null;
  createdAt: string;
}
