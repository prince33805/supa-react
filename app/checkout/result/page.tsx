'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type ChargeStatus = 'successful' | 'failed' | 'pending' | 'unknown';

export default function CheckoutResultPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<ChargeStatus>('unknown');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchChargeStatus = async () => {
      const supabase = createClient();
      if (!orderId) {
        setErrorMessage('Missing order ID in URL');
        setIsLoading(false);
        return;
      }

      // Get chargeId from Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .select('omise_charge_id')
        .eq('id', orderId)
        .single();

      if (error || !order?.omise_charge_id) {
        setErrorMessage('Order not found or missing charge ID.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/omise-charge-status?id=${order.omise_charge_id}`,
        );
        const chargeData = await res.json();

        if (!res.ok || !chargeData.status) {
          throw new Error('Failed to fetch charge status.');
        }

        setStatus(chargeData.status); // e.g., "successful", "failed", "pending"
      } catch (err) {
        console.error('Error checking charge status:', err);
        setErrorMessage('Unable to verify payment status.');
      }

      setIsLoading(false);
    };

    fetchChargeStatus();
  }, [orderId]);

  if (isLoading) return <p className="p-4">⏳ Checking payment status...</p>;
  if (errorMessage)
    return <p className="p-4 text-red-600">❌ {errorMessage}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md text-center">
      {status === 'successful' && (
        <>
          <h2 className="text-2xl font-bold text-green-600">
            ✅ Payment Successful
          </h2>
          <p className="mt-2">Thank you! Your order has been confirmed.</p>
        </>
      )}
      {status === 'failed' && (
        <>
          <h2 className="text-2xl font-bold text-red-600">❌ Payment Failed</h2>
          <p className="mt-2">
            There was a problem processing your payment. Please try again.
          </p>
        </>
      )}
      {status === 'pending' && (
        <>
          <h2 className="text-2xl font-bold text-yellow-500">
            ⌛ Payment Pending
          </h2>
          <p className="mt-2">
            Your payment is still processing. Please wait or check again later.
          </p>
        </>
      )}
      {status === 'unknown' && (
        <>
          <h2 className="text-2xl font-bold text-gray-700">
            ⚠️ Unknown Status
          </h2>
          <p className="mt-2">We couldn't determine the payment status.</p>
        </>
      )}
    </div>
  );
}
