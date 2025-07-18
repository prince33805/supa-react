'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';

export default function BarChartProduct({
  products,
}: {
  products: {
    product_id: string;
    product_name: string;
    total_price_last_month: number;
    total_price_this_month: number;
  }[];
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const chartData = products.map((p) => ({
    productId: p.product_id,
    name: p.product_name,
    total_price_last_month: p.total_price_last_month,
    total_price_this_month: p.total_price_this_month,
  }));

  return (
    // dark:bg-gray-800
    <div className="rounded-2xl pr-4 light:bg-white transition-colors w-full h-[400px]">
      <h3 className="text-lg font-semibold text-left mb-6">
        Bar chart compare selling product
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-20}
            textAnchor="end"
            tickFormatter={(name) => name.split(' ')[0]}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_price_this_month" fill="#4299e1" />
          <Bar dataKey="total_price_last_month" fill="#90cdf4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
