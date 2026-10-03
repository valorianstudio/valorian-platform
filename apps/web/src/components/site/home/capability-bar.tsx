import { Cloud, Code, Layers, Smartphone, Sparkles } from 'lucide-react';

const CAPABILITIES = [
  { Icon: Code, title: 'Custom Software' },
  { Icon: Layers, title: 'SaaS Products' },
  { Icon: Smartphone, title: 'Mobile Applications' },
  { Icon: Sparkles, title: 'AI Integration' },
  { Icon: Cloud, title: 'Business Platforms' },
];

/** A calm value strip: icons and words only, separated by hairlines. */
export function CapabilityBar() {
  return (
    <section aria-label="What we do" className="border-y border-border bg-background">
      <ul className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5 [&>li:last-child]:max-sm:col-span-2 sm:max-lg:[&>li:last-child]:col-span-2 lg:[&>li:last-child]:col-span-1">
        {CAPABILITIES.map(({ Icon, title }) => (
          <li key={title} className="flex items-center justify-center gap-3 bg-background px-4 py-6 text-primary">
            <Icon className="size-[18px] shrink-0 text-accent" aria-hidden />
            <span className="text-sm font-semibold">{title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
