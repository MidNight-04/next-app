/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // REACT_APP_BASE_PATH: "http://3.6.218.211:8080",
    // REACT_APP_BASE_PATH: "http://3.110.224.108:8080",
    REACT_APP_BASE_PATH: "http://localhost:8080",
    // REACT_APP_BASE_PATH: "https://server-1-5nta.onrender.com",
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
