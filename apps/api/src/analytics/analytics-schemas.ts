import { z } from 'zod';

/** Event types a browser may report. Business events (estimate completed, lead created, form submitted) are server-only. */
export const CLIENT_EVENT_TYPES = [
  'PAGE_VIEW',
  'DEMO_VIEW',
  'DEMO_PLATFORM_SELECT',
  'SERVICE_VIEW',
  'SOLUTION_VIEW',
  'CASE_STUDY_VIEW',
  'ARTICLE_VIEW',
  'ESTIMATOR_START',
  'ESTIMATOR_STEP_COMPLETE',
  'FEATURE_SELECT',
  'INTEGRATION_SELECT',
  'CTA_CLICK',
  'WHATSAPP_CLICK',
  'CONTACT_FORM_START',
] as const;

const short = (max: number) => z.string().trim().max(max).regex(/^[A-Za-z0-9 ._:/\-+%]*$/, 'contains unsupported characters').optional();

export const sessionIdSchema = z.string().regex(/^[A-Za-z0-9-]{16,64}$/);

export const collectSchema = z.object({
  sessionId: sessionIdSchema,
  attr: z
    .object({
      ref: z.string().trim().max(120).regex(/^[a-z0-9.-]*$/i).optional(),
      utmSource: short(80),
      utmMedium: short(80),
      utmCampaign: short(120),
      utmContent: short(120),
      utmTerm: short(120),
    })
    .optional(),
  events: z
    .array(
      z.object({
        type: z.enum(CLIENT_EVENT_TYPES),
        path: z.string().max(200).regex(/^\/[A-Za-z0-9\-_/.]*$/, 'must be a site path without a query string').optional(),
        platform: z.enum(['WEBSITE', 'MOBILE']).optional(),
        step: z.enum(['project', 'industry', 'features', 'complexity', 'integrations', 'scale']).optional(),
        cta: z.string().max(40).regex(/^[a-z0-9-]+$/).optional(),
      }),
    )
    .min(1)
    .max(8),
});
export type CollectInput = z.infer<typeof collectSchema>;

export const analyticsSettingsSchema = z.object({
  enabled: z.boolean(),
  retentionDays: z.number().int().min(7).max(1095),
  excludeAdmin: z.boolean(),
  trackArticles: z.boolean(),
  trackEstimator: z.boolean(),
  defaultRangeDays: z.union([z.literal(1), z.literal(7), z.literal(30), z.literal(90), z.literal(365)]),
  idleLeadDays: z.number().int().min(3).max(180),
});
