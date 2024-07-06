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
      // {
      //   hostname: 'api.dextrading.com',
      // },
      // {
      //   protocol: "https",
      //   hostname: "**",
      //   port: "",
      //   pathname: "**",
      // },
    ],
    // FIXME: next must be updated for this to be supported. old package still depends on this older nextjs
    // FIXME: remove pravatar from domain later
    domains: [
      "api.dextrading.com",
      "https://api.dextrading.com",
      "https://blog.dextrading.com",
      "95.81.93.198",
      "i.pravatar.cc",
    ],
  },
};

export default nextConfig;
