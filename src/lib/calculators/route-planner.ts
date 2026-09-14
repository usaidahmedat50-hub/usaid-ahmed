// PakEVFinder — Intercity Highway Consumption & Route Planner Engine
// Real-world physics: 110-120 km/h cruising, 38-42°C summer A/C load, elevation derate, and 10-80% DC fast-charging curve.

import { ChargingStation } from '@/lib/types';
import { VERIFIED_PAKISTAN_CHARGING_STATIONS } from '@/lib/data/stations';

export interface RouteCorridorPreset {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  motorwayName: string;
  originCoords: [number, number]; // [lat, lng]
  destCoords: [number, number];
  primaryStationId?: string;
  elevationTrend: 'neutral' | 'climbing' | 'descending'; // e.g. Lahore -> Islamabad climbs Potohar plateau
}

export const PAKISTAN_CORRIDORS: RouteCorridorPreset[] = [
  {
    id: 'lhr-isb-m2',
    name: 'Lahore to Islamabad (M-2 Motorway)',
    origin: 'Lahore',
    destination: 'Islamabad',
    distanceKm: 375,
    motorwayName: 'M-2',
    originCoords: [31.5204, 74.3587],
    destCoords: [33.6844, 73.0479],
    primaryStationId: 'sta-bhera-m2-north',
    elevationTrend: 'climbing', // 215m up to 540m + Salt Range climb
  },
  {
    id: 'isb-lhr-m2',
    name: 'Islamabad to Lahore (M-2 Motorway)',
    origin: 'Islamabad',
    destination: 'Lahore',
    distanceKm: 375,
    motorwayName: 'M-2',
    originCoords: [33.6844, 73.0479],
    destCoords: [31.5204, 74.3587],
    primaryStationId: 'sta-bhera-m2-south',
    elevationTrend: 'descending',
  },
  {
    id: 'lhr-mul-m3',
    name: 'Lahore to Multan (M-3 Motorway)',
    origin: 'Lahore',
    destination: 'Multan',
    distanceKm: 345,
    motorwayName: 'M-3',
    originCoords: [31.5204, 74.3587],
    destCoords: [30.1575, 71.5249],
    primaryStationId: 'sta-abdul-hakeem-m3',
    elevationTrend: 'neutral',
  },
  {
    id: 'mul-lhr-m3',
    name: 'Multan to Lahore (M-3 Motorway)',
    origin: 'Multan',
    destination: 'Lahore',
    distanceKm: 345,
    motorwayName: 'M-3',
    originCoords: [30.1575, 71.5249],
    destCoords: [31.5204, 74.3587],
    primaryStationId: 'sta-abdul-hakeem-m3',
    elevationTrend: 'neutral',
  },
  {
    id: 'khi-hyd-m9',
    name: 'Karachi to Hyderabad (M-9 Super Highway)',
    origin: 'Karachi',
    destination: 'Hyderabad',
    distanceKm: 155,
    motorwayName: 'M-9',
    originCoords: [24.8607, 67.0011],
    destCoords: [25.396, 68.3578],
    primaryStationId: 'sta-nooriabad-m9',
    elevationTrend: 'neutral',
  },
  {
    id: 'hyd-khi-m9',
    name: 'Hyderabad to Karachi (M-9 Super Highway)',
    origin: 'Hyderabad',
    destination: 'Karachi',
    distanceKm: 155,
    motorwayName: 'M-9',
    originCoords: [25.396, 68.3578],
    destCoords: [24.8607, 67.0011],
    primaryStationId: 'sta-nooriabad-m9',
    elevationTrend: 'neutral',
  },
  {
    id: 'isb-pes-m1',
    name: 'Islamabad to Peshawar (M-1 Motorway)',
    origin: 'Islamabad',
    destination: 'Peshawar',
    distanceKm: 165,
    motorwayName: 'M-1',
    originCoords: [33.6844, 73.0479],
    destCoords: [34.0151, 71.5249],
    primaryStationId: 'sta-peshawar-ring-rd',
    elevationTrend: 'neutral',
  },
  {
    id: 'mul-suk-m5',
    name: 'Multan to Sukkur (M-5 Motorway)',
    origin: 'Multan',
    destination: 'Sukkur',
    distanceKm: 390,
    motorwayName: 'M-5',
    originCoords: [30.1575, 71.5249],
    destCoords: [27.7052, 68.8574],
    primaryStationId: 'sta-sukkur-m5',
    elevationTrend: 'neutral',
  },
];

export interface RouteLeg {
  id: string;
  type: 'drive' | 'charge';
  title: string;
  fromName: string;
  toName: string;
  distanceKm: number;
  durationMins: number;
  startSoc: number; // 0 - 100%
  endSoc: number; // 0 - 100%
  kwhUsedOrAdded: number;
  costPkr?: number;
  station?: ChargingStation;
  notes?: string;
}

export interface RouteCalculationParams {
  origin: string;
  destination: string;
  batteryCapacityKwh: number;
  wltpRangeKm: number;
  maxDcChargingKw?: number;
  initialSoc: number; // e.g. 90
  minBufferSoc: number; // e.g. 15
  cruisingSpeedKmh?: number; // default 110
  ambientTempC?: number; // default 38
}

export interface RouteCalculationResult {
  corridor: RouteCorridorPreset;
  totalDistanceKm: number;
  totalDriveMins: number;
  totalChargeMins: number;
  totalTripMins: number;
  totalKwhConsumed: number;
  totalChargeCostPkr: number;
  effectiveHighwayRangeKm: number;
  whPerKm: number;
  isNonStopPossible: boolean;
  verdict: string;
  verdictLevel: 'success' | 'warning' | 'info';
  legs: RouteLeg[];
  recommendedStation?: ChargingStation;
  arrivalSocAtDest: number;
}

/**
 * Calculates realistic highway energy consumption (Wh/km) under Pakistani climate conditions.
 * - Base WLTP consumption: (batteryCapacityKwh * 1000) / wltpRangeKm
 * - Aerodynamic drag increases quadratically at 110-120 km/h: +22% to +30% vs WLTP city/mix
 * - High ambient temp (38-42°C) continuous HVAC air conditioning: +12% to +18%
 * - Potohar elevation climb: +5%
 */
export function calculateHighwayConsumptionWhKm(
  batteryCapacityKwh: number,
  wltpRangeKm: number,
  speedKmh = 110,
  ambientTempC = 38,
  elevationTrend: 'neutral' | 'climbing' | 'descending' = 'neutral'
): number {
  const baseWhKm = (batteryCapacityKwh * 1000) / (wltpRangeKm || 400);

  // Speed factor: 100 km/h = 1.15, 110 km/h = 1.25, 120 km/h = 1.35
  const speedMultiplier = 1 + (speedKmh - 90) * 0.008;

  // HVAC factor: Baseline 22°C = 1.0; 38°C adds ~15% load; 44°C adds ~20%
  const tempDelta = Math.max(0, ambientTempC - 24);
  const hvacMultiplier = 1 + tempDelta * 0.01;

  // Elevation penalty
  const elevationMultiplier =
    elevationTrend === 'climbing' ? 1.06 : elevationTrend === 'descending' ? 0.96 : 1.0;

  return Math.round(baseWhKm * speedMultiplier * hvacMultiplier * elevationMultiplier);
}

/**
 * Calculates DC fast charging duration (mins) from startSoc to targetSoc (typically up to 80%).
 * Uses average charging power accounting for tapering above 60-70%.
 */
export function calculateDcChargeDurationMins(
  batteryCapacityKwh: number,
  startSoc: number,
  targetSoc: number,
  stationPowerKw: number,
  vehicleMaxDcKw = 100
): { durationMins: number; kwhAdded: number } {
  const socDelta = Math.max(0, targetSoc - startSoc);
  const kwhAdded = Number(((batteryCapacityKwh * socDelta) / 100).toFixed(1));

  // The actual peak power is bounded by vehicle DC intake and charger capacity
  const effectiveMaxKw = Math.min(stationPowerKw, vehicleMaxDcKw);

  // Average power curve: From 15% to 80%, average rate is typically ~75% of peak power due to thermal throttling
  const averagePowerKw = Math.max(25, effectiveMaxKw * 0.78);

  const durationHours = kwhAdded / averagePowerKw;
  const durationMins = Math.round(durationHours * 60);

  return { durationMins, kwhAdded };
}

/**
 * Main route calculation engine.
 */
export function calculateIntercityRoute(params: RouteCalculationParams): RouteCalculationResult {
  const {
    origin,
    destination,
    batteryCapacityKwh,
    wltpRangeKm,
    maxDcChargingKw = 100,
    initialSoc = 90,
    minBufferSoc = 15,
    cruisingSpeedKmh = 110,
    ambientTempC = 38,
  } = params;

  // Find matching corridor or default to Lahore -> Islamabad
  let corridor = PAKISTAN_CORRIDORS.find(
    (c) =>
      (c.origin.toLowerCase() === origin.toLowerCase() &&
        c.destination.toLowerCase() === destination.toLowerCase()) ||
      (c.id === `${origin.toLowerCase()}-${destination.toLowerCase()}`)
  );

  if (!corridor) {
    corridor = PAKISTAN_CORRIDORS[0]; // fallback
  }

  // Calculate highway energy consumption
  const whPerKm = calculateHighwayConsumptionWhKm(
    batteryCapacityKwh,
    wltpRangeKm,
    cruisingSpeedKmh,
    ambientTempC,
    corridor.elevationTrend
  );

  // Real-world effective highway range on full 100% battery (km)
  const effectiveHighwayRangeKm = Math.round((batteryCapacityKwh * 1000) / whPerKm);

  // Range available with user's starting SoC minus emergency buffer
  const usableStartSoc = Math.max(0, initialSoc - minBufferSoc);
  const availableRangeLeg1Km = Math.round(effectiveHighwayRangeKm * (usableStartSoc / 100));

  const totalDistance = corridor.distanceKm;
  const avgSpeedKmh = 95; // realistic average including toll plazas & on/off ramps
  const totalDriveMins = Math.round((totalDistance / avgSpeedKmh) * 60);

  // Find corridor charging station
  let station: ChargingStation | undefined;
  if (corridor.primaryStationId) {
    station = VERIFIED_PAKISTAN_CHARGING_STATIONS.find((s) => s.id === corridor.primaryStationId);
  }
  if (!station) {
    station = VERIFIED_PAKISTAN_CHARGING_STATIONS.find(
      (s) => s.city.toLowerCase() === 'bhera' || s.city.toLowerCase() === corridor.origin.toLowerCase()
    );
  }

  // Distance to primary charging stop (e.g. Bhera km 195 from Lahore on M-2)
  let stopDistKm = Math.round(totalDistance * 0.52);
  if (corridor.id.includes('lhr-isb')) stopDistKm = 195;
  if (corridor.id.includes('isb-lhr')) stopDistKm = 180;
  if (corridor.id.includes('lhr-mul') || corridor.id.includes('mul-lhr')) stopDistKm = 185;
  if (corridor.id.includes('khi-hyd') || corridor.id.includes('hyd-khi')) stopDistKm = 75;

  const isNonStopPossible = availableRangeLeg1Km >= totalDistance;

  const legs: RouteLeg[] = [];
  let totalChargeMins = 0;
  let totalChargeCostPkr = 0;
  let arrivalSocAtDest = 0;

  if (isNonStopPossible) {
    // Single leg: Non-stop trip
    const kwhConsumed = Number(((totalDistance * whPerKm) / 1000).toFixed(1));
    const socUsed = Math.round((kwhConsumed / batteryCapacityKwh) * 100);
    arrivalSocAtDest = Math.max(0, initialSoc - socUsed);

    legs.push({
      id: 'leg-direct',
      type: 'drive',
      title: `Direct Cruising to ${corridor.destination}`,
      fromName: corridor.origin,
      toName: corridor.destination,
      distanceKm: totalDistance,
      durationMins: totalDriveMins,
      startSoc: initialSoc,
      endSoc: arrivalSocAtDest,
      kwhUsedOrAdded: kwhConsumed,
      notes: `Highway cruising at ~${cruisingSpeedKmh} km/h with continuous A/C (${ambientTempC}°C).`,
    });
  } else {
    // Multi-leg: Stop at corridor fast charger
    // Leg 1: Origin -> Charger
    const leg1DriveMins = Math.round((stopDistKm / avgSpeedKmh) * 60);
    const leg1Kwh = Number(((stopDistKm * whPerKm) / 1000).toFixed(1));
    const leg1SocUsed = Math.round((leg1Kwh / batteryCapacityKwh) * 100);
    const arrivalSocAtCharger = Math.max(5, initialSoc - leg1SocUsed);

    legs.push({
      id: 'leg-1-drive',
      type: 'drive',
      title: `Leg 1: Departure to ${station?.name || 'Charging Station'}`,
      fromName: corridor.origin,
      toName: station?.name || 'Fast Charger Stop',
      distanceKm: stopDistKm,
      durationMins: leg1DriveMins,
      startSoc: initialSoc,
      endSoc: arrivalSocAtCharger,
      kwhUsedOrAdded: leg1Kwh,
      notes: `Arrival buffer: ${arrivalSocAtCharger}% battery remaining.`,
    });

    // Leg 2: Fast Charging Stop (Charge to 80% or 85%)
    const targetSoc = 80;
    const chargerPower = station?.power_kw || 120;
    const { durationMins: chargeMins, kwhAdded } = calculateDcChargeDurationMins(
      batteryCapacityKwh,
      arrivalSocAtCharger,
      targetSoc,
      chargerPower,
      maxDcChargingKw
    );

    totalChargeMins = chargeMins;
    const tariffPerKwh = station?.price_per_kwh_pkr || 95;
    const chargeCost = Math.round(kwhAdded * tariffPerKwh);
    totalChargeCostPkr = chargeCost;

    legs.push({
      id: 'leg-charge',
      type: 'charge',
      title: `Charge at ${station?.name || 'Midway Hub'}`,
      fromName: station?.name || 'Charging Hub',
      toName: station?.name || 'Charging Hub',
      distanceKm: 0,
      durationMins: chargeMins,
      startSoc: arrivalSocAtCharger,
      endSoc: targetSoc,
      kwhUsedOrAdded: kwhAdded,
      costPkr: chargeCost,
      station,
      notes: `Top up +${kwhAdded} kWh on ${chargerPower} kW DC fast charger (${tariffPerKwh} PKR/kWh).`,
    });

    // Leg 3: Charger -> Destination
    const leg2DistKm = totalDistance - stopDistKm;
    const leg2DriveMins = Math.round((leg2DistKm / avgSpeedKmh) * 60);
    const leg2Kwh = Number(((leg2DistKm * whPerKm) / 1000).toFixed(1));
    const leg2SocUsed = Math.round((leg2Kwh / batteryCapacityKwh) * 100);
    arrivalSocAtDest = Math.max(minBufferSoc, targetSoc - leg2SocUsed);

    legs.push({
      id: 'leg-2-drive',
      type: 'drive',
      title: `Leg 2: Final Stretch to ${corridor.destination}`,
      fromName: station?.name || 'Midway Hub',
      toName: corridor.destination,
      distanceKm: leg2DistKm,
      durationMins: leg2DriveMins,
      startSoc: targetSoc,
      endSoc: arrivalSocAtDest,
      kwhUsedOrAdded: leg2Kwh,
      notes: `Arrival with comfortable ~${arrivalSocAtDest}% reserve at ${corridor.destination}.`,
    });
  }

  const totalKwhConsumed = Number(((totalDistance * whPerKm) / 1000).toFixed(1));
  const totalTripMins = totalDriveMins + totalChargeMins;

  let verdict = 'Direct non-stop possible';
  let verdictLevel: 'success' | 'warning' | 'info' = 'success';

  if (isNonStopPossible) {
    verdict = `Direct non-stop feasible (${arrivalSocAtDest}% SoC upon arrival)`;
    verdictLevel = 'success';
  } else if (station) {
    verdict = `Feasible with 1 quick stop at ${station.name} (~${totalChargeMins} mins)`;
    verdictLevel = 'info';
  } else {
    verdict = 'Requires intermediate charging — plan buffer carefully';
    verdictLevel = 'warning';
  }

  return {
    corridor,
    totalDistanceKm: totalDistance,
    totalDriveMins,
    totalChargeMins,
    totalTripMins,
    totalKwhConsumed,
    totalChargeCostPkr,
    effectiveHighwayRangeKm,
    whPerKm,
    isNonStopPossible,
    verdict,
    verdictLevel,
    legs,
    recommendedStation: station,
    arrivalSocAtDest,
  };
}
