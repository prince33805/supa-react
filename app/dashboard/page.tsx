'use client';

import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { getOrdersWithItems } from '@/app/dashboard/actions';
// import { Database } from '@/types/supabase';
// import OrderDetails from '@/components/OrderDetails';
// import OrderDetails from './OrderDetails';

// type Orders = Database['public']['Tables']['orders']['Row'];

// const pageSize = 10;

export default function OrderTable() {
  // const [orders, setOrders] = useState<Orders[]>([]);
  // const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const [loading] = useState(true);
  // const [page, setPage] = useState(1);
  // const [total, setTotal] = useState(0);
  // const [pageInput, setPageInput] = useState('1'); // input เป็น string

  // useEffect(() => {
  //   void fetchOrders();
  // }, [page]);

  // useEffect(() => {
  //   setPageInput(String(page));
  // }, [page]);

  // const fetchOrders = async () => {
  //   setLoading(true);
  //   const orderData = await getOrdersWithItems(page, pageSize);
  //   setOrders(orderData.orders);
  //   setTotal(orderData.total);
  //   setLoading(false);
  // };

  // const totalPages = Math.max(1, Math.ceil(total / pageSize)); // ✅ ป้องกัน division by 0

  return (
    <div className="relative w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 min-h-screen">
          Loading dashboard..
        </div>
      ) : (
        <div>dashboard</div>
      )}
    </div>
  );
}
