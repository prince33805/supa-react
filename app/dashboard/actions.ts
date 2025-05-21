'use server';

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';

type Orders = Database['public']['Tables']['orders']['Row'];

export const getOrdersWithItems = async (
  page: number,
  pageSize: number,
): Promise<{ orders: Orders[]; total: number }> => {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('orders')
    .select(
      `
            id,
            total_price,
            created_at,
            updated_at,
            payment_method,
            order_items (
                product_id,
                quantity,
                price,
                total_price_product,
                product:product_id (
                    id,
                    name
                )
            )
        `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error.message);
    return { orders: [], total: 0 };
  }

  const orders = (data || []).map((order) => ({
    ...order,
    items: order.order_items ?? [],
  }));

  return { orders, total: count ?? 0 };
};
