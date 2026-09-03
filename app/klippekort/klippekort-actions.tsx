"use client";

import { Loader2, Ticket } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KLIPP_PER_KJOP, KLIPP_PRIS_NOK } from "@/lib/site";

export function KlippekortActions({
  loginEnabled,
  loggedIn,
}: {
  loginEnabled: boolean;
  loggedIn: boolean;
}) {
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true }),
      });
      const data = (await response.json()) as
        | { checkoutUrl: string }
        | { message: string };
      if (!response.ok) {
        setError((data as { message: string }).message);
        setLoading(false);
        return;
      }
      window.location.href = (data as { checkoutUrl: string }).checkoutUrl;
    } catch {
      setError("Kunne ikke starte betalingen. Prøv igjen.");
      setLoading(false);
    }
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
          onClick={() => void buy()}
        >
          {loading ? (
            <Loader2 data-slot="icon" className="animate-spin" />
          ) : (
            <Ticket data-slot="icon" />
          )}
          Kjøp {KLIPP_PER_KJOP} klipp – {KLIPP_PRIS_NOK} kr
        </Button>
        {loginEnabled && !loggedIn ? (
          <Button asChild variant="outline">
            <a href="/api/auth/login?returnTo=%2Fklippekort">Logg inn</a>
          </Button>
        ) : null}
        {loggedIn ? (
          <Button asChild variant="ghost">
            <a href="/api/auth/logout">Logg ut</a>
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
