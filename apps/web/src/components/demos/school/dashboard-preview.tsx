import { CalendarCheck, CheckCircle2, ClipboardList, GraduationCap, LayoutDashboard, Users, Wallet } from 'lucide-react';
import { BarChart, Ring } from '@/components/demos/shared/charts';
import { WEEK_ATTENDANCE } from '@/data/school/app';

const SIDEBAR = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Students' },
  { icon: CalendarCheck, label: 'Attendance' },
  { icon: ClipboardList, label: 'Results' },
  { icon: Wallet, label: 'Fees' },
];

const KPIS = [
  { label: 'Students', value: '1,284' },
  { label: 'Attendance', value: '94.6%' },
  { label: 'Fees collected', value: '$482k' },
];

/** The hero visual of the landing page: a code-drawn product window with two floating cards. No image to download. */
export function DashboardPreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[34rem] pb-6 lg:max-w-none">
      <div className="absolute -right-4 -top-6 hidden size-64 rounded-full bg-blue-100/70 blur-3xl sm:block" />
      <div className="demo-rise relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(15_23_42/0.35),0_8px_24px_-12px_rgb(15_23_42/0.15)]">
        <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="ml-3 h-5 flex-1 truncate rounded-md bg-white px-3 text-[10px] leading-5 text-slate-500">app.educore.school/dashboard</span>
        </div>
        <div className="grid grid-cols-[2.75rem_1fr] sm:grid-cols-[8.5rem_1fr]">
          <div className="space-y-1 border-r border-slate-200 bg-slate-900 p-2 sm:p-3">
            <div className="mb-3 hidden items-center gap-2 px-1 sm:flex">
              <span className="grid size-6 place-items-center rounded-md bg-white text-slate-900">
                <GraduationCap className="size-3.5" />
              </span>
              <span className="text-xs font-semibold text-white">EduCore</span>
            </div>
            {SIDEBAR.map(({ icon: Icon, label, active }) => (
              <div key={label} className={`flex items-center justify-center gap-2 rounded-md px-1.5 py-2 text-[11px] sm:justify-start ${active ? 'bg-blue-600 font-semibold text-white' : 'text-slate-400'}`}>
                <Icon className="size-3.5 shrink-0" />
                <span className="hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
          <div className="min-w-0 space-y-3 bg-slate-50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500">Good morning, Principal Hart</p>
                <p className="text-sm font-semibold text-slate-900 sm:text-base">School overview</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Term 1</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {KPIS.map((kpi, i) => (
                <div key={kpi.label} className="demo-rise rounded-lg border border-slate-200 bg-white p-2 sm:p-2.5" style={{ ['--i' as string]: i + 2 }}>
                  <p className="truncate text-[9px] text-slate-500 sm:text-[10px]">{kpi.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 sm:text-base">{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="mb-2 text-[11px] font-semibold text-slate-900">Weekly attendance</p>
              <BarChart data={WEEK_ATTENDANCE} label="Weekly attendance" max={100} unit="%" highlight={1} className="h-28" />
            </div>
          </div>
        </div>
      </div>

      <div className="demo-rise absolute -bottom-1 left-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgb(15_23_42/0.4)] sm:-left-5" style={{ ['--i' as string]: 6 }}>
        <span className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="size-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-slate-900">Attendance marked</p>
          <p className="text-[10px] text-slate-500">Grade 8-A · 32 of 32 present</p>
        </div>
      </div>
      <div className="demo-rise absolute -top-3 right-1 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_18px_40px_-20px_rgb(15_23_42/0.4)] sm:flex lg:-right-3" style={{ ['--i' as string]: 7 }}>
        <Ring value={98} size={44} stroke={10} label="Collection rate" />
        <div>
          <p className="text-[11px] font-semibold text-slate-900">Fee collection</p>
          <p className="text-[10px] text-slate-500">98% of invoices paid</p>
        </div>
      </div>
    </div>
  );
}
