'use client';

import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
import { getOrdersWithItems, getOrderItemsByDate } from '@/app/order/actions';
import { Database } from '@/types/supabase';
import OrderDetails from '@/components/OrderDetails';
// import OrderDetails from './OrderDetails';

type Orders = Database['public']['Tables']['orders']['Row'];

type OrdersWithItems = {
  created_at: string;
  deleted_at: string | null;
  updated_at: string | null;
  id: string;
  payment_method: string | null;
  total_price: number;
  items: [];
};

const pageSize = 10;

export default function OrderTable() {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrdersWithItems | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageInput, setPageInput] = useState('1'); // input เป็น string
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    void fetchOrders();
  }, [page, fromDate, toDate]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    const orderData = await getOrdersWithItems(
      page,
      pageSize,
      fromDate,
      toDate,
    );
    setOrders(orderData.orders);
    setTotal(orderData.total);
    setLoading(false);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize)); // ✅ ป้องกัน division by 0

  const handleExportCSV = async () => {
    try {
      const { orderItems } = await getOrderItemsByDate(
        // page,
        // pageSize,
        fromDate,
        toDate,
      );

      console.log('orderItems', orderItems.length);
      // return

      if (!orderItems.length) {
        alert('No data to export.');
        return;
      }

      const headers = [
        'Order Item ID',
        'Order ID',
        'Product ID',
        'Quantity',
        'Price',
        'Total Price',
        'Created At',
      ];

      const rows = orderItems.map((item) => [
        item.id,
        item.order_id,
        item.product_id,
        item.quantity,
        item.price,
        item.total_price_product,
        new Date(item.created_at ?? '').toLocaleString(),
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers, ...rows].map((e) => e.join(',')).join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'order_items_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('CSV Export Error:', error);
      alert('Failed to export CSV.');
    }
  };

  return (
    <div className="relative w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 min-h-screen">
          Loading orders...
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-4">
            {/* Date Pickers */}
            <div className="flex flex-col md:flex-row gap-2 items-center md:items-center ">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label
                  htmlFor="from"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  From:
                </label>
                <input
                  type="date"
                  id="from"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-10 md:px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label
                  htmlFor="to"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  To:
                </label>
                <input
                  type="date"
                  id="to"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-10 md:px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Export Button */}
            <div className="">
              <button
                onClick={() => {
                  void handleExportCSV();
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-10 md:px-4 py-2 rounded-md shadow "
              >
                Export CSV
              </button>
            </div>
          </div>

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
                  <th scope="col" className="px-4 py-4">
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
                {orders?.map((order: Orders) => (
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    key={order.id}
                  >
                    {/* <td className="px-6 py-4">
                      {total > 0 ? total - (page - 1) * pageSize - index : '-'}
                    </td> */}
                    <td className="px-6 py-4">{order.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4">{order.total_price}</td>
                    <td className="px-6 py-4">{order.payment_method}</td>
                    <td className="px-6 py-4">
                      {new Date(order.created_at ?? '').toLocaleString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        },
                      )}
                    </td>

                    <td className="py-4 flex justify-center gap-4">
                      <button
                        onClick={() =>
                          setSelectedOrder({ ...order, items: [] })
                        }
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
