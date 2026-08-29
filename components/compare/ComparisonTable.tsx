'use client';

import React from 'react';
import Image from 'next/image';
import { VehicleSpec } from '@/types/vehicle';
import { Plus, X, Check, Zap, Gauge, Battery, ShieldAlert, Award } from 'lucide-react';

interface ComparisonTableProps {
  allVehicles: VehicleSpec[];
  selectedVehicles: VehicleSpec[];
  onSelectVehicle: (index: number, vehicleId: string) => void;
  onRemoveVehicle: (index: number) => void;
  onAddSlot: () => void;
}

export default function ComparisonTable({
  allVehicles,
  selectedVehicles,
  onSelectVehicle,
  onRemoveVehicle,
  onAddSlot,
}: ComparisonTableProps) {
  // Helper to determine best numeric value across selected vehicles
  const isBestValue = (
    key: keyof VehicleSpec,
    currentValue: number | undefined,
    higherIsBetter: boolean
  ) => {
    if (currentValue === undefined || selectedVehicles.length < 2) return false;

    const validValues = selectedVehicles
      .map((v) => v[key] as number | undefined)
      .filter((val): val is number => typeof val === 'number' && !isNaN(val) && val > 0);

    if (validValues.length < 2) return false;

    const bestVal = higherIsBetter ? Math.max(...validValues) : Math.min(...validValues);
    return currentValue === bestVal;
  };

  const getHighlightClass = (isBest: boolean) => {
    return isBest
      ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-500 px-3 py-2.5 rounded-r-lg transition-all shadow-sm'
      : 'text-slate-700 px-3 py-2.5';
  };

  return (
    <div className="w-full space-y-6">
      {/* Mobile Scroll Indicator Banner */}
      <div className="md:hidden flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl">
        <Zap className="w-4 h-4 fill-blue-600 stroke-none" />
        Swipe horizontally to compare specs across vehicles.
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left border-collapse min-w-[700px]">
          {/* Header Row with Car Selector Slots */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-52 min-w-[208px] sticky left-0 z-20 bg-slate-100 border-r border-slate-200 text-xs font-black uppercase tracking-wider text-slate-500">
                Model Selector
              </th>
              {selectedVehicles.map((vehicle, idx) => (
                <th key={idx} className="p-4 w-64 min-w-[256px] border-r border-slate-200 align-top">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Vehicle {idx + 1}
                      </span>
                      {selectedVehicles.length > 2 && (
                        <button
                          onClick={() => onRemoveVehicle(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
                          title="Remove vehicle"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <select
                      value={vehicle.id}
                      onChange={(e) => onSelectVehicle(idx, e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm"
                    >
                      {allVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.brand} {v.model} ({v.variant})
                        </option>
                      ))}
                    </select>

                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-2">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/vehicles/placeholder-ev.svg';
                        }}
                      />
                    </div>

                    <div className="space-y-0.5 text-center">
                      <h3 className="font-black text-sm text-slate-900 leading-tight">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{vehicle.variant}</p>
                    </div>
                  </div>
                </th>
              ))}

              {selectedVehicles.length < 3 && (
                <th className="p-4 w-52 min-w-[208px] text-center align-middle bg-slate-50/50">
                  <button
                    onClick={onAddSlot}
                    className="w-full py-8 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="p-2.5 rounded-full bg-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">Add Car to Compare</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-xs">
            {/* Category 1: Overview */}
            <tr className="bg-slate-100/80">
              <td
                colSpan={selectedVehicles.length + (selectedVehicles.length < 3 ? 2 : 1)}
                className="px-4 py-2.5 font-black uppercase tracking-wider text-slate-700 bg-slate-200/60 sticky left-0 text-xs"
              >
                1. Overview & Pricing
              </td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Starting Price (Ex-Factory)
              </td>
              {selectedVehicles.map((v) => {
                const isBest = isBestValue('priceLakh', v.priceLakh, false);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBest)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">PKR {v.priceLakh} Lakh</span>
                      {isBest && (
                        <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" /> Best Price
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Powertrain Technology
              </td>
              {selectedVehicles.map((v) => (
                <td key={v.id} className="p-4 border-r border-slate-200">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide ${
                    v.powertrain === 'EV' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {v.powertrain}
                  </span>
                </td>
              ))}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Body Type & Drivetrain
              </td>
              {selectedVehicles.map((v) => (
                <td key={v.id} className="p-4 border-r border-slate-200 font-medium">
                  {v.bodyType} ({v.drivetrain})
                </td>
              ))}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            {/* Category 2: Battery & Charging */}
            <tr className="bg-slate-100/80">
              <td
                colSpan={selectedVehicles.length + (selectedVehicles.length < 3 ? 2 : 1)}
                className="px-4 py-2.5 font-black uppercase tracking-wider text-slate-700 bg-slate-200/60 sticky left-0 text-xs"
              >
                2. Battery & Range
              </td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Electric Range
              </td>
              {selectedVehicles.map((v) => {
                const isBest = isBestValue('electricRangeKm', v.electricRangeKm, true);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBest)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm">{v.electricRangeKm} km</span>
                      {isBest && (
                        <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          Top Range
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Battery Capacity (kWh)
              </td>
              {selectedVehicles.map((v) => {
                const isBest = isBestValue('batteryKwh', v.batteryKwh, true);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBest)}`}>
                    {v.batteryKwh} kWh
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Energy Consumption
              </td>
              {selectedVehicles.map((v) => {
                const isBest = isBestValue('consumptionKwh100km', v.consumptionKwh100km, false);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBest)}`}>
                    {v.consumptionKwh100km} kWh / 100km
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Max DC Fast Charging
              </td>
              {selectedVehicles.map((v) => {
                const isBest = isBestValue('maxDcChargeKw', v.maxDcChargeKw, true);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBest)}`}>
                    {v.maxDcChargeKw} kW ({v.dcChargeTimeMin} mins 10-80%)
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            {/* Category 3: Engine & Range Extender (PHEV / REEV) */}
            <tr className="bg-slate-100/80">
              <td
                colSpan={selectedVehicles.length + (selectedVehicles.length < 3 ? 2 : 1)}
                className="px-4 py-2.5 font-black uppercase tracking-wider text-slate-700 bg-slate-200/60 sticky left-0 text-xs"
              >
                3. Engine & Hybrid System (PHEV / REEV)
              </td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Engine / Generator Description
              </td>
              {selectedVehicles.map((v) => (
                <td key={v.id} className="p-4 border-r border-slate-200 text-slate-700 font-medium">
                  {v.engineDesc || 'Pure EV (No ICE Engine)'}
                </td>
              ))}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Total Combined Range
              </td>
              {selectedVehicles.map((v) => {
                const isBest = isBestValue('totalRangeKm', v.totalRangeKm, true);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBest)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm">{v.totalRangeKm} km</span>
                      {isBest && (
                        <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          Max Distance
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            {/* Category 4: Performance */}
            <tr className="bg-slate-100/80">
              <td
                colSpan={selectedVehicles.length + (selectedVehicles.length < 3 ? 2 : 1)}
                className="px-4 py-2.5 font-black uppercase tracking-wider text-slate-700 bg-slate-200/60 sticky left-0 text-xs"
              >
                4. Performance & Speed
              </td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Power & Torque
              </td>
              {selectedVehicles.map((v) => {
                const isBestPower = isBestValue('powerHp', v.powerHp, true);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBestPower)}`}>
                    {v.powerHp} hp | {v.torqueNm} Nm
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                0-100 km/h Acceleration
              </td>
              {selectedVehicles.map((v) => {
                const isBest = isBestValue('zeroToHundredSec', v.zeroToHundredSec, false);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBest)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm">{v.zeroToHundredSec} sec</span>
                      {isBest && (
                        <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          Fastest
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            {/* Category 5: Dimensions & Capacity */}
            <tr className="bg-slate-100/80">
              <td
                colSpan={selectedVehicles.length + (selectedVehicles.length < 3 ? 2 : 1)}
                className="px-4 py-2.5 font-black uppercase tracking-wider text-slate-700 bg-slate-200/60 sticky left-0 text-xs"
              >
                5. Dimensions & Capacity
              </td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Seating & Boot Space
              </td>
              {selectedVehicles.map((v) => {
                const isBestBoot = isBestValue('bootCapacityL', v.bootCapacityL, true);
                return (
                  <td key={v.id} className={`p-4 border-r border-slate-200 ${getHighlightClass(isBestBoot)}`}>
                    {v.seats} Seats | {v.bootCapacityL} Liters Boot
                  </td>
                );
              })}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white border-r border-slate-200">
                Dimensions (L x W x H)
              </td>
              {selectedVehicles.map((v) => (
                <td key={v.id} className="p-4 border-r border-slate-200 font-medium">
                  {v.lengthMm} x {v.widthMm} x {v.heightMm} mm
                </td>
              ))}
              {selectedVehicles.length < 3 && <td className="bg-slate-50/30"></td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
