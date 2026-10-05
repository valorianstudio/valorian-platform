'use client';

import { CheckCircle2 } from 'lucide-react';
import { useId, useState } from 'react';
import type { FormEvent } from 'react';

export interface EnquiryCopy {
  /** Label and placeholder for the organisation field, for example "School name". */
  organisation: { label: string; placeholder: string };
  emailPlaceholder: string;
  topics: { value: string; label: string }[];
  messagePlaceholder: string;
  submitLabel: string;
}

/**
 * The request-a-demo form of a demo product's landing page. It is a demo: nothing is sent anywhere, the submit just shows a
 * thank-you state. This is the only client component on a demo landing page.
 */
export function EnquiryForm({ copy }: { copy: EnquiryCopy }) {
  const id = useId();
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="demo-rise flex h-full min-h-72 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--demo-good-soft,#ecfdf5)] text-[color:var(--demo-good-ink,#047857)]">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Request received</h3>
        <p className="mt-2 max-w-xs text-sm text-slate-600">On a real site this would reach your team. This is a demo, so nothing was sent.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-5 text-sm font-semibold text-[color:var(--demo-accent,#2563eb)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
          Send another
        </button>
      </div>
    );
  }

  const field = 'mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent,#2563eb)] focus:outline-2 focus:outline-[color:var(--demo-accent,#2563eb)]';
  const label = 'block text-sm font-medium text-slate-700';

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            Full name
          </label>
          <input id={`${id}-name`} required autoComplete="name" placeholder="Jordan Ellis" className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            Work email
          </label>
          <input id={`${id}-email`} type="email" required autoComplete="email" placeholder={copy.emailPlaceholder} className={field} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-org`} className={label}>
            {copy.organisation.label}
          </label>
          <input id={`${id}-org`} required placeholder={copy.organisation.placeholder} className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-topic`} className={label}>
            I would like to
          </label>
          <select id={`${id}-topic`} defaultValue={copy.topics[0].value} className={field}>
            {copy.topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-message`} className={label}>
          Message <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea id={`${id}-message`} rows={3} placeholder={copy.messagePlaceholder} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent,#2563eb)] focus:outline-2 focus:outline-[color:var(--demo-accent,#2563eb)]" />
      </div>
      <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[var(--demo-accent,#2563eb)] px-6 text-sm font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
        {copy.submitLabel}
      </button>
      <p className="text-center text-xs text-slate-500">Demo form: nothing is submitted.</p>
    </form>
  );
}
