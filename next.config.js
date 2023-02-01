/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});

module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  swcMinify: true,
  images: {
    // assuming you were using the Sanity.io image CDN
    // domains is an array of comma-separated strings
    // ['cdn.sanity.io', 'cdn.not-sanity.io', 'another domain']
    domains: [
      "foodcourt-media-bucket-dev-us-west-1.s3.us-west-1.amazonaws.com",
      "foodcourt-media-bucket-prod-us-west-1.s3.amazonaws.com",
      "toddassoc.com",
      "res.cloudinary.com",
    ],
  },
});