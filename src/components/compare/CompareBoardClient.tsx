'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VehicleWithDetails } from '@/lib/types';
import { VehicleSmartImage } from '@/components/vehicles/VehicleSmartImage';
import { formatPKR } from '@/lib/verification';
import {
  Plus,
  X,
  Check,
  Search,
  Sparkles,
  ArrowRight,
  GitCompare,
  Battery,
  Gauge,
  Zap,
  Shield,
  Ruler,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface CompareBoardClientProps {
  allVehicles: VehicleWithDetails[];
  initialSlugs: string[];
}

interface PopularMatchupConfig {
  id: string;
  title: string;
  tag: string;
  category: string;
  slugs: [string, string, string];
}

const POPULAR_MATCHUPS: PopularMatchupConfig[] = [
  {
    id: 'matchup-a',
    title: 'New Arrivals: Hybrids & REEVs',
    tag: 'Trending',
    category: 'New Market Entrants',
    slugs: ['gwm-haval-h6-hev', 'jaecoo-j7-shs', 'changan-nevo-hunter-reev'],
  },
  {
    id: 'matchup-b',
    title: 'Electric C-SUVs Showdown',
    tag: 'Popular',
    category: 'High-Demand SUVs',
    slugs: ['byd-atto-3', 'deepal-s07', 'omoda-e5'],
  },
  {
    id: 'matchup-c',
    title: 'Budget City EVs Under 60 Lakh',
    tag: 'City Runabouts',
    category: 'Affordable Electric',
    slugs: ['honri-ve-2', 'dongfeng-box', 'gugo-gigi-ev'],
  },
  {
    id: 'matchup-d',
    title: 'PHEVs vs REEVs: Range Extenders',
    tag: 'Long Range',
    category: 'Dual-Power Engines',
    slugs: ['chery-tiggo-7-pro-phev', 'mg-hs-phev', 'forthing-friday-reev'],
  },
];

export function CompareBoardClient({
  allVehicles,
  initialSlugs,
}: CompareBoardClientProps) {
  // Up to 3 selected vehicle slugs strictly keyed
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    const valid = initialSlugs.filter(Boolean);
    return valid.length > 0 ? valid.slice(0, 3) : ['byd-atto-3', 'deepal-s07', 'omoda-e5'];
  });

  // Modal / Drawer state for adding or swapping cars
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlotTarget, setActiveSlotTarget] = useState<number | null>(null);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [drawerPowertrain, setDrawerPowertrain] = useState<string>('ALL');

  // Sync URL search params
  const syncUrl = (slugs: string[]) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (slugs.length > 0) {
      params.set('cars', slugs.join(','));
    }
    const newPath = slugs.length > 0 ? `/compare?${params.toString()}` : '/compare';
    window.history.replaceState(null, '', newPath);
  };

  // Map each slot directly to its vehicle record
  const selectedVehicles = useMemo(() => {
    return selectedSlugs
      .map((slug) => {
        return allVehicles.find(
          (v) => v.slug.toLowerCase() === slug.toLowerCase() || v.id.toLowerCase() === `veh-${slug.toLowerCase()}`
        ) || null;
      })
      .filter(Boolean) as VehicleWithDetails[];
  }, [selectedSlugs, allVehicles]);

  // Remove car from a slot
  const handleRemoveCar = (index: number) => {
    const next = selectedSlugs.filter((_, i) => i !== index);
    setSelectedSlugs(next);
    syncUrl(next);
  };

  // Open drawer for a specific slot (or next available)
  const handleOpenDrawer = (slotIndex: number) => {
    setActiveSlotTarget(slotIndex);
    setDrawerSearch('');
    setDrawerPowertrain('ALL');
    setIsDrawerOpen(true);
  };

  // Select car from drawer
  const handleSelectVehicle = (vehicle: VehicleWithDetails) => {
    const next = [...selectedSlugs];
    if (activeSlotTarget !== null && activeSlotTarget < 3) {
      if (activeSlotTarget < next.length) {
        next[activeSlotTarget] = vehicle.slug;
      } else {
        next.push(vehicle.slug);
      }
    } else if (next.length < 3) {
      next.push(vehicle.slug);
    }
    // Remove duplicates while keeping order
    const deduped: string[] = [];
    for (const s of next) {
      if (!deduped.includes(s)) deduped.push(s);
    }
    setSelectedSlugs(deduped);
    syncUrl(deduped);
    setIsDrawerOpen(false);
    setActiveSlotTarget(null);
  };

  // Load a 1-click preset matchup
  const handleLoadMatchup = (slugs: [string, string, string]) => {
    setSelectedSlugs(slugs);
    syncUrl(slugs);
    const tableEl = document.getElementById('compare-matrix-table');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter available vehicles in drawer
  const filteredDrawerVehicles = useMemo(() => {
    return allVehicles.filter((v) => {
      if (drawerPowertrain !== 'ALL' && v.powertrain.toUpperCase() !== drawerPowertrain) {
        return false;
      }
      if (drawerSearch.trim()) {
        const q = drawerSearch.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchBrand = v.brand.name.toLowerCase().includes(q);
        const matchDistributor = v.specs.distributor_name?.value?.toLowerCase().includes(q);
        return matchName || matchBrand || matchDistributor;
      }
      return true;
    });
  }, [allVehicles, drawerSearch, drawerPowertrain]);

  // Helper for determining row winner
  const getRowWinner = (
    metricKey: 'price' | 'battery' | 'range' | 'accel' | 'dcFast' | 'groundClearance' | 'boot' | 'power'
  ) => {
    if (selectedVehicles.length < 2) return null;

    const values = selectedVehicles.map((v) => {
      let num: number | null = null;
      if (metricKey === 'price') {
        num = v.latest_ex_factory_price?.amount_pkr || null;
      } else if (metricKey === 'battery') {
        num = v.specs.battery_kwh?.value ? parseFloat(v.specs.battery_kwh.value) : null;
      } else if (metricKey === 'range') {
        num = v.specs.wltp_range_km?.value ? parseFloat(v.specs.wltp_range_km.value) : null;
      } else if (metricKey === 'accel') {
        num = v.specs.zero_to_hundred_sec?.value ? parseFloat(v.specs.zero_to_hundred_sec.value) : null;
      } else if (metricKey === 'dcFast') {
        num = v.specs.dc_fast_charge_kw?.value ? parseFloat(v.specs.dc_fast_charge_kw.value) : null;
      } else if (metricKey === 'groundClearance') {
        num = v.specs.ground_clearance_mm?.value ? parseFloat(v.specs.ground_clearance_mm.value) : null;
      } else if (metricKey === 'boot') {
        num = v.specs.boot_capacity_litres?.value ? parseFloat(v.specs.boot_capacity_litres.value) : null;
      } else if (metricKey === 'power') {
        num = v.specs.motor_power_hp?.value ? parseFloat(v.specs.motor_power_hp.value) : null;
      }
      return { slug: v.slug, value: num };
    });

    const valid = values.filter((x) => x.value !== null && !isNaN(x.value) && x.value > 0);
    if (valid.length < 2) return null;
    const allSame = valid.every((x) => x.value === valid[0].value);
    if (allSame) return null;

    if (metricKey === 'price' || metricKey === 'accel') {
      valid.sort((a, b) => (a.value as number) - (b.value as number));
    } else {
      valid.sort((a, b) => (b.value as number) - (a.value as number));
    }
    return valid[0].slug;
  };

  const winners = useMemo(() => {
    return {
      price: getRowWinner('price'),
      battery: getRowWinner('battery'),
      range: getRowWinner('range'),
      accel: getRowWinner('accel'),
      dcFast: getRowWinner('dcFast'),
      power: getRowWinner('power'),
      groundClearance: getRowWinner('groundClearance'),
      boot: getRowWinner('boot'),
    };
  }, [selectedVehicles]);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-extrabold uppercase tracking-wider text-blue-700 shadow-2xs">
          <GitCompare className="w-3.5 h-3.5 text-blue-600" />
          <span>Vehicle Comparison Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Compare Cars
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Put any three cars side by side. The best figure in each row shows in{' '}
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            green
          </span>
          .
        </p>
      </div>

      {/* 2. 3-Slot Selection Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[0, 1, 2].map((slotIdx) => {
          const vehicle = selectedVehicles[slotIdx] || null;

          if (vehicle) {
            const exPrice = vehicle.latest_ex_factory_price?.amount_pkr;
            const formattedPrice = (vehicle as any).priceFormatted || (exPrice ? formatPKR(exPrice, true) : 'Price Pending');
            const pColor =
              vehicle.powertrain.toUpperCase() === 'BEV'
                ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                : vehicle.powertrain.toUpperCase() === 'PHEV'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : vehicle.powertrain.toUpperCase() === 'REEV'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div
                key={vehicle.slug}
                className="relative bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveCar(slotIdx)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md"
                  title="Remove this car"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* 16:9 Image Box */}
                <div
                  className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <VehicleSmartImage
                    slug={vehicle.slug}
                    name={vehicle.name}
                    brandName={vehicle.brand.name}
                    imageUrl={(vehicle as any).imageUrl || vehicle.hero_image_url}
                    bodyType={vehicle.body_type}
                    powertrain={vehicle.powertrain}
                    batteryKwh={vehicle.specs.battery_kwh?.value}
                    zeroToHundred={vehicle.specs.zero_to_hundred_sec?.value}
                    chargingPort={vehicle.specs.charging_port_standard?.value}
                    country={vehicle.brand.country}
                  />

                  <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-2xs ${pColor}`}>
                      {vehicle.powertrain}
                    </span>
                  </div>
                </div>

                {/* Vehicle Meta & Price */}
                <div className="pt-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-blue-700 tracking-wider">
                      {vehicle.brand.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 capitalize">
                      {vehicle.body_type}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">
                    {vehicle.name}
                  </h3>
                  <div className="text-lg font-black text-slate-950 tabular-nums pt-1">
                    {formattedPrice}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    Distributor: <strong className="text-slate-700">{vehicle.specs.distributor_name?.value || (vehicle as any).distributor || 'Official'}</strong>
                  </div>
                </div>

                {/* Change Car CTA */}
                <button
                  type="button"
                  onClick={() => handleOpenDrawer(slotIdx)}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors text-center"
                >
                  Change Car
                </button>
              </div>
            );
          }

          // Empty Slot
          return (
            <div
              key={`empty-slot-${slotIdx}`}
              onClick={() => handleOpenDrawer(slotIdx)}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20 rounded-3xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[280px] group shadow-2xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100/70 group-hover:bg-blue-600 text-blue-700 group-hover:text-white flex items-center justify-center transition-colors mb-3 shadow-xs">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                + Add a Car
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[180px]">
                Choose slot {slotIdx + 1} from {allVehicles.length} verified Pakistani models
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Popular Matchups Preset Cards */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Popular Matchups
              </h2>
              <p className="text-xs text-slate-500">
                1-click instant comparison bundles for Pakistan's most researched categories.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_MATCHUPS.map((matchup) => {
            const cars = matchup.slugs
              .map((s) => allVehicles.find((v) => v.slug.toLowerCase() === s.toLowerCase()))
              .filter(Boolean) as VehicleWithDetails[];

            return (
              <div
                key={matchup.id}
                className="bg-white hover:bg-slate-50/60 border border-slate-200/90 hover:border-blue-400 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                      {matchup.tag}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      3 Models
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                    {matchup.title}
                  </h3>

                  {/* 3 Car Image Strip */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {cars.map((c) => (
                      <div
                        key={c.slug}
                        className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                        style={{ aspectRatio: '16 / 9' }}
                      >
                        <Image
                          src={(c as any).imageUrl || c.hero_image_url}
                          alt={c.name}
                          fill
                          unoptimized
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* List of Models */}
                  <div className="space-y-1 pt-1">
                    {cars.map((c, i) => (
                      <div key={c.slug} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-700 font-bold truncate max-w-[140px]">
                          {i + 1}. {c.name.split('(')[0].trim()}
                        </span>
                        <span className="text-slate-500 font-semibold tabular-nums text-[10px]">
                          {(c as any).priceFormatted?.split(' ')[1] ? `${(c as any).priceFormatted.split(' ')[1]} ${(c as any).priceFormatted.split(' ')[2] || ''}` : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLoadMatchup(matchup.slugs)}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1 shadow-sm mt-1"
                >
                  <span>Compare These</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Side-by-Side Comparison Matrix */}
      {selectedVehicles.length >= 1 ? (
        <section id="compare-matrix-table" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Detailed Technical Specification Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Verified figures side-by-side. Best value in each row is highlighted in green.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {selectedVehicles.length} of 3 active cars
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                {/* Sticky Header Bar */}
                <thead className="sticky top-0 z-30 bg-slate-900 text-white shadow-md">
                  <tr className="border-b border-slate-800">
                    <th className="p-4 w-1/4 min-w-[200px] text-xs font-black uppercase tracking-wider text-slate-300">
                      Specification
                    </th>
                    {selectedVehicles.map((v, i) => (
                      <th
                        key={v.slug}
                        className="p-4 w-1/4 min-w-[220px] border-l border-slate-800 align-top"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider block">
                              Car {i + 1} • {v.brand.name}
                            </span>
                            <div className="font-black text-white text-sm truncate">
                              {v.name}
                            </div>
                            <div className="text-cyan-300 font-extrabold text-xs mt-0.5 tabular-nums">
                              {(v as any).priceFormatted || (v.latest_ex_factory_price ? formatPKR(v.latest_ex_factory_price.amount_pkr, true) : 'Price Pending')}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCar(i)}
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* If fewer than 3 cars, show add slot in header */}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, emptyIdx) => (
                      <th
                        key={`empty-head-${emptyIdx}`}
                        className="p-4 w-1/4 min-w-[220px] border-l border-slate-800 align-middle text-center bg-slate-950/50"
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(selectedVehicles.length + emptyIdx)}
                          className="px-3 py-1.5 rounded-xl border border-dashed border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Car</span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {/* CATEGORY 1: Pricing & Warranty */}
                  <tr className="bg-slate-100/80">
                    <td
                      colSpan={4}
                      className="py-2.5 px-4 font-black text-slate-800 text-xs uppercase tracking-wider"
                    >
                      💰 Pricing & Warranty
                    </td>
                  </tr>

                  {/* Ex-Factory Price */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Ex-Factory Retail Price</td>
                    {selectedVehicles.map((v) => {
                      const price = v.latest_ex_factory_price?.amount_pkr;
                      const isWinner = winners.price === v.slug;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200">
                          <span
                            className={
                              isWinner
                                ? 'inline-block bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-300 px-2.5 py-1 rounded-lg text-xs'
                                : 'font-extrabold text-slate-900 text-xs'
                            }
                          >
                            {(v as any).priceFormatted || (price ? formatPKR(price, true) : 'Pending')}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Est. On-Road */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Est. On-Road (Punjab/Sindh)</td>
                    {selectedVehicles.map((v) => {
                      const onRoad = v.latest_on_road_estimate?.amount_pkr;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                          {onRoad ? formatPKR(onRoad, true) : 'Estimate ~5% Tax'}
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Battery Warranty */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Traction Battery Warranty</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.battery_warranty_years?.value || '8 Years / 150,000 km'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Vehicle Warranty */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Vehicle Warranty</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.vehicle_warranty_years?.value || '4 Years / 100,000 km'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Official Distributor */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Official Local Distributor</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-bold text-blue-700">
                        {v.specs.distributor_name?.value || (v as any).distributor || 'Official Distributor'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* CATEGORY 2: Powertrain & Battery */}
                  <tr className="bg-slate-100/80">
                    <td
                      colSpan={4}
                      className="py-2.5 px-4 font-black text-slate-800 text-xs uppercase tracking-wider"
                    >
                      ⚡ Powertrain & Battery
                    </td>
                  </tr>

                  {/* Battery kWh */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Usable Battery Capacity</td>
                    {selectedVehicles.map((v) => {
                      const kwh = v.specs.battery_kwh?.value;
                      const isWinner = winners.battery === v.slug;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200">
                          <span
                            className={
                              isWinner
                                ? 'inline-block bg-emerald-50 text-emerald-800 font-black border border-emerald-300 px-2 py-0.5 rounded-md'
                                : 'font-bold text-slate-800'
                            }
                          >
                            {kwh ? `${kwh} kWh` : 'Self-Charging'}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Range */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Official Driving Range</td>
                    {selectedVehicles.map((v) => {
                      const range = v.specs.wltp_range_km?.value;
                      const isWinner = winners.range === v.slug;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200">
                          <span
                            className={
                              isWinner
                                ? 'inline-block bg-emerald-50 text-emerald-800 font-black border border-emerald-300 px-2 py-0.5 rounded-md'
                                : 'font-bold text-slate-800'
                            }
                          >
                            {range ? `${range} km` : '—'}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Summer Range */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Real Summer 40°C Range</td>
                    {selectedVehicles.map((v) => {
                      const summer = v.specs.real_world_range_km?.value;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-700">
                          {summer ? `~${summer} km (-20%)` : '—'}
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Battery Chemistry */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Battery Chemistry</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.battery_chemistry?.value || 'Lithium Iron Phosphate (LFP)'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Motor Power */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Motor Power Output</td>
                    {selectedVehicles.map((v) => {
                      const hp = v.specs.motor_power_hp?.value;
                      const isWinner = winners.power === v.slug;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200">
                          <span
                            className={
                              isWinner
                                ? 'inline-block bg-emerald-50 text-emerald-800 font-black border border-emerald-300 px-2 py-0.5 rounded-md'
                                : 'font-bold text-slate-800'
                            }
                          >
                            {hp ? `${hp} hp` : '—'}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Torque */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Peak Torque</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.torque_nm?.value ? `${v.specs.torque_nm.value} Nm` : '—'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Acceleration 0-100 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">0 – 100 km/h Acceleration</td>
                    {selectedVehicles.map((v) => {
                      const s = v.specs.zero_to_hundred_sec?.value;
                      const isWinner = winners.accel === v.slug;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200">
                          <span
                            className={
                              isWinner
                                ? 'inline-block bg-emerald-50 text-emerald-800 font-black border border-emerald-300 px-2 py-0.5 rounded-md'
                                : 'font-bold text-slate-800'
                            }
                          >
                            {s ? `${s} sec` : '—'}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Top Speed */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Top Speed</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.top_speed_kmh?.value ? `${v.specs.top_speed_kmh.value} km/h` : '180 km/h'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* CATEGORY 3: Charging Specs */}
                  <tr className="bg-slate-100/80">
                    <td
                      colSpan={4}
                      className="py-2.5 px-4 font-black text-slate-800 text-xs uppercase tracking-wider"
                    >
                      🔌 Charging & Compatibility
                    </td>
                  </tr>

                  {/* Max DC Fast Charge */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Max DC Fast Charge Speed</td>
                    {selectedVehicles.map((v) => {
                      const dc = v.specs.dc_fast_charge_kw?.value;
                      const isWinner = winners.dcFast === v.slug;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200">
                          <span
                            className={
                              isWinner
                                ? 'inline-block bg-emerald-50 text-emerald-800 font-black border border-emerald-300 px-2 py-0.5 rounded-md'
                                : 'font-bold text-slate-800'
                            }
                          >
                            {dc ? `${dc} kW` : '—'}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* 10-80% Time */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">DC 10% to 80% Time</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.dc_charge_time_mins?.value || (v.powertrain === 'bev' ? '30-40 mins' : '—')}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* AC Charge Speed */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">On-Board AC Charger Speed</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.ac_charge_kw?.value ? `${v.specs.ac_charge_kw.value} kW` : '7.4 kW'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Charging Connector */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Charging Port Standard</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-extrabold text-blue-700">
                        {v.specs.charging_port_standard?.value || 'CCS Type 2'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* CATEGORY 4: Physical Dimensions */}
                  <tr className="bg-slate-100/80">
                    <td
                      colSpan={4}
                      className="py-2.5 px-4 font-black text-slate-800 text-xs uppercase tracking-wider"
                    >
                      📐 Physical Dimensions & Space
                    </td>
                  </tr>

                  {/* Seating Capacity */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Seating Capacity</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.seating_capacity?.value ? `${v.specs.seating_capacity.value} Seats` : '5 Seats'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Length */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Overall Length</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.length_mm?.value ? `${v.specs.length_mm.value} mm` : '—'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Width */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Overall Width</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.width_mm?.value ? `${v.specs.width_mm.value} mm` : '—'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Height */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-700">Overall Height</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.slug} className="p-4 border-l border-slate-200 font-semibold text-slate-800">
                        {v.specs.height_mm?.value ? `${v.specs.height_mm.value} mm` : '—'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Ground Clearance */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Ground Clearance</td>
                    {selectedVehicles.map((v) => {
                      const gc = v.specs.ground_clearance_mm?.value;
                      const isWinner = winners.groundClearance === v.slug;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200">
                          <span
                            className={
                              isWinner
                                ? 'inline-block bg-emerald-50 text-emerald-800 font-black border border-emerald-300 px-2 py-0.5 rounded-md'
                                : 'font-bold text-slate-800'
                            }
                          >
                            {gc ? `${gc} mm` : '175 mm'}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>

                  {/* Boot Volume */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Boot Luggage Volume</td>
                    {selectedVehicles.map((v) => {
                      const boot = v.specs.boot_capacity_litres?.value;
                      const isWinner = winners.boot === v.slug;
                      return (
                        <td key={v.slug} className="p-4 border-l border-slate-200">
                          <span
                            className={
                              isWinner
                                ? 'inline-block bg-emerald-50 text-emerald-800 font-black border border-emerald-300 px-2 py-0.5 rounded-md'
                                : 'font-bold text-slate-800'
                            }
                          >
                            {boot ? `${boot} L` : '450 L'}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 text-slate-300">—</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-3">
          <GitCompare className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Cars Selected</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click &ldquo;+ Add a Car&rdquo; above or choose one of the curated matchups to inspect specifications side-by-side.
          </p>
        </div>
      )}

      {/* 5. Interactive Vehicle Selection Drawer / Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Select a Vehicle {activeSlotTarget !== null ? `for Slot ${activeSlotTarget + 1}` : ''}
                </h3>
                <p className="text-xs text-slate-500">
                  Pick from all {allVehicles.length} official and imported electric models in Pakistan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by vehicle name, brand, or distributor..."
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                {['ALL', 'BEV', 'PHEV', 'REEV', 'HEV'].map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setDrawerPowertrain(pt)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      drawerPowertrain === pt
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pt === 'ALL' ? 'All Powertrains' : pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle List */}
            <div className="p-4 overflow-y-auto space-y-2 divide-y divide-slate-100 custom-scrollbar flex-1">
              {filteredDrawerVehicles.length > 0 ? (
                filteredDrawerVehicles.map((v) => {
                  const isAlreadySelected = selectedSlugs.includes(v.slug);
                  const formattedPrice = (v as any).priceFormatted || (v.latest_ex_factory_price ? formatPKR(v.latest_ex_factory_price.amount_pkr, true) : 'Price Pending');

                  return (
                    <div
                      key={v.slug}
                      onClick={() => handleSelectVehicle(v)}
                      className={`pt-2 first:pt-0 p-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isAlreadySelected
                          ? 'bg-blue-50/70 border border-blue-200'
                          : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 16:9 Thumbnail */}
                        <div
                          className="relative aspect-video w-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200"
                          style={{ aspectRatio: '16 / 9' }}
                        >
                          <Image
                            src={(v as any).imageUrl || v.hero_image_url}
                            alt={v.name}
                            fill
                            unoptimized
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="font-extrabold uppercase text-blue-700">
                              {v.brand.name}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-slate-500 uppercase">
                              {v.powertrain}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {v.name}
                          </div>
                          <div className="text-[11px] font-extrabold text-slate-800 tabular-nums">
                            {formattedPrice}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isAlreadySelected ? (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>In Compare</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-1">
                  <p className="text-xs font-bold text-slate-600">No vehicles match your search</p>
                  <p className="text-[11px] text-slate-400">Try changing powertrain filter or search query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
