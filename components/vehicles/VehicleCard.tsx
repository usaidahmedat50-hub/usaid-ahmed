import React from 'react';
import Link from 'next/link';
import VehicleFallbackImage from './VehicleFallbackImage';
import { getVerificationBadgeConfig } from '@/lib/data/verification';
import { formatPkr } from '@/lib/utils/format';
import { Zap, ShieldCheck, Battery, Gauge, ArrowRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: any;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const defaultVariant = vehicle.variants ? vehicle.variants[0] : null;
  const verificationConfig = getVerificationBadgeConfig(vehicle.status || 'verified');

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex justify-between items-center text-xs">
          <span className="bg-slate-900 text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
            {vehicle.bodyType} • {vehicle.powertrain || 'EV'}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${verificationConfig.badgeClass}`}>
            <ShieldCheck className="w-3 h-3" />
            {verificationConfig.label}
          </span>
        </div>

        {/* Image Preview */}
        <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <VehicleFallbackImage
            src={vehicle.imageUrl}
            alt={vehicle.name}
            brandName={vehicle.brandName}
            modelName={vehicle.name}
            bodyType={vehicle.bodyType}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Vehicle Header Info */}
        <div>
          <span className="text-xs text-slate-500 font-medium block">{vehicle.brandName}</span>
          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
            {vehicle.name}
          </h3>
        </div>

        {/* Core Specs Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
            <Battery className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">WLTP Range</span>
              <span className="font-bold text-slate-900">{vehicle.maxRangeKm} km</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Battery Pack</span>
              <span className="font-bold text-slate-900">{defaultVariant ? defaultVariant.batteryCapacityKwh : 60} kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Ex-Factory Starting</span>
          <span className="text-lg font-black text-blue-700">
            {vehicle.startingPricePkr > 0 ? formatPkr(vehicle.startingPricePkr) : 'Upcoming'}
          </span>
        </div>

        <Link
          href={`/vehicles/${vehicle.slug}`}
          className="bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white p-2.5 rounded-xl transition-all font-bold text-xs flex items-center gap-1"
        >
          <span>Specs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
