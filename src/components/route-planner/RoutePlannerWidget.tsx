'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { VehicleWithDetails, ChargingStation } from '@/lib/types';
import { VERIFIED_PAKISTAN_CHARGING_STATIONS } from '@/lib/data/stations';
import {
  calculateHighwayRoute,
  CORRIDOR_CITIES,
  HighwayNode,
  RouteCheckpoint,
} from '@/lib/route-engine';
import {
  Navigation,
  Zap,
  BatteryCharging,
  ArrowUpDown,
  X,
  ExternalLink,
  Cloud,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sliders,
  Sparkles,
  Info,
  Clock,
  CircleDollarSign,
  TrendingDown,
} from 'lucide-react';

// Dynamically import Leaflet Corridor Map to prevent SSR build errors
const RoutePlannerMap = dynamic(
  () => import('@/components/route-planner/RoutePlannerMap').then((mod) => mod.RoutePlannerMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
        <Navigation className="w-8 h-8 mb-2 text-blue-600 animate-pulse" />
        <span className="text-xs font-bold text-slate-600">Loading Pakistan Highway Map...</span>
      </div>
    ),
  }
);

interface RoutePlannerWidgetProps {
  vehicles?: VehicleWithDetails[];
}

interface PreloadedNEV {
  id: string;
  name: string;
  batteryKwh: number;
  wltpRangeKm: number;
  maxDcKw: number;
  efficiencyWhPerKm: number;
  chargingPort: string;
  isPhev?: boolean;
}

const PRELOADED_NEVS: PreloadedNEV[] = [
  {
    id: 'byd-atto-3',
    name: 'BYD Atto 3 (49.92 kWh · 410 km)',
    batteryKwh: 49.92,
    wltpRangeKm: 410,
    maxDcKw: 88,
    efficiencyWhPerKm: 155,
    chargingPort: 'CCS2',
  },
  {
    id: 'byd-seal',
    name: 'BYD Seal Dynamic/AWD (61.4 - 82.56 kWh · 520 - 570 km)',
    batteryKwh: 82.56,
    wltpRangeKm: 570,
    maxDcKw: 150,
    efficiencyWhPerKm: 160,
    chargingPort: 'CCS2',
  },
  {
    id: 'deepal-s07',
    name: 'Deepal S07 / L07 (66.8 kWh · 485 - 530 km)',
    batteryKwh: 66.8,
    wltpRangeKm: 485,
    maxDcKw: 92,
    efficiencyWhPerKm: 165,
    chargingPort: 'CCS2',
  },
  {
    id: 'mg4-ev',
    name: 'MG4 EV (51 - 64 kWh · 350 - 435 km)',
    batteryKwh: 51.0,
    wltpRangeKm: 350,
    maxDcKw: 117,
    efficiencyWhPerKm: 160,
    chargingPort: 'CCS2',
  },
  {
    id: 'chery-tiggo-7-pro-phev',
    name: 'Chery Tiggo 7 PHEV (18.3 kWh · 90 km EV / 1,200 km Hybrid)',
    batteryKwh: 18.3,
    wltpRangeKm: 90,
    maxDcKw: 30,
    efficiencyWhPerKm: 170,
    chargingPort: 'CCS2',
    isPhev: true,
  },
  {
    id: 'honri-ve-2',
    name: 'Honri VE 2.0 (18.5 kWh · 200 km)',
    batteryKwh: 18.5,
    wltpRangeKm: 200,
    maxDcKw: 20,
    efficiencyWhPerKm: 115,
    chargingPort: 'GB/T',
  },
  {
    id: 'dongfeng-box',
    name: 'Dongfeng Box (31.4 - 42.3 kWh · 330 - 430 km)',
    batteryKwh: 42.3,
    wltpRangeKm: 430,
    maxDcKw: 50,
    efficiencyWhPerKm: 135,
    chargingPort: 'CCS2',
  },
  {
    id: 'custom-ev',
    name: 'Custom EV (Input custom battery kWh & efficiency Wh/km)',
    batteryKwh: 60.0,
    wltpRangeKm: 400,
    maxDcKw: 100,
    efficiencyWhPerKm: 160,
    chargingPort: 'CCS2 / GB/T',
  },
];

// 14 verified Pakistani highway cities per prompt requirements
const PAKISTAN_CITIES = [
  'Karachi',
  'Hyderabad',
  'Sukkur',
  'Rahim Yar Khan',
  'Bahawalpur',
  'Multan',
  'Faisalabad',
  'Lahore',
  'Bhera',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Abbottabad',
  'Murree',
];

export function RoutePlannerWidget({ vehicles = [] }: RoutePlannerWidgetProps) {
  // Inputs
  const [fromCity, setFromCity] = useState<string>('Lahore');
  const [toCity, setToCity] = useState<string>('Islamabad');
  const [selectedNevId, setSelectedNevId] = useState<string>('byd-atto-3');

  // Custom EV state
  const [customBatteryKwh, setCustomBatteryKwh] = useState<number>(60);
  const [customWhPerKm, setCustomWhPerKm] = useState<number>(160);

  // Weather & AC temperature widget state (default 34°C per screenshot)
  const [ambientTempC, setAmbientTempC] = useState<number>(34);
  const [isTempOpen, setIsTempOpen] = useState<boolean>(false);

  // Advanced toggles
  const [showWaypoints, setShowWaypoints] = useState<boolean>(true);

  // Active NEV config
  const activeNev = useMemo(() => {
    return PRELOADED_NEVS.find((v) => v.id === selectedNevId) || PRELOADED_NEVS[0];
  }, [selectedNevId]);

  const effectiveBatteryKwh = selectedNevId === 'custom-ev' ? customBatteryKwh : activeNev.batteryKwh;
  const effectiveWltpRange = activeNev.wltpRangeKm;
  const effectiveMaxDcKw = activeNev.maxDcKw;

  // Swap Origin and Destination
  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  // Clear To Input
  const handleClearTo = () => {
    setToCity('');
  };

  // Map City Names to Highway Nodes
  const originNode = useMemo(() => {
    if (!fromCity) return null;
    return (
      CORRIDOR_CITIES.find(
        (c) => c.name.toLowerCase() === fromCity.toLowerCase() || c.id === fromCity.toLowerCase()
      ) || CORRIDOR_CITIES.find((c) => c.id === 'lhr')!
    );
  }, [fromCity]);

  const destNode = useMemo(() => {
    if (!toCity) return null;
    return (
      CORRIDOR_CITIES.find(
        (c) => c.name.toLowerCase() === toCity.toLowerCase() || c.id === toCity.toLowerCase()
      ) || null
    );
  }, [toCity]);

  // Route Calculation Result
  const routeResult = useMemo(() => {
    if (!originNode || !destNode || originNode.id === destNode.id) {
      return null;
    }

    return calculateHighwayRoute({
      originId: originNode.id,
      destId: destNode.id,
      batteryKwh: effectiveBatteryKwh,
      wltpRangeKm: effectiveWltpRange,
      maxDcChargingKw: effectiveMaxDcKw,
      initialSoc: 95,
      bufferSoc: 15,
      cruisingSpeedKmh: 110,
      ambientTempC: ambientTempC,
    });
  }, [originNode, destNode, effectiveBatteryKwh, effectiveWltpRange, effectiveMaxDcKw, ambientTempC]);

  // Coordinates for Map
  const originCoords: [number, number] = originNode
    ? [originNode.latitude, originNode.longitude]
    : [31.5204, 74.3587];

  const destCoords: [number, number] = destNode
    ? [destNode.latitude, destNode.longitude]
    : [33.6844, 73.0479];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      {/* 1. Leaflet Interactive Map Backdrop (100% width and 100% height) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <RoutePlannerMap
          originCoords={originCoords}
          originName={fromCity || 'Origin'}
          destCoords={destCoords}
          destName={toCity || 'Destination'}
          station={routeResult?.chargingStops?.[0]}
          stations={routeResult?.chargingStops || []}
          allNetworkStations={VERIFIED_PAKISTAN_CHARGING_STATIONS}
          isNonStop={routeResult?.isNonStop || false}
          distanceKm={routeResult?.totalDistanceKm || 375}
          motorwayName={routeResult ? `${fromCity} ↔ ${toCity}` : 'Pakistan Motorway Network'}
          motorwayPolyline={routeResult?.motorwayPolyline}
        />
      </div>

      {/* 2. Floating Console Card (Left Anchor) */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-5 z-[1000] w-[380px] max-w-[92vw] max-h-[calc(100vh-88px)] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col gap-3.5 overflow-y-auto custom-scrollbar">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              ROUTE PLANNER
            </span>
            <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-200">
              INTERCITY
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Corridor</span>
          </div>
        </div>

        {/* Inputs Container */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex flex-col gap-2 relative shadow-2xs">
          {/* From Input */}
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-100" />
            <div className="flex-1 min-w-0">
              <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-tight">
                From
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Swap Button (Positioned cleanly between fields) */}
          <div className="absolute right-4 top-[48px] -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Invert Route"
              className="w-7 h-7 rounded-full bg-white border border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 shadow-xs flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* To Input */}
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 ring-4 ring-blue-100" />
            <div className="flex-1 min-w-0">
              <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-tight">
                To
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="">Select Destination City...</option>
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {toCity && (
              <button
                type="button"
                onClick={handleClearTo}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Clear destination"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Select Your NEV Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block px-1">
            Select Your NEV
          </label>
          <div className="relative">
            <select
              value={selectedNevId}
              onChange={(e) => setSelectedNevId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 font-extrabold text-xs text-slate-900 focus:border-blue-500 focus:outline-none cursor-pointer appearance-none shadow-2xs pr-8"
            >
              {PRELOADED_NEVS.map((nev) => (
                <option key={nev.id} value={nev.id}>
                  {nev.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Custom EV Input Expansion */}
          {selectedNevId === 'custom-ev' && (
            <div className="grid grid-cols-2 gap-2 pt-1.5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Battery (kWh)</span>
                <input
                  type="number"
                  value={customBatteryKwh}
                  onChange={(e) => setCustomBatteryKwh(parseFloat(e.target.value) || 50)}
                  className="w-full bg-transparent font-black text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Consumption Wh/km</span>
                <input
                  type="number"
                  value={customWhPerKm}
                  onChange={(e) => setCustomWhPerKm(parseFloat(e.target.value) || 160)}
                  className="w-full bg-transparent font-black text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}
          {/* Auto-filled NEV Telemetry Specs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] font-bold text-slate-600">
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
              🔋 Usable: {(effectiveBatteryKwh * 0.85).toFixed(1)} kWh
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
              ⚡ {activeNev.efficiencyWhPerKm} Wh/km
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 font-extrabold">
              🔌 {activeNev.chargingPort}
            </span>
          </div>
        </div>

        {/* Ambient Telemetry & AC Degradation Bar */}
        <div className="border border-slate-200/80 rounded-2xl p-2.5 bg-slate-50/80 flex items-center justify-between text-xs gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-500 block truncate">
              {routeResult
                ? `Corridor: ${routeResult.effectiveHighwayRangeKm} km highway range`
                : 'Plan Your Trip · Pick a start and destination'}
            </span>
          </div>

          {/* Ambient Temperature Widget Button */}
          <button
            type="button"
            onClick={() => setIsTempOpen(!isTempOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs shrink-0 shadow-2xs hover:border-blue-400 transition-colors cursor-pointer"
            title="Adjust Ambient Temperature & AC Load"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-500" />
            <span className="tabular-nums">☁️ {ambientTempC}°C</span>
          </button>
        </div>

        {/* Temperature Adjustment Slider Dropdown */}
        {isTempOpen && (
          <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-2 text-xs shadow-md animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Ambient Highway Temperature
              </span>
              <span className="font-extrabold text-blue-600">{ambientTempC}°C</span>
            </div>
            <input
              type="range"
              min={20}
              max={48}
              step={1}
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>20°C (Mild)</span>
              <span className="text-amber-600 font-bold">
                {ambientTempC >= 32 ? `-20% AC Penalty` : `Minimal AC`}
              </span>
              <span>48°C (Extreme)</span>
            </div>
          </div>
        )}

        {/* 3. Interactive Route Results & Waypoint Cards */}
        {routeResult ? (
          <div className="space-y-3 pt-1 border-t border-slate-100">
            {/* Summary Metrics Bar */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-2.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-600 block">
                  Total Road Distance
                </span>
                <div className="text-base font-black text-blue-900 tabular-nums">
                  {routeResult.totalDistanceKm} km
                </div>
                <span className="text-[10px] text-blue-700 font-medium">
                  ~{Math.floor(routeResult.totalDrivingMins / 60)}h {routeResult.totalDrivingMins % 60}m driving
                </span>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-2.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  Charging Stops
                </span>
                <div className="text-base font-black text-emerald-900 tabular-nums">
                  {routeResult.isNonStop ? 'Non-Stop' : `${routeResult.chargingStops.length} Stop`}
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">
                  {routeResult.isNonStop
                    ? 'No recharge needed'
                    : `~${routeResult.totalChargingMins}m (Rs. ${routeResult.totalCostPkr.toLocaleString()})`}
                </span>
              </div>
            </div>

            {/* Feasibility Verdict Pill */}
            <div
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                routeResult.verdictTone === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="text-[11px] leading-snug">{routeResult.verdict}</span>
            </div>

            {/* Waypoint Itinerary Accordion Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Corridor Itinerary
                </span>
                <button
                  type="button"
                  onClick={() => setShowWaypoints(!showWaypoints)}
                  className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{showWaypoints ? 'Hide Details' : 'View Stops'}</span>
                  {showWaypoints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Waypoint Steps */}
              {showWaypoints && (
                <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                  {/* Leg 1 */}
                  <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800">
                        Leg 1: {fromCity} &rarr; {routeResult.isNonStop ? toCity : routeResult.chargingStops[0]?.city || 'Hub'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                        {routeResult.isNonStop ? routeResult.totalDistanceKm : 215} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Depart: 95% Battery</span>
                      <span className="text-blue-600 font-bold">
                        Arrive: ~{routeResult.isNonStop ? routeResult.checkpoints[routeResult.checkpoints.length - 1].endSoc : '22'}% SoC
                      </span>
                    </div>
                  </div>

                  {/* Charging Stop (if not nonstop) */}
                  {!routeResult.isNonStop && routeResult.chargingStops[0] && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-extrabold text-emerald-900">
                          <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{routeResult.chargingStops[0].name}</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-700 uppercase shrink-0">
                          {routeResult.chargingStops[0].power_kw} kW
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-emerald-700">
                        <span>Charge ~{routeResult.totalChargingMins}m to 80%</span>
                        <span className="font-extrabold">Rs. ~{routeResult.totalCostPkr.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Leg 2 (if not nonstop) */}
                  {!routeResult.isNonStop && (
                    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-800">
                          Leg 2: {routeResult.chargingStops[0]?.city || 'Hub'} &rarr; {toCity}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                          {Math.max(10, routeResult.totalDistanceKm - 215)} km
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Depart: 80% Battery</span>
                        <span className="text-emerald-700 font-bold">
                          Arrive: ~{routeResult.checkpoints[routeResult.checkpoints.length - 1].endSoc}% SoC
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Direct Button: Open in Google Maps Navigation */}
            <a
              href={routeResult.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer text-center"
            >
              <span>Open in Google Maps Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          /* Empty / Prompt State */
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <p className="text-xs font-extrabold text-slate-700">Pick a start and destination</p>
            <p className="text-[11px] text-slate-400">
              Select any cities to calculate road distance, battery consumption, and corridor charging stops.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
