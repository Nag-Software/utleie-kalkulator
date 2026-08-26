import type { Metadata } from "next";
import { SuperClient } from "./super-client";

export const metadata: Metadata = {
  title: "Super",
  description: "Analyser FINN-søk og ranger eiendommer etter kontantstrøm.",
  robots: { index: false, follow: false },
};

export default function SuperPage() {
  return <SuperClient />;
}