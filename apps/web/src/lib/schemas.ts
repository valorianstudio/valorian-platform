import { z } from 'zod';

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'AED', 'CAD', 'AUD'] as const;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function toFieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '');
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors as FieldErrors<T>;
}

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === '' || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value), 'Enter a full URL starting with http:// or https://');

export const loginSchema = z.object({
  email: z.email('Enter a valid email address').trim(),
  password: z.string().min(1, 'Enter your password'),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80, 'Keep it under 80 characters'),
  email: z.email('Enter a valid email address').trim(),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z.string().min(10, 'Use at least 10 characters').max(128, 'Keep it under 128 characters'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
export type PasswordValues = z.infer<typeof passwordSchema>;

export const settingsSchema = z.object({
  brandName: z.string().trim().min(1, 'Brand name is required').max(60),
  companyName: z.string().trim().min(1, 'Company name is required').max(100),
  tagline: z.string().trim().min(1, 'Tagline is required').max(120),
  description: z.string().trim().min(1, 'Description is required').max(500, 'Keep it under 500 characters'),
  primaryEmail: z.email('Enter a valid email address').trim(),
  secondaryEmail: z.union([z.literal(''), z.email('Enter a valid email address')]),
  phone: z.string().trim().refine((v) => v === '' || /^\+?[0-9 ()-]{6,24}$/.test(v), 'Enter a valid phone number'),
  whatsapp: z.string().trim().refine((v) => v === '' || /^\+?[0-9]{6,20}$/.test(v), 'Digits only, with optional leading +'),
  websiteUrl: optionalUrl,
  location: z.string().trim().max(120),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  defaultCurrency: z.enum(CURRENCIES),
  logoLightUrl: optionalUrl,
  logoDarkUrl: optionalUrl,
  faviconUrl: optionalUrl,
  maintenanceMode: z.boolean(),
});
export type SettingsValues = z.infer<typeof settingsSchema>;
