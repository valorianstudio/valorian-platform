import { z } from 'zod';

try {
  process.loadEnvFile();
} catch {
  // no .env file: rely on the process environment
}

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  LEAD_WEBHOOK_URL: z.string().url().optional(),
  UPLOAD_DIR: z.string().default('./uploads'),
  /** Private client documents. Never served statically; downloads go through an authorized endpoint. */
  PRIVATE_UPLOAD_DIR: z.string().default('./private-uploads'),
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),
  /** SMTP (Brevo: smtp-relay.brevo.com, port 587). Email is disabled, and logged as skipped, until SMTP_HOST is set. */
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_SECURE: z.enum(['true', 'false']).optional(),
  EMAIL_FROM: z.string().max(200).default('Valorian Studio <no-reply@valorian.com>'),
  /** Where new lead and contact notifications go when the CRM settings do not name a recipient. */
  EMAIL_TO: z.string().email().optional(),
  /** Older name for EMAIL_TO; still honored. */
  NOTIFY_EMAIL: z.string().email().optional(),
  /** Optional: receives a sanitized JSON report for unexpected server errors (Sentry-style integration point). */
  ERROR_WEBHOOK_URL: z.string().url().optional(),
  APP_VERSION: z.string().max(40).default('dev'),
});

const parsed = schema.safeParse(Object.fromEntries(Object.entries(process.env).map(([key, value]) => [key, value === '' ? undefined : value])));
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;

if (env.SMTP_HOST && (!env.SMTP_USER || !env.SMTP_PASSWORD)) throw new Error('SMTP_HOST is set but SMTP_USER or SMTP_PASSWORD is missing');

if (env.NODE_ENV === 'production') {
  const problems: string[] = [];
  if (/change_?me|example|secret|password/i.test(env.JWT_SECRET) || new Set(env.JWT_SECRET).size < 12) problems.push('JWT_SECRET looks like a placeholder; generate one with: openssl rand -base64 48');
  if (/change_?me/i.test(env.DATABASE_URL)) problems.push('DATABASE_URL still contains a placeholder password');
  const origin = new URL(env.WEB_ORIGIN);
  if (origin.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(origin.hostname)) problems.push('WEB_ORIGIN must be the public https URL of the website in production');
  if (problems.length > 0) throw new Error(['Unsafe production configuration:', ...problems.map((p) => `- ${p}`)].join('\n'));
}

export const isProduction = env.NODE_ENV === 'production';
