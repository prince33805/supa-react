'use server';

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';

type Orders = Database['public']['Tables']['orders']['Row'];
type OrderItems = Database['public']['Tables']['order_items']['Row'];

export const getOrdersWithItems = async (
  page: number,
  pageSize: number,
  fromDate: string,
  toDate: string,
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

  if (fromDate) {
    query = query.gte('created_at', fromDate);
  }
  if (toDate) {
    query = query.lte('created_at', toDate);
  }

  const { data, count, error } = await query;
  // console.log("datagetOrdersWithItems",data?.length)

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

export const getOrderItemsByDate = async (
  // page: number,
  // pageSize: number,
  fromDate: string,
  toDate: string,
): Promise<{ orderItems: OrderItems[]; total: number }> => {
  const supabase = await createClient();

  // const from = (page - 1) * pageSize;
  // const to = from + pageSize - 1;

  let query = supabase
    .from('order_items')
    .select(
      `
        id,
        order_id,
        product_id,
        quantity,
        price,
        total_price_product,
        created_at
      `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false });

  if (fromDate) {
    query = query.gte('created_at', fromDate);
  }
  if (toDate) {
    query = query.lte('created_at', toDate);
  }

  const { data, count, error } = await query;
  console.log('data', data?.length);

  if (error) {
    console.error('Error fetching ordersssssss:', error.message);
    return { orderItems: [], total: 0 };
  }

  const orderItems = (data ?? []) as unknown as OrderItems[];

  return { orderItems, total: count ?? 0 };
};
