// All avatar SVG assets as React components.
// Bodies + Outfits + Faces use viewBox="0 0 100 160" (unified coordinate space)
//   Head circle: cx=50, cy=26, r=22  (y: 4–48)
//   Neck:        x=44-56, y=44-60
//   Torso:       ~x=27-73, y=58-110
//   Legs:        two columns, y=108-156
// Pets use viewBox="0 0 40 40"

// ─── Bodies ─────────────────────────────────────────────────────────────────
// Bodies draw: neck, torso, legs (NO head circle — face SVG provides it)

export function Body1({ skinColor = '#f1c27d' }: { skinColor?: string }) {
  // Slim body
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Arms */}
      <rect x="19" y="60" width="14" height="44" rx="7" fill={skinColor} />
      <rect x="67" y="60" width="14" height="44" rx="7" fill={skinColor} />
      {/* Neck */}
      <rect x="44" y="44" width="12" height="16" rx="3" fill={skinColor} />
      {/* Torso */}
      <rect x="32" y="58" width="36" height="50" rx="6" fill={skinColor} />
      {/* Legs */}
      <rect x="32" y="106" width="15" height="50" rx="4" fill={skinColor} />
      <rect x="53" y="106" width="15" height="50" rx="4" fill={skinColor} />
    </svg>
  );
}

export function Body2({ skinColor = '#f1c27d' }: { skinColor?: string }) {
  // Medium body
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Arms */}
      <rect x="15" y="60" width="16" height="44" rx="7" fill={skinColor} />
      <rect x="69" y="60" width="16" height="44" rx="7" fill={skinColor} />
      {/* Neck */}
      <rect x="43" y="44" width="14" height="16" rx="3" fill={skinColor} />
      {/* Torso */}
      <rect x="28" y="58" width="44" height="52" rx="7" fill={skinColor} />
      {/* Legs */}
      <rect x="28" y="108" width="18" height="48" rx="4" fill={skinColor} />
      <rect x="54" y="108" width="18" height="48" rx="4" fill={skinColor} />
    </svg>
  );
}

export function Body3({ skinColor = '#f1c27d' }: { skinColor?: string }) {
  // Broad body
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Arms */}
      <rect x="8" y="60" width="18" height="46" rx="8" fill={skinColor} />
      <rect x="74" y="60" width="18" height="46" rx="8" fill={skinColor} />
      {/* Neck */}
      <rect x="42" y="44" width="16" height="16" rx="3" fill={skinColor} />
      {/* Torso */}
      <rect x="22" y="58" width="56" height="54" rx="9" fill={skinColor} />
      {/* Legs */}
      <rect x="22" y="110" width="22" height="46" rx="4" fill={skinColor} />
      <rect x="56" y="110" width="22" height="46" rx="4" fill={skinColor} />
    </svg>
  );
}

// ─── Hair ────────────────────────────────────────────────────────────────────
// Hair layers sit on top of FaceComp. All use viewBox="0 0 100 160".
// Head circle: cx=50, cy=26, r=22. Hair covers top of head (y~4–26) without
// obscuring the eye/mouth zone (y~20–35).
//
// "Back" variants (HairLongBack, HairBobBack) are rendered BEHIND the face
// to simulate hair flowing behind the head. They use the same viewBox.

export function HairShort({ headOnly = false, color = '#4a2e0a' }: { headOnly?: boolean; color?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Cap arc: from (29,19) over the head top to (71,19) — slightly outside head circle
          so it meets the back panel seamlessly; closes with straight line above eyes */}
      <path d="M 29 19 A 22 22 0 0 1 71 19 Z" fill={color} />
    </svg>
  );
}

// Back panel for long hair — rendered behind the face layer
export function HairLongBack({ headOnly = false, color = '#7b3f00' }: { headOnly?: boolean; color?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Wide back panel: arc from top of head, flows down to mid-torso */}
      <path d="M 29 19 A 22 22 0 0 1 71 19 L 74 72 Q 72 80 61 78 Q 50 81 39 78 Q 28 80 26 72 Z" fill={color} />
    </svg>
  );
}

// Front wisps for long hair — rendered in front of the face layer
export function HairLong({ headOnly = false, color = '#7b3f00' }: { headOnly?: boolean; color?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Cap — connects to back panel at same start point (29,19) */}
      <path d="M 29 19 A 22 22 0 0 1 71 19 Z" fill={color} />
      {/* Left wisp — continues from cap edge (29,19), flows down beside face */}
      <path d="M 29 19 C 25 24 23 42 24 58 Q 25 62 29 60 C 27 46 27 28 32 19 Z" fill={color} />
      {/* Right wisp */}
      <path d="M 71 19 C 75 24 77 42 76 58 Q 75 62 71 60 C 73 46 73 28 68 19 Z" fill={color} />
    </svg>
  );
}

// Back panel for bob hair — rendered behind the face layer
export function HairBobBack({ headOnly = false, color = '#7b3f00' }: { headOnly?: boolean; color?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Jaw-length back panel — ends just below chin (y=46) */}
      <path d="M 29 19 A 22 22 0 0 1 71 19 L 72 46 Q 70 50 61 48 Q 50 51 39 48 Q 30 50 28 46 Z" fill={color} />
    </svg>
  );
}

// Front pieces for bob hair — straight-cut sides to chin level
export function HairBob({ headOnly = false, color = '#7b3f00' }: { headOnly?: boolean; color?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Cap — same start point as back panel */}
      <path d="M 29 19 A 22 22 0 0 1 71 19 Z" fill={color} />
      {/* Left curtain — ends at jaw level (y=46) */}
      <path d="M 29 19 L 26 46 L 32 46 L 32 19 Z" fill={color} />
      {/* Right curtain */}
      <path d="M 71 19 L 74 46 L 68 46 L 68 19 Z" fill={color} />
    </svg>
  );
}

export function HairCurly({ headOnly = false, color = '#1a1a1a' }: { headOnly?: boolean; color?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Cap arc */}
      <path d="M 29 19 A 22 22 0 0 1 71 19 Z" fill={color} />
      {/* Poof circles — all bottom edges at or above y=18 so eyes stay visible */}
      <circle cx="50" cy="8"  r="9"  fill={color} />
      <circle cx="38" cy="8"  r="8"  fill={color} />
      <circle cx="62" cy="8"  r="8"  fill={color} />
      <circle cx="32" cy="14" r="7"  fill={color} />
      <circle cx="68" cy="14" r="7"  fill={color} />
      <circle cx="44" cy="5"  r="7"  fill={color} />
      <circle cx="56" cy="5"  r="7"  fill={color} />
    </svg>
  );
}

export function HairSpiky({ headOnly = false, color = '#2c1810' }: { headOnly?: boolean; color?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Cap arc */}
      <path d="M 29 19 A 22 22 0 0 1 71 19 Z" fill={color} />
      {/* 5 spikes — bases at cap level (y≈17–19), tips at y=5–8 */}
      <path d="M 33 19 Q 31 8 37 7 Q 43 8 40 18 Z" fill={color} />
      <path d="M 41 18 Q 39 7 45 6 Q 51 7 48 17 Z" fill={color} />
      <path d="M 49 17 Q 48 5 50 5 Q 52 5 51 17 Z" fill={color} />
      <path d="M 52 17 Q 49 7 55 6 Q 61 7 59 18 Z" fill={color} />
      <path d="M 60 18 Q 57 8 63 7 Q 69 8 67 19 Z" fill={color} />
    </svg>
  );
}

// ─── Faces ──────────────────────────────────────────────────────────────────
// Faces draw: head circle (skin tone) + facial features at (cx=50, cy=26, r=22)
// When headOnly=true, viewBox is cropped to show just the head circle (for faceOnly mode)

export function Face1({ headOnly = false, skinColor = '#f1c27d' }: { headOnly?: boolean; skinColor?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="26" r="22" fill={skinColor} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse cx="42" cy="22" rx="3" ry="3.5" fill="#3d2b1f" />
      <ellipse cx="58" cy="22" rx="3" ry="3.5" fill="#3d2b1f" />
      <circle cx="43.2" cy="20.5" r="1.2" fill="white" />
      <circle cx="59.2" cy="20.5" r="1.2" fill="white" />
      {/* Smile */}
      <path d="M40 31 Q50 38 60 31" stroke="#c47a4a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="36" cy="29" r="4" fill="#ffb0b0" opacity="0.4" />
      <circle cx="64" cy="29" r="4" fill="#ffb0b0" opacity="0.4" />
    </svg>
  );
}

export function Face2({ headOnly = false, skinColor = '#f1c27d' }: { headOnly?: boolean; skinColor?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="26" r="22" fill={skinColor} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      {/* Eyes — cool, half-closed */}
      <rect x="40" y="20" width="8" height="5" rx="2.5" fill="#1a1a2e" />
      <rect x="52" y="20" width="8" height="5" rx="2.5" fill="#1a1a2e" />
      <circle cx="42" cy="22" r="1.2" fill="white" />
      <circle cx="54" cy="22" r="1.2" fill="white" />
      {/* Smirk */}
      <path d="M42 32 Q52 37 60 31" stroke="#a0522d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Face3({ headOnly = false, skinColor = '#f1c27d' }: { headOnly?: boolean; skinColor?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="26" r="22" fill={skinColor} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      {/* Round eyes */}
      <circle cx="42" cy="22" r="4" fill="#fff" />
      <circle cx="58" cy="22" r="4" fill="#fff" />
      <circle cx="42.8" cy="22.8" r="2.5" fill="#2c1810" />
      <circle cx="58.8" cy="22.8" r="2.5" fill="#2c1810" />
      <circle cx="43.4" cy="21.6" r="0.8" fill="white" />
      <circle cx="59.4" cy="21.6" r="0.8" fill="white" />
      {/* Big smile */}
      <path d="M40 31 Q50 40 60 31" stroke="#5c2e00" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Face4({ headOnly = false, skinColor = '#f1c27d' }: { headOnly?: boolean; skinColor?: string }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="26" r="22" fill={skinColor} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      {/* Star eyes */}
      <text x="42" y="27" fontSize="9" textAnchor="middle" fill="#ff6b6b">★</text>
      <text x="58" y="27" fontSize="9" textAnchor="middle" fill="#ff6b6b">★</text>
      {/* Excited mouth */}
      <ellipse cx="50" cy="34" rx="6" ry="4" fill="#c0392b" />
      <path d="M44 34 Q50 40 56 34" fill="#922b21" />
      {/* Freckles */}
      <circle cx="39" cy="30" r="1.2" fill="#e07b39" opacity="0.6" />
      <circle cx="42" cy="32" r="1.2" fill="#e07b39" opacity="0.6" />
      <circle cx="58" cy="30" r="1.2" fill="#e07b39" opacity="0.6" />
      <circle cx="61" cy="32" r="1.2" fill="#e07b39" opacity="0.6" />
    </svg>
  );
}

// ─── Outfits ─────────────────────────────────────────────────────────────────
// Outfits draw clothes scaled to match each body type.
// All share viewBox="0 0 100 160". Each accepts bodyTypeId to pick the right fit.

interface Fit {
  slvLx: number; slvRx: number; slvW: number;
  torX: number;  torW: number;  torY: number; torH: number;
  legLx: number; legRx: number; legW: number; legY: number; legH: number;
}

// Derived from body part positions + 2px outward coverage on each exposed edge
const BODY_FIT: Record<string, Fit> = {
  // Body1: arms x=19-33/67-81, torso x=32-68, legs x=32-47/53-68
  body_1: { slvLx:17, slvRx:67, slvW:16, torX:30, torW:40, torY:57, torH:52, legLx:30, legRx:53, legW:17, legY:106, legH:50 },
  // Body2: arms x=15-31/69-85, torso x=28-72, legs x=28-46/54-72
  body_2: { slvLx:13, slvRx:69, slvW:18, torX:26, torW:48, torY:57, torH:54, legLx:26, legRx:54, legW:20, legY:108, legH:48 },
  // Body3: arms x=8-26/74-92,  torso x=22-78, legs x=22-44/56-78
  body_3: { slvLx: 6, slvRx:72, slvW:22, torX:20, torW:60, torY:57, torH:56, legLx:20, legRx:54, legW:26, legY:110, legH:46 },
};
const DEFAULT_FIT = BODY_FIT['body_2'];

export function OutfitCasual({ bodyTypeId }: { bodyTypeId?: string }) {
  const f = BODY_FIT[bodyTypeId ?? ''] ?? DEFAULT_FIT;
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x={f.slvLx} y="57" width={f.slvW} height="30" rx="8" fill="#6ab4f0" />
      <rect x={f.slvRx} y="57" width={f.slvW} height="30" rx="8" fill="#6ab4f0" />
      <rect x={f.torX} y={f.torY} width={f.torW} height={f.torH} rx="7" fill="#6ab4f0" />
      <path d="M43 58 Q50 65 57 58" stroke="#4a9ad4" strokeWidth="1.5" fill="none" />
      <rect x={f.legLx} y={f.legY} width={f.legW} height={f.legH} rx="4" fill="#4a4a6a" />
      <rect x={f.legRx} y={f.legY} width={f.legW} height={f.legH} rx="4" fill="#4a4a6a" />
    </svg>
  );
}

export function OutfitHoodie({ bodyTypeId }: { bodyTypeId?: string }) {
  const f = BODY_FIT[bodyTypeId ?? ''] ?? DEFAULT_FIT;
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x={f.slvLx} y="55" width={f.slvW} height="32" rx="9" fill="#7c6fa0" />
      <rect x={f.slvRx} y="55" width={f.slvW} height="32" rx="9" fill="#7c6fa0" />
      <rect x={f.torX} y={f.torY-1} width={f.torW} height={f.torH+1} rx="8" fill="#7c6fa0" />
      <path d={`M${f.torX+9} ${f.torY-1} Q50 ${f.torY-9} ${f.torX+f.torW-9} ${f.torY-1}`} fill="#6a5e8a" />
      <rect x="38" y="76" width="24" height="13" rx="5" fill="#6a5e8a" />
      <rect x={f.legLx} y={f.legY} width={f.legW} height={f.legH} rx="4" fill="#2d2d4e" />
      <rect x={f.legRx} y={f.legY} width={f.legW} height={f.legH} rx="4" fill="#2d2d4e" />
    </svg>
  );
}

export function OutfitTrack({ bodyTypeId }: { bodyTypeId?: string }) {
  const f = BODY_FIT[bodyTypeId ?? ''] ?? DEFAULT_FIT;
  const legLcx = f.legLx + Math.round(f.legW / 2);
  const legRcx = f.legRx + Math.round(f.legW / 2);
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x={f.slvLx} y="55" width={f.slvW} height="28" rx="7" fill="#e05050" />
      <rect x={f.slvRx} y="55" width={f.slvW} height="28" rx="7" fill="#e05050" />
      <rect x={f.slvLx} y="62" width={f.slvW} height="3" fill="#c03030" opacity="0.5" />
      <rect x={f.slvRx} y="62" width={f.slvW} height="3" fill="#c03030" opacity="0.5" />
      <rect x={f.torX} y={f.torY-1} width={f.torW} height={f.torH+1} rx="6" fill="#e05050" />
      <rect x={f.torX} y="63" width={f.torW} height="4" fill="#c03030" opacity="0.5" />
      <line x1="50" y1={f.torY-1} x2="50" y2={f.legY+2} stroke="#c03030" strokeWidth="2" />
      <rect x={f.legLx} y={f.legY} width={f.legW} height={f.legH} rx="4" fill="#e05050" />
      <rect x={f.legRx} y={f.legY} width={f.legW} height={f.legH} rx="4" fill="#e05050" />
      <line x1={legLcx} y1={f.legY} x2={legLcx} y2="156" stroke="#c03030" strokeWidth="1.5" />
      <line x1={legRcx} y1={f.legY} x2={legRcx} y2="156" stroke="#c03030" strokeWidth="1.5" />
    </svg>
  );
}

export function OutfitSuit({ bodyTypeId }: { bodyTypeId?: string }) {
  const f = BODY_FIT[bodyTypeId ?? ''] ?? DEFAULT_FIT;
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x={f.slvLx} y="54" width={f.slvW} height="30" rx="7" fill="#1a2e4a" />
      <rect x={f.slvRx} y="54" width={f.slvW} height="30" rx="7" fill="#1a2e4a" />
      <rect x={f.torX} y={f.torY-2} width={f.torW} height={f.torH+2} rx="6" fill="#1a2e4a" />
      <polygon points="50,55 39,68 50,74" fill="#243d5c" />
      <polygon points="50,55 61,68 50,74" fill="#243d5c" />
      <rect x="46" y="55" width="8" height="16" fill="white" />
      <polygon points="48,58 52,58 53,78 50,82 47,78" fill="#c0392b" />
      <rect x={f.legLx} y={f.legY} width={f.legW} height={f.legH} rx="3" fill="#111e30" />
      <rect x={f.legRx} y={f.legY} width={f.legW} height={f.legH} rx="3" fill="#111e30" />
    </svg>
  );
}

export function OutfitSchool({ bodyTypeId }: { bodyTypeId?: string }) {
  const f = BODY_FIT[bodyTypeId ?? ''] ?? DEFAULT_FIT;
  const rEdge = f.torX + f.torW;
  const skirtW = f.legRx + f.legW - f.legLx;
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x={f.slvLx} y="54" width={f.slvW} height="30" rx="7" fill="#f5f5f5" />
      <rect x={f.slvRx} y="54" width={f.slvW} height="30" rx="7" fill="#f5f5f5" />
      <rect x={f.torX} y={f.torY-2} width={f.torW} height={f.torH+2} rx="6" fill="#f5f5f5" />
      <polygon points="48,55 52,55 53,76 50,80 47,76" fill="#c0392b" />
      <line x1="49" y1="60" x2="51" y2="60" stroke="#922b21" strokeWidth="1" />
      <line x1="49" y1="65" x2="51" y2="65" stroke="#922b21" strokeWidth="1" />
      <polygon points={`${f.torX},55 ${f.torX},110 ${f.torX+13},110 ${f.torX+13},68`} fill="#1a3a5c" opacity="0.85" />
      <polygon points={`${rEdge},55 ${rEdge},110 ${rEdge-13},110 ${rEdge-13},68`} fill="#1a3a5c" opacity="0.85" />
      <rect x={f.legLx} y={f.legY} width={skirtW} height={f.legH} rx="4" fill="#3a5a8c" />
    </svg>
  );
}

export function OutfitWinter({ bodyTypeId }: { bodyTypeId?: string }) {
  const f = BODY_FIT[bodyTypeId ?? ''] ?? DEFAULT_FIT;
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x={f.slvLx} y="52" width={f.slvW} height="32" rx="9" fill="#4a90c4" />
      <rect x={f.slvRx} y="52" width={f.slvW} height="32" rx="9" fill="#4a90c4" />
      <line x1={f.slvLx} y1="62" x2={f.slvLx+f.slvW} y2="62" stroke="#3a7aaa" strokeWidth="2.5" />
      <line x1={f.slvRx} y1="62" x2={f.slvRx+f.slvW} y2="62" stroke="#3a7aaa" strokeWidth="2.5" />
      <rect x={f.torX} y={f.torY-4} width={f.torW} height={f.torH+4} rx="10" fill="#4a90c4" />
      <line x1={f.torX} y1="63" x2={f.torX+f.torW} y2="63" stroke="#3a7aaa" strokeWidth="3" />
      <line x1={f.torX} y1="73" x2={f.torX+f.torW} y2="73" stroke="#3a7aaa" strokeWidth="3" />
      <line x1={f.torX} y1="83" x2={f.torX+f.torW} y2="83" stroke="#3a7aaa" strokeWidth="3" />
      <path d={`M${f.torX+12} ${f.torY-4} Q50 ${f.torY-12} ${f.torX+f.torW-12} ${f.torY-4}`} fill="#3a7aaa" />
      <line x1="50" y1={f.torY-4} x2="50" y2={f.legY+2} stroke="#2d5f87" strokeWidth="2" />
      <rect x={f.legLx} y={f.legY} width={f.legW} height={f.legH} rx="4" fill="#1a1a2e" />
      <rect x={f.legRx} y={f.legY} width={f.legW} height={f.legH} rx="4" fill="#1a1a2e" />
    </svg>
  );
}

// ─── Pets ────────────────────────────────────────────────────────────────────

export function PetCat() {
  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="28" rx="12" ry="10" fill="#f4a460" />
      {/* Head */}
      <circle cx="20" cy="16" r="11" fill="#f4a460" />
      {/* Ears */}
      <polygon points="10,8 6,1 14,6" fill="#f4a460" />
      <polygon points="30,8 34,1 26,6" fill="#f4a460" />
      <polygon points="10,8 7.5,3 13,6" fill="#ffb6c1" />
      <polygon points="30,8 32.5,3 27,6" fill="#ffb6c1" />
      {/* Eyes */}
      <ellipse cx="15" cy="15" rx="2.5" ry="3" fill="#2d2d2d" />
      <ellipse cx="25" cy="15" rx="2.5" ry="3" fill="#2d2d2d" />
      <circle cx="15.8" cy="14" r="1" fill="white" />
      <circle cx="25.8" cy="14" r="1" fill="white" />
      {/* Nose + mouth */}
      <polygon points="20,19 18.5,21 21.5,21" fill="#ff9999" />
      <path d="M18.5 21 Q20 23 21.5 21" stroke="#e07070" strokeWidth="0.8" fill="none" />
      {/* Whiskers */}
      <line x1="8" y1="19" x2="16" y2="20" stroke="#8b6914" strokeWidth="0.7" />
      <line x1="8" y1="22" x2="16" y2="21.5" stroke="#8b6914" strokeWidth="0.7" />
      <line x1="32" y1="19" x2="24" y2="20" stroke="#8b6914" strokeWidth="0.7" />
      <line x1="32" y1="22" x2="24" y2="21.5" stroke="#8b6914" strokeWidth="0.7" />
      {/* Tail */}
      <path d="M30 32 Q38 28 36 22" stroke="#f4a460" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function PetDog() {
  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="29" rx="13" ry="9" fill="#c49a6c" />
      {/* Head */}
      <circle cx="20" cy="16" r="11" fill="#c49a6c" />
      {/* Floppy ears */}
      <ellipse cx="9" cy="16" rx="5" ry="8" fill="#a0784a" />
      <ellipse cx="31" cy="16" rx="5" ry="8" fill="#a0784a" />
      {/* Eyes */}
      <circle cx="15" cy="14" r="3" fill="#2d2d2d" />
      <circle cx="25" cy="14" r="3" fill="#2d2d2d" />
      <circle cx="16" cy="13" r="1.2" fill="white" />
      <circle cx="26" cy="13" r="1.2" fill="white" />
      {/* Snout */}
      <ellipse cx="20" cy="21" rx="5" ry="3.5" fill="#b0845e" />
      {/* Nose */}
      <ellipse cx="20" cy="19.5" rx="2.5" ry="2" fill="#1a1a1a" />
      {/* Tongue */}
      <ellipse cx="20" cy="24" rx="2.5" ry="2" fill="#ff8080" />
      {/* Tail */}
      <path d="M32 28 Q40 22 37 16" stroke="#c49a6c" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function PetRabbit() {
  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="30" rx="11" ry="9" fill="#f0e8e0" />
      {/* Belly */}
      <ellipse cx="20" cy="31" rx="7" ry="6" fill="#fff5f5" />
      {/* Head */}
      <circle cx="20" cy="17" r="10" fill="#f0e8e0" />
      {/* Long ears */}
      <ellipse cx="13" cy="6" rx="3.5" ry="8" fill="#f0e8e0" />
      <ellipse cx="27" cy="6" rx="3.5" ry="8" fill="#f0e8e0" />
      <ellipse cx="13" cy="6" rx="2" ry="6" fill="#ffb6c1" />
      <ellipse cx="27" cy="6" rx="2" ry="6" fill="#ffb6c1" />
      {/* Eyes */}
      <circle cx="15" cy="16" r="3" fill="#2d2d2d" />
      <circle cx="25" cy="16" r="3" fill="#2d2d2d" />
      <circle cx="16" cy="15" r="1.2" fill="white" />
      <circle cx="26" cy="15" r="1.2" fill="white" />
      {/* Nose */}
      <ellipse cx="20" cy="21" rx="1.5" ry="1.2" fill="#ff8080" />
      {/* Whiskers */}
      <line x1="10" y1="21" x2="18" y2="21.5" stroke="#bbb" strokeWidth="0.7" />
      <line x1="10" y1="23" x2="18" y2="22.5" stroke="#bbb" strokeWidth="0.7" />
      <line x1="30" y1="21" x2="22" y2="21.5" stroke="#bbb" strokeWidth="0.7" />
      <line x1="30" y1="23" x2="22" y2="22.5" stroke="#bbb" strokeWidth="0.7" />
    </svg>
  );
}
