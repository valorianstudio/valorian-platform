import { z } from 'zod';

const required = (max: number) => z.string().trim().min(1, 'is required').max(max);
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .optional();

const LINK_PATTERN = /^(\/(?!\/)[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/i;
const link = z
  .string()
  .trim()
  .max(300)
  .refine((value) => LINK_PATTERN.test(value) && !/^\/admin(\/|$)/i.test(value), 'must be a site path (/page) or full URL');
const optionalLink = z
  .union([z.literal(''), link])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional();
const optionalHttpUrl = z
  .union([z.literal(''), z.string().trim().max(500).regex(/^https?:\/\/[^\s]+$/i, 'must be a full http(s) URL')])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional();

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'may only contain lowercase letters, numbers and hyphens');
const optionalSlug = z.union([z.literal(''), slugSchema]).transform((v) => (v === '' ? undefined : v)).optional();

const lines = (maxItems: number, maxLength: number) => z.array(required(maxLength)).max(maxItems);
const ids = z.array(z.string().min(1).max(40)).max(100);
const order = z.number().int().min(0).max(100000).optional();
const status = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
const icon = z.string().trim().min(1).max(40);
const titledItems = z.array(z.object({ title: required(120), description: required(500) })).max(12);

export const seoFields = {
  metaTitle: optional(70),
  metaDescription: optional(180),
  ogImageUrl: optionalHttpUrl,
  canonicalUrl: optionalHttpUrl,
  noindex: z.boolean().optional(),
};

export const serviceSchema = z.object({
  title: required(100),
  slug: optionalSlug,
  shortDescription: required(220),
  description: required(4000),
  icon,
  heroTitle: optional(140),
  heroSubtitle: optional(300),
  features: titledItems,
  benefits: lines(10, 200),
  ctaLabel: optional(60),
  ctaUrl: optionalLink,
  featured: z.boolean(),
  status,
  displayOrder: order,
  technologyIds: ids,
  ...seoFields,
});

export const industrySchema = z.object({
  name: required(100),
  slug: optionalSlug,
  shortDescription: required(220),
  overview: required(4000),
  icon,
  problems: lines(10, 300),
  approach: required(4000),
  benefits: lines(10, 200),
  ctaLabel: optional(60),
  ctaUrl: optionalLink,
  coverImageUrl: optionalHttpUrl,
  featured: z.boolean(),
  status,
  displayOrder: order,
  technologyIds: ids,
  serviceIds: ids,
  ...seoFields,
});

export const technologySchema = z.object({
  name: required(60),
  slug: optionalSlug,
  category: z.enum(['FRONTEND', 'BACKEND', 'DATABASE', 'INFRASTRUCTURE', 'MOBILE', 'AI', 'DEVOPS']),
  description: optional(300),
  logoUrl: optional(500),
  websiteUrl: optionalHttpUrl,
  featured: z.boolean(),
  active: z.boolean(),
  displayOrder: order,
});

export const processStepSchema = z.object({
  title: required(80),
  label: optional(40),
  description: required(400),
  active: z.boolean(),
  displayOrder: order,
});

export const valuePropSchema = z.object({
  title: required(80),
  description: required(400),
  icon,
  highlight: optional(60),
  active: z.boolean(),
  displayOrder: order,
});

export const faqSchema = z.object({
  question: required(200),
  answer: required(2000),
  category: z.enum(['GENERAL', 'DEVELOPMENT', 'PRICING', 'PROCESS', 'SUPPORT']),
  featured: z.boolean(),
  active: z.boolean(),
  displayOrder: order,
});

export const ctaSchema = z.object({
  key: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{2,40}$/, 'may only contain lowercase letters, numbers and hyphens'),
  label: required(60),
  url: link,
  description: optional(240),
  active: z.boolean(),
});

export const navigationSchema = z.object({
  label: required(40),
  url: link,
  location: z.enum(['HEADER', 'FOOTER', 'LEGAL']),
  enabled: z.boolean(),
  openInNewTab: z.boolean(),
  displayOrder: order,
});

export const featuredWorkSchema = z.object({
  title: required(100),
  description: required(260),
  category: required(40),
  imageUrl: optionalHttpUrl,
  badge: optional(30),
  ctaUrl: optionalLink,
  featured: z.boolean(),
  active: z.boolean(),
  displayOrder: order,
});

export const reorderSchema = z.object({ ids: z.array(z.string().min(1).max(60)).min(1).max(200) });

export const pageSeoSchema = z.object({ ...seoFields });

const heroSection = z.object({
  eyebrow: optional(60),
  headline: required(140),
  highlight: optional(80),
  description: required(400),
  primaryLabel: required(40),
  primaryUrl: link,
  secondaryLabel: optional(40),
  secondaryUrl: optionalLink,
  imageUrl: optionalHttpUrl,
});
const introSection = z.object({ eyebrow: optional(60), title: required(140), subtitle: optional(300) });
const ctaSection = z.object({
  headline: required(140),
  description: optional(300),
  primaryLabel: required(40),
  primaryUrl: link,
  secondaryLabel: optional(40),
  secondaryUrl: optionalLink,
});
const pageHero = z.object({ eyebrow: optional(60), title: required(140), description: required(400) });
const textBlock = z.object({ eyebrow: optional(60), title: required(140), body: required(3000) });

export const sectionSchemas: Record<string, z.ZodType<Record<string, unknown>>> = {
  'HOME:hero': heroSection,
  'HOME:capabilities': introSection,
  'HOME:why': introSection,
  'HOME:featuredWork': introSection,
  'HOME:process': introSection,
  'HOME:technology': introSection,
  'HOME:cta': ctaSection,
  'ABOUT:hero': pageHero,
  'ABOUT:story': textBlock,
  'ABOUT:purpose': z.object({ missionTitle: required(60), mission: required(800), visionTitle: required(60), vision: required(800) }),
  'ABOUT:values': z.object({ title: required(140), items: titledItems }),
  'ABOUT:philosophy': z.object({ title: required(140), body: required(3000), points: lines(8, 200) }),
  'ABOUT:stats': z.object({ title: required(140), items: z.array(z.object({ value: required(20), label: required(60) })).max(6) }),
  'ABOUT:cta': ctaSection,
  'SERVICES:hero': pageHero,
  'SERVICES:cta': ctaSection,
  'SOLUTIONS:hero': pageHero,
  'SOLUTIONS:cta': ctaSection,
};

export const sectionUpdateSchema = z.object({ enabled: z.boolean().optional(), content: z.record(z.string(), z.unknown()).optional() });
