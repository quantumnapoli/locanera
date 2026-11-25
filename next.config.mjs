/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion"]
  },
  output: "export",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
