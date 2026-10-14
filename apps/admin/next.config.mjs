/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@houseofmusa/ui", "@houseofmusa/types", "@houseofmusa/schemas", "@houseofmusa/data"],
};

export default nextConfig;
