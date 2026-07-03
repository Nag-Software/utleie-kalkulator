"use client";

import {
  AlertTriangle,
  Check,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AiPanel } from "@/components/calculator/ai-panel";
import { Calculator } from "@/components/calculator/calculator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StoredAiAssessment } from "@/lib/ai/types";
import type { CalcInput } from "@/lib/calc/schema";
import type { FinnParsedData } from "@/lib/finn/types";
import { formatNOK } from "@/lib/format";

function FinnInfoCard({
  finn,
  warnings,
}: {
  finn: FinnParsedData;
  warnings: string[];
}) {
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
          {warnings.length > 0 ? (
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

export interface BeregningClientProps {
  sessionId: string;
  finn: FinnParsedData;
  warnings: string[];
  initialInputs: CalcInput;
  initialAi: StoredAiAssessment | null;
  initialAiRuns: number;
}

export function BeregningClient({
  sessionId,
  finn,
  warnings,
  initialInputs,
  initialAi,
  initialAiRuns,
}: BeregningClientProps) {
  const [ai, setAi] = useState(initialAi);
  const [aiRuns, setAiRuns] = useState(initialAiRuns);
  const [aiPending, setAiPending] = useState(!initialAi);
  const [rerunning, setRerunning] = useState(false);
  const currentInputs = useRef(initialInputs);
  const firstRunStarted = useRef(false);

  async function requestAssessment(inputs: CalcInput): Promise<boolean> {
    try {
      const response = await fetch("/api/paid/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, inputs }),
      });
      if (response.status === 409) {
        toast.info("Beregningen har brukt begge KI-vurderingene sine.");
        return false;
      }
      if (!response.ok) return false;
      const data = (await response.json()) as {
        aiAssessment: StoredAiAssessment;
        aiRuns: number;
      };
      setAi(data.aiAssessment);
      setAiRuns(data.aiRuns);
      return true;
    } catch {
      return false;
    }
  }

  // Første KI-vurdering kjøres ved første besøk (tar typisk 10–30 sek.)
  useEffect(() => {
    if (initialAi || firstRunStarted.current) return;
    firstRunStarted.current = true;
    void (async () => {
      const ok = await requestAssessment(currentInputs.current);
      if (!ok) {
        // ett nytt forsøk før vi gir oss — vurderingen kan hentes senere via knappen
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await requestAssessment(currentInputs.current);
      }
      setAiPending(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function rerunAi() {
    setRerunning(true);
    const ok = await requestAssessment(currentInputs.current);
    if (ok) {
      toast.success("KI-vurderingen er oppdatert med tallene dine.");
    } else if (!ai) {
      toast.error("KI-vurderingen feilet. Prøv igjen om litt.");
    }
    setRerunning(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lenke kopiert. Alle med lenken kan se beregningen.");
    } catch {
      toast.error("Kunne ikke kopiere lenken.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">FINN-beregning</Badge>
          <Badge className="bg-positive text-positive-foreground">
            <Check data-slot="icon" />
            Betalt
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={copyLink}>
          <LinkIcon data-slot="icon" />
          Kopier lenke
        </Button>
      </div>

      <FinnInfoCard finn={finn} warnings={warnings} />

      <Calculator
        initialInput={initialInputs}
        urlSync
        onInputChange={(inputs) => {
          currentInputs.current = inputs;
        }}
        aiPanel={
          <AiPanel
            assessment={ai}
            pending={aiPending}
            canRerun={Boolean(ai) && aiRuns < 2}
            rerunning={rerunning}
            onRerun={rerunAi}
          />
        }
      />
    </div>
  );
}
