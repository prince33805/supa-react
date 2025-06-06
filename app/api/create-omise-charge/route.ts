import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount } = await req.json();

  const res = await fetch('https://api.omise.co/charges', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.OMISE_SECRET_KEY}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'thb',
      source: { type: 'promptpay' },
    }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
