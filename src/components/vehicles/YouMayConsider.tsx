import React from 'react';
import Link from 'next/link';
import { VehicleWithSpecs } from '@/lib/types';
import { formatPKR } from '@/lib/verification';
import { VehicleSmartImage } from './VehicleSmartImage';
import { GitCompare, ArrowRight, Gauge, BatteryCharging, Sparkles } from 'lucide-react';

interface YouMayConsiderProps {
  currentVehicle: VehicleWithSpecs;
  allVehicles: VehicleWithSpecs[];
}

export function YouMayConsider({ currentVehicle, allVehicles }: YouMayConsiderProps) {
  const currentPrice = currentVehicle.latest_ex_factory_price?.amount_pkr || 0;
  const currentBody = currentVehicle.body_type;

  // Filter out current vehicle
  const candidates = allVehicles.filter((v) => v.slug !== currentVehicle.slug);

  // Score candidates based on similarity:
  // 1. Same body type (+100)
  // 2. Same powertrain (+50)
  // 3. Price proximity score
  const scored = candidates.map((v) => {
    let score = 0;
    if (v.body_type === currentBody) score += 100;
    if (v.powertrain === currentVehicle.powertrain) score += 50;

    const vPrice = v.latest_ex_factory_price?.amount_pkr || 0;
    if (currentPrice > 0 && vPrice > 0) {
      const priceDiffPct = Math.abs(vPrice - currentPrice) / currentPrice;
      if (priceDiffPct < 0.2) score += 80;
      else if (priceDiffPct < 0.4) score += 50;
      else if (priceDiffPct < 0.6) score += 20;
    }

    return { vehicle: v, score };
  });

  // Sort by score descending and take top 3
  scored.sort((a, b) => b.score - a.score);
  const recommendations = scored.slice(0, 3).map((s) => s.vehicle);

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-blue-700 mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Market Alternatives
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            You May Also Consider
          </h3>
        </div>
        <Link
          href="/vehicles"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
        >
          <span>View all models</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const recPrice = rec.latest_ex_factory_price?.amount_pkr;
          const recRange = rec.specs.wltp_range_km?.value;
          const recBattery = rec.specs.battery_kwh?.value;

          return (
            <div
              key={rec.slug}
              className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <VehicleSmartImage
                    slug={rec.slug}
                    name={rec.name}
                    brandName={rec.brand.name}
                    imageUrl={rec.hero_image_url}
                    bodyType={rec.body_type}
                    powertrain={rec.powertrain}
                    batteryKwh={recBattery}
                    chargingPort={rec.specs.charging_port_standard?.value}
                  />

                  <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-blue-700 border border-blue-200 uppercase tracking-wider shadow-2xs">
                      {rec.powertrain}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/95 text-slate-700 border border-slate-200 capitalize shadow-2xs">
                      {rec.body_type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {rec.brand.name}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {rec.name}
                    </h4>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">
                      Ex-Factory Price
                    </span>
                    <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                      {recPrice ? formatPKR(recPrice, true) : 'Pricing Pending'}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Gauge className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{recRange ? `${recRange} km` : '—'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <BatteryCharging className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{recBattery ? `${recBattery} kWh` : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/vehicles/${rec.slug}`}
                  className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  href={`/compare?v1=${currentVehicle.slug}&v2=${rec.slug}`}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-blue-700 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                >
                  <GitCompare className="w-3 h-3" />
                  <span>Compare</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
