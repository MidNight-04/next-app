/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_BASE_PATH: "https://api.thikedaar.in",
    // REACT_APP_BASE_PATH: "http://localhost:4000",
    NEXTAUTH_SECRET: "QAHzHrsHgYUL3hJcE/RprVVK2vxVyalv/LjsZl11n8U=",
  },
  images: {
    // domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
