/** Builds a wa.me link from the configured number. Returns null when no number is configured. */
export function whatsappLink(number: string | null | undefined, message: string): string | null {
  const digits = number?.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message.slice(0, 500))}`;
}

/** The studio's WhatsApp line. Used when the admin settings have no number, so every WhatsApp button works from the first deploy. */
export const DEFAULT_WHATSAPP_NUMBER = '+8801518935876';

export function whatsappNumberFrom(configured: string | null | undefined): string {
  return configured?.trim() || DEFAULT_WHATSAPP_NUMBER;
}

/** Turns a URL slug into a readable name: "school-management" becomes "School Management". */
function humanize(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** The prefilled message of the floating button, chosen from the page the visitor is on. */
export function floatingMessageFor(pathname: string): string {
  const [, section, slug] = pathname.split('/');
  if (section === 'demos' && slug) return `Hello Valorian Studio, I am interested in the ${humanize(slug)} demo and would like to discuss a similar project.`;
  if (section === 'services' && slug) return `Hello Valorian Studio, I am interested in ${humanize(slug)} and would like to discuss my project.`;
  if (section === 'estimate') return 'Hello Valorian Studio, I configured a project estimate and would like to discuss it.';
  return 'Hello Valorian Studio, I would like to discuss a software project.';
}

export const whatsappMessages = {
  general: (company: string) => `Hello ${company},\nI would like to discuss a project.`,
  /** A demo the visitor just looked at, offered as the starting point for a similar project. */
  demoSimilar: (title: string) => `Hello Valorian Studio, I am interested in the ${title} demo and would like to discuss a similar project.`,
  demo: (company: string, demo: string, platform?: string) =>
    `Hello ${company},\nI explored ${demo} and would like to discuss${platform ? ` a ${platform} solution` : ' this solution'}.`,
  service: (company: string, service: string) => `Hello ${company},\nI am interested in ${service} and would like to discuss my project.`,
  estimate: (company: string, reference?: string) =>
    `Hello ${company},\nI configured a project using your estimator and would like to discuss the requirements.${reference ? `\nReference: ${reference}` : ''}`,
  lead: (company: string, reference: string) => `Hello ${company},\nI just sent a project request.\nReference: ${reference}`,
};
