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
const optionalSlug = z.union([z.literal(''), slugSchema]).transform((v) => (v === '' ? undefined : v)).optional();
const order = z.number().int().min(0).max(100000).optional();
const price = z.number().int().min(0, 'cannot be negative').max(100_000_000).nullable().optional();
const money = z.number().int().min(0, 'cannot be negative').max(100_000_000);
const multiplier = z.number().min(0.1, 'must be at least 0.1').max(10, 'must be 10 or less');
const ids = z.array(z.string().min(1).max(40)).max(200);
const relationId = z
  .union([z.literal(''), z.string().max(40)])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional();
const platform = z.enum(['WEBSITE', 'MOBILE', 'BOTH']);

export const projectTypeSchema = z.object({
  name: required(60),
  slug: optionalSlug,
  description: optional(240),
  platform,
  basePrice: money,
  baseWeeks: z.number().int().min(1).max(260),
  active: z.boolean(),
  displayOrder: order,
});

export const estimatorCategorySchema = z.object({
  name: required(60),
  slug: optionalSlug,
  active: z.boolean(),
  displayOrder: order,
});

export const estimatorFeatureSchema = z.object({
  name: required(80),
  slug: optionalSlug,
  description: optional(300),
  categoryId: relationId,
  websitePrice: price,
  mobilePrice: price,
  bothPrice: price,
  effortDays: z.number().int().min(0).max(1000),
  required: z.boolean(),
  recommended: z.boolean(),
  active: z.boolean(),
  displayOrder: order,
  industryIds: ids,
});

export const estimatorIntegrationSchema = z.object({
  name: required(80),
  slug: optionalSlug,
  description: optional(300),
  websitePrice: price,
  mobilePrice: price,
  bothPrice: price,
  active: z.boolean(),
  displayOrder: order,
});

export const complexitySchema = z.object({
  name: required(40),
  slug: optionalSlug,
  description: optional(240),
  multiplier,
  timelineFactor: multiplier,
  active: z.boolean(),
  displayOrder: order,
});

export const pricingRuleSchema = z.object({
  kind: z.enum(['SCALE', 'URGENCY']),
  key: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{2,40}$/, 'may only contain lowercase letters, numbers and hyphens'),
  label: required(60),
  description: optional(240),
  multiplier,
  timelineFactor: multiplier,
  active: z.boolean(),
  displayOrder: order,
});

export const estimatorSettingsSchema = z.object({
  enabled: z.boolean(),
  currency: z.enum(['BDT', 'USD']),
  rangeLowPercent: z.number().int().min(0).max(50),
  rangeHighPercent: z.number().int().min(0).max(100),
  bothDiscountPercent: z.number().int().min(0).max(90),
  roundingStep: z.number().int().min(1).max(1_000_000),
  disclaimer: required(300),
});

export const calculateSchema = z.object({
  projectType: z.string().min(1).max(80),
  demo: z.string().max(80).optional(),
  industry: z.string().max(80).optional(),
  featureIds: ids,
  integrationIds: ids,
  complexity: z.string().min(1).max(80),
  scale: z.string().min(1).max(40),
  urgency: z.string().min(1).max(40),
});
export type CalculateInput = z.infer<typeof calculateSchema>;
