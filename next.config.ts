import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextlakelabs-backened.onrender.com",
      },
    ],
  },
};

export default nextConfig;
