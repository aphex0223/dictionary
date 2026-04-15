/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/dict',
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
      : 'http://localhost:3000/dict'
  }
};

module.exports = nextConfig;
