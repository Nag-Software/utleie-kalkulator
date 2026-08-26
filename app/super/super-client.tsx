"use client";

import { AlertCircle, ArrowUpDown, Loader2, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatNOK } from "@/lib/format";
import { SUPER_DEFAULTS, type SuperAnalysisResponse } from "@/lib/super/types";

type FormState = {
  searchUrl: string;
  interestRate: number;
  equityPct: number;
  loanTermYears: number;
  interestOnlyYears: number;
  loanType: "annuitet" | "serie";
  renovationCost: number;
  otherPurchaseCosts: number;
};

const COMMON_PARAMS = [
  "location",
  "price_to",
  "price_from",
  "totalprice_to",
  "rent_to",
  "min_bedrooms",
  "size_from",
  "size_to",
  "building_year_from",
  "building_year_to",
  "property_type",
  "ownership_type",
  "page",
  "sort",
];

const initialState: FormState = {
  searchUrl:
    "https://www.finn.no/realestate/homes/search.html?location=1.22046.20220&price_to=3000000&rent_to=10000&min_bedrooms=2",
  ...SUPER_DEFAULTS,
};

function money(value: number | null | undefined): string {
  if (value === null || value === undefined) return "–";
  return formatNOK(Math.round(value));
}

function percent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  return `${value.toFixed(1)} %`;
}

function parseInputNumber(raw: string): number {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function InputGroup({
  label,
  value,
  onChange,
  suffix,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="number"
          step={step}
          value={value}
          onChange={(event) => onChange(parseInputNumber(event.target.value))}
          className={suffix ? "pr-14" : undefined}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
  accent,
}: {
  title: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/80 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${accent ?? ""}`}>{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function SuperClient() {
  const [form, setForm] = useState<FormState>(initialState);
  const [analysis, setAnalysis] = useState<SuperAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assumptionPayload = useMemo(
    () => ({
      interestRate: form.interestRate,
      equityPct: form.equityPct,
      loanTermYears: form.loanTermYears,
      interestOnlyYears: form.interestOnlyYears,
      loanType: form.loanType,
      renovationCost: form.renovationCost,
      otherPurchaseCosts: form.otherPurchaseCosts,
    }),
    [form],
  );

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/super/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchUrl: form.searchUrl, assumptions: assumptionPayload }),
      });

      const data = (await response.json()) as
        | SuperAnalysisResponse
        | { message?: string };
      if (!response.ok) {
        setError(
          ("message" in data ? data.message : null) ?? "Noe gikk galt.",
        );
        return;
      }

      setAnalysis(data as SuperAnalysisResponse);
    } catch {
      setError("Kunne ikke kontakte analysen. Sjekk nettverket og prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  const topResult = analysis?.results[0] ?? null;
  const positiveCount = analysis?.results.filter((result) => result.monthlyCashflowAfterTax > 0).length ?? 0;
  const averageCashflow =
    analysis && analysis.results.length > 0
      ? analysis.results.reduce((sum, result) => sum + result.monthlyCashflowAfterTax, 0) / analysis.results.length
      : null;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top_left,_rgba(224,91,44,0.18),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.15),_transparent_34%),linear-gradient(180deg,_rgba(15,23,42,0.05),_transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="size-3.5" />
              FINN-søk + kontantstrøm-sjekk
            </div>
            <div className="max-w-3xl space-y-4">
              <h1 className="display text-[clamp(2rem,5vw,3rem)]">
                Lim inn et FINN-søk, og finn eiendommer som tåler dine krav.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Denne siden tar en vanlig FINN-søkelenke, henter alle treff i søket, og rangerer dem etter estimert kontantstrøm basert på forutsetningene du låser før analysen kjøres.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {COMMON_PARAMS.map((param) => (
                <Badge key={param} variant="secondary" className="rounded-full px-3 py-1">
                  {param}
                </Badge>
              ))}
            </div>

            <Card className="border-foreground/10 bg-background/90 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>1. Lim inn søket</CardTitle>
                <CardDescription>
                  Eksempel: en lenke med location, price_to, rent_to og min_bedrooms. Du kan bruke så mange FINN-filtre som du vil, så lenge det er en vanlig homes/search-lenke.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="search-url">FINN-søkelenke</Label>
                  <Input
                    id="search-url"
                    value={form.searchUrl}
                    onChange={(event) => setForm((current) => ({ ...current, searchUrl: event.target.value }))}
                    placeholder="https://www.finn.no/realestate/homes/search.html?..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <InputGroup label="Rente" value={form.interestRate} onChange={(value) => setForm((current) => ({ ...current, interestRate: value }))} suffix="%" />
                  <InputGroup label="Egenkapital" value={form.equityPct} onChange={(value) => setForm((current) => ({ ...current, equityPct: value }))} suffix="%" />
                  <InputGroup label="Løpetid" value={form.loanTermYears} onChange={(value) => setForm((current) => ({ ...current, loanTermYears: value }))} suffix="år" step={1} />
                  <InputGroup label="Avdragsfrihet" value={form.interestOnlyYears} onChange={(value) => setForm((current) => ({ ...current, interestOnlyYears: value }))} suffix="år" step={1} />
                  <InputGroup label="Renovering" value={form.renovationCost} onChange={(value) => setForm((current) => ({ ...current, renovationCost: value }))} suffix="kr" />
                  <InputGroup label="Andre kjøpskostnader" value={form.otherPurchaseCosts} onChange={(value) => setForm((current) => ({ ...current, otherPurchaseCosts: value }))} suffix="kr" />
                </div>

                <Button
                  onClick={() => void runAnalysis()}
                  disabled={loading}
                  className="w-full rounded-full bg-cta px-6 text-[15px] font-semibold text-cta-foreground hover:bg-cta/90"
                  size="lg"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                  Analyser søket
                </Button>
                <p className="text-sm text-muted-foreground">
                  Vanlige FINN-parametere jeg ser i homes-søk: {COMMON_PARAMS.join(", ")}.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:sticky lg:top-8">
            <Card className="border-foreground/10 bg-background/90 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>2. Resultat</CardTitle>
                <CardDescription>
                  Når analysen er kjørt, får du en rangert liste over treffene med estimert leie, kontantstrøm og break-even.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatCard title="Analyserte treff" value={analysis ? String(analysis.resultCount) : "–"} hint={analysis ? `${analysis.pagesScanned} sider skannet` : "Kjør analysen først"} />
                <StatCard title="Positive treff" value={analysis ? String(positiveCount) : "–"} hint="Treff med positiv månedlig kontantstrøm etter skatt" accent={positiveCount > 0 ? "text-positive" : undefined} />
                <StatCard title="Snitt kontantstrøm" value={analysis ? money(averageCashflow) : "–"} hint="Gjennomsnitt per måned etter skatt" accent={averageCashflow && averageCashflow > 0 ? "text-positive" : ""} />
                <StatCard title="Beste treff" value={topResult ? money(topResult.monthlyCashflowAfterTax) : "–"} hint={topResult ? topResult.title ?? topResult.finnkode : "Ingen resultater ennå"} accent={topResult && topResult.monthlyCashflowAfterTax > 0 ? "text-positive" : ""} />
                {analysis?.truncated ? (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    Søket var større enn grensen for skanning, så analysen stoppet tidlig. Strammere filtre gir mer presise resultater.
                  </div>
                ) : null}
                {error ? (
                  <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    {error}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {analysis?.warnings.length ? (
              <Card className="border-foreground/10 bg-background/90 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle>Analysevarsel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {analysis.warnings.map((warning) => (
                    <p key={warning}>{warning}</p>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>

        <Separator className="my-10" />

        {analysis ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Rangert resultat</p>
                <h2 className="display mt-2 text-3xl">Treffene med best forventet kontantstrøm</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm text-muted-foreground shadow-sm">
                <ArrowUpDown className="size-4" />
                Sortert etter score
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {analysis.results.map((result, index) => (
                <Card key={result.finnkode} className="overflow-hidden border-foreground/10 bg-background/90 shadow-sm backdrop-blur">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      {result.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.imageUrl} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-secondary text-sm font-semibold text-secondary-foreground">
                          {index + 1}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={result.monthlyCashflowAfterTax > 0 ? "default" : "secondary"} className="rounded-full">
                            {result.monthlyCashflowAfterTax > 0 ? "Positiv" : "Negativ"} cashflow
                          </Badge>
                          <Badge variant="outline" className="rounded-full">
                            #{index + 1}
                          </Badge>
                        </div>
                        <CardTitle className="mt-3 line-clamp-2 text-xl">
                          {result.title ?? `FINN ${result.finnkode}`}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {result.propertyType ?? "Ukjent boligtype"} · {result.ownershipType ?? "ukjent eieform"} · {result.area ? `${result.area} m²` : "ukjent størrelse"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl bg-secondary/40 p-3">
                        <p className="text-xs text-muted-foreground">Leie</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">{money(result.estimatedMonthlyRent)}</p>
                      </div>
                      <div className="rounded-2xl bg-secondary/40 p-3">
                        <p className="text-xs text-muted-foreground">Kontantstrøm</p>
                        <p className={`mt-1 text-lg font-semibold tabular-nums ${result.monthlyCashflowAfterTax >= 0 ? "text-positive" : "text-destructive"}`}>
                          {money(result.monthlyCashflowAfterTax)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-secondary/40 p-3">
                        <p className="text-xs text-muted-foreground">Cash-on-cash</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">{percent(result.cashOnCashPct)}</p>
                      </div>
                      <div className="rounded-2xl bg-secondary/40 p-3">
                        <p className="text-xs text-muted-foreground">Break-even leie</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">{money(result.breakEvenRent)}</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border p-3">
                        <p className="text-xs text-muted-foreground">Pris og gjeld</p>
                        <p className="mt-1 text-sm">
                          Prisantydning {money(result.askingPrice)} · Totalpris {money(result.totalPrice)} · Fellesgjeld {money(result.sharedDebt)}
                        </p>
                      </div>
                      <div className="rounded-2xl border p-3">
                        <p className="text-xs text-muted-foreground">Yield</p>
                        <p className="mt-1 text-sm">
                          Brutto {percent(result.grossYieldPct)} · Netto {percent(result.netYieldPct)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-full">
                        Lån: {money(result.loanAmount)}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        Egenkapital: {money(result.equity)}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        Omg. {money(result.transactionCosts)}
                      </Badge>
                      {result.bedrooms !== null ? (
                        <Badge variant="outline" className="rounded-full">
                          {result.bedrooms} soverom
                        </Badge>
                      ) : null}
                    </div>

                    {result.warnings.length ? (
                      <div className="space-y-1 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100">
                        {result.warnings.map((warning) => (
                          <p key={warning}>{warning}</p>
                        ))}
                      </div>
                    ) : null}

                    <a href={result.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                      Åpne annonse på FINN
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          <Card className="border-dashed border-foreground/20 bg-background/60">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
                <Search className="size-6 text-secondary-foreground" />
              </div>
              <div className="max-w-xl space-y-2">
                <h2 className="display text-2xl">Ingen analyse enda</h2>
                <p className="text-muted-foreground">
                  Lim inn en FINN-søkelenke, sett antakelsene dine, og kjør analysen. Resultatet blir sortert etter forventet kontantstrøm.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}