/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable dynamic routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

module.exports = nextConfig;