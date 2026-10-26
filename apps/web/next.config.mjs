/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  transpilePackages: ["@hausofmusa/ui", "@hausofmusa/types", "@hausofmusa/schemas", "@hausofmusa/data"],
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
