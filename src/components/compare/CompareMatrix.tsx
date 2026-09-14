'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VehicleWithDetails } from '@/lib/types';
import { formatPKR } from '@/lib/verification';
import { Zap } from 'lucide-react';
import { VehicleSmartImage } from '@/components/vehicles/VehicleSmartImage';


interface CompareMatrixProps {
  vehicles: VehicleWithDetails[];
}

export function CompareMatrix({ vehicles }: CompareMatrixProps) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500">
        <p className="text-xs font-medium">Select 2 or 3 vehicles to compare specifications side-by-side.</p>
      </div>
    );
  }

  // Calculate winners for key comparative specs
  const getWinnerVehicleId = (key: string): string | null => {
    if (vehicles.length < 2) return null;

    if (key === 'price') {
      const valid = vehicles
        .map((v) => ({ id: v.id, val: v.latest_ex_factory_price?.amount_pkr }))
        .filter((item): item is { id: string; val: number } => Boolean(item.val && item.val > 0));
      if (valid.length < 2) return null;
      valid.sort((a, b) => a.val - b.val); // Lowest price wins
      return valid[0].id;
    }

    if (key === 'zero_to_hundred_sec') {
      const valid = vehicles
        .map((v) => ({ id: v.id, val: parseFloat(v.specs.zero_to_hundred_sec?.value || '0') }))
        .filter((item) => item.val > 0);
      if (valid.length < 2) return null;
      valid.sort((a, b) => a.val - b.val); // Lowest 0-100s wins
      return valid[0].id;
    }

    if (key === 'battery_kwh' || key === 'wltp_range_km' || key === 'dc_fast_charge_kw') {
      const valid = vehicles
        .map((v) => ({ id: v.id, val: parseFloat(v.specs[key]?.value || '0') }))
        .filter((item) => item.val > 0);
      if (valid.length < 2) return null;
      valid.sort((a, b) => b.val - a.val); // Highest capacity/range/charging kW wins
      return valid[0].id;
    }

    return null;
  };

  const specRows = [
    { label: 'Ex-Factory Price', key: 'price', format: (v: VehicleWithDetails) => formatPKR(v.latest_ex_factory_price?.amount_pkr) },
    { label: 'Official Range (WLTP / CLTC)', key: 'wltp_range_km', unit: 'km' },
    { label: 'Usable Battery Capacity', key: 'battery_kwh', unit: 'kWh' },
    { label: 'Max DC Fast Charging', key: 'dc_fast_charge_kw', unit: 'kW' },
    { label: '0 – 100 km/h Acceleration', key: 'zero_to_hundred_sec', unit: 'sec' },
    { label: 'Motor Power Output', key: 'motor_power_hp' },
    { label: 'Peak Torque', key: 'torque_nm', unit: 'Nm' },
    { label: 'Charging Standard & Plug', key: 'charging_port_standard' },
    { label: 'Battery Chemistry', key: 'battery_chemistry' },
    { label: 'Ground Clearance', key: 'ground_clearance_mm', unit: 'mm' },
    { label: 'Battery Warranty', key: 'battery_warranty_years' },
    { label: 'Official Distributor', key: 'distributor_name' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          {/* Header Row: Vehicle Thumbnails & Names - Sticky Header */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="p-4 w-1/4 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] align-bottom">
                Key Comparison Metrics
              </th>
              {vehicles.map((veh) => (
                <th key={veh.id} className="p-4 w-1/3 align-top border-l border-slate-200/60">
                  <div className="space-y-3">
                    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200">
                      <VehicleSmartImage
                        slug={veh.slug}
                        name={veh.name}
                        brandName={veh.brand.name}
                        imageUrl={veh.hero_image_url}
                        bodyType={veh.body_type}
                        powertrain={veh.powertrain}
                        batteryKwh={veh.specs.battery_kwh?.value}
                        zeroToHundred={veh.specs.zero_to_hundred_sec?.value}
                        chargingPort={veh.specs.charging_port_standard?.value}
                        country={veh.brand.country}
                      />
                      <div className="absolute top-2 left-2 flex gap-1 z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/95 text-blue-700 uppercase tracking-wider shadow-2xs">
                          {veh.powertrain}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
                        {veh.brand.name}
                      </span>
                      <Link
                        href={`/vehicles/${veh.slug}`}
                        className="text-xs sm:text-sm font-black text-slate-900 hover:text-blue-700 line-clamp-1 block transition-colors"
                      >
                        {veh.name}
                      </Link>
                      <div className="text-sm font-extrabold text-slate-900 tabular-nums mt-0.5">
                        {veh.latest_ex_factory_price?.amount_pkr
                          ? formatPKR(veh.latest_ex_factory_price.amount_pkr, true)
                          : 'Price Pending'}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Specs Rows with Winner Highlighting */}
          <tbody className="divide-y divide-slate-100">
            {specRows.map((row) => {
              const winnerId = getWinnerVehicleId(row.key);

              return (
                <tr key={row.label} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                    {row.label}
                  </td>
                  {vehicles.map((veh) => {
                    let displayVal = '—';
                    if (row.key === 'price') {
                      displayVal = row.format ? row.format(veh) : '—';
                    } else {
                      const spec = veh.specs[row.key];
                      if (spec && spec.value) {
                        displayVal = row.unit ? `${spec.value} ${row.unit}` : spec.value;
                      }
                    }

                    const isWinner = winnerId === veh.id && displayVal !== '—';

                    return (
                      <td
                        key={veh.id}
                        className="p-3.5 font-semibold text-slate-900 tabular-nums border-l border-slate-100"
                      >
                        {isWinner ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold inline-flex items-center gap-1 shadow-2xs">
                            <span>{displayVal}</span>
                            <span className="text-[9px] font-black uppercase text-emerald-700 tracking-wider">
                              (BEST)
                            </span>
                          </span>
                        ) : (
                          <span>{displayVal}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
