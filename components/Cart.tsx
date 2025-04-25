'use client';

import React from 'react';
import { useCart } from './CartContext';
import { createClient } from '@/utils/supabase/client'; // อย่าลืมนำเข้า Supabase client
import { Database } from '@/types/supabase';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];

export default function Cart() {
  const supabase = createClient();
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleSubmitOrder = async () => {
    const timestamp = new Date().toISOString();
    const order: OrderInsert = {
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total_price: total,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const { error } = await supabase.from('orders').insert([order]);
    if (error) {
      console.error('❌ Error creating order:', error);
      return;
    }

    alert('✅ Order submitted successfully!');
    clearCart();
  };

  return (
    <div className="p-8 max-w-2xl m-6 bg-white shadow-lg rounded-2xl mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h2>
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
        <p className="text-gray-500 text-center py-10">
          No items in your cart.
        </p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × ฿{item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-gray-700">
                  ฿{(item.quantity * item.product.price).toFixed(2)}
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

          <div className="pt-4 border-t text-right">
            <p className="text-lg font-bold text-gray-800">
              Total: ฿{total.toFixed(2)}
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSubmitOrder}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
