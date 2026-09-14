'use client';

import React from 'react';
import Link from 'next/link';
import { BatteryCharging, Gauge, Zap, GitCompare } from 'lucide-react';
import { VehicleWithDetails } from '@/lib/types';
import { formatPKR } from '@/lib/verification';
import { VehicleSmartImage } from './VehicleSmartImage';

interface VehicleCardProps {
  vehicle: VehicleWithDetails;
  onCompareToggle?: (slug: string) => void;
  isCompared?: boolean;
}

export function VehicleCard({
  vehicle,
  onCompareToggle,
  isCompared = false,
}: VehicleCardProps) {
  const exPrice = vehicle.latest_ex_factory_price?.amount_pkr;
  const batteryKwh = vehicle.specs.battery_kwh?.value;
  const rangeKm = vehicle.specs.wltp_range_km?.value || vehicle.specs.electric_range_km?.value;
  const powerHp = vehicle.specs.motor_power_hp?.value;
  const zeroToHundred = vehicle.specs.zero_to_hundred_sec?.value;
  const chargingPort = vehicle.specs.charging_port_standard?.value;

  const imgUrl = (vehicle as any).imageUrl || vehicle.hero_image_url;

  return (
    <div className="group relative bg-white hover:border-cyan-500/50 border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-xs hover:shadow-xl hover:-translate-y-0.5">
      {/* 16:9 Smart Image Engine with Resilient Vector Fallback */}
      <div className="relative w-full aspect-video overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
        <VehicleSmartImage
          slug={vehicle.slug}
          name={vehicle.name}
          brandName={vehicle.brand.name}
          imageUrl={imgUrl}
          bodyType={vehicle.body_type}
          powertrain={vehicle.powertrain}
          batteryKwh={batteryKwh}
          zeroToHundred={zeroToHundred}
          chargingPort={chargingPort}
          country={vehicle.brand.country}
        />

        {/* Powertrain and Status badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-blue-700 border border-blue-200/80 shadow-2xs uppercase tracking-wider">
            {vehicle.powertrain}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/95 text-slate-700 border border-slate-200/80 shadow-2xs capitalize">
            {vehicle.body_type}
          </span>
          {vehicle.status === 'upcoming' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold text-blue-600 tracking-wider uppercase mb-1">
            {vehicle.brand.name}
          </div>
          <Link href={`/vehicles/${vehicle.slug}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-base font-extrabold text-[#090D16] line-clamp-1 tracking-tight">
              {vehicle.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {vehicle.summary || 'Technical specifications, battery specs, and pricing in Pakistan.'}
          </p>
        </div>

        {/* Quick Spec Matrix - Tabular, dense layout */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center text-xs">
          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-center text-slate-500 mb-0.5 text-[10px]">
              <BatteryCharging className="w-3 h-3 mr-1 text-emerald-600" />
              <span>Battery</span>
            </div>
            <div className="font-bold text-[#090D16] tabular-nums">
              {batteryKwh ? `${batteryKwh} kWh` : '—'}
            </div>
          </div>

          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-center text-slate-500 mb-0.5 text-[10px]">
              <Gauge className="w-3 h-3 mr-1 text-blue-600" />
              <span>Range</span>
            </div>
            <div className="font-bold text-[#090D16] tabular-nums">
              {rangeKm ? `${rangeKm} km` : '—'}
            </div>
          </div>

          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-center text-slate-500 mb-0.5 text-[10px]">
              <Zap className="w-3 h-3 mr-1 text-amber-500" />
              <span>Power</span>
            </div>
            <div className="font-bold text-[#090D16] tabular-nums truncate">
              {powerHp ? `${powerHp}` : '—'}
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
              Ex-Factory Price
            </span>
            <div className="font-extrabold text-sm text-[#090D16] tabular-nums">
              {exPrice ? formatPKR(exPrice) : (
                <span className="text-xs text-slate-400 font-normal">Price Pending</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onCompareToggle && (
              <button
                type="button"
                onClick={() => onCompareToggle(vehicle.slug)}
                title={isCompared ? 'Remove from compare' : 'Add to compare'}
                className={`p-2 rounded-xl border transition-all ${
                  isCompared
                    ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                    : 'bg-white text-slate-500 hover:text-[#090D16] border-slate-200 hover:bg-slate-50'
                }`}
              >
                <GitCompare className="w-4 h-4" />
              </button>
            )}
            <Link
              href={`/vehicles/${vehicle.slug}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-blue-600 text-white transition-colors shadow-2xs"
            >
              Specs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
