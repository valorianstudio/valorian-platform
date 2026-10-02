import { z } from 'zod';
import { slugSchema } from '../cms/schemas';

const required = (max: number) => z.string().trim().min(1, 'is required').max(max);
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .optional();

const IMAGE_PATTERN = /^(\/api\/media\/[a-z0-9-]+\.(png|jpg|webp|gif)|https?:\/\/[^\s]+)$/i;
const imageRef = z
  .union([z.literal(''), z.string().trim().max(500).regex(IMAGE_PATTERN, 'must be an uploaded image or a full http(s) URL')])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional();
const requiredImageRef = z.string().trim().max(500).regex(IMAGE_PATTERN, 'must be an uploaded image or a full http(s) URL');
const httpUrl = z
  .union([z.literal(''), z.string().trim().max(500).regex(/^https?:\/\/[^\s]+$/i, 'must be a full http(s) URL')])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional();
const link = z
  .union([z.literal(''), z.string().trim().max(300).regex(/^(\/(?!\/)[^\s]*|https?:\/\/[^\s]+)$/i, 'must be a site path (/page) or full URL')])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional()
  .refine((value) => !value || !/^\/admin(\/|$)/i.test(value), 'admin routes are not allowed');
const relationId = z
  .union([z.literal(''), z.string().max(40)])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional();
const ids = z.array(z.string().min(1).max(40)).max(100);
const lines = (max: number, length: number) => z.array(required(length)).max(max);
const order = z.number().int().min(0).max(100000).optional();

const base = z.object({
  name: required(100),
  internalName: optional(100),
  slug: z.union([z.literal(''), slugSchema]).transform((v) => (v === '' ? undefined : v)).optional(),
  shortDescription: required(220),
  fullDescription: z.string().trim().max(6000),
  categoryId: relationId,
  industryId: relationId,
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  statusLabel: z.enum(['INTERACTIVE_CONCEPT', 'PROTOTYPE', 'DEMO_PRODUCT', 'PRODUCTION_EXAMPLE']),
  featured: z.boolean(),
  active: z.boolean(),
  coverImageUrl: imageRef,
  thumbnailUrl: imageRef,
  badge: optional(30),
  displayOrder: order,
  problem: optional(1500),
  solution: optional(1500),
  targetUsers: optional(500),
  targetBusinesses: optional(500),
  outcomes: lines(8, 200),
  highlight: optional(160),
  ctaLabel: optional(60),
  ctaUrl: link,
  metaTitle: optional(70),
  metaDescription: optional(180),
  ogImageUrl: httpUrl,
  canonicalUrl: httpUrl,
  noindex: z.boolean(),
  relatedIds: ids,
});

export const demoCreateSchema = base.partial().required({ name: true, shortDescription: true });
export const demoUpdateSchema = base.partial();

export const platformSchema = z.object({
  enabled: z.boolean(),
  title: optional(120),
  description: optional(2000),
  demoUrl: httpUrl,
  videoUrl: httpUrl,
  ctaLabel: optional(60),
  ctaUrl: link,
  notes: optional(1000),
  android: z.boolean(),
  ios: z.boolean(),
  playStoreUrl: httpUrl,
  appStoreUrl: httpUrl,
  technologyIds: ids,
});

const featurePlatform = z.enum(['WEBSITE', 'MOBILE', 'BOTH']);

export const collectionSchemas = {
  features: z.array(
    z.object({
      platform: featurePlatform,
      title: required(100),
      description: optional(400),
      icon: optional(40),
      featured: z.boolean(),
      active: z.boolean(),
    }),
  ).max(60),
  modules: z.array(
    z.object({
      platform: featurePlatform,
      title: required(100),
      description: optional(400),
      icon: optional(40),
      active: z.boolean(),
    }),
  ).max(40),
  screenshots: z.array(
    z
      .object({
        platform: z.enum(['WEBSITE', 'MOBILE']),
        kind: z.enum(['DESKTOP', 'TABLET', 'MOBILE', 'DASHBOARD', 'ADMIN', 'CUSTOMER', 'OTHER']),
        url: requiredImageRef,
        altText: required(160),
        caption: optional(200),
        featured: z.boolean(),
        active: z.boolean(),
      })
      .refine((s) => !(s.platform === 'MOBILE' && ['DESKTOP', 'TABLET'].includes(s.kind)) && !(s.platform === 'WEBSITE' && s.kind === 'MOBILE'), {
        message: 'Desktop/tablet screenshots belong to Website and Mobile screenshots to Mobile App',
      }),
  ).max(40),
  points: z.array(
    z.object({
      type: z.enum(['BENEFIT', 'USE_CASE']),
      title: required(120),
      description: optional(400),
      active: z.boolean(),
    }),
  ).max(30),
} as const;

export const demoCategorySchema = z.object({
  name: required(60),
  slug: z.union([z.literal(''), slugSchema]).transform((v) => (v === '' ? undefined : v)).optional(),
  description: optional(240),
  active: z.boolean(),
  displayOrder: order,
});
