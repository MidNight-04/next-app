/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // BACKEND_BASE_URL: 'https://api.thikedaar.in',
    BACKEND_BASE_URL: 'http://localhost:4000',
    NEXTAUTH_SECRET: 'QAHzHrsHgYUL3hJcE/RprVVK2vxVyalv/LjsZl11n8U=',
    // NEXTAUTH_URL: 'https://www.bldox.com',
    NEXTAUTH_URL: 'http://localhost:3000',
  },
  images: {
    // domains: ["localhost"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
