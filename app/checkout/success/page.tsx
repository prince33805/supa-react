'use client'

import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">✅ Payment Successful!</h1>
      <p>Order ID: {orderId}</p>
    </div>
  );
}
