import { z } from 'zod';
import { slugSchema } from '../cms/schemas';
import { httpUrl, imageRef, ids, link, lines, optional, order, relationId, required } from '../demos/demo-schemas';

const status = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
const optionalSlug = z.union([z.literal(''), slugSchema]).transform((v) => (v === '' ? undefined : v)).optional();
const dateField = z
  .union([z.literal(''), z.string().datetime({ offset: true }), z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/)])
  .transform((value) => (value === '' ? null : new Date(value)))
  .refine((value) => value === null || !Number.isNaN(value.getTime()), 'must be a valid date')
  .nullable()
  .optional();

const seo = {
  metaTitle: optional(70),
  metaDescription: optional(180),
  ogImageUrl: httpUrl,
  canonicalUrl: httpUrl,
  noindex: z.boolean(),
};

const caseStudyBase = z.object({
  title: required(120),
  slug: optionalSlug,
  shortDescription: required(240),
  fullOverview: z.string().trim().max(6000),
  clientName: optional(100),
  clientLogoUrl: imageRef,
  clientApproved: z.boolean(),
  industryId: relationId,
  projectType: optional(80),
  challenge: optional(3000),
  solution: optional(3000),
  approach: optional(3000),
  keyFeatures: lines(12, 200),
  results: z.array(z.object({ label: required(80), value: required(60), description: optional(240) })).max(8),
  coverImageUrl: imageRef,
  featuredImageUrl: imageRef,
  videoUrl: httpUrl,
  ctaLabel: optional(60),
  ctaUrl: link,
  status,
  featured: z.boolean(),
  publishedAt: dateField,
  displayOrder: order,
  serviceIds: ids,
  technologyIds: ids,
  demoIds: ids,
  ...seo,
});
export const caseStudyCreateSchema = caseStudyBase.partial().required({ title: true, shortDescription: true });
export const caseStudyUpdateSchema = caseStudyBase.partial();

export const caseMediaSchema = z
  .array(
    z.object({
      kind: z.enum(['DESKTOP', 'MOBILE', 'DIAGRAM', 'PRODUCT']),
      url: z.string().trim().max(500).regex(/^(\/api\/media\/[a-z0-9-]+\.(png|jpg|webp|gif)|https?:\/\/[^\s]+)$/i, 'must be an uploaded image or a full http(s) URL'),
      altText: required(160),
      caption: optional(200),
      featured: z.boolean(),
      active: z.boolean(),
    }),
  )
  .max(30);

const tagNames = z.array(z.string().trim().min(2).max(30)).max(10);

const articleBase = z.object({
  title: required(160),
  slug: optionalSlug,
  excerpt: required(300),
  content: z.string().trim().min(1, 'is required').max(60000),
  featuredImageUrl: imageRef,
  featuredImageAlt: optional(160),
  authorName: optional(80),
  authorAvatarUrl: imageRef,
  authorBio: optional(300),
  categoryId: relationId,
  tags: tagNames,
  status,
  featured: z.boolean(),
  publishedAt: dateField,
  serviceIds: ids,
  industryIds: ids,
  ...seo,
});
export const articleCreateSchema = articleBase.partial().required({ title: true, excerpt: true, content: true });
export const articleUpdateSchema = articleBase.partial();

export const testimonialSchema = z.object({
  clientName: required(100),
  companyName: optional(100),
  position: optional(100),
  quote: required(1200),
  imageUrl: imageRef,
  companyLogoUrl: imageRef,
  rating: z.union([z.literal(''), z.number().int().min(1).max(5)]).transform((v) => (v === '' ? null : v)).nullable().optional(),
  verified: z.boolean(),
  caseStudyId: relationId,
  serviceId: relationId,
  featured: z.boolean(),
  active: z.boolean(),
  displayOrder: order,
});

export const articleCategorySchema = z.object({
  name: required(60),
  slug: optionalSlug,
  description: optional(240),
  active: z.boolean(),
  displayOrder: order,
});

export const seoSettingsSchema = z.object({
  siteName: optional(80),
  titleTemplate: z.string().trim().min(2).max(100).refine((v) => v.includes('%s'), 'must contain %s where the page title goes'),
  defaultTitle: optional(100),
  defaultDescription: optional(200),
  defaultOgImageUrl: imageRef,
  canonicalBaseUrl: httpUrl,
  twitterHandle: z.string().trim().max(40).regex(/^@?[A-Za-z0-9_]*$/, 'may only contain letters, numbers and underscores').transform((v) => (v === '' ? null : v.replace(/^@/, ''))).nullable().optional(),
  allowIndexing: z.boolean(),
});

export const mediaUpdateSchema = z.object({
  altText: optional(200),
  title: optional(120),
  caption: optional(240),
});
