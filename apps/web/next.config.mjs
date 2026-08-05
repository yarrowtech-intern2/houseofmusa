/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@houseofmusa/ui", "@houseofmusa/types", "@houseofmusa/schemas"],
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
