/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  // Disable static rendering for dynamic pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ["via.placeholder.com"],
  },
};

module.exports = nextConfig;
