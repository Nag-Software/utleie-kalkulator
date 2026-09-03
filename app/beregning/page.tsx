import type { Metadata } from "next";
import Link from "next/link";
import {
  decodeInputFromParams,
  hasAnyCalcParam,
} from "@/components/calculator/url-state";
import { Button } from "@/components/ui/button";

import { BeregningClient } from "./beregning-client";

export const metadata: Metadata = {
  title: "Beregning",
  robots: { index: false, follow: false },
};

/**
 * Beregningen bor i URL-en. FINN-importen låses opp i `/api/unlock`, som
 * trekker klippet og sender brukeren hit med tallene som spørreparametre —
 * så denne siden er ren lesing og trekker aldri et klipp selv. (Det er
 * bevisst: Next forhåndshenter lenker, og en side som trakk klipp ved
 * lasting ville brent dem.)
 */
function toSearchParams(
  params: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") search.set(key, value);
  }
  return search;
}

export default async function BeregningPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = toSearchParams(await searchParams);

  if (hasAnyCalcParam(search) || search.get("kilde") === "finn") {
    return (
      <BeregningClient
        finn={null}
        warnings={[]}
        initialInputs={decodeInputFromParams(search)}
        importedFromFinn={search.get("kilde") === "finn"}
      />
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-semibold">Mangler beregning</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Hent en FINN-annonse fra forsiden, eller bruk den gratis kalkulatoren
        med manuelle tall.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Til kalkulatoren</Link>
      </Button>
    </div>
  );
}
