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
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
    ],
  },
};
module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig)

// module.exports = {
//   async headers() {
//     return [
//       {
//         source: '/',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: "default-src 'self'; frame-src https://www.youtube.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://www.youtube.com; allow-same-origin",
//           },
//         ],
//       },
//     ];
//   },
// };
