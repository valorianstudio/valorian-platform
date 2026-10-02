import { z } from 'zod';
import { sessionIdSchema } from '../analytics/analytics-schemas';

const required = (max: number) => z.string().trim().min(1, 'is required').max(max);
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === '' ? undefined : value))
    .optional();
const phone = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .refine((value) => value === undefined || /^\+?[0-9 ()-]{6,24}$/.test(value), 'must be a valid phone number')
  .optional();
const email = z.string().trim().toLowerCase().email('must be a valid email address').max(160);
const contactMethod = z.enum(['EMAIL', 'WHATSAPP', 'PHONE', 'VIDEO_CALL']);
const path = z
  .string()
  .trim()
  .max(300)
  .regex(/^\/[^\s]*$/, 'must be a site path')
  .optional();

const contactBase = {
  name: required(100),
  email,
  phone,
  whatsapp: phone,
  companyName: optional(120),
  country: optional(80),
  preferredContact: contactMethod,
  message: optional(3000),
  sourceUrl: path,
  /** Honeypot: real visitors never see or fill this. */
  website: z.string().max(200).optional(),
  sessionId: sessionIdSchema.optional(),
};

function requireContactDetail<T extends { preferredContact: string; phone?: string; whatsapp?: string }>(value: T, ctx: z.RefinementCtx) {
  if (value.preferredContact === 'PHONE' && !value.phone) ctx.addIssue({ code: 'custom', path: ['phone'], message: 'is required when phone is your preferred contact method' });
  if (value.preferredContact === 'WHATSAPP' && !value.whatsapp && !value.phone) ctx.addIssue({ code: 'custom', path: ['whatsapp'], message: 'is required when WhatsApp is your preferred contact method' });
}

export const publicLeadSchema = z
  .object({
    ...contactBase,
    source: z.enum(['ESTIMATOR', 'DEMO', 'SERVICE', 'CONTACT', 'HOMEPAGE', 'DIRECT', 'OTHER']),
    demo: z.string().trim().max(80).optional(),
    service: z.string().trim().max(80).optional(),
    estimateId: z.string().trim().max(40).optional(),
    platform: z.enum(['WEBSITE', 'MOBILE', 'BOTH']).optional(),
    projectType: optional(80),
    expectedTimeline: optional(80),
    budgetRange: optional(80),
  })
  .superRefine(requireContactDetail);
export type PublicLeadInput = z.infer<typeof publicLeadSchema>;

export const publicInquirySchema = z
  .object({
    ...contactBase,
    type: z.enum(['GENERAL', 'PARTNERSHIP', 'SUPPORT', 'OTHER']),
    message: required(3000),
  })
  .superRefine(requireContactDetail);
export type PublicInquiryInput = z.infer<typeof publicInquirySchema>;

const money = z.number().int().min(0).max(1_000_000_000);
const nullableDate = z
  .union([z.literal(''), z.string().datetime({ offset: true }), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)])
  .transform((value) => (value === '' ? null : new Date(value)))
  .nullable();

export const leadUpdateSchema = z
  .object({
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
    followUpAt: nullableDate,
    followUpNote: z.string().trim().max(300).transform((v) => (v === '' ? null : v)).nullable(),
    internalSummary: z.string().trim().max(2000).transform((v) => (v === '' ? null : v)).nullable(),
    finalProjectValue: money.nullable(),
    finalCurrency: z.enum(['BDT', 'USD']).nullable(),
    assignedTo: z.string().trim().max(80).transform((v) => (v === '' ? null : v)).nullable(),
  })
  .partial();
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export const statusChangeSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']),
  lostReason: z.enum(['PRICE', 'NO_RESPONSE', 'CHOSE_COMPETITOR', 'PROJECT_CANCELLED', 'REQUIREMENTS_CHANGED', 'OTHER']).optional(),
  finalProjectValue: money.optional(),
  finalCurrency: z.enum(['BDT', 'USD']).optional(),
  note: z.string().trim().max(2000).optional(),
});
export type StatusChangeInput = z.infer<typeof statusChangeSchema>;

export const noteSchema = z.object({ content: required(4000) });
export const activitySchema = z.object({
  type: z.enum(['CALL', 'WHATSAPP', 'EMAIL', 'MEETING', 'PROPOSAL_SENT', 'OTHER']),
  title: required(120),
  detail: optional(2000),
});

export const leadSettingsSchema = z.object({
  notifyEnabled: z.boolean(),
  notifyEmail: z.union([z.literal(''), email]).transform((v) => (v === '' ? null : v)).nullable(),
  responseNote: z.string().trim().max(240).transform((v) => (v === '' ? null : v)).nullable(),
});

export const inquiryUpdateSchema = z
  .object({
    status: z.enum(['NEW', 'REPLIED', 'CLOSED']),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
    isRead: z.boolean(),
    internalNote: z.string().trim().max(2000).transform((v) => (v === '' ? null : v)).nullable(),
    archived: z.boolean(),
  })
  .partial();
