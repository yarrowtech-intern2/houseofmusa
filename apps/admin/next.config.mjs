/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@hausofmusa/ui", "@hausofmusa/types", "@hausofmusa/schemas", "@hausofmusa/data"],
};

export default nextConfig;
