'use client';

import React, { useState, useMemo } from 'react';
import { Fuel, Zap, TrendingDown, Leaf, Info, SlidersHorizontal } from 'lucide-react';
import { formatPKR } from '@/lib/verification';

interface RunningCostCalculatorProps {
  batteryKwh: number;
  wltpRangeKm: number;
  vehicleName: string;
}

export function RunningCostCalculator({
  batteryKwh,
  wltpRangeKm,
  vehicleName,
}: RunningCostCalculatorProps) {
  // User adjustable inputs
  const [monthlyKm, setMonthlyKm] = useState<number>(1500); // Default 1,500 km/month
  const [electricityTariffPkr, setElectricityTariffPkr] = useState<number>(50); // Default PKR 50/kWh
  const [petrolPricePkr, setPetrolPricePkr] = useState<number>(342.79); // Default PKR 342.79/L
  const [petrolMileageKmL, setPetrolMileageKmL] = useState<number>(10); // Default 10 km/L for typical petrol car

  // Calculate vehicle Wh/km
  const whPerKm = useMemo(() => {
    return Math.round(((batteryKwh * 1000) / Math.max(150, wltpRangeKm)) * 1.15); // +15% real-world margin
  }, [batteryKwh, wltpRangeKm]);

  // Calculations
  const calculations = useMemo(() => {
    // EV metrics
    const monthlyKwh = (monthlyKm * whPerKm) / 1000;
    const evMonthlyCostPkr = Math.round(monthlyKwh * electricityTariffPkr);
    const evCostPerKm = Number((evMonthlyCostPkr / monthlyKm).toFixed(2));

    // Petrol car benchmark
    const monthlyPetrolLitres = monthlyKm / petrolMileageKmL;
    const petrolMonthlyCostPkr = Math.round(monthlyPetrolLitres * petrolPricePkr);
    const petrolCostPerKm = Number((petrolMonthlyCostPkr / monthlyKm).toFixed(2));

    // Savings
    const monthlySavingsPkr = Math.max(0, petrolMonthlyCostPkr - evMonthlyCostPkr);
    const annualSavingsPkr = monthlySavingsPkr * 12;

    // CO2 reduction (approx 2.31 kg CO2 per litre of petrol burned)
    const annualCo2SavedTonnes = Number(((monthlyPetrolLitres * 2.31 * 12) / 1000).toFixed(2));

    return {
      whPerKm,
      monthlyKwh: Math.round(monthlyKwh),
      evMonthlyCostPkr,
      evCostPerKm,
      petrolMonthlyCostPkr,
      petrolCostPerKm,
      monthlySavingsPkr,
      annualSavingsPkr,
      annualCo2SavedTonnes,
    };
  }, [monthlyKm, whPerKm, electricityTariffPkr, petrolPricePkr, petrolMileageKmL]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      {/* Header Strip */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Cost-to-Run & Savings Calculator
            </h3>
            <p className="text-[11px] text-slate-500">
              Interactive monthly fuel expense comparison vs. a comparable petrol car in Pakistan.
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
          Petrol Rate: PKR {petrolPricePkr}/L (Sept 2026)
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Highlight Result Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Monthly Savings */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Estimated Monthly Savings
            </span>
            <div className="text-2xl font-black text-emerald-700 tabular-nums">
              {formatPKR(calculations.monthlySavingsPkr, true)}
            </div>
            <span className="text-[11px] text-emerald-700/90 font-semibold block">
              Saved every month on fuel
            </span>
          </div>

          {/* Annual Savings */}
          <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">
              Annual Operating Savings
            </span>
            <div className="text-2xl font-black text-blue-700 tabular-nums">
              {formatPKR(calculations.annualSavingsPkr, true)}
            </div>
            <span className="text-[11px] text-blue-700/90 font-semibold block">
              Direct fuel bill reduction / year
            </span>
          </div>

          {/* CO2 Emissions Cut */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tailpipe CO₂ Eliminated</span>
            </span>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {calculations.annualCo2SavedTonnes}{' '}
              <span className="text-sm font-semibold text-slate-500">Tonnes</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold block">
              🌳 ~{Math.round((calculations.annualCo2SavedTonnes * 1000) / 21.77)} trees planted equivalent / yr
            </span>
          </div>
        </div>

        {/* Comparison Rate Bar */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {vehicleName} (EV)
              </span>
              <div className="text-lg font-black text-emerald-700 tabular-nums">
                PKR {calculations.evCostPerKm} <span className="text-xs font-semibold text-slate-500">/ km</span>
              </div>
            </div>
            <span className="text-slate-300 font-bold text-base">vs</span>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Petrol Car Benchmark
              </span>
              <div className="text-lg font-black text-slate-800 tabular-nums">
                PKR {calculations.petrolCostPerKm} <span className="text-xs font-semibold text-slate-500">/ km</span>
              </div>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Cost Reduction
            </span>
            <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
              ~{Math.round((1 - calculations.evCostPerKm / calculations.petrolCostPerKm) * 100)}% Cheaper per KM
            </span>
          </div>
        </div>

        {/* User Input Sliders & Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          {/* 1. Monthly Driving Distance */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Monthly Travel
              </label>
              <span className="text-xs font-extrabold text-blue-700 tabular-nums">
                {monthlyKm.toLocaleString()} km
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="4000"
              step="100"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>500 km</span>
              <span>1,500 km avg</span>
              <span>4,000 km</span>
            </div>
          </div>

          {/* 2. Electricity Tariff */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Power Tariff
              </label>
              <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                PKR {electricityTariffPkr}/kWh
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="75"
              step="5"
              value={electricityTariffPkr}
              onChange={(e) => setElectricityTariffPkr(parseInt(e.target.value, 10))}
              className="w-full accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Rs. 0 (Solar)</span>
              <span>Rs. 55 (Grid)</span>
              <span>Rs. 75</span>
            </div>
          </div>

          {/* 3. Petrol Price */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Petrol Price
              </label>
              <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                PKR {petrolPricePkr}/L
              </span>
            </div>
            <input
              type="range"
              min="240"
              max="320"
              step="5"
              value={petrolPricePkr}
              onChange={(e) => setPetrolPricePkr(parseInt(e.target.value, 10))}
              className="w-full accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Rs. 240/L</span>
              <span>Rs. 265/L</span>
              <span>Rs. 320/L</span>
            </div>
          </div>

          {/* 4. Petrol Car Mileage */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                ICE Benchmark
              </label>
              <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                {petrolMileageKmL} km/L
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="16"
              step="1"
              value={petrolMileageKmL}
              onChange={(e) => setPetrolMileageKmL(parseInt(e.target.value, 10))}
              className="w-full accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>8 km/L (Heavy)</span>
              <span>11 km/L</span>
              <span>16 km/L</span>
            </div>
          </div>
        </div>

        {/* Sourcing & Policy Notice */}
        <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
          <p>
            Fuel calculations are modeled on official Oil & Gas Regulatory Authority (OGRA) retail petrol rates and NEPRA domestic electricity slab tariffs (dated September 2026). EV consumption includes a 15% efficiency margin for HVAC air conditioning and charging conversion loss.
          </p>
        </div>
      </div>
    </div>
  );
}
