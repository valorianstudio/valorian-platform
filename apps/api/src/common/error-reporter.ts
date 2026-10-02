import { Logger } from '@nestjs/common';
import { env } from '../config/env';

const logger = new Logger('ErrorReporter');

export interface ErrorContext {
  method?: string;
  path?: string;
}

/**
 * Integration point for error monitoring. Without configuration it does nothing.
 * With ERROR_WEBHOOK_URL it posts a small sanitized report (no request bodies, headers, cookies or query strings),
 * so any service (or a Sentry/Slack bridge) can receive it. Swap the body of this function to use an SDK instead.
 */
export function reportError(error: unknown, context: ErrorContext = {}): void {
  if (!env.ERROR_WEBHOOK_URL) return;
  const err = error instanceof Error ? error : new Error(String(error));
  const payload = {
    service: 'valorian-api',
    environment: env.NODE_ENV,
    version: env.APP_VERSION,
    time: new Date().toISOString(),
    name: err.name,
    message: err.message.slice(0, 500),
    stack: err.stack?.split('\n').slice(0, 8).join('\n'),
    ...context,
  };
  void fetch(env.ERROR_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(3000) }).catch(() => logger.warn('Could not deliver error report'));
}
