"use client";

import {
  AlertTriangle,
  Check,
  ExternalLink,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AiPanel } from "@/components/calculator/ai-panel";
import { Calculator } from "@/components/calculator/calculator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StoredAiAssessment } from "@/lib/ai/types";
import { type CalcInput, parseInputLenient } from "@/lib/calc/schema";
import type { PublicCalculation } from "@/lib/calculations/types";
import { formatNOK } from "@/lib/format";

function FinnInfoCard({ calc }: { calc: PublicCalculation }) {
  const finn = calc.finn;
  if (!finn) return null;
  return (
    <Card className="mb-4 py-4">
      <CardContent className="flex items-center gap-4 px-4">
        {finn.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={finn.imageUrl}
            alt=""
            className="hidden size-16 rounded-lg object-cover sm:block"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {finn.address ?? finn.title ?? `FINN-kode ${finn.finnkode}`}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {[
              finn.propertyType,
              finn.ownershipTypeRaw,
              finn.internalArea ? `${finn.internalArea} m²` : null,
              finn.buildYear ? `Byggeår ${finn.buildYear}` : null,
              finn.askingPrice ? formatNOK(finn.askingPrice) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {finn.warnings.length > 0 ? (
            <p className="mt-1 flex items-center gap-1 text-xs text-warning-foreground">
              <AlertTriangle className="size-3" />
              Noen felt manglet i annonsen – kontroller tallene under.
            </p>
          ) : null}
        </div>
        <Button asChild variant="ghost" size="sm">
          <a href={finn.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink data-slot="icon" />
            <span className="hidden sm:inline">Se annonsen</span>
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function WaitingForPayment({ calcId }: { calcId: string }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setSlow(true), 45_000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className="mx-auto max-w-md py-20 text-center" data-calc-id={calcId}>
      <Loader2 className="mx-auto size-8 animate-spin text-primary" />
      <h1 className="mt-4 text-xl font-semibold">Klargjør beregningen din …</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Vi bekrefter betalingen, henter tallene fra FINN og kjører
        KI-vurderingen. Dette tar vanligvis under et minutt.
      </p>
      {slow ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Tar det lang tid? Har du ikke fullført betalingen, kan du{" "}
          <Link href="/" className="text-primary underline">
            gå tilbake og prøve igjen
          </Link>
          . Er beløpet trukket, fullføres beregningen automatisk – lenken til
          denne siden er din kvitteringsside.
        </p>
      ) : null}
    </div>
  );
}

function FailedState({ calc }: { calc: PublicCalculation }) {
  const refunded = calc.status === "refunded";
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <AlertTriangle className="mx-auto size-8 text-destructive" />
      <h1 className="mt-4 text-xl font-semibold">
        Vi klarte ikke å hente annonsen fra FINN
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {calc.errorCode === "NOT_FOUND"
          ? "Annonsen ser ut til å være solgt eller fjernet."
          : "Det oppsto en teknisk feil ved henting av annonsen."}{" "}
        {refunded
          ? "Beløpet på 9,90 kr er automatisk refundert og vises på kontoen din i løpet av få dager."
          : "Beløpet refunderes automatisk."}
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Prøv med manuelle tall i stedet</Link>
      </Button>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Lagret beregning",
  paid: "FINN-beregning",
};

export function BeregningClient({ initial }: { initial: PublicCalculation }) {
  const [calc, setCalc] = useState(initial);
  const [rerunning, setRerunning] = useState(false);
  const pollCount = useRef(0);

  const awaitingFulfillment =
    calc.status === "pending_payment" || calc.status === "processing";
  const awaitingAi =
    calc.status === "paid" && calc.kind === "finn" && !calc.aiAssessment;

  useEffect(() => {
    if (!awaitingFulfillment && !awaitingAi) return;
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );
    const interval = setInterval(async () => {
      pollCount.current += 1;
      if (pollCount.current > 60) {
        clearInterval(interval);
        return;
      }
      try {
        const statusResponse = await fetch(
          `/api/calculations/${calc.id}/status${
            sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ""
          }`,
        );
        if (!statusResponse.ok) return;
        const { status, hasAi } = (await statusResponse.json()) as {
          status: string;
          hasAi: boolean;
        };
        if (status !== calc.status || hasAi !== Boolean(calc.aiAssessment)) {
          const full = await fetch(`/api/calculations/${calc.id}`);
          if (full.ok) setCalc((await full.json()) as PublicCalculation);
        }
      } catch {
        // nettverksglipp — prøver igjen neste intervall
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [awaitingFulfillment, awaitingAi, calc.id, calc.status, calc.aiAssessment]);

  if (awaitingFulfillment) return <WaitingForPayment calcId={calc.id} />;
  if (calc.status === "failed" || calc.status === "refunded") {
    return <FailedState calc={calc} />;
  }

  const initialInput = parseInputLenient(calc.inputs);
  const canRerun =
    calc.kind === "finn" && calc.status === "paid" && calc.aiRuns < 2;

  async function persistInputs(input: CalcInput) {
    try {
      await fetch(`/api/calculations/${calc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: input }),
      });
    } catch {
      // stille — deling via URL fungerer uansett
    }
  }

  async function rerunAi() {
    setRerunning(true);
    try {
      const response = await fetch(`/api/calculations/${calc.id}/ai-rerun`, {
        method: "POST",
      });
      if (response.status === 409) {
        toast.info("KI-vurderingen er allerede oppdatert for disse tallene.");
        return;
      }
      if (response.status === 429) {
        toast.error("For mange forespørsler. Prøv igjen om litt.");
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      const { aiAssessment } = (await response.json()) as {
        aiAssessment: StoredAiAssessment;
      };
      setCalc((prev) => ({
        ...prev,
        aiAssessment,
        aiRuns: prev.aiRuns + 1,
      }));
      toast.success("KI-vurderingen er oppdatert med tallene dine.");
    } catch {
      toast.error("Kunne ikke oppdatere KI-vurderingen. Prøv igjen.");
    } finally {
      setRerunning(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/beregning/${calc.id}`,
      );
      toast.success("Lenke kopiert. Alle med lenken kan se beregningen.");
    } catch {
      toast.error("Kunne ikke kopiere lenken.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {STATUS_LABELS[calc.status] ?? calc.status}
          </Badge>
          {calc.status === "paid" ? (
            <Badge className="bg-positive text-positive-foreground">
              <Check data-slot="icon" />
              Betalt
            </Badge>
          ) : null}
        </div>
        <Button variant="outline" size="sm" onClick={copyLink}>
          <LinkIcon data-slot="icon" />
          Kopier lenke
        </Button>
      </div>

      {calc.kind === "finn" ? <FinnInfoCard calc={calc} /> : null}

      <Calculator
        initialInput={initialInput}
        onInputChange={persistInputs}
        aiPanel={
          calc.kind === "finn" ? (
            <AiPanel
              assessment={calc.aiAssessment}
              pending={awaitingAi}
              canRerun={canRerun}
              rerunning={rerunning}
              onRerun={rerunAi}
            />
          ) : undefined
        }
      />
    </div>
  );
}
