"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CalcResult } from "@/lib/calc/engine";
import type { CalcInput } from "@/lib/calc/schema";
import { formatNOK, formatNumber, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AmortizationChart } from "./amortization-chart";
import { DetailsTable } from "./details-table";
import { ProjectionChart } from "./projection-chart";
import { SensitivityTable } from "./sensitivity-table";

export type Verdict = "positive" | "warning" | "negative";

export function getVerdict(monthlyCashflowAfterTax: number): Verdict {
  if (monthlyCashflowAfterTax >= 0) return "positive";
  if (monthlyCashflowAfterTax >= -1500) return "warning";
  return "negative";
}

const VERDICT_STYLES: Record<
  Verdict,
  { container: string; title: string; label: string }
> = {
  positive: {
    container: "border-positive/40 bg-positive/10",
    title: "text-positive",
    label: "Positiv kontantstrøm",
  },
  warning: {
    container: "border-warning bg-warning/15",
    title: "text-warning-foreground",
    label: "Nær break-even",
  },
  negative: {
    container: "border-destructive/40 bg-destructive/10",
    title: "text-destructive",
    label: "Negativ kontantstrøm",
  },
};

function signedKr(value: number): string {
  const rounded = Math.round(value);
  return `${rounded < 0 ? "−" : "+"}${formatNumber(Math.abs(rounded))} kr`;
}

function VerdictBanner({ result }: { result: CalcResult }) {
  const verdict = getVerdict(result.monthlyCashflowAfterTax);
  const styles = VERDICT_STYLES[verdict];
  return (
    <section
      aria-label="Konklusjon"
      className={cn("rounded-xl border p-4 sm:p-5", styles.container)}
    >
      <p className={cn("text-sm font-semibold", styles.title)}>{styles.label}</p>
      <p className="mt-1 font-mono text-3xl font-bold tabular-nums sm:text-4xl">
        {signedKr(result.monthlyCashflowAfterTax)}
        <span className="ml-1.5 text-base font-normal text-muted-foreground">
          /mnd etter skatt
        </span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {signedKr(result.years[0]?.cashflowAfterTax ?? 0)} første året.
        {result.breakEvenRent !== null
          ? ` Break-even ved månedsleie på ca. ${formatNOK(result.breakEvenRent)}.`
          : ""}
        {result.breakEvenRatePct !== null
          ? ` Tåler rente opp til ca. ${formatPct(result.breakEvenRatePct, 1)}.`
          : ""}
      </p>
    </section>
  );
}

function KeyFigures({ result }: { result: CalcResult }) {
  const figures: { label: string; value: string; hint: string; tone?: string }[] = [
    {
      label: "Kontantstrøm/mnd",
      value: signedKr(result.monthlyCashflowAfterTax),
      hint: "Etter skatt, år 1",
      tone:
        result.monthlyCashflowAfterTax >= 0 ? "text-positive" : "text-destructive",
    },
    {
      label: "Brutto yield",
      value: result.grossYieldPct !== null ? formatPct(result.grossYieldPct, 2) : "–",
      hint: "Årsleie / totalpris",
    },
    {
      label: "Netto yield",
      value: result.netYieldPct !== null ? formatPct(result.netYieldPct, 2) : "–",
      hint: "Driftsresultat / investert",
    },
    {
      label: "Cash-on-cash",
      value:
        result.cashOnCashPct !== null ? formatPct(result.cashOnCashPct, 1) : "–",
      hint: "Kontantstrøm / egenkapital",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {figures.map((figure) => (
        <Card key={figure.label} className="gap-0 py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">{figure.label}</p>
            <p
              className={cn(
                "mt-1 font-mono text-lg font-semibold tabular-nums",
                figure.tone,
              )}
            >
              {figure.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{figure.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export interface ResultsPanelProps {
  input: CalcInput;
  result: CalcResult;
  /** slot for KI-vurderingen på betalte beregninger */
  aiPanel?: React.ReactNode;
}

export function ResultsPanel({ input, result, aiPanel }: ResultsPanelProps) {
  // recharts måler DOM — vent til mount før rendring (SSR-trygt)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4" id="resultater">
      <VerdictBanner result={result} />
      {aiPanel}
      <KeyFigures result={result} />

      <Tabs defaultValue="prognose">
        <TabsList>
          <TabsTrigger value="prognose">Prognose</TabsTrigger>
          <TabsTrigger value="laan">Lån</TabsTrigger>
          <TabsTrigger value="sensitivitet">Sensitivitet</TabsTrigger>
        </TabsList>
        <TabsContent value="prognose" className="rounded-xl border bg-card p-4">
          {mounted ? (
            <ProjectionChart years={result.years} />
          ) : (
            <Skeleton className="h-72 w-full" />
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Egenkapitalverdi = boligverdi − restgjeld − fellesgjeld. Akkumulert
            kontantstrøm er etter skatt.
          </p>
        </TabsContent>
        <TabsContent value="laan" className="rounded-xl border bg-card p-4">
          {result.loanAmount === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Ingen lånefinansiering med dagens egenkapital.
            </p>
          ) : mounted ? (
            <AmortizationChart years={result.years} />
          ) : (
            <Skeleton className="h-72 w-full" />
          )}
        </TabsContent>
        <TabsContent value="sensitivitet" className="rounded-xl border bg-card p-4">
          <SensitivityTable
            sensitivity={result.sensitivity}
            baseRate={input.interestRate}
          />
        </TabsContent>
      </Tabs>

      <Accordion type="single" collapsible className="rounded-xl border bg-card px-4">
        <AccordionItem value="detaljer" className="border-b-0">
          <AccordionTrigger className="text-sm font-semibold">
            Detaljer og forutsetninger
          </AccordionTrigger>
          <AccordionContent>
            <DetailsTable result={result} />
            {result.warnings.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
