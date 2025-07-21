import { Database as BaseDatabase } from './supabase';

export type Database = BaseDatabase & {
  public: {
    Functions: {
      get_paid_product_sales: {
        Args: Record<string, never>;
        Returns: Array<{
          product_id: string;
          total_sales: number;
        }>;
      },
      get_paid_summary_by_method: {
        Args: Record<string, never>;
        Returns: Array<{
          payment_method: string;
          total_amount: number;
        }>;
      },
      get_top_product_sales_with_rest: {
        Args: Record<string, never>;
        Returns: Array<{
          product_id: string;
          total_sales: number;
        }>;
      },
      get_product_profits: {
        Args: Record<string, never>;
        Returns: Array<{
          product_id: string;
          profit: number;
        }>;
      },
      get_top_product_profits_with_rest: {
        Args: Record<string, never>;
        Returns: Array<{
          product_id: string;
          name: string;
          profit: number;
        }>;
      },
      get_top5_monthly_sales_compare: {
        Args: Record<string, never>;
        Returns: Array<{
          product_id: string;
          product_name: string;
          name: string;
          total_price_this_month: number;
          total_price_last_month: number;
        }>;
      },
    };
  };
};
