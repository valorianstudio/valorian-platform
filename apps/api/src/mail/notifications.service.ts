import { Injectable, Logger } from '@nestjs/common';
import { env } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { LeadNotice, clientInvitation, contactConfirmation, leadNotification, passwordReset } from './templates';

const oneLine = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim();

/** Business emails. Every method is safe to call without awaiting: failures are logged, never thrown. */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('Notifications');

  constructor(
    private readonly email: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  private async teamRecipient(): Promise<string | null> {
    const [leads, site] = await Promise.all([this.prisma.leadSettings.findUnique({ where: { id: 'leads' }, select: { notifyEmail: true } }), this.prisma.siteSetting.findUnique({ where: { id: 'site' }, select: { primaryEmail: true } })]);
    return leads?.notifyEmail || env.EMAIL_TO || env.NOTIFY_EMAIL || site?.primaryEmail || null;
  }

  private async safely(task: () => Promise<unknown>, what: string): Promise<void> {
    try {
      await task();
    } catch (error) {
      this.logger.error(`${what} failed: ${error instanceof Error ? error.name : 'unknown error'}`);
    }
  }

  /** Contact form, estimator and demo leads: a confirmation to the visitor and an alert to the team. */
  leadCreated(input: Omit<LeadNotice, 'kind' | 'adminUrl'> & { id?: string; responseNote?: string | null }): Promise<void> {
    return this.safely(async () => {
      const name = oneLine(input.name);
      const confirmation = contactConfirmation({ name, reference: input.reference, estimate: input.estimate, responseNote: input.responseNote });
      await this.email.sendEmail({ to: input.email, ...confirmation });

      const to = await this.teamRecipient();
      if (!to) return;
      const notice = leadNotification({ ...input, name, kind: 'Lead', adminUrl: `${env.WEB_ORIGIN.replace(/\/$/, '')}/admin/leads${input.id ? `/${input.id}` : ''}` });
      await this.email.sendEmail({ to, replyTo: input.email, ...notice });
    }, 'Lead emails');
  }

  inquiryCreated(input: { name: string; email: string; phone?: string | null; company?: string | null; message: string; type: string }): Promise<void> {
    return this.safely(async () => {
      const name = oneLine(input.name);
      await this.email.sendEmail({ to: input.email, ...contactConfirmation({ name }) });
      const to = await this.teamRecipient();
      if (!to) return;
      const notice = leadNotification({ kind: 'Contact inquiry', name, email: input.email, phone: input.phone, company: input.company, source: input.type, message: input.message, adminUrl: `${env.WEB_ORIGIN.replace(/\/$/, '')}/admin/inquiries` });
      await this.email.sendEmail({ to, replyTo: input.email, ...notice });
    }, 'Inquiry emails');
  }

  /** Ready for the client portal. Called when an admin creates a portal user while SMTP is configured. */
  clientInvited(input: { name: string; email: string; companyName: string; temporaryPassword?: string | null }): Promise<boolean> {
    return this.email.sendEmail({ to: input.email, ...clientInvitation(input) });
  }

  /** Prepared for the future password-reset flow. */
  passwordResetRequested(input: { name: string; email: string; resetUrl: string; expiresInMinutes?: number }): Promise<boolean> {
    return this.email.sendEmail({ to: input.email, ...passwordReset({ name: input.name, resetUrl: input.resetUrl, expiresInMinutes: input.expiresInMinutes ?? 30 }) });
  }
}
