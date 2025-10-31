import type { NextConfig } from "next";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;