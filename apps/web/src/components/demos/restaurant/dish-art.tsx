import type { ReactNode } from 'react';
import type { DishArtKey } from '@/data/restaurant/app';
import { cn } from '@/lib/cn';

/** Soft background tint per dish, so a menu grid reads as a calm, warm palette rather than a rainbow. */
const TINT: Record<DishArtKey, string> = {
  pasta: 'bg-amber-50',
  steak: 'bg-stone-100',
  salad: 'bg-green-50',
  burger: 'bg-amber-50',
  dessert: 'bg-stone-100',
  fish: 'bg-orange-50',
  soup: 'bg-amber-50',
  drink: 'bg-green-50',
};

const Plate = ({ children }: { children: ReactNode }) => (
  <>
    <ellipse cx="60" cy="104" rx="38" ry="5" fill="#000" opacity="0.07" />
    <circle cx="60" cy="58" r="46" fill="#fff" stroke="#e5e7eb" strokeWidth="1.5" />
    <circle cx="60" cy="58" r="35" fill="#f9fafb" stroke="#eef0f3" />
    {children}
  </>
);

const ART: Record<DishArtKey, ReactNode> = {
  pasta: (
    <Plate>
      {[22, 17, 12, 7].map((r) => (
        <circle key={r} cx="60" cy="58" r={r} fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" strokeDasharray={`${r * 4} ${r * 1.4}`} opacity={0.9} />
      ))}
      <circle cx="60" cy="58" r="5" fill="#b45309" />
      {[[48, 44], [72, 50], [66, 74], [44, 66]].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx="4.5" ry="2.6" fill="#16a34a" transform={`rotate(${x * 3} ${x} ${y})`} />
      ))}
    </Plate>
  ),
  steak: (
    <Plate>
      <rect x="34" y="40" width="30" height="20" rx="9" fill="#7c2d12" transform="rotate(-12 49 50)" />
      <rect x="52" y="52" width="30" height="20" rx="9" fill="#9a3412" transform="rotate(8 67 62)" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${42 + i * 7} 42 l6 14`} stroke="#431407" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={36 + i * 4} y="72" width="2.6" height="14" rx="1.3" fill="#16a34a" transform={`rotate(${-18 + i * 4} 40 78)`} />
      ))}
      <path d="M78 42c8 2 10 10 4 14" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </Plate>
  ),
  salad: (
    <Plate>
      {[[46, 46, 20], [66, 44, -30], [74, 62, 50], [58, 74, 10], [42, 64, -50], [56, 56, 80]].map(([x, y, a], i) => (
        <ellipse key={i} cx={x} cy={y} rx="12" ry="6" fill={['#16a34a', '#22c55e', '#4ade80'][i % 3]} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {[[62, 52], [48, 62], [70, 68]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1.5" />
      ))}
      {[[54, 46], [66, 60]].map(([x, y]) => (
        <circle key={`t${x}`} cx={x} cy={y} r="3.2" fill="#ea580c" />
      ))}
    </Plate>
  ),
  burger: (
    <Plate>
      <path d="M34 62c0-16 12-24 26-24s26 8 26 24z" fill="#d97706" />
      <circle cx="48" cy="50" r="1.4" fill="#fde68a" />
      <circle cx="60" cy="46" r="1.4" fill="#fde68a" />
      <circle cx="72" cy="51" r="1.4" fill="#fde68a" />
      <path d="M32 64c4 4 8 0 12 4s8 0 12 4 8 0 12 4 8 0 12-4 4-4 6-8z" fill="#22c55e" />
      <rect x="34" y="66" width="52" height="8" rx="4" fill="#78350f" />
      <path d="M36 74h48l-4 5H40z" fill="#facc15" />
      <path d="M34 78h52c0 6-6 9-26 9s-26-3-26-9z" fill="#d97706" />
    </Plate>
  ),
  dessert: (
    <Plate>
      <circle cx="60" cy="56" r="21" fill="#44250f" />
      <circle cx="60" cy="56" r="15" fill="#5a3216" />
      <path d="M44 50c6-8 22-8 30 0" fill="none" stroke="#fde68a" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      <circle cx="68" cy="46" r="2.2" fill="#facc15" />
      {[[48, 74], [60, 78], [72, 74]].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="3.4" fill="#7c3aed" opacity="0.8" />
      ))}
      <path d="M40 72c10 6 30 6 40 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
    </Plate>
  ),
  fish: (
    <Plate>
      <rect x="36" y="46" width="50" height="22" rx="11" fill="#fb923c" transform="rotate(-8 61 57)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${44 + i * 8} 48c3 6 3 12 0 18`} fill="none" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" transform="rotate(-8 61 57)" />
      ))}
      <path d="M72 76a9 9 0 1 1 14 0z" fill="#facc15" />
      <path d="M72 76a9 9 0 0 1 14 0" fill="none" stroke="#fde68a" strokeWidth="1.5" />
      {[[40, 76], [48, 80], [34, 70]].map(([x, y]) => (
        <ellipse key={`${x}`} cx={x} cy={y} rx="5" ry="2.4" fill="#16a34a" transform={`rotate(${x * 4} ${x} ${y})`} />
      ))}
    </Plate>
  ),
  soup: (
    <Plate>
      <circle cx="60" cy="58" r="27" fill="#fff" stroke="#e5e7eb" strokeWidth="1.5" />
      <circle cx="60" cy="58" r="22" fill="#f59e0b" />
      <path d="M44 56c6-8 10 6 16-2s10 6 16-2" fill="none" stroke="#fff7ed" strokeWidth="3" strokeLinecap="round" />
      {[[52, 66], [64, 68], [68, 52], [50, 50]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="#16a34a" />
      ))}
    </Plate>
  ),
  drink: (
    <>
      <ellipse cx="60" cy="106" rx="24" ry="4" fill="#000" opacity="0.07" />
      <path d="M40 26h40l-5 76H45z" fill="#fff" stroke="#d1d5db" strokeWidth="2" strokeLinejoin="round" />
      <path d="M43 50h34l-3.4 50H46.4z" fill="#fbbf24" opacity="0.85" />
      <rect x="48" y="58" width="12" height="12" rx="3" fill="#fff" opacity="0.65" transform="rotate(-10 54 64)" />
      <rect x="60" y="72" width="11" height="11" rx="3" fill="#fff" opacity="0.55" transform="rotate(12 65 78)" />
      <circle cx="78" cy="30" r="12" fill="#86efac" stroke="#16a34a" strokeWidth="2" />
      <path d="M78 30V19M78 30l9-5M78 30l9 5M78 30l-9 5M78 30l-9-5" stroke="#16a34a" strokeWidth="1.4" />
      <path d="M62 22L70 4" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
};

/**
 * A flat, top-down illustration of a dish, drawn as SVG so a demo menu needs no photography. Server component, a few hundred bytes each.
 * `label` is the accessible name: pass the dish name, or leave it empty for decorative use.
 */
export function DishArt({ art, label = '', className }: { art: DishArtKey; label?: string; className?: string }) {
  return (
    <div className={cn('grid place-items-center overflow-hidden', TINT[art], className)}>
      <svg viewBox="0 0 120 120" role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} className="size-full max-h-full">
        {ART[art]}
      </svg>
    </div>
  );
}
