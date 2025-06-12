import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    console.log('📥 Incoming request:', req.method, req.url);

    if (req.method !== 'POST') {
      console.warn('⚠️ Method not allowed:', req.method);
      return new Response('Method Not Allowed', { status: 405 });
    }

    const payload = await req.json();

    console.log('📦 Payload received:', JSON.stringify(payload));

    // ✅ ตรวจสอบและ log ENV
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const roleKeyShort = serviceRoleKey?.slice(0, 5);

    if (!serviceRoleKey || !supabaseUrl) {
      console.error('❌ Missing environment variables.');
      return new Response(JSON.stringify({ error: 'Missing ENV' }), {
        status: 500,
      });
    }

    console.log('🔑 ENV loaded:', {
      supabaseUrl,
      roleKeyShort,
    });

    // ✅ สร้าง Supabase client
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // ✅ Log to table
    const { error: logError } = await supabase.from('webhook_logs').insert([
      {
        payload,
        key_prefix: roleKeyShort,
        key_url: supabaseUrl,
        created_at: new Date().toISOString(),
      },
    ]);

    if (logError) {
      console.error(
        '❌ Failed to insert webhook log:',
        logError.message,
        logError,
      );
    } else {
      console.log('📝 Logged webhook to database.');
    }

    // ✅ เงื่อนไขกรณีพิเศษ
    if (
      payload.key === 'charge.complete'
      // payload.data?.status === 'successful'
    ) {
      const chargeId = payload.data.id;
      const chargeStatus = payload.data?.status;

      console.log(
        `💬 Charge complete detected: ${chargeId} with status ${chargeStatus}`,
      );

      if (!chargeId || !chargeStatus) {
        console.error('❌ Missing chargeId or status in payload');
        return new Response(JSON.stringify({ error: 'Invalid payload' }), {
          status: 400,
        });
      }

      // อัปเดตสถานะคำสั่งซื้อในฐานข้อมูล
      const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({ status: chargeStatus === 'successful' ? 'paid' : 'failed' })
        .eq('omise_charge_id', chargeId);

      console.log('[Debug] updateData:', updateData);
      console.error('[Debug] updateError:', updateError?.message, updateError);

      if (updateError) {
        console.error(
          '❌ Failed to update order status:',
          updateError.message,
          updateError,
        );
        return new Response(JSON.stringify({ error: updateError }), {
          status: 500,
        });
      }

      console.log('✅ Order marked as paid:', chargeId);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    console.log('ℹ️ Webhook received but ignored.');
    return new Response(JSON.stringify({ message: 'ignored' }), {
      status: 200,
    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'internal server error' }), {
      status: 500,
    });
  }
});
