/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  transpilePackages: ["@houseofmusa/ui", "@houseofmusa/types", "@houseofmusa/schemas", "@houseofmusa/data"],
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
