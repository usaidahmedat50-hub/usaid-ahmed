import React from 'react';
import Link from 'next/link';
import { ChargingStation } from '@/lib/types';
import { MapPin, Zap, Navigation, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HomeChargingBannerProps {
  stations: ChargingStation[];
}

export function HomeChargingBanner({ stations }: HomeChargingBannerProps) {
  // Compute real metrics from the actual stations table
  const totalCount = stations.length;
  const uniqueCities = Array.from(new Set(stations.map((s) => s.city))).length;
  const ultraFastCount = stations.filter((s) => s.power_kw >= 100).length;
  const fastDcCount = stations.filter((s) => s.power_kw >= 30 && s.power_kw < 100).length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#090D1A] via-[#0E1626] to-[#0A101D] text-white p-7 sm:p-10 border border-slate-800 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Verified Pakistan Highway & Urban Network</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Pakistan&apos;s Motorway EV Fast Charging Network
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Real GPS-mapped charging locations across major intercity motorways (M-1, M-2, M-3, M-5, M-9) and key metropolitan hubs. Complete with verified operator helplines, port standards, and real tariffs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/charging-stations"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Explore Interactive Charging Map</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/route-planner"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Plan Motorway Route</span>
            </Link>
          </div>
        </div>

        {/* Real-time Computed Metrics Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:w-96 shrink-0">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Catalogued Stations
            </span>
            <div className="text-3xl font-black text-white tabular-nums">{totalCount}</div>
            <span className="text-[11px] text-cyan-400 font-medium block">
              Verified Public Hubs
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Mapped Cities & Corridors
            </span>
            <div className="text-3xl font-black text-white tabular-nums">{uniqueCities}</div>
            <span className="text-[11px] text-slate-300 font-medium block">
              Motorway Rest Plazas
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Ultra-Fast DC (120 kW)
            </span>
            <div className="text-3xl font-black text-emerald-400 tabular-nums">{ultraFastCount}</div>
            <span className="text-[11px] text-slate-300 font-medium block">
              Bhera M-2, Emporium, Centaurus
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Fast DC (30–60 kW)
            </span>
            <div className="text-3xl font-black text-blue-400 tabular-nums">{fastDcCount}</div>
            <span className="text-[11px] text-slate-300 font-medium block">
              Motorway & City Chargers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
