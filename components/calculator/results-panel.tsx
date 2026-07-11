"use client";

import dynamic from "next/dynamic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CalcResult } from "@/lib/calc/engine";
import type { CalcInput } from "@/lib/calc/schema";
import { formatNOK, formatNumber, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
// Grafene (recharts) lastes først når resultatpanelet vises, så biblioteket
// ikke ligger i førstelast-bundelen. ssr:false fordi recharts måler DOM.
const AmortizationChart = dynamic(
  () => import("./amortization-chart").then((m) => m.AmortizationChart),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full" /> },
);
const ProjectionChart = dynamic(
  () => import("./projection-chart").then((m) => m.ProjectionChart),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full" /> },
);
import { DetailsTable } from "./details-table";
import { SensitivityTable } from "./sensitivity-table";

export type Verdict = "positive" | "warning" | "negative";

export function getVerdict(monthlyCashflowAfterTax: number): Verdict {
  if (monthlyCashflowAfterTax >= 0) return "positive";
  if (monthlyCashflowAfterTax >= -1500) return "warning";
  return "negative";
}

const VERDICT_STYLES: Record<
  Verdict,
  { pill: string; dot: string; number: string; label: string }
> = {
  positive: {
    pill: "border-positive/30 bg-positive/10 text-positive",
    dot: "bg-positive",
    number: "text-positive",
    label: "Positiv kontantstrøm",
  },
  warning: {
    pill: "border-warning/60 bg-warning/15 text-warning-foreground",
    dot: "bg-warning",
    number: "text-warning-foreground",
    label: "Nær break-even",
  },
  negative: {
    pill: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
    number: "text-destructive",
    label: "Negativ kontantstrøm",
  },
};

function signedKr(value: number): string {
  const rounded = Math.round(value);
  return `${rounded < 0 ? "−" : "+"}${formatNumber(Math.abs(rounded))} kr`;
}

function VerdictHeader({ result }: { result: CalcResult }) {
  const verdict = getVerdict(result.monthlyCashflowAfterTax);
  const styles = VERDICT_STYLES[verdict];
  return (
    <section aria-label="Konklusjon" className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="eyebrow">Kontantstrøm per måned</p>
        <p
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            styles.pill,
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", styles.dot)} />
          {styles.label}
        </p>
      </div>
      <p
        className={cn(
          "mt-3 font-mono text-4xl font-bold tabular-nums tracking-tight sm:text-[2.75rem] sm:leading-none",
          styles.number,
        )}
      >
        {signedKr(result.monthlyCashflowAfterTax)}
        <span className="ml-2 text-sm font-normal tracking-normal text-muted-foreground">
          etter skatt
        </span>
      </p>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
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
    <div className="grid grid-cols-2 gap-px border-t bg-border/60 xl:grid-cols-4">
      {figures.map((figure) => (
        <div key={figure.label} className="bg-card px-5 py-4 first:pl-5 sm:px-7 sm:py-5 xl:px-5">
          <p className="text-xs text-muted-foreground">{figure.label}</p>
          <p
            className={cn(
              "mt-1.5 font-mono text-lg font-semibold tabular-nums",
              figure.tone,
            )}
          >
            {figure.value}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground/80">
            {figure.hint}
          </p>
        </div>
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
  return (
    <div className="space-y-5" id="resultater">
      <div className="overflow-hidden rounded-3xl border bg-card">
        <VerdictHeader result={result} />
        <KeyFigures result={result} />

        <div className="border-t p-5 sm:p-7">
          <Tabs defaultValue="prognose">
            <TabsList variant="line" className="mb-4 -ml-1.5">
              <TabsTrigger value="prognose">Prognose</TabsTrigger>
              <TabsTrigger value="laan">Lån</TabsTrigger>
              <TabsTrigger value="sensitivitet">Sensitivitet</TabsTrigger>
            </TabsList>
            <TabsContent value="prognose">
              <ProjectionChart years={result.years} />
              <p className="mt-3 text-xs text-muted-foreground">
                Egenkapitalverdi = boligverdi − restgjeld − fellesgjeld. Akkumulert
                kontantstrøm er etter skatt.
              </p>
            </TabsContent>
            <TabsContent value="laan">
              {result.loanAmount === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  Ingen lånefinansiering med dagens egenkapital.
                </p>
              ) : (
                <AmortizationChart years={result.years} />
              )}
            </TabsContent>
            <TabsContent value="sensitivitet">
              <SensitivityTable
                sensitivity={result.sensitivity}
                baseRate={input.interestRate}
              />
            </TabsContent>
          </Tabs>
        </div>

        <Accordion type="single" collapsible className="border-t px-5 sm:px-7">
          <AccordionItem value="detaljer" className="border-b-0">
            <AccordionTrigger className="py-4 text-sm font-semibold hover:no-underline">
              Detaljer og forutsetninger
            </AccordionTrigger>
            <AccordionContent className="pb-5">
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

      {aiPanel}
    </div>
  );
}
