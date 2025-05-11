'use client';

import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
import { getOrdersWithItems } from '@/app/dashboard/actions';
import { Database } from '@/types/supabase';
import OrderDetails from '@/components/OrderDetails';
// import OrderDetails from './OrderDetails';

type Orders = Database['public']['Tables']['orders']['Row'];

const pageSize = 10;

export default function OrderTable() {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageInput, setPageInput] = useState('1'); // input เป็น string

  useEffect(() => {
    void fetchOrders();
  }, [page]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    const orderData = await getOrdersWithItems(page, pageSize);
    setOrders(orderData.orders);
    setTotal(orderData.total);
    setLoading(false);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize)); // ✅ ป้องกัน division by 0

  return (
    <div className="relative w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 min-h-screen">
          Loading orders...
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Total Price
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-4 flex justify-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders?.map((order: Orders, index: number) => (
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    key={order.id}
                  >
                    <td className="px-6 py-4">
                      {total > 0 ? total - (page - 1) * pageSize - index : '-'}
                    </td>
                    <td className="px-6 py-4">{order.total_price}</td>
                    <td className="px-6 py-4">{order.payment_method}</td>
                    <td className="px-6 py-4">
                      {new Date(order.created_at ?? '').toLocaleString()}
                    </td>
                    <td className="py-4 flex justify-center gap-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedOrder && (
              <OrderDetails
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-2 m-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const parsed = parseInt(pageInput, 10);
                if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
                  setPage(parsed);
                }
              }}
              className="flex items-center justify-center gap-2 mt-4 flex-wrap"
            >
              {/* หน้าแรก */}
              <button
                type="button"
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                ⏮
              </button>

              {/* หน้าก่อนหน้า */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                ←
              </button>

              {/* ช่องกรอกเลขหน้า */}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className="w-16 text-center border rounded px-2 py-1 text-sm"
                />
                <span className="text-sm text-gray-500">/ {totalPages}</span>
              </div>

              {/* หน้าถัดไป */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                →
              </button>

              {/* หน้าสุดท้าย */}
              <button
                type="button"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                ⏭
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
