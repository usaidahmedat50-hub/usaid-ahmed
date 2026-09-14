'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Zap,
  MapPin,
  Navigation,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';

export function HomeSearchWidget() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'chargers' | 'route'>('vehicles');

  // Tab 1 state: Vehicle Search
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleBudget, setVehicleBudget] = useState('all');

  // Tab 2 state: Charger Search
  const [chargerCity, setChargerCity] = useState('all');
  const [chargerSpeed, setChargerSpeed] = useState('all');

  // Tab 3 state: Route Planner
  const [routeOrigin, setRouteOrigin] = useState('Lahore');
  const [routeDest, setRouteDest] = useState('Islamabad / Rawalpindi');

  const handleVehicleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicleBudget !== 'all') {
      router.push(`/categories/${vehicleBudget}`);
    } else if (vehicleSearch.trim()) {
      router.push(`/vehicles?q=${encodeURIComponent(vehicleSearch.trim())}`);
    } else {
      router.push('/vehicles');
    }
  };

  const handleChargerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/charging-stations');
  };

  const handleRouteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/route-planner');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'vehicles'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Explore Vehicles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chargers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'chargers'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Find Chargers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('route')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'route'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Plan a Route</span>
        </button>
      </div>

      {/* Main Search Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-900">
        {/* Tab 1: Vehicles */}
        {activeTab === 'vehicles' && (
          <form onSubmit={handleVehicleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search BYD Seal, Deepal S07, MG4, Atto 3, Honri..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div className="sm:w-56">
              <select
                value={vehicleBudget}
                onChange={(e) => setVehicleBudget(e.target.value)}
                aria-label="Filter by Budget Range"
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="all">Any Budget Ceiling</option>
                <option value="under-50-lacs">Under PKR 50 Lacs</option>
                <option value="under-1-crore">Under PKR 1 Crore</option>
                <option value="under-1-5-crore">Under PKR 1.5 Crore</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
            >
              <span>Search Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Chargers */}
        {activeTab === 'chargers' && (
          <form onSubmit={handleChargerSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <select
                value={chargerCity}
                onChange={(e) => setChargerCity(e.target.value)}
                aria-label="Select City or Motorway Hub"
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="all">All Cities & Motorways (28+ Stations)</option>
                <option value="m2">M-2 Motorway Service Areas (Bhera, Sukheki, Kalar Kahar)</option>
                <option value="lahore">Lahore (Emporium, Packages, Gulberg, DHA)</option>
                <option value="islamabad">Islamabad / Rawalpindi (Centaurus, F-7, Saddar)</option>
                <option value="karachi">Karachi (Clifton, DHA 6, Lucky One, FTC, M-9)</option>
                <option value="multan">Multan & Sukkur (M-4 / M-5 Corridors)</option>
                <option value="faisalabad">Faisalabad (Canal Expressway, D-Ground)</option>
              </select>
            </div>

            <div className="sm:w-56">
              <select
                value={chargerSpeed}
                onChange={(e) => setChargerSpeed(e.target.value)}
                aria-label="Select Power Speed Tier"
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="all">All Power Tiers (7–120 kW)</option>
                <option value="120">Ultra-Fast DC (120 kW+)</option>
                <option value="60">Fast DC (60 kW+)</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
            >
              <span>Explore Charging Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 3: Route Planner */}
        {activeTab === 'route' && (
          <form onSubmit={handleRouteSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <select
                value={routeOrigin}
                onChange={(e) => setRouteOrigin(e.target.value)}
                aria-label="Select Departure Origin"
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="Lahore">Lahore (M-2 / M-3)</option>
                <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi (M-1 / M-2)</option>
                <option value="Karachi">Karachi (M-9)</option>
                <option value="Multan">Multan (M-4 / M-5)</option>
                <option value="Faisalabad">Faisalabad (M-3 / M-4)</option>
                <option value="Sukkur">Sukkur (M-5 / N-5)</option>
                <option value="Peshawar">Peshawar (M-1)</option>
              </select>
            </div>

            <div className="flex items-center justify-center text-slate-400 font-bold px-1 text-xs">
              &rarr;
            </div>

            <div className="flex-1">
              <select
                value={routeDest}
                onChange={(e) => setRouteDest(e.target.value)}
                aria-label="Select Arrival Destination"
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi (M-2)</option>
                <option value="Murree">Murree (+1,560m Hill Climb)</option>
                <option value="Lahore">Lahore (M-2 / M-3)</option>
                <option value="Hyderabad">Hyderabad (M-9)</option>
                <option value="Multan">Multan (M-3 / M-4)</option>
                <option value="Peshawar">Peshawar (M-1)</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
            >
              <span>Calculate Feasibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Quick Filter Chips Strip */}
      <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
          Quick Filters:
        </span>

        <Link
          href="/categories/pure-electric"
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-colors"
        >
          Pure Electric (BEV)
        </Link>

        <Link
          href="/categories/plug-in-hybrid"
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-colors"
        >
          Plug-in Hybrid (PHEV)
        </Link>

        <Link
          href="/categories/long-range"
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-colors"
        >
          Long-Range (400+ km)
        </Link>

        <Link
          href="/categories/7-seater"
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-colors"
        >
          7-Seater Family
        </Link>

        <Link
          href="/categories/under-50-lacs"
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-colors"
        >
          Under 50 Lacs
        </Link>

        <Link
          href="/categories/under-1-crore"
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-colors"
        >
          Under 1 Crore
        </Link>

        <Link
          href="/car-match"
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-cyan-300 font-extrabold transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Car Match Quiz</span>
        </Link>
      </div>
    </div>
  );
}
