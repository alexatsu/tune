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
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/audio/saved/**",
      },
    ],
  },
  async rewrites() {
    console.log("rewrites called")
    return [
      {
        source: "/save-and-store",
        destination: "https://ms.tuneaudio.fun/save-and-store",
      },
      {
        source: "/audio",
        destination: "https://ms.tuneaudio.fun/audio",
      },
      {
        source: "/audio/saved/:id/thumbnail.jpg",
        destination: "https://ms.tuneaudio.fun/audio/saved/:id/thumbnail.jpg",
      },
      {
        source: "/stream",
        destination: "https://ms.tuneaudio.fun/stream",
      },
    ];
  },
};
module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig)
