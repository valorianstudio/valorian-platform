import { env } from '../config/env';

/** Branded, table-based HTML emails (the only layout that renders reliably across mail clients). */

const PAPER = '#f8f4ee';
const PANEL = '#fffdfc';
const SLATE = '#344648';
const CORAL = '#ffbb98';
const TEXT = '#283638';
const MUTED = '#5d6c70';
const LINE = '#e5ddd0';

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

const origin = (): string => env.WEB_ORIGIN.replace(/\/$/, '');

export interface Rendered {
  subject: string;
  html: string;
  text: string;
}

interface Layout {
  preheader: string;
  title: string;
  /** Pre-escaped HTML paragraphs/blocks. */
  body: string;
  cta?: { label: string; url: string };
  footnote?: string;
}

function layout({ preheader, title, body, cta, footnote }: Layout): string {
  const button = cta
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 8px"><tr><td align="center" bgcolor="${SLATE}" style="border-radius:999px;background:${SLATE}"><a href="${escapeHtml(cta.url)}" target="_blank" style="display:inline-block;padding:14px 28px;font:600 15px/1 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#fffdfc;text-decoration:none;border-radius:999px">${escapeHtml(cta.label)}</a></td></tr></table>`
    : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};-webkit-text-size-adjust:100%">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:${PAPER}">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${PAPER}"><tr><td align="center" style="padding:32px 14px">
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px">
    <tr><td style="padding:0 0 22px"><img src="${origin()}/branding/valorian-logo.png" width="150" alt="Valorian" style="display:block;border:0;height:auto;max-width:150px"></td></tr></table></td></tr>
    <tr><td style="background:${PANEL};border:1px solid ${LINE};border-radius:20px;padding:36px 32px;font:400 15px/1.65 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:${TEXT}">
      <div style="height:3px;width:48px;border-radius:3px;background:${CORAL};margin-bottom:22px"></div>
      <h1 style="margin:0 0 16px;font:600 24px/1.25 Georgia,'Times New Roman',serif;color:${SLATE}">${escapeHtml(title)}</h1>
      ${body}
      ${button}
    </td></tr>
    <tr><td style="padding:22px 8px 0;font:400 12px/1.6 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:${MUTED};text-align:center">
      ${footnote ? `${escapeHtml(footnote)}<br>` : ''}Valorian Studio &middot; Scalable software, SaaS &amp; AI solutions<br><a href="${origin()}" style="color:${SLATE};text-decoration:underline">${escapeHtml(origin().replace(/^https?:\/\//, ''))}</a>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

const p = (html: string): string => `<p style="margin:0 0 14px;color:${TEXT}">${html}</p>`;
const muted = (html: string): string => `<p style="margin:0 0 14px;color:${MUTED};font-size:13px">${html}</p>`;

function details(rows: [string, string | null | undefined][]): string {
  const shown = rows.filter((row): row is [string, string] => Boolean(row[1]));
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:6px 0 18px;border-top:1px solid ${LINE}">${shown
    .map(([label, value]) => `<tr><td style="padding:10px 0;border-bottom:1px solid ${LINE};font:500 12px/1.4 Arial,sans-serif;color:${MUTED};width:34%;vertical-align:top">${escapeHtml(label)}</td><td style="padding:10px 0 10px 12px;border-bottom:1px solid ${LINE};color:${TEXT};vertical-align:top;white-space:pre-line">${escapeHtml(value)}</td></tr>`)
    .join('')}</table>`;
}

const plain = (lines: (string | null | undefined)[]): string => lines.filter((line) => line !== null && line !== undefined).join('\n');

/* ---------- visitor-facing ---------- */

export function contactConfirmation(input: { name: string; reference?: string; estimate?: string | null; responseNote?: string | null }): Rendered {
  const first = input.name.split(' ')[0] || 'there';
  const subject = input.estimate ? 'We received your project estimate request' : 'Thanks for contacting Valorian Studio';
  return {
    subject,
    html: layout({
      preheader: 'We have your message and will reply shortly.',
      title: `Thanks, ${first}. We have your message.`,
      body:
        p('A member of the Valorian team will review your request and reply personally, usually within one business day.') +
        (input.estimate || input.reference ? details([['Reference', input.reference], ['Estimated range', input.estimate]]) : '') +
        (input.responseNote ? p(escapeHtml(input.responseNote)) : '') +
        muted('You can reply directly to this email if you want to add anything.'),
      cta: { label: 'Explore our work', url: `${origin()}/demos` },
    }),
    text: plain([`Thanks, ${first}. We have your message.`, '', 'A member of the Valorian team will review your request and reply personally, usually within one business day.', input.reference && `Reference: ${input.reference}`, input.estimate && `Estimated range: ${input.estimate}`, '', `Explore our work: ${origin()}/demos`]),
  };
}

/* ---------- team-facing ---------- */

export interface LeadNotice {
  kind: 'Lead' | 'Contact inquiry';
  reference?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  projectType?: string | null;
  estimate?: string | null;
  timeline?: string | null;
  budget?: string | null;
  message?: string | null;
  adminUrl: string;
}

export function leadNotification(input: LeadNotice): Rendered {
  const subject = `New ${input.kind.toLowerCase()}: ${input.name}${input.reference ? ` (${input.reference})` : ''}`;
  return {
    subject,
    html: layout({
      preheader: `${input.name} just reached out${input.estimate ? ` with an estimate of ${input.estimate}` : ''}.`,
      title: `New ${input.kind.toLowerCase()}`,
      body:
        details([
          ['Name', input.name],
          ['Email', input.email],
          ['Phone', input.phone],
          ['Company', input.company],
          ['Source', input.source],
          ['Project type', input.projectType],
          ['Estimate', input.estimate],
          ['Timeline', input.timeline],
          ['Budget', input.budget],
          ['Reference', input.reference],
          ['Message', input.message],
        ]) + muted('Reply to this email to answer the sender directly.'),
      cta: { label: 'Open in admin', url: input.adminUrl },
      footnote: 'Internal notification',
    }),
    text: plain([`New ${input.kind.toLowerCase()}`, `Name: ${input.name}`, `Email: ${input.email}`, input.phone && `Phone: ${input.phone}`, input.company && `Company: ${input.company}`, input.source && `Source: ${input.source}`, input.projectType && `Project type: ${input.projectType}`, input.estimate && `Estimate: ${input.estimate}`, input.timeline && `Timeline: ${input.timeline}`, input.budget && `Budget: ${input.budget}`, input.reference && `Reference: ${input.reference}`, input.message && `\nMessage:\n${input.message}`, '', `Open in admin: ${input.adminUrl}`]),
  };
}

/* ---------- prepared for the client portal and account recovery ---------- */

export function clientInvitation(input: { name: string; companyName: string; email: string; temporaryPassword?: string | null }): Rendered {
  const url = `${origin()}/client/login`;
  return {
    subject: `Your ${input.companyName} project portal is ready`,
    html: layout({
      preheader: 'Sign in to follow your project with Valorian Studio.',
      title: `Welcome, ${input.name.split(' ')[0] || 'there'}`,
      body:
        p(`Valorian Studio has set up a private portal for <strong>${escapeHtml(input.companyName)}</strong>. You can follow progress, review milestones, download files and message the team.`) +
        details([['Sign-in email', input.email], ['Temporary password', input.temporaryPassword]]) +
        muted('You will be asked to choose a new password the first time you sign in. For your security, do not forward this email.'),
      cta: { label: 'Open the client portal', url },
      footnote: 'You received this because an account was created for you.',
    }),
    text: plain([`Welcome, ${input.name}`, `Valorian Studio has set up a private portal for ${input.companyName}.`, `Sign-in email: ${input.email}`, input.temporaryPassword && `Temporary password: ${input.temporaryPassword}`, 'You will be asked to choose a new password at first sign-in.', '', `Open the portal: ${url}`]),
  };
}

export function passwordReset(input: { name: string; resetUrl: string; expiresInMinutes: number }): Rendered {
  return {
    subject: 'Reset your Valorian password',
    html: layout({
      preheader: 'Use this link to choose a new password.',
      title: 'Reset your password',
      body: p(`Hi ${escapeHtml(input.name.split(' ')[0] || 'there')}, we received a request to reset your password. This link works for ${input.expiresInMinutes} minutes.`) + muted('If you did not ask for this, you can ignore this email. Your password will not change.'),
      cta: { label: 'Choose a new password', url: input.resetUrl },
    }),
    text: plain([`Hi ${input.name}, we received a request to reset your password.`, `This link works for ${input.expiresInMinutes} minutes: ${input.resetUrl}`, 'If you did not ask for this, ignore this email.']),
  };
}
