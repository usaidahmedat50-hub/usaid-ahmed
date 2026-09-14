'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChargingStation } from '@/lib/types';
import { StationDrawer } from '@/components/stations/StationDrawer';
import { StationSubmitModal } from '@/components/stations/StationSubmitModal';
import {
  MapPin,
  Plus,
  Zap,
  Search,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  Phone,
  Layers,
  Map,
  List,
  X,
} from 'lucide-react';

// Dynamic import for Leaflet map to prevent SSR window reference error
const StationMap = dynamic(
  () => import('@/components/stations/StationMap').then((mod) => mod.StationMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] bg-slate-100 flex flex-col items-center justify-center text-slate-400">
        <MapPin className="w-8 h-8 mb-2 text-blue-600 animate-bounce" />
        <span className="text-xs font-semibold text-slate-600">Loading Pakistan Charging Network Map...</span>
      </div>
    ),
  }
);

interface ChargingStationDirectoryClientProps {
  initialStations: ChargingStation[];
}

export function ChargingStationDirectoryClient({
  initialStations,
}: ChargingStationDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpeed, setSelectedSpeed] = useState<'all' | 'ultra' | 'fast' | 'slow'>('all');
  const [selectedPlug, setSelectedPlug] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'verified' | 'public' | 'home_hosts' | 'coming_soon'>('all');
  const [focusedStation, setFocusedStation] = useState<ChargingStation | null>(null);
  const [drawerStation, setDrawerStation] = useState<ChargingStation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isCardCollapsedOnMobile, setIsCardCollapsedOnMobile] = useState<boolean>(false);

  // Filter stations based on search query, speed, connector plug, and verification/operating status
  const filteredStations = useMemo(() => {
    return initialStations.filter((s) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesCity = s.city.toLowerCase().includes(query);
        const matchesOp = s.network_operator?.toLowerCase().includes(query) ?? false;
        const matchesAddr = s.address?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesCity && !matchesOp && !matchesAddr) return false;
      }

      // 2. Speed filter
      if (selectedSpeed === 'ultra' && s.power_kw < 120) return false;
      if (selectedSpeed === 'fast' && (s.power_kw < 30 || s.power_kw >= 120)) return false;
      if (selectedSpeed === 'slow' && s.power_kw >= 30) return false;

      // 3. Plug filter
      if (selectedPlug !== 'all') {
        const hasPlug = s.connector_types.some((c) => {
          if (selectedPlug === 'CCS2') return c.includes('CCS');
          if (selectedPlug === 'GB/T') return c.includes('GB/T');
          if (selectedPlug === 'Type 2') return c.includes('Type 2');
          return false;
        });
        if (!hasPlug) return false;
      }

      // 4. Status filter
      if (selectedStatus === 'verified' && s.verification_status !== 'verified') return false;
      if (selectedStatus === 'public' && s.is_home_host) return false;
      if (selectedStatus === 'home_hosts' && !s.is_home_host) return false;
      if (selectedStatus === 'coming_soon' && s.operating_status !== 'coming_soon') return false;

      return true;
    });
  }, [initialStations, searchQuery, selectedSpeed, selectedPlug, selectedStatus]);

  const handleSelectStation = (st: ChargingStation) => {
    setFocusedStation(st);
  };

  const handleOpenDrawer = (st: ChargingStation) => {
    setDrawerStation(st);
    setFocusedStation(st);
    setIsDrawerOpen(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      {/* 1. Leaflet Interactive Map Backdrop (100% width and 100% height) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <StationMap
          stations={filteredStations}
          focusedStation={focusedStation}
          onSelectStation={handleSelectStation}
          onOpenDrawer={handleOpenDrawer}
          className="w-full h-full rounded-none border-none"
        />
      </div>

      {/* 2. Floating Control Console Card (Anchored Top-Left) */}
      <div
        className={`absolute top-4 left-4 z-[1000] w-[390px] max-w-[94vw] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col gap-3 transition-all duration-300 ${
          isCardCollapsedOnMobile
            ? 'max-h-[82px] overflow-hidden sm:max-h-[calc(100vh-88px)]'
            : 'max-h-[calc(100vh-88px)]'
        }`}
      >
        {/* Header Badges & Actions */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white tracking-wider uppercase">
              CHARGING MAP
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              {filteredStations.length} Stations
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Get Listed</span>
            </button>

            {/* Mobile Expand / Collapse Toggle */}
            <button
              type="button"
              onClick={() => setIsCardCollapsedOnMobile(!isCardCollapsedOnMobile)}
              className="sm:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              aria-label="Toggle drawer"
            >
              {isCardCollapsedOnMobile ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Search Input: Rounded Pill */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search station name, city, or highway..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row: Speed & Plug Dropdowns */}
        <div className="grid grid-cols-2 gap-2 shrink-0 text-xs">
          {/* Speed Dropdown */}
          <select
            value={selectedSpeed}
            onChange={(e) => setSelectedSpeed(e.target.value as 'all' | 'ultra' | 'fast' | 'slow')}
            aria-label="Filter by Charging Speed"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:border-blue-600 focus:outline-none cursor-pointer text-[11px]"
          >
            <option value="all">All Speeds</option>
            <option value="ultra">Ultra-Fast (120–240 kW)</option>
            <option value="fast">Fast DC (30–90 kW)</option>
            <option value="slow">AC Slow (3.3–22 kW)</option>
          </select>

          {/* Plug Dropdown */}
          <select
            value={selectedPlug}
            onChange={(e) => setSelectedPlug(e.target.value)}
            aria-label="Filter by Connector Standard"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:border-blue-600 focus:outline-none cursor-pointer text-[11px]"
          >
            <option value="all">All Plugs</option>
            <option value="CCS2">CCS2 (European / PK)</option>
            <option value="GB/T">GB/T (Chinese Standard)</option>
            <option value="Type 2">Type 2 (AC Destination)</option>
          </select>
        </div>

        {/* Status Toggle Badges */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 text-[10px]">
          <button
            type="button"
            onClick={() => setSelectedStatus(selectedStatus === 'verified' ? 'all' : 'verified')}
            className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
              selectedStatus === 'verified'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Verified
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus(selectedStatus === 'public' ? 'all' : 'public')}
            className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
              selectedStatus === 'public'
                ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Public
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus(selectedStatus === 'home_hosts' ? 'all' : 'home_hosts')}
            className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
              selectedStatus === 'home_hosts'
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Home Hosts
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus(selectedStatus === 'coming_soon' ? 'all' : 'coming_soon')}
            className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
              selectedStatus === 'coming_soon'
                ? 'bg-zinc-800 text-white border-zinc-700 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Coming Soon
          </button>

          {(selectedSpeed !== 'all' || selectedPlug !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedSpeed('all');
                setSelectedPlug('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="text-[10px] text-blue-600 hover:underline font-bold ml-auto"
            >
              Reset
            </button>
          )}
        </div>

        {/* Scrollable Station Drawer (inside the floating card) */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar min-h-0">
          {filteredStations.length > 0 ? (
            filteredStations.map((st) => {
              const isSelected = focusedStation?.id === st.id;
              const isUltra = st.power_kw >= 180;
              const isFast = st.power_kw >= 100 && st.power_kw < 180;
              const isStandard = st.power_kw >= 30 && st.power_kw < 100;

              const powerBadgeBg = isUltra
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : isFast
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isStandard
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

              const isOutOfService = st.operating_status === 'out_of_service';
              const isComingSoon = st.operating_status === 'coming_soon';

              const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${st.latitude},${st.longitude}`;

              return (
                <div
                  key={st.id}
                  onClick={() => handleSelectStation(st)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-400 shadow-xs'
                      : 'bg-slate-50/60 hover:bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Status & Power Header */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {isOutOfService ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                          Out of Service
                        </span>
                      ) : isComingSoon ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                          Coming Soon
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse inline-block" />
                          Operational
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {st.network_operator || 'Independent'}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border tabular-nums ${powerBadgeBg}`}>
                      {st.power_kw} kW {st.power_kw >= 30 ? 'DC' : 'AC'}
                    </span>
                  </div>

                  {/* Station Name & City */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">
                      {st.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{st.city} • {st.connector_types.join(', ')}</span>
                    </p>
                  </div>

                  {/* Actions: Get Directions & Details */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Get Directions</span>
                    </a>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDrawer(st);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200/80">
              <p className="text-xs font-bold text-slate-800">No stations match filters</p>
              <p className="text-[11px] text-slate-500">Try clearing search terms or selecting &quot;All Speeds&quot;.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSpeed('all');
                  setSelectedPlug('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-blue-600"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Slide-out Station Details Drawer */}
      <StationDrawer
        station={drawerStation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* 4. Community Submission Modal */}
      <StationSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}
