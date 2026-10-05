import { CalendarCheck, MessageCircle } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { whatsappLink, whatsappMessages } from '@/lib/whatsapp';

/**
 * The free-consultation offer that sits above the contact form. The primary button goes to `bookingUrl`: by default the form on this
 * page, and any calendar link can replace it later without touching the layout.
 */
export function ConsultationBand({ number, bookingUrl = '#lead-form' }: { number: string; bookingUrl?: string }) {
  const wa = whatsappLink(number, whatsappMessages.general('Valorian Studio'));
  return (
    <section aria-labelledby="consultation-heading" className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Get Free Project Consultation</p>
          <h2 id="consultation-heading" className="display mt-2 text-2xl text-primary sm:text-3xl">Have a Project Idea? Let’s Discuss It.</h2>
          <p className="mt-2 max-w-2xl text-pretty text-muted">Get a free consultation with our team and understand the best solution for your business.</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <ButtonLink href={bookingUrl} size="lg">
            <CalendarCheck className="size-4" aria-hidden /> Book Free Consultation
          </ButtonLink>
          {wa && (
            <ButtonLink href={wa} size="lg" variant="secondary" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden /> Chat on WhatsApp
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
