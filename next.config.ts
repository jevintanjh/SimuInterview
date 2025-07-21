import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'http://localhost:9002',
      'http://172.31.128.34:9002',
      '2f68414d-00cd-4213-aa14-b8283a4ae13b-00-3qpreagyovnug.sisko.replit.dev'
    ],
  },
};

export default nextConfig;
