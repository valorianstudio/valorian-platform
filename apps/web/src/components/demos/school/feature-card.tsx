import { CalendarCheck, CalendarClock, ClipboardList, MessagesSquare, NotebookPen, Presentation, Users, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FeatureIcon } from '@/data/school/landing';

const ICONS: Record<FeatureIcon, LucideIcon> = {
  users: Users,
  teachers: Presentation,
  attendance: CalendarCheck,
  results: ClipboardList,
  fees: Wallet,
  messages: MessagesSquare,
  schedule: CalendarClock,
  exams: NotebookPen,
};

/** One capability of the product: a quiet card whose icon tile turns blue on hover. */
export function FeatureCard({ icon, title, description, index = 0 }: { icon: FeatureIcon; title: string; description: string; index?: number }) {
  const Icon = ICONS[icon];
  return (
    <article data-reveal style={{ ['--i' as string]: index % 4 }} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_40px_-24px_rgb(37_99_235/0.35)]">
      <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </article>
  );
}
