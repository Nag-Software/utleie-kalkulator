"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { VippsMark } from "@/components/vipps-mark";
import { Button } from "@/components/ui/button";
import { KLIPP_PER_KJOP, KLIPP_PRIS_NOK } from "@/lib/site";

/**
 * Handlingene på klippekortsiden. `finnkode` er annonsen brukeren var på vei
 * til da han måtte logge inn — den følger med gjennom innloggingen, så han
 * ikke trenger å lime inn FINN-lenken på nytt.
 */
export function KlippekortActions({
  loggedIn,
  remaining,
  finnkode,
}: {
  loggedIn: boolean;
  remaining: number;
  finnkode?: string | null;
}) {
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function post(path: string, body: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as
        | { redirectUrl?: string; calculationUrl?: string }
        | { message: string };
      if (!response.ok) {
        setError((data as { message: string }).message);
        setLoading(false);
        return;
      }
      const next = data as { redirectUrl?: string; calculationUrl?: string };
      window.location.href = next.redirectUrl ?? next.calculationUrl ?? "/klippekort";
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
      setLoading(false);
    }
  }

  if (!loggedIn) {
    const returnTo = finnkode ? `/klippekort?finn=${finnkode}` : "/klippekort";
    return (
      <div className="mt-7 space-y-3">
        <Button variant="cta" asChild>
          <a href={`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`}>
            <VippsMark data-slot="icon" />
            Logg inn med Vipps
          </a>
        </Button>
        <p className="max-w-md text-sm text-muted-foreground">
          Klippene følger Vipps-brukeren din, så de virker på alle enhetene
          dine.
        </p>
      </div>
    );
  }

  // Har han allerede klipp og kom fra en annonse, skal han ikke gjennom
  // kjøpet på nytt — bare bruke et klipp.
  if (finnkode && remaining > 0) {
    return (
      <div className="mt-7 space-y-3">
        <Button
          variant="cta"
          disabled={loading}
          onClick={() => void post("/api/unlock", { finnUrl: finnkode })}
        >
          {loading ? (
            <Loader2 data-slot="icon" className="animate-spin" />
          ) : (
            <ArrowRight data-slot="icon" />
          )}
          Hent tallene – bruk 1 klipp
        </Button>
        <p className="max-w-md text-sm text-muted-foreground">
          Gjelder FINN-kode {finnkode}. Du har {remaining} klipp igjen.
        </p>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="mt-7 space-y-3">
      <label className="flex max-w-lg items-start gap-2.5 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 size-4 accent-[#ff5d30]"
        />
        <span>
          Jeg samtykker til umiddelbar levering og at angreretten dermed
          bortfaller. Jeg har lest{" "}
          <a href="/vilkar" className="font-medium text-foreground underline">
            salgsvilkårene
          </a>
          .
        </span>
      </label>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="cta"
          disabled={!consent || loading}
          onClick={() =>
            void post("/api/checkout", {
              consent: true,
              ...(finnkode ? { finnkode } : {}),
            })
          }
        >
          {loading ? (
            <Loader2 data-slot="icon" className="animate-spin" />
          ) : (
            <VippsMark data-slot="icon" />
          )}
          Kjøp {KLIPP_PER_KJOP} klipp – {KLIPP_PRIS_NOK} kr
        </Button>
        <Button asChild variant="ghost">
          <a href="/api/auth/logout">Logg ut</a>
        </Button>
      </div>
      {finnkode ? (
        <p className="text-sm text-muted-foreground">
          Etter betalingen åpner vi beregningen for FINN-kode {finnkode}{" "}
          automatisk, og bruker ett klipp på den.
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
