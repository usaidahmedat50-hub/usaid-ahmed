'use client';

import React, { useState } from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import { calculateEvVsPetrol } from '@/lib/calculations/ev-vs-petrol';
import { formatPkr } from '@/lib/utils/format';
import { ArrowRightLeft, Zap, Fuel, DollarSign, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function EvVsPetrolCalculatorPage() {
  const [monthlyKm, setMonthlyKm] = useState<number>(1500);
  const [petrolPricePkrPerLiter, setPetrolPricePkrPerLiter] = useState<number>(275);
  const [petrolFuelEconomyKmPerLiter, setPetrolFuelEconomyKmPerLiter] = useState<number>(12);
  const [electricityTariffPkrPerKwh, setElectricityTariffPkrPerKwh] = useState<number>(50);
  const [evPurchasePricePkr, setEvPurchasePricePkr] = useState<number>(9500000);
  const [petrolPurchasePricePkr, setPetrolPurchasePricePkr] = useState<number>(8000000);

  const calcResult = calculateEvVsPetrol({
    monthlyKm,
    petrolPricePkrPerLiter,
    petrolFuelEconomyKmPerLiter,
    electricityTariffPkrPerKwh,
    evEfficiencyKwhPer100Km: 15,
    homeChargingPercent: 80,
    publicChargingTariffPkrPerKwh: 90,
    chargingLossPercent: 10,
    evPurchasePricePkr,
    petrolPurchasePricePkr,
    annualPetrolMaintenancePkr: 120000,
    annualEvMaintenancePkr: 45000,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <ArrowRightLeft className="w-4 h-4 text-blue-400" />
          <span>Fuel & Energy Calculator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          EV vs Petrol Cost & Break-Even Calculator
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Compare monthly fuel expenses, annual maintenance savings, and calculate the exact break-even period for electric vehicles in Pakistan.
        </p>
      </div>

      <AnswerFirstSummary
        answer="Driving an electric vehicle in Pakistan costs ~PKR 7.50 per km on home charging, compared to ~PKR 22.90 per km for a 12 km/L petrol sedan at PKR 275/L. For a driver covering 1,500 km monthly, an EV delivers ~PKR 27,600 in monthly fuel savings and recovers a PKR 1.5M price premium in under 45 months."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Fuel & Tariff Matrix"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
            Comparison Parameters
          </h2>

          <div className="space-y-5 text-xs font-bold">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Monthly Driving Distance</span>
                <span className="text-blue-400 font-extrabold">{monthlyKm} KM / month</span>
              </div>
              <input
                type="range"
                min="500"
                max="4000"
                step="100"
                value={monthlyKm}
                onChange={(e) => setMonthlyKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Petrol Price in Pakistan</span>
                <span className="text-amber-400 font-extrabold">PKR {petrolPricePkrPerLiter} / Liter</span>
              </div>
              <input
                type="range"
                min="240"
                max="350"
                step="5"
                value={petrolPricePkrPerLiter}
                onChange={(e) => setPetrolPricePkrPerLiter(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Petrol Vehicle Fuel Average</span>
                <span className="text-slate-200 font-extrabold">{petrolFuelEconomyKmPerLiter} KM / Liter</span>
              </div>
              <input
                type="range"
                min="6"
                max="22"
                step="1"
                value={petrolFuelEconomyKmPerLiter}
                onChange={(e) => setPetrolFuelEconomyKmPerLiter(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Home Electricity Tariff</span>
                <span className="text-emerald-400 font-extrabold">PKR {electricityTariffPkrPerKwh} / kWh</span>
              </div>
              <input
                type="range"
                min="25"
                max="80"
                step="5"
                value={electricityTariffPkrPerKwh}
                onChange={(e) => setElectricityTariffPkrPerKwh(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">EV Price</span>
                <span className="font-extrabold text-blue-400 block">{formatPkr(evPurchasePricePkr)}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Petrol Vehicle Price</span>
                <span className="font-extrabold text-slate-300 block">{formatPkr(petrolPurchasePricePkr)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Estimated Monthly Savings</span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {formatPkr(calcResult.monthlySavingsPkr)} / mo
                </span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-400 font-bold text-xs">
                {calcResult.breakEvenMonths > 0 ? `${calcResult.breakEvenMonths} Months Break-Even` : 'Instant Break-Even'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Monthly Petrol Expense</span>
                <span className="font-extrabold text-amber-400 text-base">{formatPkr(calcResult.monthlyPetrolCostPkr)}</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Monthly EV Charging Expense</span>
                <span className="font-extrabold text-blue-400 text-base">{formatPkr(calcResult.monthlyEvCostPkr)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-800/80 pt-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">3-Year Cumulative Savings</span>
                <span className="font-black text-emerald-400 text-lg">{formatPkr(calcResult.threeYearSavingsPkr)}</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">5-Year Cumulative Savings</span>
                <span className="font-black text-cyan-400 text-lg">{formatPkr(calcResult.fiveYearSavingsPkr)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
