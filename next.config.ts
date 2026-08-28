import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Markets used to live at /markets/[slug]. Only the suppressed Kaimukī
      // placeholder was ever there, so nothing indexed is moving, but a
      // permanent redirect costs nothing and beats a hard 404 on any link
      // that was shared while the path existed.
      {
        source: "/markets/:slug",
        destination: "/farmers-markets/:slug",
        permanent: true,
      },
      {
        source: "/markets",
        destination: "/oahu/farmers-markets",
        permanent: true,
      },
      // The category slug moved from the generic "markets" at the same time.
      {
        source: "/:island/markets",
        destination: "/:island/farmers-markets",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
