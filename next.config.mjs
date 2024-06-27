/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    staticPageGenerationTimeout: 120,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**", 
      },
    ],
    domains: [
      "api.dextrading.com",
      "blog.dextrading.com", 
      "i.pravatar.cc",
    ],
  },
};

export default nextConfig;
