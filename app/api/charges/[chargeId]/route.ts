import { NextRequest, NextResponse } from 'next/server';
// import type { NextApiRequest } from 'next';

export async function GET(
  req: NextRequest,
  // { params }: { params: { chargeId: string } }
): Promise<NextResponse> {
  // const { chargeId } = params;
  const chargeId = req.nextUrl.searchParams.get('id');

  try {
    const response = await fetch(`https://api.omise.co/charges/${chargeId}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.OMISE_SECRET_KEY}:`).toString('base64')}`,
      },
    });

    const data = await response.json();

    return NextResponse.json({ status: data.status });
  } catch (error) {
    console.error('Error fetching charge:', error);
    return NextResponse.json({ error: 'Failed to fetch charge status' }, { status: 500 });
  }
}
