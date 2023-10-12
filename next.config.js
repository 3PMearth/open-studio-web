/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    API_KEY: process.env.API_KEY,
    TARGET: process.env.TARGET,
    WEB3AUTH_CLIENT_ID: process.env.WEB3AUTH_CLIENT_ID,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  },
  images: {
    domains: ['3pm-open-studio.s3.ap-northeast-2.amazonaws.com'],
  },
};

module.exports = nextConfig;
