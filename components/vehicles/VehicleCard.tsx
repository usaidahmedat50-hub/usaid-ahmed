import React from 'react';
import Link from 'next/link';
import { Vehicle } from '@/lib/data/mock-db';
import { formatPkr } from '@/lib/utils/format';
import { Zap, Gauge, Battery, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import VehicleFallbackImage from '@/components/vehicles/VehicleFallbackImage';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md">
      {/* 16:9 Aspect Video Container with Fallback Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <VehicleFallbackImage
          src={vehicle.imageUrl}
          alt={`${vehicle.brandName} ${vehicle.name} - Electric Car Pakistan`}
          brandName={vehicle.brandName}
          modelName={vehicle.name}
          bodyType={vehicle.bodyType}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
            {vehicle.bodyType}
          </span>
          <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Verified {vehicle.verifiedDate || 'Feb 2026'}
          </span>
        </div>

        {vehicle.isFeatured && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
            Featured
          </div>
        )}
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="font-bold text-slate-700">{vehicle.brandName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {vehicle.distributorName}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
            {vehicle.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1 mb-3">
            {vehicle.tagline}
          </p>

          {/* PKR Price Display */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 flex items-baseline justify-between">
            <span className="text-slate-500 text-xs font-semibold">Ex-Factory Starting:</span>
            <span className="text-xl font-extrabold text-blue-700">
              {formatPkr(vehicle.startingPricePkr)}
            </span>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-2 px-1 bg-slate-50 rounded-xl text-center border border-slate-100">
            <div className="flex flex-col items-center">
              <Battery className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-xs font-bold text-slate-800">
                {vehicle.maxRangeKm} km
              </span>
              <span className="text-[10px] text-slate-500">Max Range</span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-200">
              <Zap className="w-4 h-4 text-amber-500 mb-1" />
              <span className="text-xs font-bold text-slate-800">
                {vehicle.accelerationSec}s
              </span>
              <span className="text-[10px] text-slate-500">0-100 km/h</span>
            </div>
            <div className="flex flex-col items-center">
              <Gauge className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-xs font-bold text-slate-800">
                {vehicle.topSpeedKmh} km/h
              </span>
              <span className="text-[10px] text-slate-500">Top Speed</span>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2 pt-2">
          <Link
            href={`/electric-cars/${vehicle.brandSlug}/${vehicle.slug}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>View Full Specs & Price</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/compare?v1=${vehicle.slug}`}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors border border-slate-200"
            title="Compare with other EVs"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}
