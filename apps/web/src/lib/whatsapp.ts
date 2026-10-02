/** Builds a wa.me link from the configured number. Returns null when no number is configured. */
export function whatsappLink(number: string | null | undefined, message: string): string | null {
  const digits = number?.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message.slice(0, 500))}`;
}

export const whatsappMessages = {
  general: (company: string) => `Hello ${company},\nI would like to discuss a project.`,
  demo: (company: string, demo: string, platform?: string) =>
    `Hello ${company},\nI explored ${demo} and would like to discuss${platform ? ` a ${platform} solution` : ' this solution'}.`,
  service: (company: string, service: string) => `Hello ${company},\nI am interested in ${service} and would like to discuss my project.`,
  estimate: (company: string, reference?: string) =>
    `Hello ${company},\nI configured a project using your estimator and would like to discuss the requirements.${reference ? `\nReference: ${reference}` : ''}`,
  lead: (company: string, reference: string) => `Hello ${company},\nI just sent a project request.\nReference: ${reference}`,
};
