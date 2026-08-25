/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
  transpilePackages: ["@houseofmusa/ui", "@houseofmusa/types", "@houseofmusa/schemas"],
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
