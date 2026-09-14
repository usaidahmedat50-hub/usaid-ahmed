import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllVehicles, getVehicleBySlug } from '@/lib/vehicles';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { SpecTable } from '@/components/vehicles/SpecTable';
import { OnRoadPriceEstimator } from '@/components/vehicles/OnRoadPriceEstimator';
import { PriceHistoryChart } from '@/components/vehicles/PriceHistoryChart';
import { RunningCostCalculator } from '@/components/vehicles/RunningCostCalculator';
import { WhereToChargeBlock } from '@/components/vehicles/WhereToChargeBlock';
import { YouMayConsider } from '@/components/vehicles/YouMayConsider';
import { VehicleSmartImage } from '@/components/vehicles/VehicleSmartImage';
import { formatPKR } from '@/lib/verification';
import { BatteryCharging, Gauge, Zap, ArrowLeft, GitCompare, ExternalLink, Shield } from 'lucide-react';

export const revalidate = 43200; // ISR 12 hours

interface VehiclePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const vehicles = await getAllVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: 'Vehicle Not Found — PakEVFinder' };

  const priceStr = formatPKR(vehicle.latest_ex_factory_price?.amount_pkr);
  const range = vehicle.specs.wltp_range_km?.value;

  return {
    title: `${vehicle.name} Price in Pakistan (2026), Specs & Range — PakEVFinder`,
    description: `Ex-factory price (${priceStr}), ${range ? `${range} km range, ` : ''}battery specifications, and DC fast charging details for ${vehicle.name} in Pakistan.`,
    alternates: {
      canonical: `https://pakevfinder.com/vehicles/${vehicle.slug}`,
    },
    openGraph: {
      title: `${vehicle.name} Price in Pakistan (2026), Specs & Range`,
      description: vehicle.summary || `Technical specifications for ${vehicle.name} in Pakistan.`,
      images: vehicle.hero_image_url ? [{ url: vehicle.hero_image_url }] : [],
    },
  };
}

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const allVehicles = await getAllVehicles();

  const exPrice = vehicle.latest_ex_factory_price?.amount_pkr;
  const batteryKwh = vehicle.specs.battery_kwh?.value;
  const wltpRange = vehicle.specs.wltp_range_km?.value;
  const realRange = vehicle.specs.real_world_range_km?.value;
  const powerHp = vehicle.specs.motor_power_hp?.value;
  const dcFastKw = vehicle.specs.dc_fast_charge_kw?.value;

  // JSON-LD Vehicle & Product Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Vehicle'],
    name: vehicle.name,
    image: vehicle.hero_image_url || undefined,
    description: vehicle.summary || `${vehicle.name} specifications and prices in Pakistan`,
    brand: {
      '@type': 'Brand',
      name: vehicle.brand.name,
    },
    offers: exPrice
      ? {
          '@type': 'Offer',
          priceCurrency: 'PKR',
          price: exPrice,
          availability: 'https://schema.org/InStock',
          url: `https://pakevfinder.com/vehicles/${vehicle.slug}`,
        }
      : undefined,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-1.5 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Vehicles</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/compare?v1=${vehicle.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 border border-gray-200 text-blue-700 font-medium text-xs transition-colors"
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
          <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-white">
            <VehicleSmartImage
              slug={vehicle.slug}
              name={vehicle.name}
              brandName={vehicle.brand.name}
              imageUrl={vehicle.hero_image_url}
              bodyType={vehicle.body_type}
              powertrain={vehicle.powertrain}
              batteryKwh={batteryKwh}
              zeroToHundred={vehicle.specs.zero_to_hundred_sec?.value}
              chargingPort={vehicle.specs.charging_port_standard?.value}
              country={vehicle.brand.country}
              priority
            />

            <div className="absolute top-3 left-3 flex gap-2 z-10 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white/95 text-blue-700 border border-blue-200 uppercase tracking-wider shadow-2xs">
                {vehicle.powertrain}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/95 text-slate-700 border border-slate-200 capitalize shadow-2xs">
                {vehicle.body_type}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Key Specs & Pricing Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs">
              <Link
                href={`/brands/${vehicle.brand.slug}`}
                className="font-semibold text-blue-700 hover:underline uppercase tracking-wider"
              >
                {vehicle.brand.name}
              </Link>
              {vehicle.brand.country && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">{vehicle.brand.country}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114]">{vehicle.name}</h1>

            <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                Ex-Factory Retail Price (Pakistan)
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#111114] tabular-nums mt-0.5">
                {exPrice ? formatPKR(exPrice, true) : (
                  <span className="text-lg text-gray-500 font-normal">Pricing Pending Official Launch</span>
                )}
              </div>
              {vehicle.latest_ex_factory_price?.source_url && (
                <div className="mt-2 text-[11px] flex items-center gap-1.5 text-gray-500">
                  <span>Source Reference:</span>
                  <a
                    href={vehicle.latest_ex_factory_price.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Distributor Announcement</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1 text-[11px]">
                <BatteryCharging className="w-3.5 h-3.5 text-blue-700" />
                <span>Usable Battery</span>
              </div>
              <div className="text-sm font-bold text-[#111114] tabular-nums">
                {batteryKwh ? `${batteryKwh} kWh` : '—'}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1 text-[11px]">
                <Gauge className="w-3.5 h-3.5 text-gray-600" />
                <span>Official Range</span>
              </div>
              <div className="text-sm font-bold text-[#111114] tabular-nums">
                {wltpRange ? `${wltpRange} km` : '—'}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-gray-600" />
                <span>Motor Output</span>
              </div>
              <div className="text-sm font-bold text-[#111114] tabular-nums truncate">
                {powerHp ? `${powerHp}` : '—'}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-gray-600" />
                <span>Max DC Charge</span>
              </div>
              <div className="text-sm font-bold text-[#111114] tabular-nums">
                {dcFastKw ? `${dcFastKw} kW` : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Answer Block */}
      {vehicle.summary && (
        <DirectAnswerBlock
          title={`Summary & Verdict: ${vehicle.name}`}
          summary={vehicle.summary}
          keyFacts={[
            { label: 'Ex-Factory Price', value: formatPKR(exPrice) },
            { label: 'Official Range', value: wltpRange ? `${wltpRange} km` : 'Pending' },
            {
              label: 'Pakistan Summer Range',
              value: realRange ? `${realRange}` : 'Est. ~80% WLTP',
            },
            {
              label: 'Distributor',
              value: vehicle.specs.distributor_name?.value || vehicle.brand.name,
            },
          ]}
        />
      )}

      {/* Detailed Technical Specifications Table */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-[#111114]">
            Technical Specifications
          </h2>
          <p className="text-xs text-gray-500">
            Sourced from official manufacturer and distributor technical data sheets.
          </p>
        </div>
        <SpecTable specs={vehicle.specs} />
      </section>

      {/* Running Cost & Fuel Savings Calculator */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Running Cost & Petrol Savings Calculator
          </h2>
          <p className="text-xs text-slate-500">
            Compare running costs per kilometer and monthly savings against petrol cars in Pakistan.
          </p>
        </div>
        <RunningCostCalculator
          batteryKwh={Number(batteryKwh) || 60}
          wltpRangeKm={Number(wltpRange) || 400}
          vehicleName={vehicle.name}
        />
      </section>

      {/* Where to Charge & Network Match */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Charging Compatibility & Public Infrastructure
          </h2>
          <p className="text-xs text-slate-500">
            Connector standards and verified charging compatibility across Pakistan.
          </p>
        </div>
        <WhereToChargeBlock
          vehicleName={vehicle.name}
          vehicleSlug={vehicle.slug}
          chargingPort={vehicle.specs.charging_port_standard?.value}
          maxDcChargeKw={dcFastKw}
          batteryKwh={batteryKwh}
        />
      </section>

      {/* On-Road Price Estimator */}
      {exPrice && (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Estimated On-Road Price Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Itemized provincial registration, withholding tax, and filer/non-filer estimates for all 5 provinces.
            </p>
          </div>
          <OnRoadPriceEstimator
            exFactoryPricePkr={exPrice}
            vehicleName={vehicle.name}
          />
        </section>
      )}

      {/* Append-Only Price History Log */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
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
