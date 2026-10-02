import { Injectable, Logger } from '@nestjs/common';
import { env } from '../config/env';

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/** Provider contract. Add an SMTP, Resend, Postmark or SES implementation without touching callers. */
export abstract class MailTransport {
  abstract send(message: MailMessage, from: string): Promise<void>;
}

/** Used when no provider is configured: records that a mail was skipped, never its content or recipient. */
@Injectable()
export class NoopMailTransport extends MailTransport {
  private readonly logger = new Logger('Mail');

  async send(): Promise<void> {
    this.logger.warn('Email skipped: no mail provider configured (set MAIL_WEBHOOK_URL or add a transport).');
  }
}

/** Posts the message as JSON to any HTTP endpoint (a provider's API, a serverless function, an automation tool). */
@Injectable()
export class WebhookMailTransport extends MailTransport {
  async send(message: MailMessage, from: string): Promise<void> {
    const response = await fetch(env.MAIL_WEBHOOK_URL as string, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from, ...message }), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Mail provider responded ${response.status}`);
  }
}

/**
 * Transactional email entry point for invitations, lead notifications and password resets.
 * Failures are logged and swallowed so a mail outage never breaks the action that triggered it.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger('Mail');
  private readonly transport: MailTransport = env.MAIL_WEBHOOK_URL ? new WebhookMailTransport() : new NoopMailTransport();

  get enabled(): boolean {
    return Boolean(env.MAIL_WEBHOOK_URL);
  }

  async send(message: MailMessage): Promise<boolean> {
    try {
      await this.transport.send(message, env.MAIL_FROM);
      return this.enabled;
    } catch (error) {
      this.logger.warn(`Email delivery failed: ${error instanceof Error ? error.message : 'unknown error'}`);
      return false;
    }
  }
}
