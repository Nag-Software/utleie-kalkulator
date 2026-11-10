import type { Metadata } from "next";
import Link from "next/link";
import { UploadProspectus } from "@/components/analyse/upload-prospectus";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { type KiStatus, loadKiStatus } from "@/lib/db/analyses";

export const metadata: Metadata = {
  title: "Mine analyser",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  uploaded: "Venter på betaling",
  running: "Analyseres",
  done: "Ferdig",
  failed: "Feilet – prøv igjen",
};

const MESSAGES: Record<string, string> = {
  "kjop=ok": "Betalingen er registrert.",
  "kjop=feilet": "Noe gikk galt med betalingen. Du er ikke belastet uten at analysen er levert – kontakt oss hvis beløpet er trukket.",
  "kjop=avbrutt": "Betalingen ble avbrutt. Du er ikke belastet.",
  "kjop=sen": "Vipps har ikke bekreftet betalingen ennå. Last siden på nytt om et øyeblikk.",
  "login=utilgjengelig": "Innlogging er ikke tilgjengelig akkurat nå.",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });

/**
 * Oversikten over kjøpte analyser. Innlogging er bare nødvendig for å finne
 * dem igjen: selve kjøpet skjer uten konto, og hver rapport har sin egen lenke.
 */
export default async function AnalyserPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const config = getConfig();
  const session = await readSession();

  let status: KiStatus | null = null;
  if (session) {
    status = await loadKiStatus(session.userId).catch((error) => {
      console.error("analyser: kunne ikke lese status", error);
      return null;
    });
  }

  const message =
    MESSAGES[`kjop=${query.kjop}`] ??
    (typeof query.login === "string"
      ? (MESSAGES[`login=${query.login}`] ?? "Innloggingen ble ikke fullført. Prøv igjen.")
      : null);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <h1 className="display text-[clamp(2rem,5vw,3rem)]">Mine analyser</h1>
      {message ? (
        <p className="mt-4 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
          {message}
        </p>
      ) : null}

      <div className="surface-dark mt-8 flex flex-wrap items-end justify-between gap-6 rounded-3xl p-6 sm:p-8">
        <div>
          {session && status ? (
            <>
              <p className="text-[13px] text-muted-foreground">Analyser igjen</p>
              <p className="display mt-1 text-5xl tabular-nums">{status.remaining}</p>
              {status.expiresAt ? (
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Gyldig til {formatDate(status.expiresAt)}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="display text-2xl">Analyser en salgsoppgave</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                49 kr per bolig, betalt med Vipps. Du trenger ikke konto.
              </p>
            </>
          )}
        </div>
        <UploadProspectus variant="button" />
      </div>

      {session ? (
        <section className="mt-10">
          <h2 className="display-sm text-xl">Rapporter</h2>
          {status && status.analyses.length > 0 ? (
            <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
              {status.analyses.map((analysis) => (
                <li key={analysis.id}>
                  <Link
                    href={`/analyse/${analysis.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-secondary"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-medium">
                        {analysis.address ?? analysis.filename}
                      </span>
                      <span className="block text-[13px] text-muted-foreground">
                        {formatDate(analysis.createdAt)}
                      </span>
                    </span>
                    <span className="shrink-0 text-[13px] text-muted-foreground">
                      {STATUS_LABEL[analysis.status] ?? analysis.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              {status
                ? "Du har ingen rapporter ennå."
                : "Vi klarte ikke å hente rapportene dine akkurat nå. Prøv igjen om litt."}
            </p>
          )}
          <p className="mt-8 text-sm text-muted-foreground">
            Innlogget{session.name ? ` som ${session.name}` : ""}.{" "}
            <a href="/api/auth/logout" className="underline underline-offset-2">
              Logg ut
            </a>
          </p>
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="display-sm text-xl">Har du kjøpt analyser før?</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Logg inn med Vipps for å finne rapportene dine og analysene du har
            igjen.
          </p>
          {config.features.login ? (
            <a
              href="/api/auth/login?returnTo=%2Fanalyser"
              className="mt-5 inline-flex items-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Logg inn med Vipps
            </a>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Innlogging er ikke tilgjengelig akkurat nå.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
