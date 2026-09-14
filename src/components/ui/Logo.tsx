import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark'; // 'dark' = dark text for light canvas; 'light' = white text for dark obsidian hero
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function Logo({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  className = '',
}: LogoProps) {
  const isLightText = variant === 'light';

  // Sizing definitions
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Aerodynamic Bolt + Automotive Wheel Rim SVG Emblem */}
      <div className={`relative shrink-0 ${iconSizes[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* High-voltage performance gradient */}
            <linearGradient id="pakev-grad-primary" x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="55%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            {/* Subtle glow rim */}
            <linearGradient id="pakev-rim-glow" x1="0" y1="22" x2="44" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Outer Alloy Rim Ring with Airflow Openings */}
          <circle cx="22" cy="22" r="20" stroke="url(#pakev-grad-primary)" strokeWidth="2.5" />
          <circle cx="22" cy="22" r="16.5" stroke={isLightText ? '#334155' : '#E2E8F0'} strokeWidth="1" strokeDasharray="3 3" />

          {/* Aerodynamic Spoke Accents */}
          <path d="M22 2L22 6" stroke="url(#pakev-grad-primary)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 22L38 22" stroke="url(#pakev-grad-primary)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 42L22 38" stroke="url(#pakev-grad-primary)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M2 22L6 22" stroke="url(#pakev-grad-primary)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Lightning Bolt morphing across center hub */}
          <path
            d="M24.5 9L14 23.5H22L19.5 35L30 20.5H22L24.5 9Z"
            fill="url(#pakev-grad-primary)"
            stroke={isLightText ? '#0E1626' : '#FFFFFF'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Center Hub Core */}
          <circle cx="22" cy="22" r="3" fill="#06B6D4" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className={`font-black tracking-tight ${textSizes[size]} flex items-center`}>
          <span className={isLightText ? 'text-white' : 'text-slate-900'}>PAK</span>
          <span className="text-cyan-500 font-extrabold mx-0.5">EV</span>
          <span className={`font-semibold tracking-wider ${isLightText ? 'text-slate-300' : 'text-slate-600'}`}>
            FINDER
          </span>
          <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-cyan-500/15 text-cyan-500 border border-cyan-500/30 uppercase tracking-widest hidden sm:inline-block">
            PK
          </span>
        </div>

        {showTagline && (
          <p className={`mt-1 font-medium tracking-wide uppercase ${taglineSizes[size]} ${isLightText ? 'text-slate-400' : 'text-slate-500'}`}>
            Find. Compare. Calculate. Route.
          </p>
        )}
      </div>
    </div>
  );
}
