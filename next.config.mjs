/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    // FIXME: remove this later on
    ignoreBuildErrors: true,
  },
  ignoreBuildErrors: true,
  images: {
    // remotePatterns: [
    //   {
    //     hostname: 'api.dextrading.com',
    //   },
    // ], FIXME: next must be updated for this to be supported. old package still depends on this older nextjs
    // FIXME: remove pravatar from domain later
    domains: ["api.dextrading.com", "95.81.93.198", "i.pravatar.cc"],
  },
};

export default nextConfig;
