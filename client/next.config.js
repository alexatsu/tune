// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // output: "standalone",
  reactStrictMode: false,
  images: {
    domains: ["http://localhost:8000"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/audio/saved/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/save-and-store",
        destination: "http://localhost:8000/save-and-store",
      },
    ];
  },
};
module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig)
