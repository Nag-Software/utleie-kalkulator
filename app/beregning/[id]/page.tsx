import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCalculation,
  toPublicCalculation,
} from "@/lib/calculations/store";
import { getConfig } from "@/lib/config";
import { BeregningClient } from "./beregning-client";

export const metadata: Metadata = {
  title: "Beregning",
  robots: { index: false, follow: false },
};

export default async function BeregningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!getConfig().features.db) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Lagrede beregninger er ikke tilgjengelige ennå</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bruk{" "}
          <Link href="/" className="text-primary underline">
            kalkulatoren
          </Link>{" "}
          og del via lenke i stedet.
        </p>
      </div>
    );
  }

  const row = await getCalculation(id);
  if (!row) notFound();

  return <BeregningClient initial={toPublicCalculation(row)} />;
}
