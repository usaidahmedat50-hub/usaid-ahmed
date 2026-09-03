'use client';

import React, { useState } from 'react';
import { Calculator, Zap, DollarSign, Sparkles } from 'lucide-react';
import { formatPkr } from '@/lib/utils/format';

interface VehicleRunningCostCalculatorProps {
  vehicleName: string;
  batteryCapacityKwh: number;
  maxRangeKm: number;
}

export default function VehicleRunningCostCalculator({
  vehicleName,
  batteryCapacityKwh,
  maxRangeKm,
}: VehicleRunningCostCalculatorProps) {
  const [monthlyKm, setMonthlyKm] = useState<number>(1500);
  const [electricityTariff, setElectricityTariff] = useState<number>(50); // PKR per kWh
  const [petrolPrice, setPetrolPrice] = useState<number>(275); // PKR per liter
  const [petrolAvgKmPerLiter, setPetrolAvgKmPerLiter] = useState<number>(11);

  const evEfficiencyKwhPer100Km = (batteryCapacityKwh / Math.max(100, maxRangeKm)) * 100;
  const monthlyKwhConsumed = (monthlyKm / 100) * evEfficiencyKwhPer100Km;
  const monthlyEvCost = monthlyKwhConsumed * electricityTariff;

  const monthlyPetrolLitersConsumed = monthlyKm / petrolAvgKmPerLiter;
  const monthlyPetrolCost = monthlyPetrolLitersConsumed * petrolPrice;

  const monthlySavings = Math.max(0, monthlyPetrolCost - monthlyEvCost);
  const annualSavings = monthlySavings * 12;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <Calculator className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {vehicleName} Monthly Running Cost Calculator
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Calculate your estimated fuel savings vs petrol cars in Pakistan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Sliders */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Monthly Driving Distance</span>
              <span className="text-blue-700">{monthlyKm.toLocaleString()} km / month</span>
            </div>
            <input
              type="range"
              min="300"
              max="5000"
              step="100"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Electricity Rate (Domestic Peak/Off-peak Tariff)</span>
              <span className="text-blue-700">PKR {electricityTariff} / kWh</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="1"
              value={electricityTariff}
              onChange={(e) => setElectricityTariff(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Current Petrol Price</span>
              <span className="text-blue-700">PKR {petrolPrice} / Liter</span>
            </div>
            <input
              type="range"
              min="200"
              max="400"
              step="5"
              value={petrolPrice}
              onChange={(e) => setPetrolPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Output Cards */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Calculated Financial Impact
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block">{vehicleName} Cost</span>
                <span className="text-lg font-black text-emerald-400">
                  {formatPkr(monthlyEvCost)}
                </span>
                <span className="text-[10px] text-slate-400 block">/ month</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block">Equivalent Petrol Cost</span>
                <span className="text-lg font-black text-rose-400">
                  {formatPkr(monthlyPetrolCost)}
                </span>
                <span className="text-[10px] text-slate-400 block">/ month</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-1">
              <span className="text-xs text-emerald-300 font-bold block">Estimated Annual Savings</span>
              <span className="text-2xl font-black text-emerald-400 block">
                {formatPkr(annualSavings)}
              </span>
              <span className="text-[10px] text-emerald-200 block">
                Saved every year compared to a petrol sedan
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
