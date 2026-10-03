import { env } from '../src/config/env';
import { EmailService } from '../src/mail/email.service';
import { contactConfirmation } from '../src/mail/templates';

/** Sends one real test email using the normal environment. Prints a sanitized result, never credentials. */
async function main(): Promise<void> {
  const email = new EmailService();
  const to = env.EMAIL_TO ?? env.NOTIFY_EMAIL;
  console.info(`SMTP host:   ${env.SMTP_HOST ?? '(not set)'}:${env.SMTP_PORT}`);
  console.info(`SMTP user:   ${env.SMTP_USER ? 'set' : '(not set)'}`);
  console.info(`SMTP key:    ${env.SMTP_PASSWORD ? 'set' : '(not set)'}`);
  console.info(`From:        ${env.EMAIL_FROM}`);
  console.info(`To:          ${to ?? '(set EMAIL_TO or NOTIFY_EMAIL)'}`);
  if (!to) process.exit(1);

  const check = await email.verify();
  if (!check.ok) {
    console.error(`\nSMTP connection/login FAILED [${check.problem?.code}]\n${check.problem?.hint}`);
    process.exit(1);
  }
  console.info('\nSMTP connection and login OK.');

  const sent = await email.sendEmail({ to, ...contactConfirmation({ name: 'Valorian test', reference: 'TEST-0000' }), subject: 'Valorian email test' });
  if (!sent) {
    console.error('Sending FAILED. See the sanitized reason logged above.');
    process.exit(1);
  }
  console.info(`Test email accepted by the SMTP server for ${to}. Check the inbox (and spam).`);
  process.exit(0);
}

void main();
