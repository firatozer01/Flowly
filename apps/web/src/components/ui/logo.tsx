"use client";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 40, className }: LogoMarkProps) {
  const id = `lg-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Rounded rectangle background */}
      <rect width="48" height="48" rx="14" fill={`url(#${id}-bg)`} />

      {/* Glass shine overlay */}
      <rect width="48" height="24" rx="14" fill={`url(#${id}-shine)`} opacity="0.6" />
      <rect x="0" y="12" width="48" height="12" fill={`url(#${id}-shine)`} opacity="0.2" />

      {/* Flow symbol: 3 S-curves stacked, decreasing opacity */}
      <g filter={`url(#${id}-glow)`}>
        {/* Top arc - brightest */}
        <path
          d="M10 17 C14 11 20 11 24 17 C28 23 34 23 38 17"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Middle arc */}
        <path
          d="M10 24 C14 18 20 18 24 24 C28 30 34 30 38 24"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom arc - subtlest */}
        <path
          d="M10 31 C14 25 20 25 24 31 C28 37 34 37 38 31"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Dot accent at start */}
      <circle cx="10" cy="17" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}

export function LogoFull({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={size} />
      <span
        className="font-bold tracking-tight text-white"
        style={{ fontSize: size * 0.6 }}
      >
        Flowly
      </span>
    </div>
  );
}
