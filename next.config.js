/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Support both Vercel and EdgeOne Pages
    SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.EDGEONE_URL
      ? `https://${process.env.EDGEONE_URL}`
      : 'http://localhost:3000'
  }
};

module.exports = nextConfig;
