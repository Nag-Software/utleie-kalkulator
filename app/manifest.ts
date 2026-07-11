import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Utleiekalkulator – lønnsomhet for utleiebolig",
    short_name: SITE_NAME,
    description:
      "Beregn kontantstrøm, yield og avkastning på utleiebolig. Gratis, uten konto.",
    start_url: "/",
    display: "minimal-ui",
    lang: "nb",
    background_color: "#f7f3ea",
    theme_color: "#1d4636",
    icons: [
      { src: "/icon/64", sizes: "64x64", type: "image/png" },
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
