/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  transpilePackages: ["@houseofmusa/ui", "@houseofmusa/types", "@houseofmusa/schemas"],
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
