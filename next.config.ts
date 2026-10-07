import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DELCOM_BASEURL:
      process.env.NEXT_PUBLIC_DELCOM_BASEURL ||
      "https://open-api.delcom.org/api/v1",
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;