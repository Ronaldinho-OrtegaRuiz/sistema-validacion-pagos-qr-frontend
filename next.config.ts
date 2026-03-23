import type { NextConfig } from "next";

const DEFAULT_UPSTREAM =
  "https://sistema-validacion-pagos-qr-production.up.railway.app";

const apiUpstream =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_UPSTREAM;

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiUpstream}/:path*`,
      },
    ];
  },
};

export default nextConfig;
