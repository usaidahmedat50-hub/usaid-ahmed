import { haversineDistanceKm } from './geo';

export interface LocationSearchResult {
  displayName: string;
  lat: number;
  lng: number;
}

export interface OsrmRouteResponse {
  polyline: [number, number][]; // [lat, lng] array
  distanceKm: number;
  durationMins: number;
}

// Preset major Pakistani cities & hubs
export const PRESET_PAKISTAN_CITIES: LocationSearchResult[] = [
  { displayName: 'Lahore, Punjab', lat: 31.5204, lng: 74.3587 },
  { displayName: 'Islamabad, ICT', lat: 33.6844, lng: 73.0479 },
  { displayName: 'Karachi, Sindh', lat: 24.8607, lng: 67.0011 },
  { displayName: 'Rawalpindi, Punjab', lat: 33.5651, lng: 73.0169 },
  { displayName: 'Peshawar, KP', lat: 34.0151, lng: 71.5249 },
  { displayName: 'Faisalabad, Punjab', lat: 31.4504, lng: 73.135 },
  { displayName: 'Multan, Punjab', lat: 30.1575, lng: 71.5249 },
  { displayName: 'Gujranwala, Punjab', lat: 32.1877, lng: 74.1945 },
  { displayName: 'Hyderabad, Sindh', lat: 25.396, lng: 68.3578 },
  { displayName: 'Sukkur, Sindh', lat: 27.7052, lng: 68.8574 },
  { displayName: 'Quetta, Balochistan', lat: 30.1798, lng: 66.975 },
  { displayName: 'Murree, Punjab', lat: 33.907, lng: 73.3903 },
  { displayName: 'Abbottabad, KP', lat: 34.1688, lng: 73.2215 },
  { displayName: 'Bahawalpur, Punjab', lat: 29.3544, lng: 71.6911 },
  { displayName: 'Sialkot, Punjab', lat: 32.4945, lng: 74.5229 },
  { displayName: 'Bhera (M-2 Hub)', lat: 32.3275, lng: 72.935 },
];

// OpenStreetMap Nominatim Geocoding API with Pakistani filter
export async function searchPakistanLocations(
  query: string
): Promise<LocationSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=pk&limit=6&q=${encodeURIComponent(
      query.trim()
    )}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PakEVFinder/2.0 (EV Route Engine)',
      },
    });

    if (!res.ok) throw new Error('Nominatim request failed');

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.warn('Nominatim search failed, falling back to local preset matching:', error);
    const q = query.toLowerCase();
    return PRESET_PAKISTAN_CITIES.filter((c) =>
      c.displayName.toLowerCase().includes(q)
    );
  }
}

// OSRM Routing Engine API (Free public driving router)
export async function fetchOsrmDrivingRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<OsrmRouteResponse> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('OSRM routing request failed');

    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const coords: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] as [number, number]
    );

    return {
      polyline: coords,
      distanceKm: Math.round(route.distance / 1000),
      durationMins: Math.round(route.duration / 60),
    };
  } catch (error) {
    console.warn('OSRM API unavailable, falling back to straight-line interpolation:', error);
    // Straight-line fallback interpolation (20 steps)
    const steps = 20;
    const polyline: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = originLat + t * (destLat - originLat);
      const lng = originLng + t * (destLng - originLng);
      polyline.push([lat, lng]);
    }

    const dist = haversineDistanceKm(originLat, originLng, destLat, destLng);
    return {
      polyline,
      distanceKm: Math.round(dist * 1.2), // 1.2 road factor for driving
      durationMins: Math.round(((dist * 1.2) / 80) * 60), // Avg 80 km/h driving
    };
  }
}
