import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.wonderjoyai.com",
          },
        ],
        destination: "https://wonderjoyai.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;