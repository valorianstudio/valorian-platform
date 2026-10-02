'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Button, ButtonLink } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { ApiError, apiRequest } from '@/lib/client-api';
import { whatsappLink, whatsappMessages } from '@/lib/whatsapp';

export interface LeadContext {
  source: 'ESTIMATOR' | 'DEMO' | 'SERVICE' | 'CONTACT' | 'HOMEPAGE' | 'OTHER';
  demo?: string;
  demoName?: string;
  service?: string;
  serviceName?: string;
  estimateId?: string;
  platform?: 'WEBSITE' | 'MOBILE' | 'BOTH';
  projectType?: string;
  backHref?: string;
  backLabel?: string;
}

interface LeadFormProps {
  context: LeadContext;
  company: string;
  whatsappNumber: string | null;
  responseNote?: string | null;
  showInquiryTypes?: boolean;
  submitLabel?: string;
}

const INQUIRY_TYPES = [
  { value: 'PROJECT', label: 'Project inquiry' },
  { value: 'GENERAL', label: 'General inquiry' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'SUPPORT', label: 'Support' },
  { value: 'OTHER', label: 'Other' },
];
const PROJECT_TYPES = ['Website', 'Web application', 'Mobile app', 'Website + mobile app', 'SaaS platform', 'System upgrade', 'Not sure yet'];
const BUDGETS = ['Not sure yet', 'Under 100k BDT / $1,000', '100k–300k BDT / $1,000–3,000', '300k–1M BDT / $3,000–10,000', 'Over 1M BDT / $10,000+'];
const TIMELINES = ['Flexible', 'Within 3 months', 'Within 1 month', 'As soon as possible'];

type FieldErrors = Record<string, string>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9 ()-]{6,24}$/;

export function LeadForm({ context, company, whatsappNumber, responseNote, showInquiryTypes, submitLabel = 'Send request' }: LeadFormProps) {
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [preferred, setPreferred] = useState('EMAIL');
  const [type, setType] = useState('PROJECT');
  const [done, setDone] = useState<{ reference?: string } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? '').trim();

    const found: FieldErrors = {};
    if (!text('name')) found.name = 'Please enter your name';
    if (!EMAIL.test(text('email'))) found.email = 'Enter a valid email address';
    if (text('phone') && !PHONE.test(text('phone'))) found.phone = 'Enter a valid phone number';
    if ((preferred === 'PHONE' || preferred === 'WHATSAPP') && !text('phone')) found.phone = 'Add a number so we can reach you this way';
    if (type !== 'PROJECT' && !text('message')) found.message = 'Please tell us how we can help';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setApiError(null);
    setSubmitting(true);
    const phone = text('phone') || undefined;
    const base = {
      name: text('name'),
      email: text('email'),
      phone,
      whatsapp: preferred === 'WHATSAPP' ? phone : undefined,
      companyName: text('company') || undefined,
      country: text('country') || undefined,
      preferredContact: preferred,
      message: text('message') || undefined,
      sourceUrl: window.location.pathname,
      website: text('website'),
    };
    try {
      if (type === 'PROJECT') {
        const result = await apiRequest<{ reference: string }>('POST', '/leads', {
          ...base,
          source: context.source,
          demo: context.demo,
          service: context.service,
          estimateId: context.estimateId,
          platform: context.platform,
          projectType: text('projectType') || context.projectType,
          expectedTimeline: text('timeline') || undefined,
          budgetRange: text('budget') || undefined,
        });
        setDone({ reference: result.reference });
      } else {
        await apiRequest('POST', '/inquiries', { ...base, type, message: text('message') });
        setDone({});
      }
    } catch (error) {
      setApiError(error instanceof ApiError ? error : new ApiError('Something went wrong. Please try again.', 0));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const subject = context.demoName ?? context.serviceName;
    const wa = whatsappLink(
      whatsappNumber,
      done.reference ? (context.estimateId ? whatsappMessages.estimate(company, done.reference) : whatsappMessages.lead(company, done.reference)) : whatsappMessages.general(company),
    );
    return (
      <div role="status" className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">{done.reference ? 'Thanks — your project request has been received.' : 'Thanks — your message has been received.'}</h2>
        {done.reference && (
          <p className="mt-2 text-muted">
            Reference: <strong className="font-mono text-foreground">{done.reference}</strong>
          </p>
        )}
        <p className="mx-auto mt-3 max-w-md text-muted">{responseNote ?? `${company} will review your details and get back to you using your preferred contact method.`}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {wa && (
            <ButtonLink href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden /> Chat on WhatsApp
            </ButtonLink>
          )}
          {context.backHref && (
            <ButtonLink href={context.backHref} variant="secondary">
              {context.backLabel ?? (subject ? `Return to ${subject}` : 'Go back')}
            </ButtonLink>
          )}
          <ButtonLink href="/demos" variant="secondary">
            Explore more work
          </ButtonLink>
        </div>
      </div>
    );
  }

  const contextLabel = context.demoName ? `Demo: ${context.demoName}${context.platform ? ` · ${context.platform === 'MOBILE' ? 'Mobile App' : context.platform === 'BOTH' ? 'Website + Mobile' : 'Website'}` : ''}` : context.serviceName ? `Service: ${context.serviceName}` : context.estimateId ? 'Includes your estimate configuration' : null;

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${formId}-title`} className="space-y-5">
      <h2 id={`${formId}-title`} className="sr-only">
        Project inquiry form
      </h2>
      {contextLabel && <p className="rounded-lg bg-primary-soft px-4 py-2.5 text-sm font-medium text-primary">{contextLabel}</p>}
      <FormAlert error={apiError} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {showInquiryTypes && (
        <Field label="What is this about?">
          {(props) => (
            <Select {...props} value={type} onChange={(e) => setType(e.target.value)}>
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          )}
        </Field>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          {(props) => <Input {...props} name="name" autoComplete="name" required maxLength={100} />}
        </Field>
        <Field label="Email" error={errors.email}>
          {(props) => <Input {...props} name="email" type="email" inputMode="email" autoComplete="email" required maxLength={160} />}
        </Field>
        <Field label="Phone / WhatsApp" error={errors.phone} hint="Optional unless you prefer a call or WhatsApp.">
          {(props) => <Input {...props} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={24} />}
        </Field>
        <Field label="Company" error={errors.company}>
          {(props) => <Input {...props} name="company" autoComplete="organization" maxLength={120} />}
        </Field>
        <Field label="Country">
          {(props) => <Input {...props} name="country" autoComplete="country-name" maxLength={80} />}
        </Field>
        <Field label="Preferred contact method">
          {(props) => (
            <Select {...props} value={preferred} onChange={(e) => setPreferred(e.target.value)}>
              <option value="EMAIL">Email</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="PHONE">Phone call</option>
              <option value="VIDEO_CALL">Video call</option>
            </Select>
          )}
        </Field>
        {type === 'PROJECT' && showInquiryTypes && (
          <>
            <Field label="Project type">
              {(props) => (
                <Select {...props} name="projectType" defaultValue="">
                  <option value="">Select…</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Budget range">
              {(props) => (
                <Select {...props} name="budget" defaultValue="">
                  <option value="">Select…</option>
                  {BUDGETS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              )}
            </Field>
          </>
        )}
        {type === 'PROJECT' && (
          <Field label="Expected timeline" className={showInquiryTypes ? '' : 'sm:col-span-2'}>
            {(props) => (
              <Select {...props} name="timeline" defaultValue="">
                <option value="">Select…</option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            )}
          </Field>
        )}
      </div>

      <Field label={type === 'PROJECT' ? 'Tell us about your project' : 'Message'} error={errors.message}>
        {(props) => <Textarea {...props} name="message" rows={5} maxLength={3000} required={type !== 'PROJECT'} />}
      </Field>

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          We only use your details to reply to this request. See our{' '}
          <Link href="/privacy" className="underline underline-offset-2">privacy policy</Link>.
        </p>
        <Button type="submit" size="lg" loading={submitting}>
          {submitting ? 'Sending…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
