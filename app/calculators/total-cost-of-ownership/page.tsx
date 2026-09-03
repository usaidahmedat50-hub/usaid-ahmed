'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import { calculateTco } from '@/lib/calculations/tco';
import { formatPkr } from '@/lib/utils/format';
import { Calculator, DollarSign, ShieldCheck, Zap, TrendingDown, ArrowRight } from 'lucide-react';

export default function TcoCalculatorPage() {
  const [purchasePricePkr, setPurchasePricePkr] = useState<number>(9500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(18);
  const [loanTermYears, setLoanTermYears] = useState<number>(5);
  const [monthlyKm, setMonthlyKm] = useState<number>(1500);
  const [electricityPricePkrPerKwh, setElectricityPricePkrPerKwh] = useState<number>(50);
  const [ownershipYears, setOwnershipYears] = useState<3 | 5 | 7>(5);
  const [estimatedResalePercent, setEstimatedResalePercent] = useState<number>(55);

  const tcoResult = calculateTco({
    purchasePricePkr,
    downPaymentPercent,
    interestRatePercent,
    loanTermYears,
    monthlyKm,
    evEfficiencyKwhPer100Km: 15,
    electricityPricePkrPerKwh,
    annualMaintenancePkr: 45000,
    annualInsurancePkr: 120000,
    annualTaxPkr: 15000,
    homeWallboxPricePkr: 180000,
    ownershipYears,
    estimatedResalePercent,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Financial Decision Tool</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          3/5/7-Year Total Cost of Ownership (TCO) Calculator
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Calculate true lifetime EV costs in Pakistan including purchase outlay, bank financing interest, electricity tariffs, insurance, maintenance, wallbox installation, and expected resale value.
        </p>
      </div>

      <AnswerFirstSummary
        answer="Total Cost of Ownership (TCO) measures true net financial expenditure over 3, 5, or 7 years. Because electric vehicles eliminate oil changes, spark plugs, and transmission servicing while charging at ~PKR 7.5/km versus ~PKR 23/km for petrol, an EV typically delivers 35% to 48% lower lifetime ownership costs."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Financial Modeling Engine"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
            Ownership Parameters
          </h2>

          <div className="space-y-4 text-xs font-bold">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">EV Vehicle Purchase Price</span>
                <span className="text-blue-400 font-extrabold">{formatPkr(purchasePricePkr)}</span>
              </div>
              <input
                type="range"
                min="4000000"
                max="35000000"
                step="500000"
                value={purchasePricePkr}
                onChange={(e) => setPurchasePricePkr(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Down Payment Percentage</span>
                <span className="text-emerald-400 font-extrabold">{downPaymentPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Auto Finance Interest Rate (KIBOR Spread)</span>
                <span className="text-amber-400 font-extrabold">{interestRatePercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="26"
                step="1"
                value={interestRatePercent}
                onChange={(e) => setInterestRatePercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Monthly Driving Distance</span>
                <span className="text-cyan-400 font-extrabold">{monthlyKm} KM / month</span>
              </div>
              <input
                type="range"
                min="500"
                max="4000"
                step="100"
                value={monthlyKm}
                onChange={(e) => setMonthlyKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Ownership Term</span>
                <div className="flex gap-1">
                  {[3, 5, 7].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setOwnershipYears(yr as any)}
                      className={`flex-1 py-1 rounded-lg text-xs font-extrabold transition-all ${
                        ownershipYears === yr
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Expected Resale</span>
                <select
                  value={estimatedResalePercent}
                  onChange={(e) => setEstimatedResalePercent(Number(e.target.value))}
                  className="w-full bg-slate-900 text-white font-extrabold text-xs rounded-lg p-1 focus:outline-none"
                >
                  <option value={65}>65% (High Demand)</option>
                  <option value={55}>55% (Standard Market)</option>
                  <option value={45}>45% (Conservative)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Net {ownershipYears}-Year TCO</span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400">
                  {formatPkr(tcoResult.netTcoPkr)}
                </span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-400 font-bold text-xs">
                {tcoResult.costPerKmPkr} PKR / KM
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Monthly Equivalent</span>
                <span className="font-extrabold text-white text-base">{formatPkr(tcoResult.monthlyEquivalentPkr)}</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Estimated Resale Recovery</span>
                <span className="font-extrabold text-emerald-400 text-base">{formatPkr(tcoResult.estimatedResaleValuePkr)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-800/80 pt-4">
              <span className="font-bold text-slate-300 block mb-2">Cost Breakdown Overview:</span>
              <div className="flex justify-between py-1 border-b border-slate-800/40 text-slate-300">
                <span>Bank Financing Interest:</span>
                <span className="font-bold text-amber-400">{formatPkr(tcoResult.totalFinancingCostPkr)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40 text-slate-300">
                <span>Electricity & Charging:</span>
                <span className="font-bold text-emerald-400">{formatPkr(tcoResult.totalEnergyCostPkr)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40 text-slate-300">
                <span>Maintenance ({ownershipYears} Yrs):</span>
                <span className="font-bold text-slate-200">{formatPkr(tcoResult.totalMaintenanceCostPkr)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Wallbox Charger & Install:</span>
                <span className="font-bold text-blue-400">{formatPkr(tcoResult.chargingEquipmentCostPkr)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
