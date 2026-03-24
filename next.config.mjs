/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow fabric.js to work properly
  webpack: (config) => {
    config.externals = config.externals || []
    return config
  },
}

export default nextConfig
