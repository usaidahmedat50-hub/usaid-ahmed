'use client';

import React from 'react';
import { Vehicle } from '@/lib/data/mock-db';
import { formatPkr } from '@/lib/utils/format';
import { Trophy, X, Plus } from 'lucide-react';

import VehicleImage from '@/components/VehicleImage';

interface ComparisonMatrixProps {
  vehicles: Vehicle[];
  allVehicles: Vehicle[];
  onRemoveVehicle: (slug: string) => void;
  onAddVehicle: (slug: string) => void;
}

export default function ComparisonMatrix({
  vehicles,
  allVehicles,
  onRemoveVehicle,
  onAddVehicle,
}: ComparisonMatrixProps) {
  if (vehicles.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center my-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Vehicles Selected for Comparison</h3>
        <p className="text-slate-600 text-sm mb-6 max-w-lg mx-auto">
          Select up to 4 electric vehicles to compare prices, battery capacity, range, and fast-charging speeds side by side.
        </p>
        <div className="max-w-md mx-auto">
          <select
            onChange={(e) => e.target.value && onAddVehicle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
            defaultValue=""
          >
            <option value="" disabled>
              + Select a Vehicle to Compare...
            </option>
            {allVehicles.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.brandName} {v.name} ({formatPkr(v.startingPricePkr)})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // Best metrics across selected
  const lowestPrice = Math.min(...vehicles.map((v) => v.startingPricePkr));
  const maxRange = Math.max(...vehicles.map((v) => v.maxRangeKm));
  const fastestAcceleration = Math.min(...vehicles.map((v) => v.accelerationSec));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm my-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-1/5 text-slate-700 text-xs font-bold uppercase tracking-wider">
                Specification Feature
              </th>
              {vehicles.map((v) => (
                <th key={v.slug} className="p-4 w-1/5 border-l border-slate-200 relative bg-white">
                  <button
                    onClick={() => onRemoveVehicle(v.slug)}
                    className="absolute top-2 right-2 p-1 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
                    title="Remove vehicle"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                    <VehicleImage
                      src={v.imageUrl}
                      alt={v.name}
                      brandName={v.brandName}
                      modelName={v.name}
                      bodyType={v.bodyType}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold block">{v.brandName}</span>
                  <h4 className="text-base font-bold text-slate-900 leading-tight mb-1">{v.name}</h4>
                  <span className="text-sm font-extrabold text-blue-700 block">
                    {formatPkr(v.startingPricePkr)}
                  </span>
                </th>
              ))}
              {vehicles.length < 4 && (
                <th className="p-4 border-l border-slate-200 bg-slate-50 text-center">
                  <div className="h-full flex flex-col items-center justify-center py-6">
                    <Plus className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-xs text-slate-600 block mb-3 font-semibold">Add Model</span>
                    <select
                      onChange={(e) => e.target.value && onAddVehicle(e.target.value)}
                      className="bg-white border border-slate-200 text-xs text-slate-900 rounded-lg px-2.5 py-2 max-w-[150px] focus:outline-none focus:border-blue-600 font-medium"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        + Choose...
                      </option>
                      {allVehicles
                        .filter((av) => !vehicles.some((v) => v.slug === av.slug))
                        .map((av) => (
                          <option key={av.slug} value={av.slug}>
                            {av.brandName} {av.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {/* Body Type */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50">Body Style</td>
              {vehicles.map((v) => (
                <td key={v.slug} className="p-4 border-l border-slate-200 text-slate-800 font-medium">
                  {v.bodyType}
                </td>
              ))}
            </tr>

            {/* Official Distributor */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50">Distributor (Pakistan)</td>
              {vehicles.map((v) => (
                <td key={v.slug} className="p-4 border-l border-slate-200 text-slate-800 font-semibold">
                  {v.distributorName}
                </td>
              ))}
            </tr>

            {/* Ex-Factory Price */}
            <tr className="bg-blue-50/40">
              <td className="p-4 font-bold text-blue-950">Ex-Factory Price</td>
              {vehicles.map((v) => {
                const isBest = v.startingPricePkr === lowestPrice;
                return (
                  <td key={v.slug} className="p-4 border-l border-slate-200 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className={isBest ? 'text-blue-700 font-black text-sm' : 'text-slate-900'}>
                        {formatPkr(v.startingPricePkr)}
                      </span>
                      {isBest && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                          <Trophy className="w-3 h-3 text-emerald-600" /> Lowest
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Max Range */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50">Claimed Driving Range</td>
              {vehicles.map((v) => {
                const isBest = v.maxRangeKm === maxRange;
                return (
                  <td key={v.slug} className="p-4 border-l border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className={isBest ? 'text-blue-700 font-bold' : 'text-slate-800'}>
                        {v.maxRangeKm} km
                      </span>
                      {isBest && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          Best Range
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Battery Capacity */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50">Battery Capacity</td>
              {vehicles.map((v) => (
                <td key={v.slug} className="p-4 border-l border-slate-200 text-slate-800 font-medium">
                  {v.variants[0]?.batteryCapacityKwh || 'N/A'} kWh (Blade / NMC)
                </td>
              ))}
            </tr>

            {/* 0-100 km/h */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50">0-100 km/h Acceleration</td>
              {vehicles.map((v) => {
                const isBest = v.accelerationSec === fastestAcceleration;
                return (
                  <td key={v.slug} className="p-4 border-l border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className={isBest ? 'text-amber-700 font-bold' : 'text-slate-800'}>
                        {v.accelerationSec}s
                      </span>
                      {isBest && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          Fastest
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Fast Charging Time */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50">DC Fast Charge (10-80%)</td>
              {vehicles.map((v) => (
                <td key={v.slug} className="p-4 border-l border-slate-200 text-slate-800 font-medium">
                  {v.variants[0]?.fastChargeTimeMin || 35} mins ({v.variants[0]?.fastChargeKw || 60} kW DC)
                </td>
              ))}
            </tr>

            {/* Battery Warranty */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50">Battery Warranty</td>
              {vehicles.map((v) => (
                <td key={v.slug} className="p-4 border-l border-slate-200 text-emerald-700 font-semibold">
                  {v.variants[0]?.batteryWarrantyYears || 8} Years / 160,000 km
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
