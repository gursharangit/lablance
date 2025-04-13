/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "labelingv2.blr1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  typescript: {
    // ✅ Ignore TypeScript build errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
