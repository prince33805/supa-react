'use server';

import { createClient } from '@/utils/supabase/server';

export async function getProductSalesGroupedByProductId() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_paid_product_sales');
  if (error) {
    console.error('Supabase RPC error:', error);
    return [];
  }
  return data;
}

export async function getPaidSummaryByMethod() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_paid_summary_by_method');
  if (error) {
    console.error('Supabase RPC error:', error);
    return [];
  }
  return data;
}

export async function getTopProductSalesWithRest() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_top_product_sales_with_rest');
  if (error) {
    console.error('Supabase RPC error:', error);
    return [];
  }
  return data;
}

export async function getProductProfits() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_product_profits');
  if (error) {
    console.error('Supabase RPC error:', error);
    return [];
  }
  return data;
}

export async function getTopProductProfitsRest() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_top_product_profits_with_rest');
  if (error) {
    console.error('Supabase RPC error:', error);
    return [];
  }
  return data;
}

export async function getTop5MonthlySalesCompare() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_top5_monthly_sales_compare');
  if (error) {
    console.error('Supabase RPC error:', error);
    return [];
  }
  return data;
}