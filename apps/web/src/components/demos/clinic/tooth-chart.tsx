import { TOOTH_STATES } from '@/data/clinic/app';
import type { ToothState } from '@/data/clinic/app';

const UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

/** Crown size by FDI position: 1-2 incisors, 3 canine, 4-5 premolars, 6-8 molars. */
function size(tooth: number): { w: number; h: number } {
  const n = tooth % 10;
  if (n <= 2) return { w: 15, h: 24 };
  if (n === 3) return { w: 15, h: 27 };
  if (n <= 5) return { w: 18, h: 22 };
  return { w: 27, h: 25 };
}

const FILL: Record<ToothState, { fill: string; stroke: string; text: string }> = {
  healthy: { fill: '#ffffff', stroke: '#94a3b8', text: '#475569' },
  filled: { fill: '#0f4c81', stroke: '#0a3a63', text: '#ffffff' },
  crown: { fill: '#0ea5a4', stroke: '#0b7f7e', text: '#052e2e' },
  implant: { fill: '#22c55e', stroke: '#15803d', text: '#052e16' },
  cavity: { fill: '#fbbf24', stroke: '#b45309', text: '#451a03' },
  missing: { fill: '#f1f5f9', stroke: '#cbd5e1', text: '#94a3b8' },
};

const RX = 172;
const RY = 92;
const SCALE = 1.1;

/**
 * Teeth are spaced by arc length along the arch, in proportion to their own width, so wide molars never overlap their
 * neighbours and every arch has even gaps. Computed once: both arches share the same order of tooth sizes.
 */
const PLACEMENT = (() => {
  const steps = 600;
  const table: { theta: number; length: number }[] = [];
  let length = 0;
  let previous = { x: 200 + RX * Math.cos(Math.PI), y: -RY * Math.sin(Math.PI) };
  for (let i = 0; i <= steps; i++) {
    const theta = Math.PI - (i / steps) * Math.PI;
    const point = { x: 200 + RX * Math.cos(theta), y: -RY * Math.sin(theta) };
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    table.push({ theta, length });
    previous = point;
  }
  const widths = UPPER.map((tooth) => size(tooth).w);
  const total = widths.reduce((sum, w) => sum + w, 0);
  let before = 0;
  return widths.map((w) => {
    const target = ((before + w / 2) / total) * length;
    before += w;
    const row = table.find((entry) => entry.length >= target) ?? table[table.length - 1];
    return row.theta;
  });
})();

function position(tooth: number, index: number, upper: boolean) {
  const theta = PLACEMENT[index];
  const x = 200 + RX * Math.cos(theta);
  const y = upper ? 128 - RY * Math.sin(theta) * 0.95 : 152 + RY * Math.sin(theta) * 0.95;
  const slope = upper ? RY * 0.95 * Math.cos(theta) : -RY * 0.95 * Math.cos(theta);
  const angle = (Math.atan2(slope, RX * Math.sin(theta)) * 180) / Math.PI;
  const { w, h } = size(tooth);
  return { x, y, angle, w: w * SCALE, h: h * SCALE };
}

/**
 * A 32-tooth dental chart (FDI numbering) drawn as SVG. Without `onSelect` it is a static picture, so it can be used in server
 * components; with `onSelect` every tooth becomes a keyboard-accessible button.
 */
export function ToothChart({ teeth, selected, onSelect, showNumbers = false }: { teeth: Record<number, ToothState>; selected?: number | null; onSelect?: (tooth: number) => void; showNumbers?: boolean }) {
  const interactive = Boolean(onSelect);
  const label = (tooth: number) => TOOTH_STATES.find((s) => s.id === (teeth[tooth] ?? 'healthy'))?.label ?? 'Healthy';

  const render = (list: number[], upper: boolean) =>
    list.map((tooth, index) => {
      const state = teeth[tooth] ?? 'healthy';
      const { x, y, angle, w, h } = position(tooth, index, upper);
      const colors = FILL[state];
      const chosen = selected === tooth;
      const shape = (
        <>
          {chosen && <rect x={-w / 2 - 3} y={-h / 2 - 3} width={w + 6} height={h + 6} rx={w * 0.45} fill="none" stroke="#0f4c81" strokeWidth="2" />}
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.38} fill={colors.fill} stroke={colors.stroke} strokeWidth="1.4" strokeDasharray={state === 'missing' ? '3 2' : undefined} />
          {showNumbers && (
            <text transform={`rotate(${-angle})`} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="600" fill={colors.text}>
              {tooth}
            </text>
          )}
        </>
      );
      const transform = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`;
      return interactive ? (
        <g
          key={tooth}
          transform={transform}
          role="button"
          tabIndex={0}
          aria-label={`Tooth ${tooth}: ${label(tooth)}`}
          aria-pressed={chosen}
          className="cursor-pointer outline-none transition-opacity hover:opacity-80 focus-visible:opacity-80"
          onClick={() => onSelect?.(tooth)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelect?.(tooth);
            }
          }}
        >
          {shape}
        </g>
      ) : (
        <g key={tooth} transform={transform}>
          {shape}
        </g>
      );
    });

  return (
    <svg viewBox="0 0 400 280" role={interactive ? 'group' : 'img'} aria-label="Dental chart: upper and lower arch" className="h-auto w-full">
      <text x="200" y="140" textAnchor="middle" fontSize="9" fill="#94a3b8" letterSpacing="1.5">
        UPPER
      </text>
      <text x="200" y="164" textAnchor="middle" fontSize="9" fill="#94a3b8" letterSpacing="1.5">
        LOWER
      </text>
      {render(UPPER, true)}
      {render(LOWER, false)}
    </svg>
  );
}

/** Colour key for the chart. */
export function ToothLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600" aria-label="Chart key">
      {TOOTH_STATES.map((state) => (
        <li key={state.id} className="flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-[4px] border" style={{ background: FILL[state.id].fill, borderColor: FILL[state.id].stroke, borderStyle: state.id === 'missing' ? 'dashed' : 'solid' }} />
          {state.label}
        </li>
      ))}
    </ul>
  );
}
