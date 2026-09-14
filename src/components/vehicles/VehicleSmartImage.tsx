'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Battery, Zap, Timer, PlugZap } from 'lucide-react';

interface VehicleSmartImageProps {
  slug: string;
  name: string;
  brandName: string;
  imageUrl?: string | null;
  bodyType?: string;
  powertrain?: string;
  batteryKwh?: string | null;
  zeroToHundred?: string | null;
  chargingPort?: string | null;
  country?: string | null;
  className?: string;
  priority?: boolean;
}

// Brand color palette & origin flags
const BRAND_METADATA: Record<string, { bg: string; text: string; border: string; accent: string; flag: string }> = {
  byd: { bg: 'bg-cyan-950/80', text: 'text-cyan-300', border: 'border-cyan-500/40', accent: '#06B6D4', flag: '🇨🇳' },
  deepal: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-500/40', accent: '#3B82F6', flag: '🇨🇳' },
  mg: { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-500/40', accent: '#F43F5E', flag: '🇨🇳' },
  honri: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-500/40', accent: '#10B981', flag: '🇨🇳' },
  gugo: { bg: 'bg-teal-950/80', text: 'text-teal-300', border: 'border-teal-500/40', accent: '#14B8A6', flag: '🇨🇳' },
  gwm: { bg: 'bg-sky-950/80', text: 'text-sky-300', border: 'border-sky-500/40', accent: '#0284C7', flag: '🇨🇳' },
  omoda: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-500/40', accent: '#A855F7', flag: '🇨🇳' },
  dongfeng: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-500/40', accent: '#F59E0B', flag: '🇨🇳' },
  gac: { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-500/40', accent: '#6366F1', flag: '🇨🇳' },
  kia: { bg: 'bg-zinc-900/80', text: 'text-zinc-200', border: 'border-zinc-500/40', accent: '#E4E4E7', flag: '🇰🇷' },
  audi: { bg: 'bg-slate-900/90', text: 'text-slate-200', border: 'border-slate-500/40', accent: '#94A3B8', flag: '🇩🇪' },
  bmw: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-500/40', accent: '#2563EB', flag: '🇩🇪' },
  tesla: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-500/40', accent: '#EF4444', flag: '🇺🇸' },
  chery: { bg: 'bg-orange-950/80', text: 'text-orange-300', border: 'border-orange-500/40', accent: '#F97316', flag: '🇨🇳' },
  seres: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-500/40', accent: '#10B981', flag: '🇨🇳' },
  riddara: { bg: 'bg-lime-950/80', text: 'text-lime-300', border: 'border-lime-500/40', accent: '#84CC16', flag: '🇨🇳' },
  zeekr: { bg: 'bg-amber-950/80', text: 'text-amber-200', border: 'border-amber-500/40', accent: '#FBBF24', flag: '🇨🇳' },
};

export function VehicleSmartImage({
  slug,
  name,
  brandName,
  imageUrl,
  bodyType = 'suv',
  powertrain = 'bev',
  batteryKwh,
  zeroToHundred,
  chargingPort,
  country,
  className = '',
  priority = false,
}: VehicleSmartImageProps) {
  const [imgError, setImgError] = useState(false);

  // Normalize brand key
  const brandKey = brandName.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '');
  const brandTheme = BRAND_METADATA[brandKey] || {
    bg: 'bg-slate-900/80',
    text: 'text-slate-200',
    border: 'border-slate-700',
    accent: '#06B6D4',
    flag: country === 'Germany' ? '🇩🇪' : country === 'South Korea' ? '🇰🇷' : country === 'USA' ? '🇺🇸' : '🇨🇳',
  };

  const isSedan = bodyType.toLowerCase().includes('sedan') || bodyType.toLowerCase().includes('fastback');
  const isMicro = bodyType.toLowerCase().includes('micro') || bodyType.toLowerCase().includes('city');

  // If a valid image URL exists and hasn't errored out, render Next.js Image
  if (imageUrl && !imgError) {
    return (
      <div 
        className={`relative aspect-video w-full overflow-hidden bg-slate-900 ${className}`}
        style={{ aspectRatio: '16 / 9' }}
      >
        <Image
          src={imageUrl}
          alt={`${brandName} ${name}`}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
        {/* Floating Quick-Spec Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-white">
            {batteryKwh && (
              <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 backdrop-blur-md font-mono font-bold">
                ⚡ {batteryKwh} kWh
              </span>
            )}
            {zeroToHundred && (
              <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 backdrop-blur-md font-mono font-bold">
                ⏱ {zeroToHundred}s 0-100
              </span>
            )}
            {chargingPort && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 backdrop-blur-md font-bold">
                🔌 {chargingPort}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Resilient High-End Dark Obsidian/Carbon SVG Automotive Fallback Canvas
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-gradient-to-br from-[#090D1A] via-[#0E1626] to-[#0A101D] border-b border-slate-800/80 flex flex-col justify-between p-3.5 select-none ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* Background radial glow & technical grid */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: brandTheme.accent }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#38BDF8 1px, transparent 1px), radial-gradient(#38BDF8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Top Meta Badges: Brand + Country + Powertrain */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase border shadow-2xs backdrop-blur-md flex items-center gap-1 ${brandTheme.bg} ${brandTheme.text} ${brandTheme.border}`}
          >
            <span>{brandTheme.flag}</span>
            <span>{brandName}</span>
          </span>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800/90 text-slate-300 border border-slate-700 uppercase tracking-wider">
            {powertrain}
          </span>
        </div>

        {/* Quick floating spec badges */}
        <div className="flex items-center gap-1 text-[10px] font-bold tabular-nums">
          {batteryKwh && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 text-cyan-300 border border-slate-700/80 shadow-2xs">
              <Battery className="w-3 h-3 text-cyan-400" />
              <span>{batteryKwh} kWh</span>
            </span>
          )}
          {chargingPort && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 text-emerald-300 border border-slate-700/80 shadow-2xs">
              <PlugZap className="w-3 h-3 text-emerald-400" />
              <span>{chargingPort}</span>
            </span>
          )}
        </div>
      </div>

      {/* Center Automotive Silhouette Vector Graphic */}
      <div className="relative z-0 my-auto flex items-center justify-center w-full px-4 py-1">
        <svg
          viewBox="0 0 400 140"
          className="w-full max-w-[290px] h-auto drop-shadow-[0_8px_20px_rgba(6,182,212,0.15)] transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground reflection shadow */}
          <ellipse cx="200" cy="128" rx="160" ry="7" fill="#000000" fillOpacity="0.4" />

          {isMicro ? (
            /* City Microcar Silhouette (Honri VE, Gugo GiGi) */
            <g>
              <path
                d="M60 115 L70 75 Q85 40 140 38 L250 42 Q290 45 320 85 L335 115 Z"
                fill="#0F172A"
                stroke={brandTheme.accent}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Microcar Window cabin */}
              <path
                d="M130 46 L240 48 Q265 52 278 78 L110 78 Q118 55 130 46 Z"
                fill={brandTheme.accent}
                fillOpacity="0.25"
                stroke={brandTheme.accent}
                strokeWidth="1.5"
              />
              {/* Wheels */}
              <circle cx="110" cy="115" r="22" fill="#020617" stroke="#334155" strokeWidth="2" />
              <circle cx="110" cy="115" r="13" fill="#0F172A" stroke={brandTheme.accent} strokeWidth="2" />
              <circle cx="280" cy="115" r="22" fill="#020617" stroke="#334155" strokeWidth="2" />
              <circle cx="280" cy="115" r="13" fill="#0F172A" stroke={brandTheme.accent} strokeWidth="2" />
              {/* Headlight & Taillight accents */}
              <path d="M320 88 L330 92" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
              <path d="M68 84 L64 92" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : isSedan ? (
            /* Streamlined Fastback / Sports Sedan (BYD Seal, Deepal L07, Model 3) */
            <g>
              {/* Low-slung aerodynamic chassis */}
              <path
                d="M40 112 L70 85 Q115 50 180 40 L260 42 Q320 52 355 86 L375 112 Z"
                fill="#0F172A"
                stroke={brandTheme.accent}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Fastback Glasshouse */}
              <path
                d="M135 50 L245 48 Q285 52 315 80 L105 80 Q120 56 135 50 Z"
                fill={brandTheme.accent}
                fillOpacity="0.25"
                stroke={brandTheme.accent}
                strokeWidth="1.5"
              />
              {/* Aero Beltline crease */}
              <path d="M72 84 L350 84" stroke={brandTheme.accent} strokeWidth="1" strokeOpacity="0.6" />
              {/* Sport Wheels & Low Profile Tires */}
              <circle cx="100" cy="112" r="24" fill="#020617" stroke="#334155" strokeWidth="2" />
              <circle cx="100" cy="112" r="15" fill="#0F172A" stroke={brandTheme.accent} strokeWidth="2.5" />
              <circle cx="100" cy="112" r="5" fill="#06B6D4" />
              <circle cx="310" cy="112" r="24" fill="#020617" stroke="#334155" strokeWidth="2" />
              <circle cx="310" cy="112" r="15" fill="#0F172A" stroke={brandTheme.accent} strokeWidth="2.5" />
              <circle cx="310" cy="112" r="5" fill="#06B6D4" />
              {/* Futuristic LED Matrix Headlight */}
              <path d="M358 88 L370 93" stroke="#06B6D4" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M42 85 L40 92" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            /* Modern Electric SUV / Crossover (Atto 3, Deepal S07, MG4, EV5, Omoda E5) */
            <g>
              {/* High-clearance SUV body */}
              <path
                d="M45 112 L65 72 Q95 42 165 38 L255 40 Q305 45 345 74 L370 112 Z"
                fill="#0F172A"
                stroke={brandTheme.accent}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Elevated SUV Cabin */}
              <path
                d="M125 44 L245 44 Q278 48 305 72 L95 72 Q110 50 125 44 Z"
                fill={brandTheme.accent}
                fillOpacity="0.25"
                stroke={brandTheme.accent}
                strokeWidth="1.5"
              />
              {/* Protective Cladding Baseline */}
              <path d="M50 108 L365 108" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              {/* Large Alloy Wheels */}
              <circle cx="105" cy="112" r="25" fill="#020617" stroke="#334155" strokeWidth="2" />
              <circle cx="105" cy="112" r="15" fill="#0F172A" stroke={brandTheme.accent} strokeWidth="2.5" />
              <circle cx="105" cy="112" r="5" fill="#06B6D4" />
              <circle cx="305" cy="112" r="25" fill="#020617" stroke="#334155" strokeWidth="2" />
              <circle cx="305" cy="112" r="15" fill="#0F172A" stroke={brandTheme.accent} strokeWidth="2.5" />
              <circle cx="305" cy="112" r="5" fill="#06B6D4" />
              {/* Horizon LED lightbar */}
              <path d="M350 78 L366 84" stroke="#06B6D4" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M48 76 L44 84" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Model Card Label & Quick Spec */}
      <div className="relative z-10 flex items-center justify-between pt-1 border-t border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-200 tracking-tight truncate max-w-[70%]">
          {name}
        </span>
        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-cyan-400" />
          <span>{bodyType}</span>
        </span>
      </div>
    </div>
  );
}
