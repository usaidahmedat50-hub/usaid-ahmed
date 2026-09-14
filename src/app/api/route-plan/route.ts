// PakevFinder.com — Route Planner API Route Handler
// Implements docs/02-ARCHITECTURE.md §3 and §8
// Keeps ORS_API_KEY strictly server-only while exposing geocoding and routing

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleBySlug, getAllVehicles } from '@/lib/vehicles';
import { planRoute } from '@/lib/routing';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin') || 'Lahore';
    const destination = searchParams.get('destination') || 'Islamabad';
    const vehicleSlug = searchParams.get('vehicleSlug') || '';
    const socParam = searchParams.get('soc');
    const initialSoc = socParam ? parseInt(socParam, 10) : 90;

    // Resolve vehicle
    let vehicle = null;
    if (vehicleSlug) {
      vehicle = await getVehicleBySlug(vehicleSlug);
    }

    if (!vehicle) {
      const allVehicles = await getAllVehicles();
      vehicle = allVehicles[0];
    }

    if (!vehicle) {
      return NextResponse.json(
        { error: 'No vehicles found in database to evaluate route.' },
        { status: 404 }
      );
    }

    const plan = await planRoute(origin, destination, vehicle, initialSoc);

    return NextResponse.json(plan, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown routing error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
