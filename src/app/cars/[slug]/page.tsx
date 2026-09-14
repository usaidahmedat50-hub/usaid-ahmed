import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { SpecTable } from '@/components/vehicles/SpecTable';
import { OnRoadPriceEstimator } from '@/components/vehicles/OnRoadPriceEstimator';
import { PriceHistoryChart } from '@/components/vehicles/PriceHistoryChart';
import { RunningCostCalculator } from '@/components/vehicles/RunningCostCalculator';
import { WhereToChargeBlock } from '@/components/vehicles/WhereToChargeBlock';
import { YouMayConsider } from '@/components/vehicles/YouMayConsider';
import { VehicleSmartImage } from '@/components/vehicles/VehicleSmartImage';
import { formatPKR } from '@/lib/verification';
import {
  BatteryCharging,
  Gauge,
  Zap,
  ArrowLeft,
  GitCompare,
  ExternalLink,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import {
  getVehiclesFromJson,
  getVehicleFromJsonBySlug,
  convertJsonToVehicleWithDetails,
  getAllVehiclesWithDetailsFromJson,
} from '@/lib/vehicles-json';

export const revalidate = 43200; // ISR 12 hours

interface CarPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Enable Next.js Static Site Generation (SSG) across all 32 slugs
 * directly from /data/vehicles.json.
 */
export async function generateStaticParams() {
  const vehicles = getVehiclesFromJson();
  return vehicles.map((v) => ({
    slug: v.id,
  }));
}

/**
 * Dynamic SEO metadata for each vehicle slug.
 */
export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawVehicle = getVehicleFromJsonBySlug(slug);
  if (!rawVehicle) return { title: 'Vehicle Not Found — PakEVFinder' };

  const priceStr = rawVehicle.priceFormatted || 'Price Pending';
  const rangeStr = rawVehicle.rangeKm
    ? `${rawVehicle.rangeKm} km range (~${rawVehicle.summerRangeKm} km summer)`
    : '';

  return {
    title: `${rawVehicle.name} Price in Pakistan (2026), Specs & Range — PakEVFinder`,
    description: `Official ${rawVehicle.name} ex-factory price (${priceStr}), ${rangeStr}, ${rawVehicle.batteryKwh ? rawVehicle.batteryKwh + ' kWh battery, ' : ''}DC fast charging & distributor specs in Pakistan.`,
    alternates: {
      canonical: `https://pakevfinder.com/cars/${rawVehicle.id}`,
    },
    openGraph: {
      title: `${rawVehicle.name} Price in Pakistan (2026), Specs & Range`,
      description: rawVehicle.summary || `Technical specifications for ${rawVehicle.name} in Pakistan.`,
      images: rawVehicle.imageUrl ? [{ url: rawVehicle.imageUrl }] : [],
    },
  };
}

/**
 * Vehicle Detail View reading directly from /data/vehicles.json store.
 */
export default async function CarDetailPage({ params }: CarPageProps) {
  const { slug } = await params;
  const rawVehicle = getVehicleFromJsonBySlug(slug);

  if (!rawVehicle) {
    notFound();
  }

  const vehicle = convertJsonToVehicleWithDetails(rawVehicle);
  const allVehicles = getAllVehiclesWithDetailsFromJson();

  const exPrice = rawVehicle.pricePkr;
  const batteryKwh = rawVehicle.batteryKwh;
  const wltpRange = rawVehicle.rangeKm;
  const realRange = rawVehicle.summerRangeKm;
  const powerHp = rawVehicle.powerHp;
  const dcFastKw = vehicle.specs.dc_fast_charge_kw?.value;

  // JSON-LD Product & Vehicle Schema.org Tags
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Vehicle'],
    name: rawVehicle.name,
    image: `https://pakevfinder.com${rawVehicle.imageUrl}`,
    description: rawVehicle.summary || `${rawVehicle.name} specifications and prices in Pakistan`,
    brand: {
      '@type': 'Brand',
      name: rawVehicle.brand,
    },
    manufacturer: {
      '@type': 'Organization',
      name: rawVehicle.brand,
    },
    category: `${rawVehicle.powertrain} ${rawVehicle.bodyType}`,
    vehicleConfiguration: rawVehicle.powertrain,
    bodyType: rawVehicle.bodyType,
    fuelType: rawVehicle.powertrain === 'BEV' ? 'Electricity' : 'Hybrid',
    productionDate: '2026',
    offers: exPrice
      ? {
          '@type': 'Offer',
          priceCurrency: 'PKR',
          price: exPrice,
          priceValidUntil: '2026-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          url: `https://pakevfinder.com/cars/${rawVehicle.id}`,
          seller: {
            '@type': 'Organization',
            name: rawVehicle.distributor,
          },
        }
      : undefined,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Embedded JSON-LD Product & Vehicle Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link
          href="/cars"
          className="inline-flex items-center gap-1.5 hover:text-blue-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Cars ({allVehicles.length})</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/compare?v1=${rawVehicle.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-blue-700 font-bold text-xs transition-colors shadow-2xs"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Model</span>
          </Link>
        </div>
      </div>

      {/* Hero Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Imagery */}
        <div className="lg:col-span-7">
          <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
            <VehicleSmartImage
              slug={vehicle.slug}
              name={vehicle.name}
              brandName={vehicle.brand.name}
              imageUrl={rawVehicle.imageUrl}
              bodyType={vehicle.body_type}
              powertrain={vehicle.powertrain}
              batteryKwh={batteryKwh ? String(batteryKwh) : undefined}
              zeroToHundred={rawVehicle.zeroToHundred ? String(rawVehicle.zeroToHundred) : undefined}
              chargingPort={rawVehicle.chargingPort}
              country={vehicle.brand.country}
              priority
            />

            <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-white/95 text-blue-700 border border-blue-200 uppercase tracking-wider shadow-sm">
                {rawVehicle.powertrain}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/95 text-slate-700 border border-slate-200 capitalize shadow-sm">
                {rawVehicle.bodyType}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shadow-sm">
                {rawVehicle.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Key Specs & Pricing Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs">
              <span className="font-extrabold text-blue-700 uppercase tracking-wider">
                {rawVehicle.brand}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-semibold">{rawVehicle.distributor}</span>
              {vehicle.brand.country && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{vehicle.brand.country}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {rawVehicle.name}
            </h1>

            <div className="mt-4 p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                  Ex-Factory Retail Price (Pakistan)
                </span>
                <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums mt-1">
                {rawVehicle.priceFormatted}
              </div>
              <div className="mt-2 text-[11px] flex items-center justify-between text-slate-500 pt-2 border-t border-slate-200/60">
                <span>Distributor Partner:</span>
                <strong className="text-slate-800">{rawVehicle.distributor}</strong>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1 text-[11px] font-medium">
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
                <span>Battery Capacity</span>
              </div>
              <div className="text-base font-black text-slate-900 tabular-nums">
                {batteryKwh ? `${batteryKwh} kWh` : 'Self-Charging'}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1 text-[11px] font-medium">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>Official Range</span>
              </div>
              <div className="text-base font-black text-slate-900 tabular-nums">
                {wltpRange ? `${wltpRange} km` : '—'}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1 text-[11px] font-medium">
                <Gauge className="w-4 h-4 text-amber-600" />
                <span>Summer 40°C Heat</span>
              </div>
              <div className="text-base font-black text-slate-900 tabular-nums">
                ~{realRange} km
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1 text-[11px] font-medium">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span>Output & Speed</span>
              </div>
              <div className="text-base font-black text-slate-900 tabular-nums">
                {powerHp} hp {rawVehicle.zeroToHundred ? `• ${rawVehicle.zeroToHundred}s` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Answer Block */}
      {rawVehicle.summary && (
        <DirectAnswerBlock
          title={`Summary & Verdict: ${rawVehicle.name}`}
          summary={rawVehicle.summary}
          keyFacts={[
            { label: 'Ex-Factory Price', value: rawVehicle.priceFormatted },
            { label: 'Official Range', value: `${wltpRange} km` },
            {
              label: 'Pakistan Summer 40°C Range',
              value: `~${realRange} km (-20% A/C load)`,
            },
            {
              label: 'Charging Port',
              value: rawVehicle.chargingPort,
            },
            {
              label: 'Local Distributor',
              value: rawVehicle.distributor,
            },
          ]}
        />
      )}

      {/* Detailed Technical Specifications Table */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Technical Specifications
          </h2>
          <p className="text-xs text-slate-500">
            Sourced from official manufacturer and distributor technical data sheets in Pakistan.
          </p>
        </div>
        <SpecTable specs={vehicle.specs} />
      </section>

      {/* Running Cost & Fuel Savings Calculator */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Running Cost & Petrol Savings Calculator
          </h2>
          <p className="text-xs text-slate-500">
            Compare running costs per kilometer and monthly savings against petrol cars in Pakistan.
          </p>
        </div>
        <RunningCostCalculator
          batteryKwh={batteryKwh || 60}
          wltpRangeKm={wltpRange || 400}
          vehicleName={rawVehicle.name}
        />
      </section>

      {/* Where to Charge & Network Match */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Charging Compatibility & Public Infrastructure
          </h2>
          <p className="text-xs text-slate-500">
            Connector standards and verified charging compatibility across Pakistan fast-charging networks.
          </p>
        </div>
        <WhereToChargeBlock
          vehicleName={rawVehicle.name}
          vehicleSlug={rawVehicle.id}
          chargingPort={rawVehicle.chargingPort}
          maxDcChargeKw={dcFastKw}
          batteryKwh={batteryKwh ? String(batteryKwh) : undefined}
        />
      </section>

      {/* On-Road Price Estimator */}
      {exPrice && (
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Estimated On-Road Price Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Itemized provincial registration, withholding tax, and filer/non-filer estimates for all 5 provinces.
            </p>
          </div>
          <OnRoadPriceEstimator
            exFactoryPricePkr={exPrice}
            vehicleName={rawVehicle.name}
          />
        </section>
      )}

      {/* Append-Only Price History Log */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Price History Log
          </h2>
          <p className="text-xs text-slate-500">
            Historical distributor price announcements and revisions.
          </p>
        </div>
        <PriceHistoryChart prices={vehicle.prices} />
      </section>

      {/* You May Also Consider */}
      <section className="pt-4 border-t border-slate-200">
        <YouMayConsider
          currentVehicle={vehicle}
          allVehicles={allVehicles}
        />
      </section>
    </div>
  );
}
