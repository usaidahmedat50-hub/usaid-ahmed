import React from 'react';
import Link from 'next/link';
import { Zap, MapPin, Navigation, ArrowRight, CheckCircle } from 'lucide-react';
import { VERIFIED_PAKISTAN_CHARGING_STATIONS } from '@/lib/data/stations';

interface WhereToChargeBlockProps {
  vehicleName: string;
  vehicleSlug: string;
  chargingPort?: string | null;
  maxDcChargeKw?: string | number | null;
  batteryKwh?: string | number | null;
}

export function WhereToChargeBlock({
  vehicleName,
  vehicleSlug,
  chargingPort = 'CCS2',
  maxDcChargeKw,
  batteryKwh,
}: WhereToChargeBlockProps) {
  const normalizedPort = (chargingPort || 'CCS2').toUpperCase();
  const isGbt = normalizedPort.includes('GB/T') || normalizedPort.includes('GBT');
  const isCcs2 = normalizedPort.includes('CCS2') || normalizedPort.includes('CCS');

  // Compute exact compatibility from our verified stations dataset
  const totalStations = VERIFIED_PAKISTAN_CHARGING_STATIONS.length;
  const compatibleStations = VERIFIED_PAKISTAN_CHARGING_STATIONS.filter((station) => {
    return station.connector_types.some((conn) => {
      const cUpper = conn.toUpperCase();
      if (isGbt && (cUpper.includes('GB/T') || cUpper.includes('GBT'))) return true;
      if (isCcs2 && (cUpper.includes('CCS') || cUpper.includes('TYPE 2') || cUpper.includes('TYPE2'))) return true;
      return false;
    });
  });

  const compatibleCount = compatibleStations.length;
  const compatibilityPct = Math.round((compatibleCount / Math.max(1, totalStations)) * 100);

  // Filter top motorway stations that support this standard
  const motorwayStations = compatibleStations.filter(
    (s) => s.city.includes('Motorway') || s.name.includes('M-2') || s.name.includes('M-5') || s.name.includes('M-9')
  ).slice(0, 4);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Where to Charge & Network Compatibility
            </h3>
            <p className="text-[11px] text-slate-500">
              Charging port standards and verified Pakistan public charging infrastructure match.
            </p>
          </div>
        </div>
        <span className="text-[10px] text-cyan-700 font-bold bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 shrink-0">
          Connector: {chargingPort}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Network Match Stat Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950 text-white rounded-xl p-5 border border-slate-800">
          <div className="md:col-span-8 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                <CheckCircle className="w-3 h-3" />
                Verified Compatibility
              </span>
              <span className="text-xs text-slate-400">
                Standard: <strong className="text-white">{chargingPort}</strong>
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold tracking-tight">
              {compatibleCount} of {totalStations} mapped public stations support the {vehicleName}
            </h4>
            <p className="text-xs text-slate-300">
              {compatibilityPct}% of Pakistan&apos;s verified public fast-charging points feature native {chargingPort} plugs. {isGbt ? 'GB/T to CCS2 adapters can be used at universal CCS2 motorway hubs.' : 'CCS2 is the predominant standard across Motorways M-2, M-3, M-5, and urban centers.'}
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Network Coverage
            </span>
            <div className="text-3xl font-black text-cyan-400 tabular-nums">
              {compatibilityPct}%
            </div>
            <span className="text-[10px] text-slate-400">
              {compatibleCount} Verified Locations
            </span>
          </div>
        </div>

        {/* Technical Port Specs & Estimated DC Charging Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              DC Fast Charge Standard
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {isGbt ? 'GB/T 20234.3 (DC)' : 'CCS Combo 2 (DC)'}
            </div>
            <span className="text-[11px] text-slate-500 block">
              Up to {maxDcChargeKw ? `${maxDcChargeKw} kW` : '100+ kW'} peak intake
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              AC Home / Destination Port
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {isGbt ? 'GB/T AC (7 kW / 11 kW)' : 'Type 2 Mennekes (AC)'}
            </div>
            <span className="text-[11px] text-slate-500 block">
              Compatible with 7 kW home wallboxes
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Est. 20% to 80% DC Time
            </span>
            <div className="text-sm font-extrabold text-blue-700">
              {maxDcChargeKw && Number(maxDcChargeKw) >= 100
                ? '~25–35 Minutes'
                : '~40–55 Minutes'}
            </div>
            <span className="text-[11px] text-slate-500 block">
              At 120 kW M-2 / M-5 motorway fast chargers
            </span>
          </div>
        </div>

        {/* Verified Motorway Corridor Highlights */}
        {motorwayStations.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Compatible Motorway Highway Hubs
              </span>
              <Link
                href="/charging-stations"
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>View all {totalStations} stations</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {motorwayStations.map((station) => (
                <div
                  key={station.id}
                  className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-slate-900 truncate block">
                      {station.name}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {station.address}
                    </span>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {station.power_kw} kW DC
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {station.network_operator}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shrink-0"
                    title="Open in Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/route-planner?vehicle=${vehicleSlug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-sm hover:shadow transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Plan Intercity Route with {vehicleName}</span>
          </Link>

          <Link
            href="/charging-stations"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wide border border-slate-300 transition-all"
          >
            <MapPin className="w-4 h-4 text-slate-600" />
            <span>Browse Full Charging Network Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
