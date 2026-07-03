import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { decodeInputFromParams } from "@/components/calculator/url-state";
import { Button } from "@/components/ui/button";
import {
  type CalcInput,
  DEFAULT_INPUT,
  parseInputLenient,
} from "@/lib/calc/schema";
import { mapFinnToInputs } from "@/lib/finn/map-to-inputs";
import { loadOrFulfill } from "@/lib/payments/fulfill";
import { BeregningClient } from "./beregning-client";

export const metadata: Metadata = {
  title: "Beregning",
  robots: { index: false, follow: false },
};

// Første besøk henter FINN-data og kan refundere — gi god tid
export const maxDuration = 60;

/** Importerte FINN-tall + brukerens URL-justeringer (kun felt som finnes i URL-en). */
function mergeUrlOverrides(
  imported: CalcInput,
  search: URLSearchParams,
): CalcInput {
  const decoded = decodeInputFromParams(search);
  const merged: CalcInput = { ...imported };
  for (const key of Object.keys(DEFAULT_INPUT) as (keyof CalcInput)[]) {
    if (search.has(key)) {
      (merged as Record<string, unknown>)[key] = decoded[key];
    }
  }
  return parseInputLenient(merged);
}

function InfoState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      <Button asChild className="mt-6">
        <Link href="/">Til kalkulatoren</Link>
      </Button>
    </div>
  );
}

export default async function BeregningPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : null;

  if (!sessionId) {
    return (
      <InfoState title="Mangler betalingsreferanse">
        Lenken til en betalt beregning inneholder en betalingsreferanse. Bruk
        hele lenken du fikk etter kjøpet, eller start en ny beregning fra
        forsiden.
      </InfoState>
    );
  }

  const lookup = await loadOrFulfill(sessionId);

  switch (lookup.kind) {
    case "unavailable":
      return (
        <InfoState title="Betaling er ikke tilgjengelig ennå">
          Betalte beregninger lanseres snart. Den manuelle kalkulatoren er
          gratis i mellomtiden.
        </InfoState>
      );
    case "not_found":
      return (
        <InfoState title="Fant ikke beregningen">
          Kontroller at du bruker hele lenken fra kjøpet.
        </InfoState>
      );
    case "unpaid":
      return (
        <InfoState title="Betalingen er ikke fullført">
          Vi finner ingen gjennomført betaling for denne lenken. Har du avbrutt
          betalingen, kan du starte på nytt fra forsiden.
        </InfoState>
      );
    case "failed":
      return (
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <AlertTriangle className="mx-auto size-8 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold">
            Vi klarte ikke å hente annonsen fra FINN
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {lookup.code === "NOT_FOUND"
              ? "Annonsen ser ut til å være solgt eller fjernet."
              : "Det oppsto en teknisk feil ved henting av annonsen."}{" "}
            {lookup.refunded
              ? "Beløpet på 9,90 kr er automatisk refundert og vises på kontoen din i løpet av få dager."
              : "Beløpet refunderes. Hører du ikke fra oss, kontakt casper@nagsoftware.no."}
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Prøv med manuelle tall i stedet</Link>
          </Button>
        </div>
      );
    case "ready": {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === "string") search.set(key, value);
      }
      const initialInputs = mergeUrlOverrides(
        mapFinnToInputs(lookup.finn.p),
        search,
      );
      return (
        <BeregningClient
          sessionId={lookup.sessionId}
          finn={lookup.finn.p}
          warnings={lookup.finn.w}
          initialInputs={initialInputs}
          initialAi={lookup.calculation.ai}
          initialAiRuns={lookup.calculation.aiRuns}
        />
      );
    }
  }
}
