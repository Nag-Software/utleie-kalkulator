import { Check, Ticket } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Pill } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import {
  loadByCustomerId,
  statusOf,
} from "@/lib/payments/klippekort";
import {
  KLIPP_GYLDIGHET_MANEDER,
  KLIPP_PER_KJOP,
} from "@/lib/site";
import { KlippekortActions } from "./klippekort-actions";

export const metadata: Metadata = {
  title: "Klippekortet ditt",
  robots: { index: false, follow: false },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function KlippekortPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const config = getConfig();
  const session = await readSession();
  const card = session?.customerId
    ? await loadByCustomerId(session.customerId)
    : null;
  const status = statusOf(card);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6">
      {params.kjop === "ok" ? (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-positive/25 bg-positive/10 p-4 text-sm text-positive">
          <Check className="size-5 shrink-0" aria-hidden />
          <p>
            Betalingen er fullført. {KLIPP_PER_KJOP} klipp er lagt til
            klippekortet ditt.
          </p>
        </div>
      ) : null}
      {params.kjop === "feilet" ? (
        <p className="mb-8 rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
          Vi kunne ikke bekrefte kjøpet. Kontakt oss hvis beløpet er trukket.
        </p>
      ) : null}
      {params.import ? (
        <p className="mb-8 rounded-2xl border border-warning/25 bg-warning/10 p-4 text-sm text-warning">
          Klippekortet er aktivert, men annonsen kunne ikke hentes. Det ble
          ikke brukt et klipp.
        </p>
      ) : null}

      <Pill>Klippekort</Pill>
      <h1 className="display mt-5 text-[clamp(2rem,5vw,2.75rem)]">
        Klippekortet ditt
      </h1>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-muted-foreground">
              Klipp igjen
            </p>
            <p className="mt-1 text-5xl font-semibold tracking-[-0.03em] tabular-nums">
              {status.remaining}
            </p>
          </div>
          <Ticket className="size-8 text-cta" aria-hidden />
        </div>

        {status.expiresAt ? (
          <p className="mt-5 text-sm text-muted-foreground">
            De neste klippene utløper {formatDate(status.expiresAt)}.
          </p>
        ) : status.expired ? (
          <p className="mt-5 text-sm text-muted-foreground">
            Klippekortet er utløpt.
          </p>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Du har ikke aktive klipp. Ett klipp henter tallene fra én
            FINN-annonse.
          </p>
        )}

        {status.used > 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {status.used} {status.used === 1 ? "annonse" : "annonser"} låst opp.
            De kan åpnes igjen uten nytt klipp.
          </p>
        ) : null}

        {config.features.payments ? (
          <KlippekortActions
            loginEnabled={config.features.login}
            loggedIn={Boolean(session?.vippsSub)}
          />
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Betaling er midlertidig utilgjengelig.
          </p>
        )}

        {status.remaining > 0 ? (
          <Button asChild variant="outline" className="mt-4">
            <Link href="/#finn-import">Hent en FINN-annonse</Link>
          </Button>
        ) : null}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Klippene er gyldige i {KLIPP_GYLDIGHET_MANEDER} måneder fra hvert kjøp.
        Uten innlogging er klippekortet knyttet til denne nettleseren.{" "}
        <Link href="/vilkar#tjenester" className="font-medium underline">
          Se salgsvilkårene
        </Link>
        .
      </p>
    </div>
  );
}
