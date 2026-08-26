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
    pill: "border-positive/25 bg-positive/10 text-positive",
    dot: "bg-positive",
    number: "text-positive",
    label: "Positiv kontantstrøm",
  },
  warning: {
    pill: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
    number: "text-warning",
    label: "Nær break-even",
  },
  negative: {
    pill: "border-destructive/25 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
    number: "text-destructive",
    label: "Negativ kontantstrøm",
  },
};

function signedKr(value: number): string {
  const rounded = Math.round(value);
  return `${rounded < 0 ? "−" : "+"}${formatNumber(Math.abs(rounded))} kr`;
}

/**
 * Én setning på vanlig norsk om hva tallet betyr: hva boligen koster eller
 * gir deg per måned, og hvor mye av lånet du nedbetaler samtidig. Nedbetalt
 * gjeld er ikke kontantstrøm, men det er heller ikke tapte penger – derfor
 * står de to størrelsene ved siden av hverandre.
 */
function PlainSummary({ result }: { result: CalcResult }) {
  const cashflow = Math.round(result.monthlyCashflowAfterTax);
  const monthlyPrincipal = Math.round((result.years[0]?.principalPaid ?? 0) / 12);
  const net = cashflow + monthlyPrincipal;

  return (
    <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
      {cashflow >= 0
        ? `Boligen gir deg ${formatNumber(cashflow)} kr i overskudd hver måned etter skatt`
        : `Boligen koster deg ${formatNumber(Math.abs(cashflow))} kr av egen lomme hver måned etter skatt`}
      {monthlyPrincipal > 0 ? (
        <>
          , samtidig som du nedbetaler{" "}
          <span className="font-medium text-foreground">
            {formatNumber(monthlyPrincipal)} kr
          </span>{" "}
          i gjeld i måneden.{" "}
          {net >= 0
            ? `Summen av de to er ${signedKr(net)} i måneden i økt formue.`
            : `Selv med nedbetalingen er du ${formatNumber(Math.abs(net))} kr i minus per måned.`}
        </>
      ) : (
        "."
      )}
      {result.breakEvenRent !== null
        ? ` Du går i null ved en månedsleie på ${formatNOK(result.breakEvenRent)}.`
        : ""}
      {result.breakEvenRatePct !== null
        ? ` Økonomien tåler en rente opp til ${formatPct(result.breakEvenRatePct, 1)}.`
        : ""}
    </p>
  );
}

function VerdictHeader({ result }: { result: CalcResult }) {
  const verdict = getVerdict(result.monthlyCashflowAfterTax);
  const styles = VERDICT_STYLES[verdict];
  return (
    <section aria-label="Konklusjon" className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="text-[13px] font-medium text-muted-foreground">
          Kontantstrøm per måned, etter skatt
        </p>
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
          "display mt-3 text-[clamp(2.25rem,7vw,3.5rem)] tabular-nums",
          styles.number,
        )}
      >
        {signedKr(result.monthlyCashflowAfterTax)}
      </p>
      <PlainSummary result={result} />
    </section>
  );
}

function KeyFigures({ result }: { result: CalcResult }) {
  const figures: { label: string; value: string; hint: string; tone?: string }[] =
    [
      {
        label: "Brutto yield",
        value:
          result.grossYieldPct !== null ? formatPct(result.grossYieldPct, 2) : "–",
        hint: "Årsleie / totalpris",
      },
      {
        label: "Netto yield",
        value:
          result.netYieldPct !== null ? formatPct(result.netYieldPct, 2) : "–",
        hint: "Driftsresultat / investert",
      },
      {
        label: "Cash-on-cash",
        value:
          result.cashOnCashPct !== null ? formatPct(result.cashOnCashPct, 1) : "–",
        hint: "Kontantstrøm / egenkapital",
        tone:
          result.cashOnCashPct !== null && result.cashOnCashPct < 0
            ? "text-destructive"
            : undefined,
      },
      {
        label: "Belåningsgrad",
        value: result.ltvPct !== null ? formatPct(result.ltvPct, 1) : "–",
        hint: "Lån / boligverdi",
      },
    ];

  return (
    <div className="grid grid-cols-2 gap-px border-t border-border bg-border xl:grid-cols-4">
      {figures.map((figure) => (
        <div key={figure.label} className="bg-card px-5 py-4 sm:px-7 sm:py-5 xl:px-5">
          <p className="text-xs text-muted-foreground">{figure.label}</p>
          <p
            className={cn(
              "mt-1.5 text-xl font-semibold tracking-[-0.02em] tabular-nums",
              figure.tone,
            )}
          >
            {figure.value}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{figure.hint}</p>
        </div>
      ))}
    </div>
  );
}

export interface ResultsPanelProps {
  input: CalcInput;
  result: CalcResult;
}

export function ResultsPanel({ input, result }: ResultsPanelProps) {
  return (
    <div className="space-y-5" id="resultater">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <VerdictHeader result={result} />
        <KeyFigures result={result} />

        <div className="border-t border-border p-5 sm:p-7">
          <Tabs defaultValue="prognose">
            <TabsList variant="line" className="mb-5 -ml-1.5">
              <TabsTrigger value="prognose">Prognose</TabsTrigger>
              <TabsTrigger value="laan">Lån</TabsTrigger>
              <TabsTrigger value="sensitivitet">Sensitivitet</TabsTrigger>
            </TabsList>
            <TabsContent value="prognose">
              <ProjectionChart years={result.years} />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Egenkapitalverdi = boligverdi − restgjeld − fellesgjeld.
                Akkumulert kontantstrøm er etter skatt.
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

        <Accordion
          type="single"
          collapsible
          className="border-t border-border px-5 sm:px-7"
        >
          <AccordionItem value="detaljer" className="border-b-0">
            <AccordionTrigger className="py-4 text-[13px] font-semibold hover:no-underline">
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
    </div>
  );
}
