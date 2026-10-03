import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env, isProduction } from '../config/env';

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface SmtpProblem {
  /** Short machine-friendly reason, safe to log. */
  code: string;
  /** What to do about it. */
  hint: string;
}

/** Turns a Nodemailer error into a safe summary. It never includes credentials, recipients or message content. */
export function describeSmtpError(error: unknown): SmtpProblem {
  const e = (error ?? {}) as { code?: string; responseCode?: number; response?: string };
  const code = e.code ?? (e.responseCode ? String(e.responseCode) : 'UNKNOWN');
  const response = (e.response ?? '').toLowerCase();

  if (e.code === 'EAUTH' || e.responseCode === 535 || e.responseCode === 530) {
    return { code, hint: 'Brevo rejected the SMTP login. SMTP_USER must be the "Login" shown in Brevo > SMTP & API > SMTP (it looks like 123abc@smtp-brevo.com, not your account email), and SMTP_PASSWORD must be an SMTP key (not an API key and not your account password).' };
  }
  if (e.code === 'EENVELOPE' || e.responseCode === 553 || e.responseCode === 550 || e.responseCode === 554 || /sender|not (yet )?(valid|verified|allowed|activated)|domain/.test(response)) {
    return { code, hint: 'Brevo accepted the login but refused the message. EMAIL_FROM must be a sender or domain verified in Brevo > Senders, Domains & Dedicated IPs. Also check that the Brevo account is activated for SMTP sending.' };
  }
  if (e.code === 'ETIMEDOUT' || e.code === 'ESOCKET' || e.code === 'ECONNREFUSED' || e.code === 'ECONNECTION' || e.code === 'ENOTFOUND') {
    return { code, hint: 'Could not reach the SMTP server. Check SMTP_HOST (smtp-relay.brevo.com) and SMTP_PORT (587), and that the host allows outbound SMTP.' };
  }
  if (e.code === 'ETLS' || e.code === 'ESTARTTLS' || /tls|ssl/.test(response)) {
    return { code, hint: 'TLS negotiation failed. Use port 587 with SMTP_SECURE unset or false (STARTTLS). Only use SMTP_SECURE=true with port 465.' };
  }
  if (e.responseCode === 421 || e.responseCode === 451 || e.responseCode === 452) {
    return { code, hint: 'Brevo asked us to retry later (rate limit or temporary issue).' };
  }
  return { code, hint: 'Unexpected SMTP error. Run "npm run email:test" in apps/api for details.' };
}

/**
 * SMTP email (Brevo or any provider) through Nodemailer.
 * sendEmail never throws: a mail problem must not break the request that triggered it. Failures are logged
 * with the subject and a sanitized reason only, never the recipient, body or credentials.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger('Email');
  private transporter: Transporter | null = null;

  get enabled(): boolean {
    return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD);
  }

  /** Port 465 is implicit TLS. Every other port (587 included) starts plain and upgrades with STARTTLS. */
  private get implicitTls(): boolean {
    return env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : env.SMTP_PORT === 465;
  }

  private getTransporter(): Transporter {
    this.transporter ??= createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: this.implicitTls,
      requireTLS: !this.implicitTls && (isProduction || env.SMTP_PORT === 587),
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
      pool: true,
      maxConnections: 3,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    return this.transporter;
  }

  /** Opens a connection and authenticates without sending anything. */
  async verify(): Promise<{ ok: boolean; problem?: SmtpProblem }> {
    if (!this.enabled) return { ok: false, problem: { code: 'NOT_CONFIGURED', hint: 'Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD to enable email.' } };
    try {
      await this.getTransporter().verify();
      return { ok: true };
    } catch (error) {
      return { ok: false, problem: describeSmtpError(error) };
    }
  }

  /** Logs the SMTP state once at startup. Never blocks or crashes the app. */
  async logStartupStatus(): Promise<void> {
    if (!this.enabled) {
      this.logger.warn('SMTP not configured: emails will be skipped.');
      return;
    }
    const result = await this.verify();
    if (result.ok) this.logger.log(`SMTP ready (${env.SMTP_HOST}:${env.SMTP_PORT}, sender ${env.EMAIL_FROM})`);
    else this.logger.error(`SMTP check failed (${result.problem?.code}): ${result.problem?.hint}`);
  }

  async sendEmail(message: EmailMessage): Promise<boolean> {
    if (!this.enabled) {
      this.logger.warn(`Email skipped (SMTP is not configured): "${message.subject}"`);
      return false;
    }
    try {
      await this.getTransporter().sendMail({ from: env.EMAIL_FROM, to: message.to, replyTo: message.replyTo, subject: message.subject, html: message.html, text: message.text });
      return true;
    } catch (error) {
      const problem = describeSmtpError(error);
      this.logger.error(`Email failed ("${message.subject}") [${problem.code}]: ${problem.hint}`);
      return false;
    }
  }
}
