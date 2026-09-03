import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, {
  createVehicleProductSchema,
  createBreadcrumbSchema,
} from '@/components/seo/SchemaScript';
import VehicleFallbackImage from '@/components/vehicles/VehicleFallbackImage';
import VehicleRunningCostCalculator from '@/components/vehicles/VehicleRunningCostCalculator';
import RangeCalculator from '@/components/vehicles/RangeCalculator';
import { getVehicleBySlug, getAllVehicles } from '@/lib/data/mock-db';
import { getVerificationBadgeConfig } from '@/lib/data/verification';
import { calculateVehicleScore } from '@/lib/calculations/scoring';
import { formatPkr } from '@/lib/utils/format';
import {
  Zap,
  Battery,
  Gauge,
  Clock,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  ShieldCheck,
  Plug,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface VehicleSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const vehicles = getAllVehicles();
  return vehicles.map((v) => ({
    slug: v.slug,
  }));
}

export default async function VehicleSlugPage({ params }: VehicleSlugPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const defaultVariant = vehicle.variants[0];
  const verificationConfig = getVerificationBadgeConfig(
    (defaultVariant.status as any) || 'verified'
  );

  const scores = calculateVehicleScore({
    startingPricePkr: vehicle.startingPricePkr,
    maxRangeKm: vehicle.maxRangeKm,
    batteryCapacityKwh: defaultVariant.batteryCapacityKwh,
    fastChargeKw: defaultVariant.fastChargeKw,
    motorPowerHp: defaultVariant.motorPowerHp,
    motorTorqueNm: defaultVariant.motorTorqueNm,
    accelerationSec: vehicle.accelerationSec,
    warrantyYears: defaultVariant.warrantyYears,
    batteryWarrantyYears: defaultVariant.batteryWarrantyYears,
  });

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Vehicles', url: 'https://pakevfinder.com/vehicles' },
    { name: vehicle.brandName, url: `https://pakevfinder.com/brands/${vehicle.brandSlug}` },
    { name: vehicle.name, url: `https://pakevfinder.com/vehicles/${vehicle.slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SchemaScript
        schemaData={[
          createVehicleProductSchema(vehicle),
          createBreadcrumbSchema(breadcrumbs),
        ]}
      />

      {/* Main Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
            <span className="bg-slate-950 text-white border border-slate-800 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
              {vehicle.bodyType} • {vehicle.powertrain || 'EV'}
            </span>

            {/* Verification Status Badge */}
            <span className={`text-[10px] px-3 py-1 rounded-full border flex items-center gap-1.5 ${verificationConfig.badgeClass}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {verificationConfig.label}
            </span>

            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-[10px] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Verified {vehicle.verifiedDate || 'Feb 2026'}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{vehicle.brandName}</span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {vehicle.name} Specs, Price & Range
            </h1>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            {vehicle.description}
          </p>

          <div className="pt-2 flex items-baseline gap-3">
            <span className="text-slate-400 text-xs font-bold">Ex-Factory Price:</span>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {vehicle.startingPricePkr > 0 ? formatPkr(vehicle.startingPricePkr) : 'Upcoming / Expected'}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={`/compare/${vehicle.slug}-vs-byd-seal`}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Compare {vehicle.name}</span>
            </Link>
            <Link
              href="/compare"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3.5 px-6 rounded-xl transition-all border border-slate-700 flex items-center gap-2"
            >
              Select Competitor
            </Link>
          </div>
        </div>

        {/* Vehicle Image */}
        <div className="lg:col-span-5 relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
          <VehicleFallbackImage
            src={vehicle.imageUrl}
            alt={`${vehicle.brandName} ${vehicle.name} Electric Vehicle`}
            brandName={vehicle.brandName}
            modelName={vehicle.name}
            bodyType={vehicle.bodyType}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Answer-First Summary (AEO) */}
      <AnswerFirstSummary
        answer={`The ${vehicle.name} is distributed by ${vehicle.distributorName} in Pakistan starting at ex-factory price ${
          vehicle.startingPricePkr > 0 ? formatPkr(vehicle.startingPricePkr) : 'Expected'
        }. It features a ${defaultVariant.batteryCapacityKwh} kWh battery delivering up to ${
          vehicle.maxRangeKm
        } km WLTP range, ${defaultVariant.motorPowerHp} HP motor output, and ${
          defaultVariant.fastChargeKw
        } kW DC fast charging capabilities.`}
        verifiedDate="Feb 2026"
        sourceName={`${vehicle.distributorName} Verified Specifications`}
      />

      {/* KPI Specs Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center shadow-md">
          <Battery className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <span className="text-xl font-black text-white block">{vehicle.maxRangeKm} km</span>
          <span className="text-xs text-slate-400 font-medium">WLTP Range</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center shadow-md">
          <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <span className="text-xl font-black text-white block">{defaultVariant.batteryCapacityKwh} kWh</span>
          <span className="text-xs text-slate-400 font-medium">Battery Pack</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center shadow-md">
          <Gauge className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <span className="text-xl font-black text-white block">
            {defaultVariant.motorPowerHp} HP
          </span>
          <span className="text-xs text-slate-400 font-medium">{defaultVariant.motorTorqueNm} Nm Torque</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center shadow-md">
          <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <span className="text-xl font-black text-white block">{defaultVariant.fastChargeTimeMin} min</span>
          <span className="text-xs text-slate-400 font-medium">10-80% DC Fast Charge</span>
        </div>
      </div>

      {/* Value Scoring Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">PakevFinder Value Score Index</h2>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-black text-lg px-4 py-1.5 rounded-2xl shadow-lg">
            {scores.overallScore} / 10
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(scores.categoryScores).map((cs, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span>{cs.category}</span>
                <span className="text-blue-400 font-extrabold">{cs.score}/10</span>
              </div>
              <span className="text-sm font-bold text-white block">{cs.label}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{cs.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Range Estimator */}
      <RangeCalculator
        vehicleName={vehicle.name}
        claimedWltpRangeKm={vehicle.maxRangeKm}
        batteryCapacityKwh={defaultVariant.batteryCapacityKwh}
      />

      {/* Interactive Running Cost Calculator */}
      <VehicleRunningCostCalculator
        vehicleName={vehicle.name}
        batteryCapacityKwh={defaultVariant.batteryCapacityKwh}
        maxRangeKm={vehicle.maxRangeKm}
      />

      {/* Specifications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <FileSpreadsheet className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Technical Specifications Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-bold">
                <th className="p-4">Spec Feature</th>
                {vehicle.variants.map((v) => (
                  <th key={v.id} className="p-4 text-blue-400 font-bold text-sm">
                    {v.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-950">Ex-Factory Price</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-black text-sm text-emerald-400">
                    {v.pricePkr > 0 ? formatPkr(v.pricePkr) : 'Expected'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-950">Battery Capacity</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.batteryCapacityKwh} kWh Usable
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-950">Claimed Range</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.wltpRangeKm ? `${v.wltpRangeKm} km WLTP` : `${v.nedcRangeKm} km NEDC`}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-950">Motor Output & Torque</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.motorPowerHp} HP / {v.motorTorqueNm} Nm ({v.driveType})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-950">Warranty Coverage</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-semibold text-emerald-400">
                    {v.warrantyYears} Years Vehicle / {v.batteryWarrantyYears} Years Battery
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
