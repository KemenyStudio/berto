/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export when explicitly building for static deployment
  output: process.env.STATIC_BUILD ? 'export' : undefined,
  trailingSlash: process.env.STATIC_BUILD ? true : false,
  distDir: process.env.STATIC_BUILD ? 'out' : '.next',
  env: {
    // Suppress npm-related warnings
    NPM_RC: '',
    NPM_TOKEN: '',
  },
  // Suppress specific warnings in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress npm-related warnings in development
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    // Fix for webpack module resolution issues
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
  // Updated configuration for Next.js 15
  serverExternalPackages: [],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
