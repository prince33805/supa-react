// /app/api/omise-charge-status/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const chargeId = req.nextUrl.searchParams.get('id');

  if (!chargeId) {
    return NextResponse.json({ error: 'Missing charge ID' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.omise.co/charges/${chargeId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.OMISE_SECRET_KEY}:`).toString('base64')}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message }, { status: res.status });
    }

    return NextResponse.json({
      status: data.status, // pending, successful, failed
      charge: data,
    });
  } catch (err) {
    console.error('❌ Error fetching Omise charge:', err);
    return NextResponse.json({ error: 'Failed to fetch charge status' }, { status: 500 });
  }
}
