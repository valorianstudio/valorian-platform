import { ArrowRight, Hammer, MessageCircle, Sparkles } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { getSiteSettings } from '@/lib/server-api';
import { whatsappLink, whatsappMessages, whatsappNumberFrom } from '@/lib/whatsapp';

/**
 * The call to action at the end of a demo: after the visitor has looked at it, offer the next step. The three options are to build a
 * similar project, talk on WhatsApp with the demo already named, or book a free consultation. Only the server reads the settings.
 */
export async function DemoInterest({ slug, title }: { slug: string; title: string }) {
  const settings = await getSiteSettings();
  const wa = whatsappLink(whatsappNumberFrom(settings.whatsapp), whatsappMessages.demoSimilar(title));

  return (
    <section aria-labelledby="demo-interest-heading" className="bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Next step</p>
              <h2 id="demo-interest-heading" className="display mt-2 text-2xl text-primary sm:text-3xl">Interested in this Solution?</h2>
              <p className="mt-2 max-w-xl text-pretty text-muted">Tell us what your business needs and we will shape a version of this system around it.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:shrink-0">
              <ButtonLink href={`/contact?demo=${slug}#lead-form`} size="lg">
                <Hammer className="size-4" aria-hidden /> Build Similar {title}
              </ButtonLink>
              {wa && (
                <ButtonLink href={wa} size="lg" variant="secondary" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" aria-hidden /> Discuss on WhatsApp
                </ButtonLink>
              )}
              <ButtonLink href="/contact#lead-form" size="lg" variant="ghost">
                <Sparkles className="size-4" aria-hidden /> Get Free Consultation <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
