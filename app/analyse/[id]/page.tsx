import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PayPanel, RunPanel } from "@/components/analyse/analysis-flow";
import { ReportView } from "@/components/analyse/report-view";
import { PaymentPoller } from "@/components/analyse/payment-poller";
import { getAnalysis } from "@/lib/db/analyses";

export const metadata: Metadata = {
  title: "KI-analyse av salgsoppgaven",
  robots: { index: false, follow: false },
};

const PURCHASE_MESSAGES: Record<string, string> = {
  avbrutt: "Betalingen ble avbrutt. Du er ikke belastet.",
  feilet: "Noe gikk galt med betalingen. Prøv igjen.",
  sen: "Vipps har ikke bekreftet betalingen ennå. Last siden på nytt om et øyeblikk.",
};

/**
 * Rapportsiden. Å laste den er ren lesing: betaling og analyse startes
 * bare av knappene her, så lenkeforhåndshenting aldri kan koste noe.
 */
export default async function AnalysisPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const analysis = await getAnalysis(id).catch(() => null);
  if (!analysis || analysis.status === "created") notFound();

  if (analysis.status === "done" && analysis.result) {
    return <ReportView analysis={analysis.result} filename={analysis.filename} />;
  }

  const purchase = typeof query.kjop === "string" ? query.kjop : null;
  const reference = typeof query.ref === "string" ? query.ref : null;
  const attempt = Number.parseInt(typeof query.forsok === "string" ? query.forsok : "0", 10) || 0;
  const waiting = purchase === "venter" && reference;
  const megabytes = (analysis.sizeBytes / 1024 / 1024).toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="surface-dark rounded-3xl p-6 sm:p-10">
        <div className="flex items-center gap-3 rounded-2xl bg-white/8 p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <FileText className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{analysis.filename}</p>
            <p className="text-xs text-white/55">{megabytes} MB · lastet opp</p>
          </div>
        </div>

        {analysis.paid ? (
          <>
            <h1 className="display mt-8 text-[clamp(1.75rem,4vw,2.5rem)]">
              Analysen er i gang
            </h1>
            <div className="mt-6">
              <RunPanel
                id={analysis.id}
                initialError={analysis.status === "failed" ? analysis.error : null}
              />
            </div>
          </>
        ) : waiting ? (
          <>
            <h1 className="display mt-8 text-[clamp(1.75rem,4vw,2.5rem)]">
              Venter på Vipps
            </h1>
            <p className="mt-3 text-[15px] text-white/65">
              Vi sjekker betalingen. Dette tar bare noen sekunder.
            </p>
            <PaymentPoller reference={reference} attempt={attempt} />
          </>
        ) : (
          <>
            <h1 className="display mt-8 text-[clamp(1.75rem,4vw,2.5rem)]">
              Se hva boligen tjener deg
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">
              Salgsoppgaven er klar. Du får kontantstrømmen, fellene med
              sidetall og prisen boligen går i null på.
            </p>
            {purchase && PURCHASE_MESSAGES[purchase] ? (
              <p className="mt-4 text-sm text-[#ff8a66]">{PURCHASE_MESSAGES[purchase]}</p>
            ) : null}
            <div className="mt-8">
              <PayPanel id={analysis.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
