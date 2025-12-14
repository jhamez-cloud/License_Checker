import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
        ignoreDuringBuilds: true, // disables ESLint during production build
    },
} as never;

export default nextConfig;
