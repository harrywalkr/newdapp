/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    // remotePatterns: [
    //   {
    //     hostname: 'api.dextrading.com',
    //   },
    // ], FIXME: next must be updated for this to be supported. old package still depends on this older nextjs
    // FIXME: remove pravatar from domain later
    domains: ["api.dextrading.com", "95.81.93.198", "i.pravatar.cc"],
  },
  future: { webpack5: true }
};

export default nextConfig;
