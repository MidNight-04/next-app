/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_BASE_PATH: "http://3.6.218.211:8080",
    // REACT_APP_BASE_PATH: "http://192.168.1.12:8080",
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
