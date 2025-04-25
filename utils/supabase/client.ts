import { createBrowserClient } from "@supabase/ssr";
// import { type Database } from '@/types/supabase';
// <Database>
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
