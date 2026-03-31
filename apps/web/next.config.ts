import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@chinook/db"],
};

export default nextConfig;
