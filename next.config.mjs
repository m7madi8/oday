/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev-only: set by scripts/dev-fresh.cjs so `next dev` does not share/collide with
  // production `.next` (reduces Windows "UNKNOWN" open errors + stale chunk IDs).
  ...(process.env.NEXT_DEV_DIST === "1" ? { distDir: ".next-dev" } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
