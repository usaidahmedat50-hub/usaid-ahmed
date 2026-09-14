'use client';

import React, { useState } from 'react';
import { Calculator, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatPKR } from '@/lib/verification';

interface OnRoadPriceEstimatorProps {
  exFactoryPricePkr: number;
  vehicleName: string;
}

type Province = 'punjab' | 'sindh' | 'ict' | 'kpk' | 'balochistan';

interface ProvinceConfig {
  name: string;
  regRate: number;
  tokenTax: number;
  smartCardAndPlates: number;
  profTax: number;
  deliveryFee: number;
  notes: string;
}

const PROVINCE_CONFIGS: Record<Province, ProvinceConfig> = {
  punjab: {
    name: 'Punjab',
    regRate: 0.015, // 1.5% subsidized EV registration
    tokenTax: 2500, // Annual subsidized EV token tax
    smartCardAndPlates: 3500, // Computerized smart card + computerized plates
    profTax: 2000,
    deliveryFee: 25000,
    notes: 'Subsidized 1.5% motor vehicle registration under Punjab Green NEVP.',
  },
  sindh: {
    name: 'Sindh',
    regRate: 0.02, // 2.0%
    tokenTax: 3000,
    smartCardAndPlates: 4000,
    profTax: 2000,
    deliveryFee: 25000,
    notes: 'Sindh Excise registration rate with EV token tax relief.',
  },
  ict: {
    name: 'Islamabad (ICT)',
    regRate: 0.01, // 1.0%
    tokenTax: 2000,
    smartCardAndPlates: 3000,
    profTax: 1000,
    deliveryFee: 25000,
    notes: 'ICT special 1.0% federal capital green transit incentive.',
  },
  kpk: {
    name: 'Khyber Pakhtunkhwa',
    regRate: 0.012, // 1.2%
    tokenTax: 2000,
    smartCardAndPlates: 3500,
    profTax: 1500,
    deliveryFee: 30000,
    notes: 'KPK Excise schedule with reduced EV environmental levy.',
  },
  balochistan: {
    name: 'Balochistan',
    regRate: 0.01, // 1.0%
    tokenTax: 2000,
    smartCardAndPlates: 3000,
    profTax: 1000,
    deliveryFee: 35000,
    notes: 'Balochistan flat 1.0% registration with remote transit delivery charge.',
  },
};

export function OnRoadPriceEstimator({
  exFactoryPricePkr,
  vehicleName,
}: OnRoadPriceEstimatorProps) {
  const [province, setProvince] = useState<Province>('punjab');
  const [isFiler, setIsFiler] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);

  const cfg = PROVINCE_CONFIGS[province];

  // 1. Motor vehicle registration fee
  const regFee = Math.round(exFactoryPricePkr * cfg.regRate);

  // 2. Advance Withholding Tax (FBR Section 231B for EVs)
  // Active Filer: 1% | Non-Filer: 3%
  const whtRate = isFiler ? 0.01 : 0.03;
  const advanceTax = Math.round(exFactoryPricePkr * whtRate);

  // 3. Smart card, plates, token tax, professional tax, delivery
  const tokenTax = cfg.tokenTax;
  const smartCardAndPlates = cfg.smartCardAndPlates;
  const profTax = cfg.profTax;
  const deliveryFreight = cfg.deliveryFee;

  // 4. Insurance & Tracker (avg 2.3% comprehensive)
  const insuranceFee = includeInsurance ? Math.round(exFactoryPricePkr * 0.023) : 0;

  // Total
  const totalOnRoad =
    exFactoryPricePkr +
    regFee +
    advanceTax +
    tokenTax +
    smartCardAndPlates +
    profTax +
    deliveryFreight +
    insuranceFee;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      {/* Header Strip */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              On-Road Price Breakdown & Tax Estimator
            </h3>
            <p className="text-[11px] text-slate-500">
              Itemized calculation including provincial registration, FBR WHT, and mandatory charges.
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
          Updated FBR / Excise Rates 2026
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Input Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Province */}
          <div>
            <label className="block text-slate-700 text-[11px] uppercase font-bold tracking-wider mb-1.5">
              Registration Province
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value as Province)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="punjab">Punjab (~1.5% fee)</option>
              <option value="sindh">Sindh (~2.0% fee)</option>
              <option value="ict">Islamabad ICT (~1.0% fee)</option>
              <option value="kpk">Khyber Pakhtunkhwa (~1.2% fee)</option>
              <option value="balochistan">Balochistan (~1.0% fee)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">{cfg.notes}</p>
          </div>

          {/* Filer Status */}
          <div>
            <label className="block text-slate-700 text-[11px] uppercase font-bold tracking-wider mb-1.5">
              FBR Taxpayer Status
            </label>
            <select
              value={isFiler ? 'filer' : 'non-filer'}
              onChange={(e) => setIsFiler(e.target.value === 'filer')}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="filer">Active Tax Filer (1% WHT)</option>
              <option value="non-filer">Non-Filer (3% WHT Penalty)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              {isFiler ? 'FBR 231B active taxpayer subsidized rate' : 'FBR 231B non-filer surcharge (+2%)'}
            </p>
          </div>

          {/* Insurance Toggle */}
          <div>
            <label className="block text-slate-700 text-[11px] uppercase font-bold tracking-wider mb-1.5">
              1st Year Comprehensive Insurance
            </label>
            <button
              type="button"
              onClick={() => setIncludeInsurance(!includeInsurance)}
              className={`w-full text-xs rounded-xl p-2.5 border transition-all flex items-center justify-between cursor-pointer ${
                includeInsurance
                  ? 'bg-blue-50/80 text-blue-800 border-blue-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100 font-medium'
              }`}
            >
              <span>{includeInsurance ? 'Included (~2.3% rate)' : 'Excluded (Self-Arranged)'}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                includeInsurance ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {includeInsurance ? 'ACTIVE' : 'OFF'}
              </span>
            </button>
            <p className="text-[10px] text-slate-400 mt-1">Includes 24/7 telematics GPS tracker</p>
          </div>
        </div>

        {/* Itemized Calculation Sheet */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 sm:p-5 space-y-2.5 text-xs">
          {/* Base */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
            <span className="text-slate-700 font-medium">Ex-Factory Base Retail Invoice</span>
            <span className="font-bold text-slate-900 tabular-nums">
              {formatPKR(exFactoryPricePkr, true)}
            </span>
          </div>

          {/* Registration */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
            <div>
              <span className="text-slate-700 font-medium">Motor Vehicle Registration Fee</span>
              <span className="text-[11px] text-slate-400 ml-1.5 font-normal">
                ({(cfg.regRate * 100).toFixed(1)}% {cfg.name} Excise)
              </span>
            </div>
            <span className="font-semibold text-slate-800 tabular-nums">
              +{formatPKR(regFee)}
            </span>
          </div>

          {/* Advance WHT */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
            <div>
              <span className="text-slate-700 font-medium">Advance Income Tax (Section 231B)</span>
              <span className={`text-[11px] ml-1.5 font-semibold ${isFiler ? 'text-emerald-700' : 'text-rose-600'}`}>
                ({isFiler ? '1% Active Filer' : '3% Non-Filer'})
              </span>
            </div>
            <span className="font-semibold text-slate-800 tabular-nums">
              +{formatPKR(advanceTax)}
            </span>
          </div>

          {/* Token Tax */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
            <span className="text-slate-700 font-medium">Annual Token Tax (Subsidized EV Rate)</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              +{formatPKR(tokenTax)}
            </span>
          </div>

          {/* Smart Card & Number Plates */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
            <span className="text-slate-700 font-medium">Excise Smart Card & Embossed Plates</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              +{formatPKR(smartCardAndPlates)}
            </span>
          </div>

          {/* Professional Tax */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
            <span className="text-slate-700 font-medium">Provincial Professional Tax</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              +{formatPKR(profTax)}
            </span>
          </div>

          {/* Delivery & Documentation */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
            <span className="text-slate-700 font-medium">Transit Delivery & Dealership Documentation</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              +{formatPKR(deliveryFreight)}
            </span>
          </div>

          {/* Optional Insurance */}
          {includeInsurance && (
            <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
              <div>
                <span className="text-slate-700 font-medium">Comprehensive EV Insurance & Tracker</span>
                <span className="text-[11px] text-slate-400 ml-1.5 font-normal">(1st Year @ 2.3%)</span>
              </div>
              <span className="font-semibold text-blue-700 tabular-nums">
                +{formatPKR(insuranceFee)}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center pt-3 text-sm">
            <div>
              <span className="text-slate-900 font-extrabold block">
                Estimated On-Road Total ({cfg.name})
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                Includes all taxes, fees, and initial on-road handover costs.
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-blue-700 tabular-nums">
              {formatPKR(totalOnRoad, true)}
            </span>
          </div>
        </div>

        {/* Sourcing & Policy Disclaimer */}
        <div className="flex items-start gap-2.5 text-[11px] text-slate-500 pt-1">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
          <p>
            Tax rates reflect the National Electric Vehicle Policy (NEVP) concessions and latest provincial finance acts for {cfg.name}. Dealers may charge nominal logistical handling charges depending on final destination showroom.
          </p>
        </div>
      </div>
    </div>
  );
}

