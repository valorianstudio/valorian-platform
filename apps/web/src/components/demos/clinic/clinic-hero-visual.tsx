import { CalendarDays, CheckCircle2, CreditCard, FileHeart, LayoutDashboard, Stethoscope, Users } from 'lucide-react';
import { ClinicLogo } from './clinic-logo';
import { ToothChart } from './tooth-chart';
import { INITIAL_TEETH } from '@/data/clinic/app';

const SIDEBAR = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Patients' },
  { icon: CalendarDays, label: 'Appointments' },
  { icon: FileHeart, label: 'Records' },
  { icon: CreditCard, label: 'Billing' },
];

const TODAY = [
  { time: '09:30', name: 'Marcus Reed', type: 'Crown fitting', status: 'In progress', tone: 'bg-clinic-green/15 text-green-800' },
  { time: '10:00', name: 'Sofia Alvarez', type: 'Fluoride treatment', status: 'Checked in', tone: 'bg-clinic-green/15 text-green-800' },
  { time: '10:30', name: 'Daniel Osei', type: 'Plan review', status: 'Confirmed', tone: 'bg-clinic/10 text-clinic' },
];

/** The hero visual of the landing page: a code-drawn clinic dashboard with a dental chart card and a confirmation chip. No image to download. */
export function ClinicHeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[34rem] pb-8 lg:max-w-none">
      <div className="absolute -right-6 -top-6 hidden size-64 rounded-full bg-clinic-teal/15 blur-3xl sm:block" />
      <div className="demo-rise relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(10_42_71/0.4),0_8px_24px_-12px_rgb(10_42_71/0.15)]">
        <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="ml-3 h-5 flex-1 truncate rounded-md bg-white px-3 text-[10px] leading-5 text-slate-500">app.clinicos.health/dashboard</span>
        </div>
        <div className="grid grid-cols-[2.75rem_1fr] sm:grid-cols-[8.5rem_1fr]">
          <div className="space-y-1 bg-clinic-ink p-2 sm:p-3">
            <div className="mb-3 hidden px-1 sm:block">
              <ClinicLogo tone="dark" className="[&>span:last-child]:text-xs [&>span:first-child]:size-6" />
            </div>
            {SIDEBAR.map(({ icon: Icon, label, active }) => (
              <div key={label} className={`flex items-center justify-center gap-2 rounded-md px-1.5 py-2 text-[11px] sm:justify-start ${active ? 'bg-clinic-teal-ink font-semibold text-white' : 'text-white/60'}`}>
                <Icon className="size-3.5 shrink-0" />
                <span className="hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
          <div className="min-w-0 space-y-3 bg-slate-50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500">Good morning, Dr. Costa</p>
                <p className="text-sm font-semibold text-slate-900 sm:text-base">Brightsmile Dental</p>
              </div>
              <span className="rounded-full bg-clinic-green/15 px-2 py-0.5 text-[10px] font-semibold text-green-800">36 today</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['Patients', '3,482'],
                ['Doctors', '14'],
                ['Revenue', '$48.2k'],
              ].map(([label, value], i) => (
                <div key={label} className="demo-rise rounded-lg border border-slate-200 bg-white p-2 sm:p-2.5" style={{ ['--i' as string]: i + 2 }}>
                  <p className="truncate text-[9px] text-slate-500 sm:text-[10px]">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 sm:text-base">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="mb-2 text-[11px] font-semibold text-slate-900">Today&rsquo;s appointments</p>
              <ul className="space-y-2">
                {TODAY.map((a) => (
                  <li key={a.time} className="flex items-center gap-2.5">
                    <span className="w-9 text-[10px] font-semibold tabular-nums text-clinic">{a.time}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-medium text-slate-900">{a.name}</span>
                      <span className="block truncate text-[10px] text-slate-500">{a.type}</span>
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${a.tone}`}>{a.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-rise absolute -bottom-2 left-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgb(10_42_71/0.45)] sm:-left-5" style={{ ['--i' as string]: 6 }}>
        <span className="grid size-8 place-items-center rounded-full bg-clinic-green/15 text-green-800">
          <CheckCircle2 className="size-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-slate-900">Appointment confirmed</p>
          <p className="text-[10px] text-slate-500">Reminder sent to patient</p>
        </div>
      </div>
      <div className="demo-rise absolute -top-12 right-2 hidden w-40 rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_18px_40px_-20px_rgb(10_42_71/0.45)] sm:block lg:-right-3" style={{ ['--i' as string]: 7 }}>
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-900">
          <Stethoscope className="size-3 text-clinic-teal-ink" /> Dental chart
        </p>
        <ToothChart teeth={INITIAL_TEETH} />
      </div>
    </div>
  );
}
