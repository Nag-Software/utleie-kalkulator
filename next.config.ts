import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    // 301 fra alternative verter til det kanoniske domenet, så Google aldri
    // indekserer duplikater. Rammer ikke preview-deploys (egne vertsnavn).
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "utleie-kalkulator.vercel.app" }],
        destination: "https://utleie-kalkulator.no/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.utleie-kalkulator.no" }],
        destination: "https://utleie-kalkulator.no/:path*",
        permanent: true,
      },
      // /sitemap uten filendelse → den faktiske sitemapen.
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
