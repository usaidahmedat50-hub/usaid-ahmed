// PakevFinder.com — Centralized Routing & Highway Corridor Engine
// Strictly implements docs/02-ARCHITECTURE.md §3 and docs/04-DESIGN.md §3

import { CityCoordinates, ChargingStation, VehicleWithDetails } from './types';
import { PAKISTAN_CITIES, getRoadDistanceKm, calculateHotWeatherHighwayRange } from './routes';
import { SEED_CHARGING_STATIONS } from '@/data/seed-data';

export interface RouteChargerEntry {
  station: ChargingStation;
  distance_from_start_km: number;
  detour_time_mins: number;
  recommended: boolean;
  notes?: string;
}

export interface WeatherContext {
  tempC: number;
  condition: string;
}

export interface RoutePlanResult {
  origin: CityCoordinates;
  destination: CityCoordinates;
  total_distance_km: number;
  total_drive_time_mins: number;
  vehicle_name: string;
  usable_range_km: number;
  feasibility_verdict: string; // e.g. "Doable non-stop", "Doable with 1 stop", "Requires 2 stops"
  required_stops_count: number;
  chargers_along_route: RouteChargerEntry[];
  weather?: {
    origin?: WeatherContext | null;
    destination?: WeatherContext | null;
  };
  disclaimer: string;
}

/**
 * Approximate driving duration in minutes for Pakistani highway network
 * Average motorway travel speed is approx 100-110 km/h accounting for toll plazas
 */
function estimateDrivingDurationMins(distanceKm: number): number {
  const avgSpeedKmh = 95; // realistic average including tolls and interchange slowdown
  return Math.round((distanceKm / avgSpeedKmh) * 60);
}

/**
 * Geocode user input (free text location or city name) using OpenRouteService
 * Geocoding API endpoint, falling back to calibrated PAKISTAN_CITIES coordinates.
 * Per docs/02-ARCHITECTURE.md §1 & §3.
 */
export async function geocodeLocation(query: string): Promise<CityCoordinates | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // 1. Direct match against calibrated Pakistan cities
  const directMatch = PAKISTAN_CITIES.find(
    (c) => c.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (directMatch) return directMatch;

  // 2. OpenRouteService Geocoding endpoint if key is available
  const apiKey = process.env.ORS_API_KEY;
  if (apiKey) {
    try {
      const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(trimmed)}&boundary.country=PAK&size=1`;
      const res = await fetch(url, { next: { revalidate: 86400 * 7 } });
      if (res.ok) {
        const data = await res.json();
        const feature = data.features?.[0];
        if (feature && feature.geometry?.coordinates) {
          const [lon, lat] = feature.geometry.coordinates;
          const label = feature.properties?.name || feature.properties?.label || trimmed;
          const region = feature.properties?.region || 'Pakistan';
          return {
            name: label,
            province: region,
            latitude: lat,
            longitude: lon,
          };
        }
      }
    } catch {
      // Fall through to fuzzy local search
    }
  }

  // 3. Fuzzy/substring search in calibrated cities
  const fuzzyMatch = PAKISTAN_CITIES.find(
    (c) =>
      c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
      trimmed.toLowerCase().includes(c.name.toLowerCase())
  );
  if (fuzzyMatch) return fuzzyMatch;

  return null;
}

/**
 * Optional contextual weather at origin/destination via Open-Meteo free API
 * Per docs/02-ARCHITECTURE.md §3 (Light context, no API key required)
 */
export async function getWeatherContext(
  latitude: number,
  longitude: number
): Promise<WeatherContext | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const data = await res.json();
    const temp = Math.round(data.current?.temperature_2m ?? 0);
    const code = data.current?.weather_code ?? 0;

    let condition = 'Clear';
    if (code === 0) condition = 'Clear Sky';
    else if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
    else if (code >= 45 && code <= 48) condition = 'Foggy';
    else if (code >= 51 && code <= 67) condition = 'Rain';
    else if (code >= 71 && code <= 77) condition = 'Snow';
    else if (code >= 80 && code <= 82) condition = 'Showers';
    else if (code >= 95) condition = 'Thunderstorm';

    return { tempC: temp, condition };
  } catch {
    return null;
  }
}

/**
 * OpenRouteService routing caller with fallback to internal Pakistani highway network
 * Centralized wrapper per 02-ARCHITECTURE.md so changing provider is a 1-file change
 */
export async function calculateRouteDistance(
  origin: CityCoordinates,
  destination: CityCoordinates
): Promise<{ distanceKm: number; durationMins: number }> {
  const apiKey = process.env.ORS_API_KEY;

  if (apiKey) {
    try {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${origin.longitude},${origin.latitude}&end=${destination.longitude},${destination.latitude}`;
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (res.ok) {
        const data = await res.json();
        const summary = data.features?.[0]?.properties?.summary;
        if (summary) {
          const distanceKm = Math.round(summary.distance / 1000);
          const durationMins = Math.round(summary.duration / 60);
          return { distanceKm, durationMins };
        }
      }
    } catch {
      // Graceful fallback to verified highway distance matrix
    }
  }

  // Fallback to calibrated Pakistani highway network
  const distanceKm = getRoadDistanceKm(origin.name, destination.name);
  const durationMins = estimateDrivingDurationMins(distanceKm);
  return { distanceKm, durationMins };
}

/**
 * Query and sort chargers along the specific highway corridor
 */
export function getChargersAlongRoute(
  originName: string,
  destinationName: string,
  totalDistanceKm: number,
  usableRangeKm: number
): RouteChargerEntry[] {
  const allStations = SEED_CHARGING_STATIONS;

  // Filter chargers located along or near the primary corridor
  const pair = `${originName}-${destinationName}`;
  const isM2 = (originName === 'Lahore' && destinationName === 'Islamabad') ||
               (originName === 'Islamabad' && destinationName === 'Lahore');
  const isM3M4 = (originName === 'Lahore' && destinationName === 'Multan') ||
                 (originName === 'Multan' && destinationName === 'Lahore');
  const isM9 = (originName === 'Karachi' && destinationName === 'Hyderabad') ||
               (originName === 'Hyderabad' && destinationName === 'Karachi');

  const routeChargers: RouteChargerEntry[] = [];

  allStations.forEach((station) => {
    let distFromStart = 0;
    let matchesRoute = false;
    let detourMins = 10; // Service area off-ramp / on-ramp default

    if (isM2) {
      if (station.name.includes('Bhera')) {
        matchesRoute = true;
        distFromStart = originName === 'Lahore' ? 195 : 180;
        detourMins = 8;
      } else if (station.name.includes('Sukheke')) {
        matchesRoute = true;
        distFromStart = originName === 'Lahore' ? 95 : 280;
        detourMins = 8;
      }
    } else if (isM3M4) {
      if (station.city === 'Faisalabad' || station.name.includes('Faisalabad')) {
        matchesRoute = true;
        distFromStart = originName === 'Lahore' ? 135 : 210;
        detourMins = 15;
      }
    } else if (isM9) {
      if (station.city === 'Hyderabad' || station.city === 'Karachi') {
        matchesRoute = true;
        distFromStart = originName === 'Karachi' ? 140 : 15;
        detourMins = 12;
      }
    } else {
      // General heuristic for long journeys
      if (station.city !== originName && station.city !== destinationName) {
        matchesRoute = true;
        distFromStart = Math.round(totalDistanceKm * 0.5);
      }
    }

    if (matchesRoute) {
      // Recommend if vehicle cannot complete trip non-stop and station sits within usable range
      const recommended = totalDistanceKm > usableRangeKm && distFromStart <= usableRangeKm;
      routeChargers.push({
        station,
        distance_from_start_km: distFromStart,
        detour_time_mins: detourMins,
        recommended,
        notes: station.power_kw >= 50 ? 'DC Fast Charging' : 'AC Standard Charging',
      });
    }
  });

  // Sort strictly by distance from start
  return routeChargers.sort((a, b) => a.distance_from_start_km - b.distance_from_start_km);
}

/**
 * Primary Route Plan generator
 */
export async function planRoute(
  originCityName: string,
  destinationCityName: string,
  vehicle: VehicleWithDetails,
  initialSocPercent = 90
): Promise<RoutePlanResult> {
  const origin = (await geocodeLocation(originCityName)) || PAKISTAN_CITIES[0];
  const destination = (await geocodeLocation(destinationCityName)) || PAKISTAN_CITIES[1];

  const { distanceKm, durationMins } = await calculateRouteDistance(origin, destination);

  const ratedRange = parseInt(vehicle.specs.wltp_range_km?.value || '400', 10);
  const hotWeatherRange = calculateHotWeatherHighwayRange(ratedRange);
  const usableRangeKm = Math.round(hotWeatherRange * (initialSocPercent / 100));

  const chargers = getChargersAlongRoute(origin.name, destination.name, distanceKm, usableRangeKm);

  let feasibilityVerdict = 'Doable non-stop';
  let requiredStops = 0;

  if (distanceKm <= usableRangeKm) {
    feasibilityVerdict = 'Doable non-stop';
    requiredStops = 0;
  } else if (distanceKm <= usableRangeKm * 1.7) {
    feasibilityVerdict = 'Doable with 1 stop';
    requiredStops = 1;
  } else {
    requiredStops = Math.ceil(distanceKm / (usableRangeKm * 0.8)) - 1;
    feasibilityVerdict = `Requires ${requiredStops} stops`;
  }

  // Fetch optional light weather context in parallel
  const [originWeather, destWeather] = await Promise.all([
    getWeatherContext(origin.latitude, origin.longitude),
    getWeatherContext(destination.latitude, destination.longitude),
  ]);

  return {
    origin,
    destination,
    total_distance_km: distanceKm,
    total_drive_time_mins: durationMins,
    vehicle_name: `${vehicle.brand.name} ${vehicle.name}`,
    usable_range_km: usableRangeKm,
    feasibility_verdict: feasibilityVerdict,
    required_stops_count: requiredStops,
    chargers_along_route: chargers,
    weather: {
      origin: originWeather,
      destination: destWeather,
    },
    disclaimer:
      'Planning aid only. Distances and durations are estimates. Driving range varies with speed, A/C load, and battery health. Always verify station status before departing.',
  };
}
