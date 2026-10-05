'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { track } from '@/lib/analytics';
import { floatingMessageFor, whatsappLink } from '@/lib/whatsapp';

/**
 * The floating WhatsApp button on every public page. It is small, fixed to the corner and never covers content: on phones it is an
 * icon, and it lifts slightly on hover. The message follows the page the visitor is on.
 */
export function FloatingWhatsApp({ number }: { number: string }) {
  const pathname = usePathname();
  const href = whatsappLink(number, floatingMessageFor(pathname));
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Valorian Studio on WhatsApp"
      onClick={() => track({ type: 'WHATSAPP_CLICK' })}
      className="animate-fade-up fixed bottom-4 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgb(37_211_102/0.7)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6 sm:h-13 sm:px-5"
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden />
      <span className="hidden sm:inline">Chat With Us</span>
    </a>
  );
}
