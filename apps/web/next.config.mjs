/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: no Node server on the host (Render Static Site), the
  // API lives on a separate VPS. Every dynamic route needs
  // generateStaticParams as a result — see products/[slug] and
  // careers/[slug]. Content edited via the admin dashboard only appears on
  // the live site after a rebuild (docs/ARCHITECTURE.md).
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["@houseofmusa/ui", "@houseofmusa/types", "@houseofmusa/schemas"],
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
