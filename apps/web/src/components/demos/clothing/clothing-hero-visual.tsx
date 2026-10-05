import { Truck } from 'lucide-react';
import Image from 'next/image';

/** Hero artwork for the clothing overview: the real store and shopping-app screenshots with a floating dispatch chip. */
export function ClothingHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[36rem] pb-8 lg:max-w-none">
      <div className="absolute -right-6 -top-6 hidden size-64 rounded-full bg-[#e7dccb]/70 blur-3xl sm:block" />
      <div className="demo-rise relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgb(0_0_0/0.35),0_8px_24px_-12px_rgb(0_0_0/0.15)]">
        <Image src="/demos/clothing-ecommerce-dashboard.webp" alt="Maison Vale admin dashboard showing total sales, orders, customers, revenue and inventory status" width={1216} height={751} priority sizes="(min-width: 1024px) 640px, 100vw" className="h-auto w-full" />
      </div>
      <div className="demo-rise absolute -bottom-2 left-2 hidden w-[23%] min-w-[6.5rem] max-w-40 sm:block lg:-left-6" style={{ ['--i' as string]: 6 }}>
        <Image src="/demos/clothing-ecommerce-phone.webp" alt="Maison Vale shopping app showing the home screen with the new season and picked-for-you products" width={608} height={1250} sizes="160px" className="h-auto w-full drop-shadow-[0_20px_30px_rgb(0_0_0/0.35)]" />
      </div>
      <div aria-hidden className="demo-rise absolute -top-4 right-2 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)] sm:flex lg:-right-3" style={{ ['--i' as string]: 7 }}>
        <span className="grid size-8 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]">
          <Truck className="size-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-slate-900">Order #10482 shipped</p>
          <p className="text-[10px] text-slate-500">Arrives Thu 8 Oct</p>
        </div>
      </div>
    </div>
  );
}
