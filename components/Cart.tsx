'use client';

import React from 'react';
import { useCart } from './CartContext';
import { createClient } from '@/utils/supabase/client'; // อย่าลืมนำเข้า Supabase client
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

type Props = {
  onOrderSubmitted: () => void;
};

export default function Cart({ onOrderSubmitted }: Props) {
  const supabase = createClient();
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce(
    (sum, item) => sum + (item.product.price ?? 1) * item.quantity,
    0,
  );

  const handleSubmitOrder = async () => {
    const timestamp = new Date().toISOString();
    const orderId = uuidv4(); // ให้ front-end gen ก็ได้ หรือให้ Supabase gen ก็ได้
    const order: OrderInsert = {
      id: orderId,
      total_price: total,
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

    const { error: itemError } = await supabase.from('order_items').insert(orderItems);
    if (itemError) {
      console.error('❌ Failed to insert items, rolling back order...');
      await supabase.from('orders').delete().eq('id', orderId); // rollback
      return;
    }

    alert('✅ Order submitted successfully!');
    clearCart();
    onOrderSubmitted(); // clear the ProductTable input fields
  };

  return (
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
                <p className="font-semibold text-gray-800 dark:text-white">
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

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => handleSubmitOrder()}
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
