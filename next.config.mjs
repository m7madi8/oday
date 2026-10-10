/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_DEV_DIST === "1" ? { distDir: ".next-dev" } : {}),
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    deviceSizes: [384, 414, 640, 750, 828, 1080, 1200, 1280, 1366, 1536, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.png",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
