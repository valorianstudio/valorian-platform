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
  /** Optional: POST target for the transactional mail transport (provider-agnostic). */
  MAIL_WEBHOOK_URL: z.string().url().optional(),
  MAIL_FROM: z.string().max(200).default('Valorian <no-reply@localhost>'),
  /** Optional: receives a sanitized JSON report for unexpected server errors (Sentry-style integration point). */
  ERROR_WEBHOOK_URL: z.string().url().optional(),
  APP_VERSION: z.string().max(40).default('dev'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;

if (env.NODE_ENV === 'production') {
  const problems: string[] = [];
  if (/change_?me|example|secret|password/i.test(env.JWT_SECRET) || new Set(env.JWT_SECRET).size < 12) problems.push('JWT_SECRET looks like a placeholder; generate one with: openssl rand -base64 48');
  if (/change_?me/i.test(env.DATABASE_URL)) problems.push('DATABASE_URL still contains a placeholder password');
  const origin = new URL(env.WEB_ORIGIN);
  if (origin.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(origin.hostname)) problems.push('WEB_ORIGIN must be the public https URL of the website in production');
  if (problems.length > 0) throw new Error(['Unsafe production configuration:', ...problems.map((p) => `- ${p}`)].join('\n'));
}

export const isProduction = env.NODE_ENV === 'production';
