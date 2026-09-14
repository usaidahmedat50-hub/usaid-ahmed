import { NextRequest, NextResponse } from 'next/server';
import { submitStationForReview } from '@/lib/stations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.latitude || !body.longitude || !body.city) {
      return NextResponse.json(
        { error: 'Missing required station fields: name, city, latitude, longitude' },
        { status: 400 }
      );
    }

    const result = await submitStationForReview(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
