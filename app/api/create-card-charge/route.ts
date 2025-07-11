import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount, orderId } = await req.json();
  console.log('process.env.OMISE_SECRET_KEY', process.env.OMISE_SECRET_KEY);
  console.log(
    'process.env.NEXT_PUBLIC_BASE_URL',
    process.env.NEXT_PUBLIC_BASE_URL,
  );
  try {
    const res = await fetch('https://api.omise.co/charges', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.OMISE_SECRET_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'thb',
        source: { type: 'rabbit_linepay' },
        return_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?orderId=${orderId}`,
      }),
    });
    const data = await res.json();
    console.log('data', data);
    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error('❌ Error creating charge:', error);
    return NextResponse.json(
      { error: 'Failed to create charge' },
      { status: 500 },
    );
  }
}
