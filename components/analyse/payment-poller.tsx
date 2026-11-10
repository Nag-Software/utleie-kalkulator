"use client";

import { useEffect } from "react";

/**
 * Når kunden er tilbake fra Vipps før godkjenningen er registrert, sender
 * vi ham tilbake til retur-sjekken etter noen sekunder. Retur-handleren
 * teller forsøkene og gir opp selv, så denne trenger ingen egen grense.
 */
const RETRY_DELAY_MS = 3000;

export function PaymentPoller({
  reference,
  attempt,
}: {
  reference: string;
  attempt: number;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(
        `/api/vipps/retur?ref=${encodeURIComponent(reference)}&forsok=${attempt}`,
      );
    }, RETRY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [reference, attempt]);

  return null;
}
