'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VehicleSpec } from '@/types/vehicle';
import { ChargingStation } from '@/types/station';
import RouteMap from './RouteMap';
import {
  PRESET_PAKISTAN_CITIES,
  searchPakistanLocations,
  fetchOsrmDrivingRoute,
  LocationSearchResult,
} from '@/lib/utils/route-osrm';
import { minDistanceToPolylineKm, haversineDistanceKm } from '@/lib/utils/geo';
import {
  Navigation,
  Zap,
  BatteryCharging,
  ArrowRight,
  DollarSign,
  Clock,
  ShieldCheck,
  Search,
  Sun,
  Sliders,
  MapPin,
  Check,
  RotateCcw,
} from 'lucide-react';

interface RoutePlannerProps {
  vehicles: VehicleSpec[];
  stations: ChargingStation[];
}

interface CalculatedStop {
  station: ChargingStation;
  distanceFromOriginKm: number;
  arrivalBatteryPct: number;
  chargeTimeMins: number;
  topUpKwh: number;
  costPkr: number;
}

export default function RoutePlanner({ vehicles, stations }: RoutePlannerProps) {
  // Preset Defaults: Lahore to Islamabad
  const [origin, setOrigin] = useState<LocationSearchResult>(PRESET_PAKISTAN_CITIES[0]); // Lahore
  const [destination, setDestination] = useState<LocationSearchResult>(PRESET_PAKISTAN_CITIES[1]); // Islamabad

  // Search Inputs
  const [originSearch, setOriginSearch] = useState<string>(PRESET_PAKISTAN_CITIES[0].displayName);
  const [destSearch, setDestSearch] = useState<string>(PRESET_PAKISTAN_CITIES[1].displayName);
  const [originSuggestions, setOriginSuggestions] = useState<LocationSearchResult[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSearchResult[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState<boolean>(false);
  const [showDestDropdown, setShowDestDropdown] = useState<boolean>(false);

  // Vehicle & SoC State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || 'byd-atto-3');
  const [startingBatteryPct, setStartingBatteryPct] = useState<number>(100);
  const [minReservePct, setMinReservePct] = useState<number>(15);
  const [isAcSummerMode, setIsAcSummerMode] = useState<boolean>(true); // Default AC mode on in Pakistan

  // OSRM Route Data State
  const [polyline, setPolyline] = useState<[number, number][]>([]);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number>(380);
  const [drivingDurationMins, setDrivingDurationMins] = useState<number>(270);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Debounced Nominatim Search for Origin
  useEffect(() => {
    if (!originSearch || originSearch === origin.displayName) {
      setOriginSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchPakistanLocations(originSearch);
      setOriginSuggestions(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [originSearch, origin.displayName]);

  // Debounced Nominatim Search for Destination
  useEffect(() => {
    if (!destSearch || destSearch === destination.displayName) {
      setDestSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchPakistanLocations(destSearch);
      setDestSuggestions(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [destSearch, destination.displayName]);

  // Fetch OSRM Road Route whenever Origin or Destination changes
  useEffect(() => {
    let isMounted = true;
    async function loadRoute() {
      setIsLoadingRoute(true);
      const routeData = await fetchOsrmDrivingRoute(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng
      );
      if (isMounted) {
        setPolyline(routeData.polyline);
        setTotalDistanceKm(routeData.distanceKm);
        setDrivingDurationMins(routeData.durationMins);
        setIsLoadingRoute(false);
      }
    }
    loadRoute();
    return () => {
      isMounted = false;
    };
  }, [origin, destination]);

  // --- Dynamic SoC & Corridor Charging Hub Simulation Engine ---

  // Effective consumption considering AC/Summer penalty (+15%)
  const effectiveConsumption = isAcSummerMode
    ? selectedVehicle.consumptionKwh100km * 1.15
    : selectedVehicle.consumptionKwh100km;

  // Maximum range at current battery % & consumption rate
  const usableInitialKwh = (startingBatteryPct / 100) * selectedVehicle.batteryKwh;
  const maxInitialRangeKm = (usableInitialKwh / effectiveConsumption) * 100;

  // Reserve capacity in kWh
  const minReserveKwh = (minReservePct / 100) * selectedVehicle.batteryKwh;

  // 15 km Corridor Filtering: Find stations near the road polyline
  const corridorStationsWithPos = stations
    .map((st) => {
      const { minDistanceKm, segmentIndex } = minDistanceToPolylineKm(
        st.lat,
        st.lng,
        polyline
      );
      // Estimate distance from origin along polyline
      const ratio = polyline.length > 1 ? segmentIndex / (polyline.length - 1) : 0;
      const distanceFromOriginKm = Math.round(ratio * totalDistanceKm);
      return {
        station: st,
        minDistanceKm,
        distanceFromOriginKm,
      };
    })
    .filter(
      (item) =>
        item.minDistanceKm <= 15 &&
        item.distanceFromOriginKm > 10 &&
        item.distanceFromOriginKm < totalDistanceKm - 10
    )
    .sort((a, b) => a.distanceFromOriginKm - b.distanceFromOriginKm);

  // Simulation logic to insert charging stops
  const calculatedStops: CalculatedStop[] = [];
  let currentPosKm = 0;
  let currentBatteryKwh = usableInitialKwh;

  // Check if direct trip is possible without dropping below reserve
  const energyNeededFullTrip = (totalDistanceKm / 100) * effectiveConsumption;
  const isDirectPossible = usableInitialKwh - energyNeededFullTrip >= minReserveKwh;

  if (!isDirectPossible && corridorStationsWithPos.length > 0) {
    // Select optimal station along the route
    const reachableStations = corridorStationsWithPos.filter((item) => {
      const distToStation = item.distanceFromOriginKm - currentPosKm;
      const energyUsed = (distToStation / 100) * effectiveConsumption;
      return currentBatteryKwh - energyUsed >= minReserveKwh;
    });

    const chosen =
      reachableStations.length > 0
        ? reachableStations[reachableStations.length - 1] // Best furthest reachable station
        : corridorStationsWithPos[0]; // Fallback to first corridor station

    const distToChosen = chosen.distanceFromOriginKm - currentPosKm;
    const energyUsedToChosen = (distToChosen / 100) * effectiveConsumption;
    const arrivalKwh = Math.max(0, currentBatteryKwh - energyUsedToChosen);
    const arrivalPct = Math.round((arrivalKwh / selectedVehicle.batteryKwh) * 100);

    // Target 80% charge at station
    const targetPct = 80;
    const targetKwh = (targetPct / 100) * selectedVehicle.batteryKwh;
    const topUpKwh = Math.max(0, targetKwh - arrivalKwh);

    const chargePowerKw = Math.min(
      chosen.station.maxPowerKw,
      selectedVehicle.maxDcChargeKw
    );
    const chargeTimeMins = topUpKwh > 0 ? Math.ceil((topUpKwh / chargePowerKw) * 60) : 0;
    const costPkr = Math.round(topUpKwh * chosen.station.pricePerKwh);

    calculatedStops.push({
      station: chosen.station,
      distanceFromOriginKm: chosen.distanceFromOriginKm,
      arrivalBatteryPct: arrivalPct,
      chargeTimeMins,
      topUpKwh,
      costPkr,
    });

    currentPosKm = chosen.distanceFromOriginKm;
    currentBatteryKwh = targetKwh;
  }

  // Calculate final arrival battery % at destination
  const remainingDist = totalDistanceKm - currentPosKm;
  const remainingEnergyNeeded = (remainingDist / 100) * effectiveConsumption;
  const finalKwh = currentBatteryKwh - remainingEnergyNeeded;
  const finalArrivalBatteryPct = Math.max(
    0,
    Math.round((finalKwh / selectedVehicle.batteryKwh) * 100)
  );

  const totalChargingTimeMins = calculatedStops.reduce((sum, s) => sum + s.chargeTimeMins, 0);
  const totalChargingCostPkr = calculatedStops.reduce((sum, s) => sum + s.costPkr, 0);
  const totalTripKwhNeeded = (totalDistanceKm / 100) * effectiveConsumption;

  return (
    <div className="w-full space-y-8">
      {/* Route Configuration Form Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1.5 rounded-full">
            <Navigation className="w-4 h-4 text-blue-600 fill-blue-600" />
            Pakistan EV Route Engine (OSRM & Nominatim)
          </div>

          {/* Quick Preset City Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Quick Hubs:
            </span>
            {PRESET_PAKISTAN_CITIES.slice(0, 6).map((city) => (
              <button
                key={city.displayName}
                onClick={() => {
                  setDestination(city);
                  setDestSearch(city.displayName);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 font-bold text-[11px] transition-all shadow-sm"
              >
                {city.displayName.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Origin Search */}
          <div className="space-y-2 relative">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              1. Origin City / Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={originSearch}
                onChange={(e) => {
                  setOriginSearch(e.target.value);
                  setShowOriginDropdown(true);
                }}
                onFocus={() => setShowOriginDropdown(true)}
                placeholder="Search Origin e.g. Lahore..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Dropdown Suggestions */}
            {showOriginDropdown && originSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                {originSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setOrigin(item);
                      setOriginSearch(item.displayName);
                      setShowOriginDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {item.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination Search */}
          <div className="space-y-2 relative">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              2. Destination City / Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={destSearch}
                onChange={(e) => {
                  setDestSearch(e.target.value);
                  setShowDestDropdown(true);
                }}
                onFocus={() => setShowDestDropdown(true)}
                placeholder="Search Destination e.g. Islamabad..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Dropdown Suggestions */}
            {showDestDropdown && destSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                {destSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDestination(item);
                      setDestSearch(item.displayName);
                      setShowDestDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {item.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* EV Model Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              3. Select EV Model
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.batteryKwh} kWh)
                </option>
              ))}
            </select>
          </div>

          {/* AC / Summer Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              4. Summer AC Climate Penalty
            </label>
            <button
              onClick={() => setIsAcSummerMode(!isAcSummerMode)}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-extrabold flex items-center justify-between transition-all shadow-sm ${
                isAcSummerMode
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span>{isAcSummerMode ? '☀️ Summer AC Active (-15%)' : '❄️ Mild Weather (Standard)'}</span>
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded">
                {isAcSummerMode ? 'Penalty On' : 'Off'}
              </span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          {/* Starting Battery Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">
                Starting Battery %
              </span>
              <span className="font-extrabold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                {startingBatteryPct}% ({Math.round(usableInitialKwh)} kWh)
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={startingBatteryPct}
              onChange={(e) => setStartingBatteryPct(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Minimum Reserve Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">
                Minimum Reserve Buffer %
              </span>
              <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {minReservePct}% Safety Buffer
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              value={minReservePct}
              onChange={(e) => setMinReservePct(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* KPI Journey Summary Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Road Distance</span>
          <div className="text-2xl font-black text-slate-900">{totalDistanceKm} km</div>
          <span className="text-xs font-medium text-slate-600">OSRM Road Geometry</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Est. Driving Time</span>
          <div className="text-2xl font-black text-slate-900">
            {Math.floor(drivingDurationMins / 60)}h {drivingDurationMins % 60}m
          </div>
          <span className="text-xs font-medium text-slate-600">Excludes charging stops</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fast Charging Stop</span>
          <div className="text-2xl font-black text-emerald-600">
            {calculatedStops.length > 0 ? `${totalChargingTimeMins} mins` : 'Direct Trip'}
          </div>
          <span className="text-xs font-medium text-slate-600">
            {calculatedStops.length > 0 ? `${calculatedStops.length} stop required` : 'No stop needed'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Energy Required</span>
          <div className="text-2xl font-black text-blue-600">{Math.round(totalTripKwhNeeded)} kWh</div>
          <span className="text-xs font-medium text-slate-600">
            {effectiveConsumption.toFixed(1)} kWh/100km
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated PKR Cost</span>
          <div className="text-2xl font-black text-slate-900">
            PKR {totalChargingCostPkr.toLocaleString()}
          </div>
          <span className="text-xs font-medium text-slate-600">Highway charging bill</span>
        </div>
      </div>

      {/* Interactive Route Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Interactive Road Polyline Map
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {origin.displayName.split(',')[0]} &rarr; {destination.displayName.split(',')[0]}
          </span>
        </div>

        <RouteMap
          polyline={polyline}
          origin={origin}
          destination={destination}
          chargingStops={calculatedStops}
        />
      </div>

      {/* Turn-by-Turn Journey Timeline */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <BatteryCharging className="w-5 h-5 text-blue-600" />
          Turn-by-Turn Journey & SoC Timeline
        </h3>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6">
          {/* Step 1: Departure */}
          <div className="relative">
            <div className="absolute -left-[33px] top-0 bg-emerald-600 text-white rounded-full p-1.5 border-4 border-white shadow-sm">
              <Navigation className="w-4 h-4 fill-white stroke-none" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                  Step 1: Departure — {origin.displayName}
                </span>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  0 km
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                Start Driving at {startingBatteryPct}% Battery
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.batteryKwh} kWh) with {Math.round(maxInitialRangeKm)} km of estimated initial range at {effectiveConsumption.toFixed(1)} kWh/100km efficiency.
              </p>
            </div>
          </div>

          {/* Step 2: Charging Stops */}
          {calculatedStops.length > 0 ? (
            calculatedStops.map((stop, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[33px] top-0 bg-amber-500 text-white rounded-full p-1.5 border-4 border-white shadow-sm animate-pulse">
                  <Zap className="w-4 h-4 fill-white stroke-none" />
                </div>
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                      Step 2: Fast Charging Stop #{idx + 1} — {stop.station.name}
                    </span>
                    <span className="text-xs font-bold bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full">
                      {stop.distanceFromOriginKm} km mark
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-slate-900">
                      Arrive at Station with {stop.arrivalBatteryPct}% Battery Remaining
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Station network <span className="font-bold text-slate-900">{stop.station.network}</span>. Plug into {stop.station.maxPowerKw} kW DC Fast Charger.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-amber-200 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Charging Time: {stop.chargeTimeMins} Mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Top-up: +{Math.round(stop.topUpKwh)} kWh (to 80%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-slate-700" />
                      <span>Station Cost: PKR {stop.costPkr}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="relative">
              <div className="absolute -left-[33px] top-0 bg-blue-500 text-white rounded-full p-1.5 border-4 border-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-black uppercase text-blue-700 tracking-wider">
                  Direct Driving — No Highway Charging Stop Needed
                </span>
                <p className="text-xs text-slate-600 font-medium">
                  Your vehicle's {Math.round(maxInitialRangeKm)} km usable range easily covers the {totalDistanceKm} km route. You will arrive at destination without needing an intermediate stop!
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Arrival */}
          <div className="relative">
            <div className="absolute -left-[33px] top-0 bg-slate-900 text-white rounded-full p-1.5 border-4 border-white shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Step 3: Arrival — {destination.displayName}
                </span>
                <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full">
                  {totalDistanceKm} km total
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                Arrive with ~{finalArrivalBatteryPct}% Battery Reserve
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Successfully reached {destination.displayName}. Total highway charging expense: PKR {totalChargingCostPkr.toLocaleString()}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
