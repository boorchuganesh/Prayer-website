/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
    minimumCacheTTL: 60,
  },
  compress: true,
  reactStrictMode: false, // Disable strict mode to prevent double-rendering
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog', 
      '@radix-ui/react-tabs',
      'lucide-react'
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        },
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        }
      ]
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400'
        }
      ]
    }
  ]
}

export default nextConfig
