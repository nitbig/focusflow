import React from 'react';

interface FocusflowLogoProps {
  className?: string;
  size?: number | string;
  animated?: boolean;
}

export const FocusflowLogo: React.FC<FocusflowLogoProps> = ({
  className = 'w-7 h-7',
  size,
  animated = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_2px_12px_rgba(217,243,106,0.35)] ${
          animated ? 'animate-pulse' : ''
        }`}
      >
        <defs>
          <linearGradient id="ff-grad-primary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D9F36A" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="ff-grad-accent" x1="40" y1="10" x2="8" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="60%" stopColor="#D9F36A" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="ff-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer continuous energy stream (interlocking F-loop) */}
        <path
          d="M12 40V14C12 8.47715 16.4772 4 22 4H36C38.2091 4 40 5.79086 40 8C40 10.2091 38.2091 12 36 12H23C20.2386 12 18 14.2386 18 17V22H32C34.2091 22 36 23.7909 36 26C36 28.2091 34.2091 30 32 30H18V40C18 42.2091 16.2091 44 14 44C11.7909 44 10 42.2091 10 40H12Z"
          fill="url(#ff-grad-primary)"
        />

        {/* Dynamic flowing arc that loops across to signify flow & rhythm */}
        <path
          d="M26 12C26 12 38 14 38 24C38 34 26 36 26 36"
          stroke="url(#ff-grad-accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="40"
          strokeDashoffset="0"
          className="opacity-90"
        />

        {/* Luminous Central Focus Singularity */}
        <circle cx="30" cy="24" r="3.5" fill="#D9F36A" filter="url(#ff-glow)" />
        <circle cx="30" cy="24" r="1.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export const FocusflowBrand: React.FC<{
  showTagline?: boolean;
  className?: string;
  logoSize?: string;
  onClick?: () => void;
}> = ({ showTagline = true, className = '', logoSize = 'w-8 h-8', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      <div className="relative">
        <FocusflowLogo className={logoSize} />
        <div className="absolute -inset-1 rounded-full bg-[var(--lime)]/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <div className="text-base font-extrabold tracking-tight text-[var(--ink)] font-['Montserrat',sans-serif] flex items-center gap-1.5 leading-none">
          <span>Focusflow</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] animate-pulse" />
        </div>
        {showTagline && (
          <div className="text-[11px] text-[var(--muted)] font-medium mt-1 tracking-normal">
            Adaptive Day Planner
          </div>
        )}
      </div>
    </div>
  );
};
