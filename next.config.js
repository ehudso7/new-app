/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['m.media-amazon.com', 'images-na.ssl-images-amazon.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
