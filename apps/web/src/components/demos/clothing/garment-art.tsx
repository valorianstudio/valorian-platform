import type { ProductArt } from '@/data/clothing/catalog';

/**
 * A flat, front-facing illustration of a garment, drawn as SVG so the catalogue needs no photography. Colours are passed in so the
 * same shape can show every colourway. Server-safe: a few hundred bytes each, no image requests.
 */
export function GarmentArt({ art, colour = '#e7e2d8', accent = '#111111', label = '', className }: { art: ProductArt; colour?: string; accent?: string; label?: string; className?: string }) {
  const shape = (() => {
    switch (art) {
      case 'shirt':
        return (
          <>
            <path d="M42 30 L60 22 L78 30 L100 42 L92 62 L84 58 L84 102 L36 102 L36 58 L28 62 L20 42 Z" fill={colour} stroke={accent} strokeOpacity="0.12" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M60 22 L52 34 L60 42 L68 34 Z" fill="#fff" stroke={accent} strokeOpacity="0.2" strokeWidth="1" />
            <path d="M60 42 V102" stroke={accent} strokeOpacity="0.18" strokeWidth="1.2" />
            {[54, 66, 78].map((y) => (
              <circle key={y} cx="60" cy={y} r="1.6" fill={accent} opacity="0.35" />
            ))}
          </>
        );
      case 'knit':
        return (
          <>
            <path d="M44 26 Q60 34 76 26 L98 40 L90 64 L82 60 L82 104 L38 104 L38 60 L30 64 L22 40 Z" fill={colour} stroke={accent} strokeOpacity="0.12" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M44 26 Q60 34 76 26" fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="1.5" />
            {[46, 56, 66, 76, 86].map((y) => (
              <path key={y} d={`M40 ${y} Q60 ${y + 4} 80 ${y}`} fill="none" stroke={accent} strokeOpacity="0.1" strokeWidth="1" />
            ))}
          </>
        );
      case 'coat':
        return (
          <>
            <path d="M46 20 L60 28 L74 20 L100 34 L96 106 L80 106 L78 60 L76 106 L44 106 L42 60 L40 106 L24 106 L20 34 Z" fill={colour} stroke={accent} strokeOpacity="0.14" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M60 28 V106" stroke={accent} strokeOpacity="0.22" strokeWidth="1.4" />
            <path d="M46 20 L56 46 L60 40 L64 46 L74 20" fill="none" stroke={accent} strokeOpacity="0.3" strokeWidth="1.2" />
            {[52, 66, 80].map((y) => (
              <circle key={y} cx="54" cy={y} r="1.8" fill={accent} opacity="0.4" />
            ))}
          </>
        );
      case 'dress':
        return (
          <>
            <path d="M50 18 Q60 30 70 18 L72 46 Q86 60 92 106 L28 106 Q34 60 48 46 Z" fill={colour} stroke={accent} strokeOpacity="0.12" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M50 18 L48 46 M70 18 L72 46" fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="1.4" />
            <path d="M34 92 Q60 96 86 92" fill="none" stroke={accent} strokeOpacity="0.12" strokeWidth="1" />
          </>
        );
      case 'trouser':
        return (
          <>
            <path d="M36 22 H84 L90 106 H72 L60 56 L48 106 H30 Z" fill={colour} stroke={accent} strokeOpacity="0.14" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M36 22 H84" stroke={accent} strokeOpacity="0.3" strokeWidth="2" />
            <path d="M60 56 V34" stroke={accent} strokeOpacity="0.18" strokeWidth="1.2" />
            <path d="M52 40 L56 90 M68 40 L64 90" stroke={accent} strokeOpacity="0.1" strokeWidth="1" />
          </>
        );
      case 'bag':
        return (
          <>
            <path d="M40 46 Q40 22 60 22 Q80 22 80 46" fill="none" stroke={accent} strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />
            <rect x="28" y="44" width="64" height="58" rx="10" fill={colour} stroke={accent} strokeOpacity="0.14" strokeWidth="1.5" />
            <path d="M28 60 H92" stroke={accent} strokeOpacity="0.12" strokeWidth="1.2" />
            <rect x="54" y="66" width="12" height="9" rx="2" fill="#D4AF37" />
          </>
        );
    }
  })();

  return (
    <svg viewBox="0 0 120 120" role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} className={className ?? 'size-full'}>
      <ellipse cx="60" cy="110" rx="36" ry="4" fill="#000" opacity="0.07" />
      {shape}
    </svg>
  );
}
