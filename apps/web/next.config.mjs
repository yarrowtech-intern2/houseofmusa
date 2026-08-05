/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: no Node server on the host. Dynamic public settings are
  // baked at build time and refreshed client-side when NEXT_PUBLIC_API_URL is configured.
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["@houseofmusa/ui", "@houseofmusa/types", "@houseofmusa/schemas"],
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
