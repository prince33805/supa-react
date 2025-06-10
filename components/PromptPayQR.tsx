'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

type Props = {
  orderId: string | null;
  chargeId: string | null;
  qrImageUrl: string;
  onPaid?: () => void;
};

export default function PromptPayQR({
  orderId,
  chargeId,
  qrImageUrl,
  onPaid,
}: Props) {
  const supabase = createClient();
  const [status, setStatus] = useState<'pending' | 'paid' | 'error'>('pending');
  const [checking, setChecking] = useState(true);

  // Poll status from Supabase every 5 sec
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('❌ Error checking order status:', error);
        setStatus('error');
        clearInterval(interval);
        return;
      }

      if (data?.status === 'paid') {
        setStatus('paid');
        setChecking(false);
        clearInterval(interval);
        onPaid?.(); // call callback
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, supabase, onPaid]);

  return (
    <div className="text-center space-y-4 mt-6">
      <h3 className="text-lg font-bold">📱 Scan to Pay with PromptPay</h3>

      {qrImageUrl && (
        <Image
          src={qrImageUrl}
          alt="PromptPay QR"
          width={240}
          height={240}
          className="mx-auto border rounded-xl"
        />
      )}

      <p className="text-gray-500 text-sm">
        Order ID: <code className="text-xs">{orderId}</code>
      </p>

      {status === 'pending' && (
        <p className="text-yellow-600 font-medium">กำลังรอการชำระเงิน...</p>
      )}

      {status === 'paid' && (
        <p className="text-green-600 font-bold text-lg">
          ✅ ชำระเงินเรียบร้อยแล้ว!
        </p>
      )}

      {status === 'error' && (
        <p className="text-red-500">❌ เกิดข้อผิดพลาดในการตรวจสอบสถานะ</p>
      )}
    </div>
  );
}
