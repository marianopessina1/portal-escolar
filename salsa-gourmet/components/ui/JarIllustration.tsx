/** Flat 2D jar used on product cards and in the cart (the 3D jar lives in the canvas). */
export default function JarIllustration({ sauce, accent, name, className = "" }: { sauce: string; accent: string; name: string; className?: string }) {
  const id = name.replace(/\W/g, "");
  return (
    <svg viewBox="0 0 200 280" className={className} aria-hidden>
      <defs>
        <linearGradient id={`glass-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="0.92" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`sauce-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={sauce} stopOpacity="0.75" />
          <stop offset="0.45" stopColor={sauce} />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`lid-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#2a2421" />
          <stop offset="0.3" stopColor="#4a423d" />
          <stop offset="0.55" stopColor="#0c0a09" />
          <stop offset="1" stopColor="#1c1816" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="270" rx="70" ry="7" fill="#000" opacity="0.35" />
      <path d="M38 92 Q38 72 62 66 L62 54 L138 54 L138 66 Q162 72 162 92 L162 252 Q162 266 148 266 L52 266 Q38 266 38 252 Z" fill={`url(#sauce-${id})`} />
      <rect x="38" y="140" width="124" height="86" fill="#0d0a08" />
      <rect x="38" y="140" width="124" height="5" fill={accent} />
      <rect x="38" y="221" width="124" height="5" fill={accent} />
      <text x="100" y="178" textAnchor="middle" fontFamily="var(--font-display), Impact" fontSize="22" fill="#f5ebdc">FUEGO NEGRO</text>
      <text x="100" y="202" textAnchor="middle" fontFamily="var(--font-serif), Georgia" fontStyle="italic" fontSize="12" fill={accent}>{name}</text>
      <path d="M38 92 Q38 72 62 66 L62 54 L138 54 L138 66 Q162 72 162 92 L162 252 Q162 266 148 266 L52 266 Q38 266 38 252 Z" fill={`url(#glass-${id})`} stroke="#fff" strokeOpacity="0.25" />
      <rect x="56" y="22" width="88" height="34" rx="4" fill={`url(#lid-${id})`} />
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={58 + i * 4} y="24" width="1.4" height="30" fill="#000" opacity="0.35" />
      ))}
    </svg>
  );
}
