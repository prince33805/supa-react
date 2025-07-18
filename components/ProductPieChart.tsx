'use client';

import {
  PieChart as RechartsPieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ProductPieChart({
  products,
  title,
}: {
  products: {
    product_id: string;
    name: string;
    total_sales?: number;
    profit?: number;
    fill: string;
  }[];
  title: string;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set to true after component mounts (only on client)
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // prevent mismatches during SSR

  const totalSales = products.reduce(
    (sum, p) => sum + (p.total_sales ?? p.profit ?? 0),
    0,
  );

  const chartData = products.map((p) => ({
    productId: p.product_id,
    name: p.name,
    value: p.total_sales ?? p.profit,
    fill: p.fill,
    percent: (((p.total_sales ?? p.profit ?? 0) / totalSales) * 100).toFixed(1),
  }));
  return (
    // border border-green-500
    <div className="rounded-2xl p-4 flex-1 min-w-[130px] bg-whitetransition-colors">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      {/* border border-red-500 */}
      <div className="flex justify-between gap-2 items-center justify-self-center ">
        <RechartsPieChart width={350} height={450}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            labelLine={false}
          />
          <Tooltip />

          {/* <Legend verticalAlign="bottom" height={36} /> */}
          <Legend
            // height={36}
            verticalAlign="bottom"
            layout="vertical"
            align="center"
            content={() => (
              <ul className="text-sm space-y-1 ml-2">
                {chartData.map((entry, index) => (
                  <li
                    key={`legend-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span>
                      {entry.name} : {entry.value} ({entry.percent}%)
                    </span>
                  </li>
                ))}
              </ul>
            )}
          />
        </RechartsPieChart>
      </div>
    </div>
  );
}
