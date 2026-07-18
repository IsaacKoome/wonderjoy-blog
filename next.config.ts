import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/articles/acne-skars-vs-dark-spots",
        destination: "/articles/acne-scars-vs-dark-spots",
        permanent: true,
      },
      {
        source: "/tips",
        destination: "/articles",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
