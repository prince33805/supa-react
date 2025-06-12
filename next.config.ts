import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none';",
    domains: ['api.omise.co', 'ulfpbrucgvvlqpxhlsjh.supabase.co'],
  },
};

export default nextConfig;
