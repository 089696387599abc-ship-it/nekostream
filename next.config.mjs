/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.craftvel.com',
      },
      {
        protocol: 'https',
        hostname: 'media.craftvel.com',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
      },
      {
        protocol: 'https',
        hostname: '*.anilist.co',
      },
    ],
  },
};

export default nextConfig;
