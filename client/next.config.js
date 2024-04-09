// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
      },
    ],
  },
};
module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig)
