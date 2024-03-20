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
    return [
      {
        source: "/save-and-store",
        destination: "http://ms.tuneaudio.fun/save-and-store",
      },
      {
        source: "/audio",
        destination: "http://ms.tuneaudio.fun/audio",
      },
      {
        source: "/audio/saved/:id/thumbnail.jpg",
        destination: "http://ms.tuneaudio.fun/audio/saved/:id/thumbnail.jpg",
      },
      {
        source: "/stream",
        destination: "http://ms.tuneaudio.fun/stream",
      },
    ];
  },
};
module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig)
