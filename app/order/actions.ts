'use server';

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';

// type Orders = Database['public']['Tables']['orders']['Row'];
type OrderItems = Database['public']['Tables']['order_items']['Row'];

type OrderItem = {
  product_id: string;
  quantity: number;
  price: number;
  total_price_product: number;
};

type OrderWithItems = {
  id: string;
  total_price: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  payment_method: string | null;
  order_items: OrderItem[];
};

export const getOrdersWithItems = async (
  page: number,
  pageSize: number,
  fromDate: string,
  toDate: string,
): Promise<{ orders: OrderWithItems[]; total: number }> => {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('orders')
    .select(
      `
        id,
        total_price,
        payment_method,
        status,
        created_at,
        updated_at,
        order_items (
          product_id,
          quantity,
          price,
          total_price_product
        )
      `,
      { count: 'estimated' } 
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (fromDate) query = query.gte('created_at', fromDate);
  if (toDate) query = query.lte('created_at', toDate);

  const result = await query;
  const data = result.data as OrderWithItems[] | null;
  const error = result.error;

  if (error || !data) {
    console.error('Error fetching orders:', error?.message);
    return { orders: [], total: 0 };
  }

  const orders = data.map((order) => ({
    ...order,
    deleted_at: null, // fallback
  }));


  console.log('data', result.count);
  return { orders, total: result.count ?? 0 };
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
    )
    .order('created_at', { ascending: false });

  if (fromDate) {
    query = query.gte('created_at', fromDate);
  }
  if (toDate) {
    query = query.lte('created_at', toDate);
  }

  const { data, error } = await query;
  console.log('data', data?.length);

  if (error) {
    console.error('Error fetching ordersssssss:', error.message);
    return { orderItems: [], total: 0 };
  }

  const orderItems = (data ?? []) as unknown as OrderItems[];

  return { orderItems, total: orderItems.length ?? 0 };
};
