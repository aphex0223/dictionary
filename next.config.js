/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  basePath: isProduction ? '/dict' : '',
  async rewrites() {
    return [
      { source: '/api/:path*', destination: '/api/:path*' },
    ]
  },
  env: {
    // Support both Vercel and EdgeOne Pages
    SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/dict`
      : process.env.EDGEONE_URL
      ? `https://${process.env.EDGEONE_URL}/dict`
      : 'http://localhost:3000'
  },
  // 修复样式和资源加载问题
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ]
  }
};

module.exports = nextConfig;
