import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // custom client ที่มี service key ก็ได้

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createClient(); // ใช้ service role จะได้ bypass RLS

  if (body.key === 'charge.complete' && body.data.status === 'successful') {
    const chargeId = body.data.id;

    // 👇 สมมุติคุณมี field ชื่อ omise_charge_id ใน orders
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('omise_charge_id', chargeId);

    if (error) {
      console.error('❌ Error updating order:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Ignored' });
}
