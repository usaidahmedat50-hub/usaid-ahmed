// Haversine formula to compute distance between two (lat, lng) points in kilometers
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Distance from a point (pLat, pLng) to a line segment (aLat, aLng) -> (bLat, bLng) in km
export function distanceToSegmentKm(
  pLat: number,
  pLng: number,
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const l2 = Math.pow(aLat - bLat, 2) + Math.pow(aLng - bLng, 2);
  if (l2 === 0) return haversineDistanceKm(pLat, pLng, aLat, aLng);

  let t = ((pLat - aLat) * (bLat - aLat) + (pLng - aLng) * (bLng - aLng)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projLat = aLat + t * (bLat - aLat);
  const projLng = aLng + t * (bLng - aLng);

  return haversineDistanceKm(pLat, pLng, projLat, projLng);
}

// Minimum distance from a station (sLat, sLng) to any segment in a polyline [lat, lng][]
export function minDistanceToPolylineKm(
  sLat: number,
  sLng: number,
  polyline: [number, number][]
): { minDistanceKm: number; segmentIndex: number } {
  if (polyline.length === 0) return { minDistanceKm: Infinity, segmentIndex: -1 };
  if (polyline.length === 1) {
    return {
      minDistanceKm: haversineDistanceKm(sLat, sLng, polyline[0][0], polyline[0][1]),
      segmentIndex: 0,
    };
  }

  let minDistanceKm = Infinity;
  let segmentIndex = 0;

  for (let i = 0; i < polyline.length - 1; i++) {
    const dist = distanceToSegmentKm(
      sLat,
      sLng,
      polyline[i][0],
      polyline[i][1],
      polyline[i + 1][0],
      polyline[i + 1][1]
    );
    if (dist < minDistanceKm) {
      minDistanceKm = dist;
      segmentIndex = i;
    }
  }

  return { minDistanceKm, segmentIndex };
}
