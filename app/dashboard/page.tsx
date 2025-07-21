'use client';

import { useEffect, useState } from 'react';
import {
  getPaidSummaryByMethod,
  getProductProfits,
  getProductSalesGroupedByProductId,
  getTop5MonthlySalesCompare,
  getTopProductProfitsRest,
  getTopProductSalesWithRest,
} from '@/app/dashboard/actions';
import { createClient } from '@/utils/supabase/client';
import PayMetCard from '@/components/PayMetCard';
import { useTheme } from 'next-themes';
import ProductPieChart from '@/components/ProductPieChart';
import { BarChart } from 'recharts';
import BarChartProduct from '@/components/BarChartProduct';

export default function OrderTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [productProfitsRest, setProductProfitsRest] = useState<any[]>([]);
  const [product5, setProduct5] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([
        fetchMethod(),
        fetchProducts(),
        fetchProductProfitsRest(),
        fetch5Product(),
      ]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    const productSales = await getTopProductSalesWithRest();
    const supabase = createClient();
    const { data: products } = await supabase
      .from('product')
      .select('id, name');
    const colors =
      resolvedTheme === 'light'
        ? ['#90cdf4', '#63b3ed', '#4299e1', '#2b6cb0', '#1a365d']
        : ['#3182ce', '#63b3ed', '#90cdf4', '#bee3f8', '#ebf8ff'];
    const mergedProducts = productSales
      .map((sale, index) => {
        const product = products?.find((p) => p.id === sale.product_id);
        return {
          id: sale.product_id,
          name: product?.name ?? 'Others',
          total_sales: sale.total_sales,
          fill: colors[index % colors.length],
        };
      })
      .sort((a, b) => a.total_sales - b.total_sales);
    setProducts(mergedProducts);
  };

  const fetchMethod = async () => {
    const methods = await getPaidSummaryByMethod();
    setMethods(methods);
  };

  const fetchProductProfitsRest = async () => {
    const productSales = await getTopProductProfitsRest();
    const colors =
      resolvedTheme === 'light'
        ? ['#90cdf4', '#63b3ed', '#4299e1', '#2b6cb0', '#1a365d']
        : ['#3182ce', '#63b3ed', '#90cdf4', '#bee3f8', '#ebf8ff'];
    const mergedProducts = productSales
      .map((sale, index) => {
        return {
          id: sale.product_id,
          name: sale.name,
          profit: sale.profit,
          fill: colors[index % colors.length],
        };
      })
      .sort((a, b) => a.profit - b.profit);
    setProductProfitsRest(mergedProducts);
  };

  const fetch5Product = async () => {
    const productSales = await getTop5MonthlySalesCompare();
    setProduct5(productSales);
  };

  return (
    <div className="relative w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 min-h-screen">
          Loading dashboard..
        </div>
      ) : (
        <>
          <div className="grid mb-4 md:grid-cols-3 gap-4 px-4 md:px-0 mx-auto max-w-5xl">
            {methods.map((method) => (
              <PayMetCard
                key={method.payment_method}
                paymentMethod={method.payment_method}
                totalAmount={method.total_amount}
              />
            ))}
          </div>
          {/* gap-4 px-4 md:px-0 */}
          <div className="grid mb-4 md:grid-cols-2 lg:grid-cols-2 ">
            <ProductPieChart title="Top Selling Products" products={products} />
            <ProductPieChart
              title="Top Profits Products"
              products={productProfitsRest}
            />
            <div className=""></div>
          </div>
          <div className="grid mb-4 grid-cols-1 gap-4 px-4 md:px-0 mx-auto max-w-5xl">
            <BarChartProduct products={product5} />
          </div>
          <div className="w-full h-[100px] pt-4"></div>
        </>
      )}
    </div>
  );
}
