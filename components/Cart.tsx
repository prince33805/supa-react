'use client';

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import PromptPayQR from './PromptPayQR';
import Omise from 'omise';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

type Props = {
  onOrderSubmitted: () => void;
};

export default function Cart({ onOrderSubmitted }: Props) {
  const supabase = createClient();
  const { cart, removeFromCart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [omiseChargeId, setOmiseChargeId] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const total = cart.reduce(
    (sum, item) => sum + (item.product.price ?? 1) * item.quantity,
    0,
  );

  const handleSubmitOrder = async () => {
    const timestamp = new Date().toISOString();
    const orderId = uuidv4();

    let chargeId: string | null = null;
    let qrUrl: string | null = null;
    let data;

    if (paymentMethod === 'qr') {
      try {
        const res = await fetch('/api/create-omise-charge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total * 100, // Omise ต้องการหน่วยเป็นสตางค์
            currency: 'thb',
          }),
        });
        data = await res.json();
        if (!res.ok || data.object !== 'charge' || data.status !== 'pending') {
          console.error('❌ Omise Charge failed:', data);
          alert('❌ Failed to create Omise QR charge');
          return;
        }
        console.log('data qr', data);
      } catch (err) {
        console.error('❌ Error creating Omise charge:', err);
        alert('❌ Error contacting Omise server');
        return;
      }
    } else if (paymentMethod === 'linepay') {
      const res = await fetch('/api/create-card-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total * 100, // Omise ต้องการหน่วยเป็นสตางค์
          currency: 'thb',
          orderId,
        }),
      });
      data = await res.json();
      console.log('data linepay', data);
      if (data.authorize_uri) {
        window.location.href = data.authorize_uri; // 👉 redirect ไปหน้า Omise
      }
      if (!res.ok || data.object !== 'charge' || data.status !== 'pending') {
        console.error('❌ Omise Charge failed:', data);
        alert('❌ Failed to create Omise Linepay charge');
        return;
      }
      console.log('data linepay', data);
    }
    chargeId = data?.id ?? null;

    qrUrl = data?.source?.scannable_code?.image?.download_uri;
    if (qrUrl) setQrImageUrl(qrUrl);
    console.log(qrImageUrl);

    setOmiseChargeId(chargeId);
    setCurrentOrderId(orderId);

    const order: OrderInsert = {
      id: orderId,
      total_price: total,
      payment_method: paymentMethod,
      omise_charge_id: chargeId,
      status: paymentMethod === 'cash' ? 'paid' : 'pending',
      created_at: timestamp,
      updated_at: timestamp,
    };
    const { error } = await supabase.from('orders').insert([order]);
    if (error) {
      console.error('❌ Error creating order:', error);
      return;
    }
    const orderItems: OrderItemInsert[] = cart.map((item) => {
      const price = item.product.price ?? 1;
      const quantity = item.quantity;
      return {
        order_id: orderId,
        product_id: item.product.id,
        quantity,
        price,
        total_price_product: price * quantity,
        created_at: timestamp,
        updated_at: timestamp,
      };
    });
    const { error: itemError } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemError) {
      console.error('❌ Failed to insert items, rolling back order...');
      await supabase.from('orders').delete().eq('id', orderId);
      return;
    }

    console.log({ qrModalVisible, qrImageUrl, omiseChargeId, currentOrderId });

    if (paymentMethod === 'qr') {
      setQrModalVisible(true); // เปิด QR Modal
    } else if (paymentMethod === 'cash') {
      alert('order submitted !!!'); // เปิด QR Modal
    }
    setPaymentMethod('cash')
    clearCart();
    onOrderSubmitted();
  };

  return (
    <>
      <div className="p-8 max-w-2xl m-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            🛒 Your Cart
          </h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Clear
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-10">
            No items in your cart.
          </p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3"
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white break-all">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity} × ฿{(item.product.price ?? 1).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    ฿{(item.quantity * (item.product.price ?? 1)).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 transition text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                Total: ฿{total.toFixed(2)}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <p className="font-medium">💳 Payment Method</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                  />
                  <span>Cash</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="qr"
                    checked={paymentMethod === 'qr'}
                    onChange={() => setPaymentMethod('qr')}
                  />
                  <span>QR Code Payment</span>
                </label>

                {paymentMethod === 'qr' && (
                  <div className="mt-2 mx-auto">
                    <Image
                      src="/images/qrcode.jpeg" // เปลี่ยนเป็น path QR จริง
                      alt="QR Payment"
                      width={200}
                      height={200}
                      className="border rounded"
                    />
                    <p className="text-sm mt-1 text-gray-500">📸 Scan to pay</p>
                  </div>
                )}

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="linepay"
                    checked={paymentMethod === 'linepay'}
                    onChange={() => setPaymentMethod('linepay')}
                  />
                  <span>Rabbit Linepay</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  void handleSubmitOrder();
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition mx-auto"
              >
                Submit Order
              </button>
            </div>
          </div>
        )}
      </div>

      {qrModalVisible && currentOrderId && qrImageUrl && omiseChargeId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full text-center shadow-lg relative">
            <PromptPayQR
              orderId={currentOrderId}
              chargeId={omiseChargeId}
              qrImageUrl={qrImageUrl}
              onPaid={() => {
                alert('✅ ชำระเงินเรียบร้อยแล้ว!');
                setQrModalVisible(false);
                clearCart();
                onOrderSubmitted();
              }}
            />
            <button
              onClick={() => setQrModalVisible(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
