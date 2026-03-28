// All avatar SVG assets as React components.
// Bodies + Outfits + Faces use viewBox="0 0 100 160" (unified coordinate space)
//   Head circle: cx=50, cy=26, r=22  (y: 4–48)
//   Neck:        x=44-56, y=44-60
//   Torso:       ~x=27-73, y=58-110
//   Legs:        two columns, y=108-156
// Pets use viewBox="0 0 40 40"

// ─── Bodies ─────────────────────────────────────────────────────────────────
// Bodies draw: neck, torso, legs (NO head circle — face SVG provides it)

export function Body1() {
  // Slim, light skin
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Arms */}
      <rect x="19" y="60" width="14" height="44" rx="7" fill="#e2c9a8" />
      <rect x="67" y="60" width="14" height="44" rx="7" fill="#e2c9a8" />
      {/* Neck */}
      <rect x="44" y="44" width="12" height="16" rx="3" fill="#e2c9a8" />
      {/* Torso */}
      <rect x="32" y="58" width="36" height="50" rx="6" fill="#e2c9a8" />
      {/* Legs */}
      <rect x="32" y="106" width="15" height="50" rx="4" fill="#e2c9a8" />
      <rect x="53" y="106" width="15" height="50" rx="4" fill="#e2c9a8" />
    </svg>
  );
}

export function Body2() {
  // Medium, tan skin
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Arms */}
      <rect x="15" y="60" width="16" height="44" rx="7" fill="#d4a574" />
      <rect x="69" y="60" width="16" height="44" rx="7" fill="#d4a574" />
      {/* Neck */}
      <rect x="43" y="44" width="14" height="16" rx="3" fill="#d4a574" />
      {/* Torso */}
      <rect x="28" y="58" width="44" height="52" rx="7" fill="#d4a574" />
      {/* Legs */}
      <rect x="28" y="108" width="18" height="48" rx="4" fill="#d4a574" />
      <rect x="54" y="108" width="18" height="48" rx="4" fill="#d4a574" />
    </svg>
  );
}

export function Body3() {
  // Broad, dark skin
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Arms */}
      <rect x="8" y="60" width="18" height="46" rx="8" fill="#8d6e4c" />
      <rect x="74" y="60" width="18" height="46" rx="8" fill="#8d6e4c" />
      {/* Neck */}
      <rect x="42" y="44" width="16" height="16" rx="3" fill="#8d6e4c" />
      {/* Torso */}
      <rect x="22" y="58" width="56" height="54" rx="9" fill="#8d6e4c" />
      {/* Legs */}
      <rect x="22" y="110" width="22" height="46" rx="4" fill="#8d6e4c" />
      <rect x="56" y="110" width="22" height="46" rx="4" fill="#8d6e4c" />
    </svg>
  );
}

// ─── Hair ────────────────────────────────────────────────────────────────────
// Hair layers sit on top of FaceComp. All use viewBox="0 0 100 160".
// Head circle: cx=50, cy=26, r=22. Hair covers top of head (y~4–26) without
// obscuring the eye/mouth zone (y~20–35).

export function HairShort({ headOnly = false }: { headOnly?: boolean }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Arc cap: traces head circle from (30,17) up through (50,4) to (70,17) */}
      <path d="M 30 17 A 22 22 0 0 1 70 17 Z" fill="#4a2e0a" />
    </svg>
  );
}

export function HairLong({ headOnly = false }: { headOnly?: boolean }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Side panels outside face circle, extend below shoulder */}
      <rect x="17" y="15" width="15" height="42" rx="7" fill="#7b3f00" />
      <rect x="68" y="15" width="15" height="42" rx="7" fill="#7b3f00" />
      {/* Top cap arc */}
      <path d="M 30 17 A 22 22 0 0 1 70 17 Z" fill="#7b3f00" />
    </svg>
  );
}

export function HairCurly({ headOnly = false }: { headOnly?: boolean }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Poof above and to sides of head */}
      <circle cx="50" cy="3"  r="11" fill="#1a1a1a" />
      <circle cx="34" cy="8"  r="10" fill="#1a1a1a" />
      <circle cx="66" cy="8"  r="10" fill="#1a1a1a" />
      <circle cx="28" cy="19" r="9"  fill="#1a1a1a" />
      <circle cx="72" cy="19" r="9"  fill="#1a1a1a" />
    </svg>
  );
}

export function HairSpiky({ headOnly = false }: { headOnly?: boolean }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Base arc same as HairShort */}
      <path d="M 30 17 A 22 22 0 0 1 70 17 Z" fill="#2c1810" />
      {/* Upward spikes from crown */}
      <polygon points="38,15 34,1  43,14" fill="#2c1810" />
      <polygon points="50,13 48,0  54,13" fill="#2c1810" />
      <polygon points="62,15 66,1  57,14" fill="#2c1810" />
    </svg>
  );
}

// ─── Faces ──────────────────────────────────────────────────────────────────
// Faces draw: head circle (skin tone) + facial features at (cx=50, cy=26, r=22)
// When headOnly=true, viewBox is cropped to show just the head circle (for faceOnly mode)

export function Face1({ headOnly = false }: { headOnly?: boolean }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="26" r="22" fill="#ffe0bd" stroke="#f0c090" strokeWidth="1.5" />
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

export function Face2({ headOnly = false }: { headOnly?: boolean }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="26" r="22" fill="#f1c27d" stroke="#daa052" strokeWidth="1.5" />
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

export function Face3({ headOnly = false }: { headOnly?: boolean }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="26" r="22" fill="#8d5524" stroke="#6b3a1f" strokeWidth="1.5" />
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

export function Face4({ headOnly = false }: { headOnly?: boolean }) {
  const vb = headOnly ? "28 4 44 44" : "0 0 100 160";
  return (
    <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="26" r="22" fill="#ffd5b0" stroke="#e8b080" strokeWidth="1.5" />
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
// Outfits draw clothes at the torso/leg position; transparent in head area (y < 50)

export function OutfitCasual() {
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Sleeves — vertical rounded tubes */}
      <rect x="13" y="57" width="18" height="30" rx="8" fill="#6ab4f0" />
      <rect x="69" y="57" width="18" height="30" rx="8" fill="#6ab4f0" />
      {/* T-shirt body (overlaps inner sleeve edge for seamless join) */}
      <rect x="30" y="58" width="40" height="52" rx="7" fill="#6ab4f0" />
      {/* Collar */}
      <path d="M43 58 Q50 65 57 58" stroke="#4a9ad4" strokeWidth="1.5" fill="none" />
      {/* Pants */}
      <rect x="30" y="108" width="17" height="48" rx="4" fill="#4a4a6a" />
      <rect x="53" y="108" width="17" height="48" rx="4" fill="#4a4a6a" />
    </svg>
  );
}

export function OutfitHoodie() {
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Sleeves — vertical rounded tubes */}
      <rect x="10" y="55" width="18" height="32" rx="9" fill="#7c6fa0" />
      <rect x="72" y="55" width="18" height="32" rx="9" fill="#7c6fa0" />
      {/* Hoodie body (overlaps inner sleeve edge) */}
      <rect x="27" y="56" width="46" height="54" rx="8" fill="#7c6fa0" />
      {/* Hood detail */}
      <path d="M35 56 Q50 48 65 56" fill="#6a5e8a" />
      {/* Pocket */}
      <rect x="38" y="76" width="24" height="13" rx="5" fill="#6a5e8a" />
      {/* Pants */}
      <rect x="27" y="108" width="18" height="48" rx="4" fill="#2d2d4e" />
      <rect x="55" y="108" width="18" height="48" rx="4" fill="#2d2d4e" />
    </svg>
  );
}

export function OutfitTrack() {
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Sleeves — vertical rounded tubes */}
      <rect x="10" y="55" width="18" height="28" rx="7" fill="#e05050" />
      <rect x="72" y="55" width="18" height="28" rx="7" fill="#e05050" />
      {/* Sleeve stripes */}
      <rect x="10" y="62" width="18" height="3" fill="#c03030" opacity="0.5" />
      <rect x="72" y="62" width="18" height="3" fill="#c03030" opacity="0.5" />
      {/* Tracksuit jacket (overlaps inner sleeve edge) */}
      <rect x="27" y="56" width="46" height="52" rx="6" fill="#e05050" />
      {/* Stripe */}
      <rect x="27" y="63" width="46" height="4" fill="#c03030" opacity="0.5" />
      {/* Zip */}
      <line x1="50" y1="56" x2="50" y2="108" stroke="#c03030" strokeWidth="2" />
      {/* Track pants */}
      <rect x="27" y="106" width="18" height="50" rx="4" fill="#e05050" />
      <rect x="55" y="106" width="18" height="50" rx="4" fill="#e05050" />
      <line x1="36" y1="106" x2="36" y2="156" stroke="#c03030" strokeWidth="1.5" />
      <line x1="64" y1="106" x2="64" y2="156" stroke="#c03030" strokeWidth="1.5" />
    </svg>
  );
}

export function OutfitSuit() {
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Sleeves — vertical rounded tubes */}
      <rect x="9" y="54" width="18" height="30" rx="7" fill="#1a2e4a" />
      <rect x="73" y="54" width="18" height="30" rx="7" fill="#1a2e4a" />
      {/* Suit jacket (overlaps inner sleeve edge) */}
      <rect x="26" y="55" width="48" height="55" rx="6" fill="#1a2e4a" />
      {/* Lapels */}
      <polygon points="50,55 39,68 50,74" fill="#243d5c" />
      <polygon points="50,55 61,68 50,74" fill="#243d5c" />
      {/* Shirt & tie */}
      <rect x="46" y="55" width="8" height="16" fill="white" />
      <polygon points="48,58 52,58 53,78 50,82 47,78" fill="#c0392b" />
      {/* Pants */}
      <rect x="28" y="108" width="18" height="48" rx="3" fill="#111e30" />
      <rect x="54" y="108" width="18" height="48" rx="3" fill="#111e30" />
    </svg>
  );
}

export function OutfitSchool() {
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Sleeves — vertical rounded tubes */}
      <rect x="10" y="54" width="18" height="30" rx="7" fill="#f5f5f5" />
      <rect x="72" y="54" width="18" height="30" rx="7" fill="#f5f5f5" />
      {/* White shirt (overlaps inner sleeve edge) */}
      <rect x="27" y="55" width="46" height="55" rx="6" fill="#f5f5f5" />
      {/* Tie */}
      <polygon points="48,55 52,55 53,76 50,80 47,76" fill="#c0392b" />
      <line x1="49" y1="60" x2="51" y2="60" stroke="#922b21" strokeWidth="1" />
      <line x1="49" y1="65" x2="51" y2="65" stroke="#922b21" strokeWidth="1" />
      {/* Blazer panels */}
      <polygon points="27,55 27,110 40,110 40,68" fill="#1a3a5c" opacity="0.85" />
      <polygon points="73,55 73,110 60,110 60,68" fill="#1a3a5c" opacity="0.85" />
      {/* Skirt / Pants */}
      <rect x="27" y="108" width="46" height="48" rx="4" fill="#3a5a8c" />
    </svg>
  );
}

export function OutfitWinter() {
  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Sleeves — vertical rounded tubes */}
      <rect x="7" y="52" width="19" height="32" rx="9" fill="#4a90c4" />
      <rect x="74" y="52" width="19" height="32" rx="9" fill="#4a90c4" />
      {/* Puffer segment lines on sleeves */}
      <line x1="7" y1="62" x2="25" y2="62" stroke="#3a7aaa" strokeWidth="2.5" />
      <line x1="74" y1="62" x2="92" y2="62" stroke="#3a7aaa" strokeWidth="2.5" />
      {/* Puffer jacket (overlaps inner sleeve edge) */}
      <rect x="24" y="53" width="52" height="57" rx="10" fill="#4a90c4" />
      {/* Puffer segments */}
      <line x1="24" y1="63" x2="76" y2="63" stroke="#3a7aaa" strokeWidth="3" />
      <line x1="24" y1="73" x2="76" y2="73" stroke="#3a7aaa" strokeWidth="3" />
      <line x1="24" y1="83" x2="76" y2="83" stroke="#3a7aaa" strokeWidth="3" />
      {/* Collar */}
      <path d="M38 53 Q50 45 62 53" fill="#3a7aaa" />
      {/* Zip */}
      <line x1="50" y1="53" x2="50" y2="110" stroke="#2d5f87" strokeWidth="2" />
      {/* Pants */}
      <rect x="26" y="108" width="18" height="48" rx="4" fill="#1a1a2e" />
      <rect x="56" y="108" width="18" height="48" rx="4" fill="#1a1a2e" />
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
