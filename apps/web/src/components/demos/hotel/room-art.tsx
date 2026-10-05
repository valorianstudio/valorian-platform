import type { RoomCategory } from '@/data/hotel/rooms';

/**
 * A flat, elegant illustration of a hotel room (bed, window and a category detail), drawn as SVG so the rooms need no photography.
 * Server-safe, with no image requests. Each category gets its own palette so the three types are easy to tell apart at a glance.
 */
const PALETTE: Record<RoomCategory, { wall: string; bed: string; accent: string; window: string }> = {
  Deluxe: { wall: '#f5f1eb', bed: '#0f172a', accent: '#d4af37', window: '#cfe3e1' },
  Suite: { wall: '#eef2f6', bed: '#1e293b', accent: '#d4af37', window: '#dbe7f3' },
  Family: { wall: '#f1f5f3', bed: '#0f766e', accent: '#d4af37', window: '#d7ece8' },
};

export function RoomArt({ category, label = '', className }: { category: RoomCategory; label?: string; className?: string }) {
  const p = PALETTE[category];
  return (
    <svg viewBox="0 0 160 120" role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} className={className ?? 'size-full'}>
      <rect width="160" height="120" fill={p.wall} />
      <rect x="0" y="92" width="160" height="28" fill="#e7dfd2" />
      <rect x="104" y="18" width="40" height="46" rx="2" fill={p.window} stroke="#0f172a" strokeOpacity="0.12" />
      <path d="M104 41h40M124 18v46" stroke="#0f172a" strokeOpacity="0.1" strokeWidth="1.5" />
      <rect x="24" y="58" width="78" height="26" rx="6" fill={p.bed} />
      <rect x="24" y="48" width="20" height="14" rx="5" fill="#ffffff" />
      <rect x="48" y="48" width="20" height="14" rx="5" fill="#ffffff" />
      <rect x="24" y="78" width="78" height="6" fill="#0f172a" opacity="0.2" />
      {category === 'Family' && <rect x="108" y="74" width="26" height="18" rx="3" fill={p.accent} opacity="0.85" />}
      {category === 'Suite' && <rect x="112" y="68" width="34" height="24" rx="10" fill="#ffffff" stroke="#0f172a" strokeOpacity="0.15" />}
      {category === 'Deluxe' && <circle cx="132" cy="72" r="9" fill={p.accent} opacity="0.85" />}
      <rect x="0" y="56" width="10" height="36" fill="#0f172a" opacity="0.08" />
    </svg>
  );
}
