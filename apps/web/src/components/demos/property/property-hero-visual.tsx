import { Building2 } from 'lucide-react';
import Image from 'next/image';

/** Hero artwork for the property overview: the real dashboard and resident-app screenshots with a floating rent chip. */
export function PropertyHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[36rem] pb-8 lg:max-w-none">
      <div className="absolute -right-6 -top-6 hidden size-64 rounded-full bg-amber-200/50 blur-3xl sm:block" />
      <div className="demo-rise relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(15_23_42/0.45),0_8px_24px_-12px_rgb(15_23_42/0.15)]">
        <Image src="/demos/property-management-dashboard.webp" alt="Keystone property dashboard showing total properties, occupied units, monthly revenue, pending requests and active tenants" width={1216} height={751} priority sizes="(min-width: 1024px) 640px, 100vw" className="h-auto w-full" />
      </div>
      <div className="demo-rise absolute -bottom-2 left-2 hidden w-[23%] min-w-[6.5rem] max-w-40 sm:block lg:-left-6" style={{ ['--i' as string]: 6 }}>
        <Image src="/demos/property-management-phone.webp" alt="Keystone resident app showing the rent status, a repair in progress and building announcements" width={608} height={1250} sizes="160px" className="h-auto w-full drop-shadow-[0_20px_30px_rgb(15_23_42/0.35)]" />
      </div>
      <div aria-hidden className="demo-rise absolute -top-4 right-2 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgb(15_23_42/0.5)] sm:flex lg:-right-3" style={{ ['--i' as string]: 7 }}>
        <span className="grid size-8 place-items-center rounded-full bg-[var(--demo-good)] text-white"><Building2 className="size-4" /></span>
        <div><p className="text-[11px] font-semibold text-slate-900">Rent received, 4B</p><p className="text-[10px] text-slate-500">Harbor View · 1 Oct</p></div>
      </div>
    </div>
  );
}
