"use client";

import { AlertTriangle, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { StoredAiAssessment } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

function gaugeColor(score: number): string {
  if (score < 35) return "var(--destructive)";
  if (score < 65) return "var(--warning)";
  return "var(--positive)";
}

function ProbabilityGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 80;
  const circumference = Math.PI * radius;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-44" role="img" aria-label={`Sannsynlighet for lønnsomhet: ${clamped} av 100`}>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={gaugeColor(clamped)}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * circumference} ${circumference}`}
          className="transition-all duration-700"
        />
        <text
          x="100"
          y="88"
          textAnchor="middle"
          className="fill-foreground font-mono text-[34px] font-bold"
        >
          {clamped} %
        </text>
      </svg>
      <p className="text-xs text-muted-foreground">Sannsynlighet for lønnsomhet</p>
    </div>
  );
}

function AssessmentList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "negative" | "neutral";
}) {
  if (!items.length) return null;
  return (
    <div>
      <h4
        className={cn(
          "mb-1.5 text-xs font-semibold uppercase tracking-wide",
          tone === "positive" && "text-positive",
          tone === "negative" && "text-destructive",
          tone === "neutral" && "text-muted-foreground",
        )}
      >
        {title}
      </h4>
      <ul className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              aria-hidden
              className={cn(
                "mt-[7px] size-1.5 shrink-0 rounded-full",
                tone === "positive" && "bg-positive",
                tone === "negative" && "bg-destructive",
                tone === "neutral" && "bg-muted-foreground",
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface AiPanelProps {
  assessment: StoredAiAssessment | null;
  /** pending = betalt, vurdering genereres fortsatt */
  pending?: boolean;
  canRerun?: boolean;
  rerunning?: boolean;
  onRerun?: () => void;
}

export function AiPanel({
  assessment,
  pending = false,
  canRerun = false,
  rerunning = false,
  onRerun,
}: AiPanelProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-cta" />
          KI-vurdering
        </CardTitle>
        {assessment && canRerun ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onRerun}
            disabled={rerunning}
          >
            {rerunning ? (
              <Loader2 className="animate-spin" data-slot="icon" />
            ) : (
              <RefreshCw data-slot="icon" />
            )}
            Oppdater med mine tall
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-5">
        {assessment ? (
          <>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
              <ProbabilityGauge score={assessment.result.probability_profitable} />
              <p className="flex-1 text-sm leading-relaxed">
                {assessment.result.summary}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <AssessmentList
                title="Styrker"
                items={assessment.result.strengths}
                tone="positive"
              />
              <AssessmentList
                title="Svakheter"
                items={assessment.result.weaknesses}
                tone="negative"
              />
              <AssessmentList
                title="Risikofaktorer"
                items={assessment.result.risks}
                tone="neutral"
              />
              <AssessmentList
                title="Bør undersøkes"
                items={assessment.result.assumptions_to_verify}
                tone="neutral"
              />
            </div>
          </>
        ) : pending ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Vurderingen genereres – dette tar vanligvis under et minutt.
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            KI-vurderingen er ikke tilgjengelig for denne beregningen.
          </p>
        )}
        <Alert>
          <AlertTriangle />
          <AlertDescription>
            KI-generert vurdering basert på tallene i beregningen. Dette er ikke
            finansiell rådgivning – gjør alltid egne undersøkelser.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
