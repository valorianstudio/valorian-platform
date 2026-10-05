import type { Point } from '@/data/delivery/operations';
import { cn } from '@/lib/cn';

/**
 * A stylised city map drawn in SVG: streets, the harbour, a route between two pins and the rider's position along it. Positions are
 * percentages, so the same map scales to any width. No tiles and no network requests.
 */
export function MapView({ from, to, progress = 50, label = 'Delivery route map', className }: { from: Point; to: Point; progress?: number; label?: string; className?: string }) {
  const bend = { x: (from.x + to.x) / 2 + (to.y - from.y) * 0.25, y: (from.y + to.y) / 2 - (to.x - from.x) * 0.25 };
  const path = `M${from.x} ${from.y} Q${bend.x} ${bend.y} ${to.x} ${to.y}`;
  const t = Math.max(0, Math.min(1, progress / 100));
  const rider = {
    x: (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * bend.x + t * t * to.x,
    y: (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * bend.y + t * t * to.y,
  };
  return (
    <div role="img" aria-label={`${label}: from ${from.label} to ${to.label}, ${Math.round(progress)}% complete`} className={cn('relative overflow-hidden rounded-xl bg-[#e8eef7]', className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
        <path d="M0 78 Q30 66 52 74 T100 70 V100 H0Z" fill="#bfd7f2" />
        <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M0 22 H100" /><path d="M0 46 H100" /><path d="M14 0 V100" /><path d="M42 0 V100" /><path d="M70 0 V100" />
        </g>
        <g stroke="#ffffff" strokeWidth="0.9" fill="none" opacity="0.7"><path d="M0 34 H100" /><path d="M28 0 V100" /><path d="M86 0 V100" /></g>
        <path d={path} fill="none" stroke="#0f172a" strokeOpacity="0.18" strokeWidth="3.6" strokeLinecap="round" />
        <path d={path} fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="0.1 2.4" />
        <circle cx={from.x} cy={from.y} r="2.6" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
        <rect x={to.x - 2.6} y={to.y - 2.6} width="5.2" height="5.2" rx="1.2" fill="#f97316" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx={rider.x} cy={rider.y} r="3.4" fill="#1d4ed8" opacity="0.2" />
        <circle cx={rider.x} cy={rider.y} r="1.8" fill="#1d4ed8" stroke="#ffffff" strokeWidth="0.7" />
      </svg>
    </div>
  );
}
