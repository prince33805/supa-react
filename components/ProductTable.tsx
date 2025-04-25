'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';

type Product = Database['public']['Tables']['product']['Row'];

export default function ProductTable() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const { addToCart } = useCart();

  useEffect(() => {
    void fetchProduct();
  }, []);

  const handleChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[id] ?? 1;
      const newQty = Math.max(1, currentQty + delta);
      return { ...prev, [id]: newQty };
    });
  };

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .order('created_at', { ascending: true });

    if (!data || error) return;
    setProducts(data as Product[]);
    setLoading(false);
  };

  const handleInputChange = (id: string, value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setQuantities((prev) => ({ ...prev, [id]: num }));
    }
  };

  const handleAdd = (product: Product) => {
    const qty = quantities[product.id] ?? 1;
    console.log('🔵 handleAdd called:', product.name, qty);
    addToCart(product, qty);
  };

  return (
    <div className="relative">
      {loading ? (
        <div className="text-center py-10 text-gray-500 min-h-screen">
          Loading products...
        </div>
      ) : (
        <>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center"
                >
                  <img
                    src={product.attachments ?? ''}
                    alt={product.name ?? ''}
                    className="w-24 h-24 object-cover mb-4 rounded"
                  />
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-gray-600">
                    ฿ {(product.price ?? 1).toFixed(2)}
                  </p>

                  <div className="flex items-center mt-4 space-x-2">
                    <button
                      onClick={() => handleChange(product.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] ?? '1'}
                      onChange={(e) =>
                        handleInputChange(product.id, e.target.value)
                      }
                      className="w-14 text-center border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => handleChange(product.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
