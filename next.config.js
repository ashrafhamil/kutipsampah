/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tile.openstreetmap.org'],
  },
  async redirects() {
    return [
      { source: '/favicon.ico', destination: '/icon', permanent: false },
    ]
  },
}

module.exports = nextConfig
