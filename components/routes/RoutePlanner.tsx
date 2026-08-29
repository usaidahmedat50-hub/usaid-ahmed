'use client';

import React, { useState } from 'react';
import { VehicleSpec } from '@/types/vehicle';
import { ChargingStation } from '@/types/station';
import { Navigation, Zap, BatteryCharging, ArrowRight, DollarSign, Clock, ShieldCheck } from 'lucide-react';

interface RoutePlannerProps {
  vehicles: VehicleSpec[];
  stations: ChargingStation[];
}

interface Corridor {
  id: string;
  name: string;
  startCity: string;
  endCity: string;
  distanceKm: number;
  motorwayName: string;
  recommendedStationId: string;
  stationDistanceKm: number;
}

const CORRIDORS: Corridor[] = [
  {
    id: 'lahore-islamabad',
    name: 'Lahore ⇄ Islamabad (M-2 Motorway)',
    startCity: 'Lahore',
    endCity: 'Islamabad',
    distanceKm: 380,
    motorwayName: 'M-2',
    recommendedStationId: 'm2-bhera-north',
    stationDistanceKm: 190,
  },
  {
    id: 'karachi-hyderabad',
    name: 'Karachi ⇄ Hyderabad (M-9 Motorway)',
    startCity: 'Karachi',
    endCity: 'Hyderabad',
    distanceKm: 145,
    motorwayName: 'M-9',
    recommendedStationId: 'm9-nooriabad',
    stationDistanceKm: 85,
  },
  {
    id: 'multan-sukkur',
    name: 'Multan ⇄ Sukkur (M-5 Motorway)',
    startCity: 'Multan',
    endCity: 'Sukkur',
    distanceKm: 390,
    motorwayName: 'M-5',
    recommendedStationId: 'm5-zahir-pir',
    stationDistanceKm: 195,
  },
];

export default function RoutePlanner({ vehicles, stations }: RoutePlannerProps) {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('lahore-islamabad');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    vehicles[0]?.id || 'byd-atto-3'
  );
  const [startingBatteryPct, setStartingBatteryPct] = useState<number>(100);

  const currentCorridor = CORRIDORS.find((c) => c.id === selectedCorridorId) || CORRIDORS[0];
  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Charging Station for corridor
  const targetStation =
    stations.find((s) => s.id === currentCorridor.recommendedStationId) ||
    stations.find((s) => s.isMotorway && s.motorwayName === currentCorridor.motorwayName) ||
    stations[0];

  // Route & Range Calculation
  const usableInitialKwh = (startingBatteryPct / 100) * currentVehicle.batteryKwh;
  const initialMaxRangeKm = (usableInitialKwh / currentVehicle.consumptionKwh100km) * 100;

  // Energy consumed to reach intermediate station
  const energyToStationKwh =
    (currentCorridor.stationDistanceKm / 100) * currentVehicle.consumptionKwh100km;
  const arrivalBatteryKwhAtStation = Math.max(0, usableInitialKwh - energyToStationKwh);
  const arrivalBatteryPctAtStation = Math.round(
    (arrivalBatteryKwhAtStation / currentVehicle.batteryKwh) * 100
  );

  // Target 80% charge at station
  const targetChargePct = 80;
  const targetChargeKwh = (targetChargePct / 100) * currentVehicle.batteryKwh;
  const neededTopUpKwh = Math.max(0, targetChargeKwh - arrivalBatteryKwhAtStation);

  // Charging Time calculation based on Station Max Power vs Car Max DC Charge Speed
  const effectiveChargeKw = Math.min(targetStation.maxPowerKw, currentVehicle.maxDcChargeKw);
  const chargeTimeMins =
    neededTopUpKwh > 0 ? Math.ceil((neededTopUpKwh / effectiveChargeKw) * 60) : 0;

  // Cost calculation in PKR
  const tripChargingCostPkr = Math.round(neededTopUpKwh * targetStation.pricePerKwh);

  // Energy consumed from station to destination
  const remainingDistanceKm = currentCorridor.distanceKm - currentCorridor.stationDistanceKm;
  const energyToDestinationKwh = (remainingDistanceKm / 100) * currentVehicle.consumptionKwh100km;
  const finalArrivalKwh = targetChargeKwh - energyToDestinationKwh;
  const finalArrivalBatteryPct = Math.max(
    0,
    Math.round((finalArrivalKwh / currentVehicle.batteryKwh) * 100)
  );

  const needsStop = initialMaxRangeKm < currentCorridor.distanceKm;

  return (
    <div className="w-full space-y-8">
      {/* Form Controls Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1.5 rounded-full w-fit">
          <Navigation className="w-4 h-4 text-blue-600 fill-blue-600" />
          Route Configuration & Range Estimator
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Corridor Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Select Intercity Route
            </label>
            <select
              value={selectedCorridorId}
              onChange={(e) => setSelectedCorridorId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              {CORRIDORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.distanceKm} km)
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. Select EV / Hybrid Model
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.batteryKwh} kWh, {v.powertrain})
                </option>
              ))}
            </select>
          </div>

          {/* Starting Battery % Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                3. Starting Battery Charge
              </label>
              <span className="font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {startingBatteryPct}%
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
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>20%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Route Distance</span>
          <div className="text-2xl font-black text-slate-900">{currentCorridor.distanceKm} km</div>
          <span className="text-xs font-medium text-slate-600">{currentCorridor.motorwayName} Expressway</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Initial EV Range</span>
          <div className="text-2xl font-black text-blue-600">{Math.round(initialMaxRangeKm)} km</div>
          <span className="text-xs font-medium text-slate-600">at {startingBatteryPct}% Charge</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fast Charging Stop</span>
          <div className="text-2xl font-black text-emerald-600">
            {needsStop ? `${chargeTimeMins} mins` : 'No Stop Needed'}
          </div>
          <span className="text-xs font-medium text-slate-600">
            {needsStop ? `Top up +${Math.round(neededTopUpKwh)} kWh` : 'Direct arrival'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Trip Cost</span>
          <div className="text-2xl font-black text-slate-900">
            PKR {needsStop ? tripChargingCostPkr.toLocaleString() : 0}
          </div>
          <span className="text-xs font-medium text-slate-600">at PKR {targetStation.pricePerKwh}/kWh</span>
        </div>
      </div>

      {/* Visual Step-by-step Timeline */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <BatteryCharging className="w-5 h-5 text-blue-600" />
          Step-by-Step Intercity Route Timeline
        </h3>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6">
          {/* Step 1: Departure */}
          <div className="relative">
            <div className="absolute -left-[33px] top-0 bg-blue-600 text-white rounded-full p-1.5 border-4 border-white shadow-sm">
              <Navigation className="w-4 h-4 fill-white stroke-none" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-700 tracking-wider">
                  Step 1: Departure from {currentCorridor.startCity}
                </span>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  0 km
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                Start Journey at {startingBatteryPct}% Battery
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                {currentVehicle.brand} {currentVehicle.model} ({currentVehicle.batteryKwh} kWh battery) loaded with {Math.round(initialMaxRangeKm)} km of estimated electric range.
              </p>
            </div>
          </div>

          {/* Step 2: Intermediate Motorway Charging Stop */}
          {needsStop ? (
            <div className="relative">
              <div className="absolute -left-[33px] top-0 bg-emerald-600 text-white rounded-full p-1.5 border-4 border-white shadow-sm">
                <Zap className="w-4 h-4 fill-white stroke-none" />
              </div>
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                    Step 2: Fast Charging Stop — {targetStation.name}
                  </span>
                  <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                    {currentCorridor.stationDistanceKm} km mark
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900">
                    Arrive with {arrivalBatteryPctAtStation}% Battery Remaining
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Operated by <span className="font-bold text-slate-900">{targetStation.network}</span> on {currentCorridor.motorwayName}. Plug into {targetStation.maxPowerKw} kW DC Fast Charger.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-emerald-200 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Charge Time: {chargeTimeMins} Mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Top-up: +{Math.round(neededTopUpKwh)} kWh (to 80%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-700" />
                    <span>Cost: PKR {tripChargingCostPkr}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -left-[33px] top-0 bg-blue-500 text-white rounded-full p-1.5 border-4 border-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-black uppercase text-blue-700 tracking-wider">
                  Direct Cruise — No Charging Stop Required
                </span>
                <p className="text-xs text-slate-600 font-medium">
                  Your vehicle's {Math.round(initialMaxRangeKm)} km initial range exceeds the {currentCorridor.distanceKm} km route length. You can drive non-stop!
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Destination Arrival */}
          <div className="relative">
            <div className="absolute -left-[33px] top-0 bg-slate-900 text-white rounded-full p-1.5 border-4 border-white shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Step 3: Arrival at {currentCorridor.endCity}
                </span>
                <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full">
                  {currentCorridor.distanceKm} km total
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                Arrive with ~{finalArrivalBatteryPct}% Reserve Battery
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Successfully completed the {currentCorridor.name} journey with total electricity expenditure of PKR {needsStop ? tripChargingCostPkr.toLocaleString() : 0}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
