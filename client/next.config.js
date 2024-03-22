// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // output: "standalone",
  reactStrictMode: false,
};
module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig)
