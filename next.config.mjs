/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.ELECTRON_BUILD ? 'export' : undefined,
  trailingSlash: true,
  distDir: 'out',
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
