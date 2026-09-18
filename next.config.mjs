/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_DEV_DIST === "1" ? { distDir: ".next-dev" } : {}),
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1170, 1200, 1284, 1366, 1536, 1668, 1920, 2048, 2560, 3840, 4096],
    formats: ["image/avif", "image/webp"],
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
