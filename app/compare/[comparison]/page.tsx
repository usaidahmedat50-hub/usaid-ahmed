import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import VehicleFallbackImage from '@/components/vehicles/VehicleFallbackImage';
import { getVehicleBySlug, getAllVehicles } from '@/lib/data/mock-db';
import { compareVehicleScores } from '@/lib/calculations/scoring';
import { formatPkr } from '@/lib/utils/format';
import { Sparkles, Trophy, ShieldCheck, Zap, Battery, Gauge, Clock, Award } from 'lucide-react';
import Link from 'next/link';

interface ComparisonPageProps {
  params: Promise<{
    comparison: string; // e.g. "byd-seal-vs-tesla-model-3"
  }>;
}

export async function generateStaticParams() {
  const vehicles = getAllVehicles();
  const params: { comparison: string }[] = [];

  for (let i = 0; i < Math.min(6, vehicles.length); i++) {
    for (let j = i + 1; j < Math.min(6, vehicles.length); j++) {
      params.push({
        comparison: `${vehicles[i].slug}-vs-${vehicles[j].slug}`,
      });
    }
  }

  return params;
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const resolvedParams = await params;
  const comparisonSlug = resolvedParams?.comparison || '';
  const parts = comparisonSlug.split('-vs-');

  if (parts.length !== 2) {
    notFound();
  }

  const v1 = getVehicleBySlug(parts[0]);
  const v2 = getVehicleBySlug(parts[1]);

  if (!v1 || !v2) {
    notFound();
  }

  const v1Variant = v1.variants[0];
  const v2Variant = v2.variants[0];

  const scores = compareVehicleScores(
    {
      startingPricePkr: v1.startingPricePkr,
      maxRangeKm: v1.maxRangeKm,
      batteryCapacityKwh: v1Variant.batteryCapacityKwh,
      fastChargeKw: v1Variant.fastChargeKw,
      motorPowerHp: v1Variant.motorPowerHp,
      motorTorqueNm: v1Variant.motorTorqueNm,
      accelerationSec: v1.accelerationSec,
      warrantyYears: v1Variant.warrantyYears,
      batteryWarrantyYears: v1Variant.batteryWarrantyYears,
    },
    {
      startingPricePkr: v2.startingPricePkr,
      maxRangeKm: v2.maxRangeKm,
      batteryCapacityKwh: v2Variant.batteryCapacityKwh,
      fastChargeKw: v2Variant.fastChargeKw,
      motorPowerHp: v2Variant.motorPowerHp,
      motorTorqueNm: v2Variant.motorTorqueNm,
      accelerationSec: v2.accelerationSec,
      warrantyYears: v2Variant.warrantyYears,
      batteryWarrantyYears: v2Variant.batteryWarrantyYears,
    }
  );

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Compare', url: 'https://pakevfinder.com/compare' },
    {
      name: `${v1.name} vs ${v2.name}`,
      url: `https://pakevfinder.com/compare/${comparisonSlug}`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Side-by-Side EV Comparison
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {v1.name} vs {v2.name}
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          Detailed price, battery, range, charging power, and performance comparison.
        </p>
      </div>

      <AnswerFirstSummary
        answer={`${v1.name} (${formatPkr(v1.startingPricePkr)}, ${v1.maxRangeKm} km range) vs ${
          v2.name
        } (${formatPkr(v2.startingPricePkr)}, ${v2.maxRangeKm} km range). ${
          scores.winnerOverall === 1 ? v1.name : v2.name
        } achieves a higher overall PakevFinder Value Score.`}
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Comparison Calculation Module"
      />

      {/* Vehicles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vehicle 1 Card */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden">
          {scores.winnerOverall === 1 && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Trophy className="w-3.5 h-3.5" /> Higher Value Score
            </div>
          )}

          <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <VehicleFallbackImage
              src={v1.imageUrl}
              alt={v1.name}
              brandName={v1.brandName}
              modelName={v1.name}
              bodyType={v1.bodyType}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">{v1.name}</h2>
            <span className="text-2xl font-bold text-blue-700 block">
              {v1.startingPricePkr > 0 ? formatPkr(v1.startingPricePkr) : 'Expected'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">WLTP Range</span>
              <span className="font-bold text-slate-900">{v1.maxRangeKm} km</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Battery Size</span>
              <span className="font-bold text-slate-900">{v1Variant.batteryCapacityKwh} kWh</span>
            </div>
          </div>
        </div>

        {/* Vehicle 2 Card */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden">
          {scores.winnerOverall === 2 && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Trophy className="w-3.5 h-3.5" /> Higher Value Score
            </div>
          )}

          <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <VehicleFallbackImage
              src={v2.imageUrl}
              alt={v2.name}
              brandName={v2.brandName}
              modelName={v2.name}
              bodyType={v2.bodyType}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">{v2.name}</h2>
            <span className="text-2xl font-bold text-blue-700 block">
              {v2.startingPricePkr > 0 ? formatPkr(v2.startingPricePkr) : 'Expected'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">WLTP Range</span>
              <span className="font-bold text-slate-900">{v2.maxRangeKm} km</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Battery Size</span>
              <span className="font-bold text-slate-900">{v2Variant.batteryCapacityKwh} kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Direct Category Comparison</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <th className="p-4">Feature Category</th>
                <th className="p-4 text-blue-700 font-bold">{v1.name}</th>
                <th className="p-4 text-blue-700 font-bold">{v2.name}</th>
                <th className="p-4 text-emerald-700 font-bold">Category Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Ex-Factory Price</td>
                <td className="p-4 font-bold">{formatPkr(v1.startingPricePkr)}</td>
                <td className="p-4 font-bold">{formatPkr(v2.startingPricePkr)}</td>
                <td className="p-4 font-bold text-emerald-700">
                  {v1.startingPricePkr <= v2.startingPricePkr ? v1.name : v2.name}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Claimed WLTP Range</td>
                <td className="p-4 font-bold">{v1.maxRangeKm} km</td>
                <td className="p-4 font-bold">{v2.maxRangeKm} km</td>
                <td className="p-4 font-bold text-emerald-700">
                  {v1.maxRangeKm >= v2.maxRangeKm ? v1.name : v2.name}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Battery Capacity</td>
                <td className="p-4">{v1Variant.batteryCapacityKwh} kWh</td>
                <td className="p-4">{v2Variant.batteryCapacityKwh} kWh</td>
                <td className="p-4 font-bold text-emerald-700">
                  {v1Variant.batteryCapacityKwh >= v2Variant.batteryCapacityKwh ? v1.name : v2.name}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">DC Fast Charge Speed</td>
                <td className="p-4">{v1Variant.fastChargeKw} kW ({v1Variant.fastChargeTimeMin} min)</td>
                <td className="p-4">{v2Variant.fastChargeKw} kW ({v2Variant.fastChargeTimeMin} min)</td>
                <td className="p-4 font-bold text-emerald-700">
                  {v1Variant.fastChargeKw >= v2Variant.fastChargeKw ? v1.name : v2.name}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Motor Output & Torque</td>
                <td className="p-4">{v1Variant.motorPowerHp} HP / {v1Variant.motorTorqueNm} Nm</td>
                <td className="p-4">{v2Variant.motorPowerHp} HP / {v2Variant.motorTorqueNm} Nm</td>
                <td className="p-4 font-bold text-emerald-700">
                  {v1Variant.motorPowerHp >= v2Variant.motorPowerHp ? v1.name : v2.name}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">PakevFinder Score</td>
                <td className="p-4 font-black text-sm text-blue-700">{scores.vehicle1.overallScore}/10</td>
                <td className="p-4 font-black text-sm text-blue-700">{scores.vehicle2.overallScore}/10</td>
                <td className="p-4 font-bold text-emerald-700">
                  {scores.winnerOverall === 1 ? v1.name : v2.name}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
