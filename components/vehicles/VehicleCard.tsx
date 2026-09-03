import React from 'react';
import Link from 'next/link';
import VehicleFallbackImage from './VehicleFallbackImage';
import { getVerificationBadgeConfig } from '@/lib/data/verification';
import { calculateVehicleScore } from '@/lib/calculations/scoring';
import { formatPkr } from '@/lib/utils/format';
import { Zap, ShieldCheck, Battery, Gauge, ArrowRight, Award } from 'lucide-react';

interface VehicleCardProps {
  vehicle: any;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const defaultVariant = vehicle.variants ? vehicle.variants[0] : null;
  const verificationConfig = getVerificationBadgeConfig(vehicle.status || 'verified');

  const scores = calculateVehicleScore({
    startingPricePkr: vehicle.startingPricePkr,
    maxRangeKm: vehicle.maxRangeKm,
    batteryCapacityKwh: defaultVariant ? defaultVariant.batteryCapacityKwh : 60,
    fastChargeKw: defaultVariant ? defaultVariant.fastChargeKw : 100,
    motorPowerHp: defaultVariant ? defaultVariant.motorPowerHp : 200,
    motorTorqueNm: defaultVariant ? defaultVariant.motorTorqueNm : 300,
    accelerationSec: vehicle.accelerationSec || 6.0,
    warrantyYears: defaultVariant ? defaultVariant.warrantyYears : 5,
    batteryWarrantyYears: defaultVariant ? defaultVariant.batteryWarrantyYears : 8,
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 group">
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex justify-between items-center text-xs">
          <span className="bg-slate-950 border border-slate-800 text-slate-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
            {vehicle.bodyType} • {vehicle.powertrain || 'EV'}
          </span>
          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 ${verificationConfig.badgeClass}`}>
            <ShieldCheck className="w-3 h-3" />
            {verificationConfig.label}
          </span>
        </div>

        {/* Image Preview Container */}
        <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors">
          <VehicleFallbackImage
            src={vehicle.imageUrl}
            alt={vehicle.name}
            brandName={vehicle.brandName}
            modelName={vehicle.name}
            bodyType={vehicle.bodyType}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Value Score Pill */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-blue-400 flex items-center gap-1 shadow-md">
            <Award className="w-3 h-3 text-emerald-400" />
            Score {scores.overallScore}/10
          </div>
        </div>

        {/* Vehicle Header Info */}
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{vehicle.brandName}</span>
          <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
            {vehicle.name}
          </h3>
        </div>

        {/* Specs Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Battery className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">WLTP Range</span>
              <span className="font-extrabold text-white">{vehicle.maxRangeKm} km</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Battery Pack</span>
              <span className="font-extrabold text-white">{defaultVariant ? defaultVariant.batteryCapacityKwh : 60} kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Ex-Factory Starting</span>
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            {vehicle.startingPricePkr > 0 ? formatPkr(vehicle.startingPricePkr) : 'Upcoming'}
          </span>
        </div>

        <Link
          href={`/vehicles/${vehicle.slug}`}
          className="bg-blue-600/20 group-hover:bg-blue-600 text-blue-400 group-hover:text-white border border-blue-500/30 px-3.5 py-2 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <span>View Specs</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
