import { Calculator } from "@/components/calculator/calculator";
import { partKey } from "@/lib/ai/merge";
import { buildReport } from "@/lib/ai/report";
import type { AnalysisResult } from "@/lib/ai/schema";
import { calculate } from "@/lib/calc/engine";
import type { CalcInput } from "@/lib/calc/schema";
import { formatNumber, formatPct } from "@/lib/format";

const kr = (value: number) => `${formatNumber(Math.round(value))} kr`;
const signedKr = (value: number) =>
  `${value < 0 ? "−" : "+"}${formatNumber(Math.abs(Math.round(value)))} kr`;

type Light = "red" | "yellow" | "green";

/** Trafikklyset: én fargekode brukt likt i hele rapporten. */
const LIGHT: Record<Light, { dot: string; text: string; panel: string; badge: string }> = {
  red: {
    dot: "bg-destructive",
    text: "text-destructive",
    panel: "border-destructive/25 bg-destructive/[0.04]",
    badge: "bg-destructive text-white",
  },
  yellow: {
    dot: "bg-[#e0a100]",
    text: "text-warning",
    panel: "border-[#e0a100]/30 bg-[#e0a100]/[0.06]",
    badge: "bg-[#e0a100] text-[#111]",
  },
  green: {
    dot: "bg-positive",
    text: "text-positive",
    panel: "border-positive/25 bg-positive/[0.05]",
    badge: "bg-positive text-white",
  },
};

const CONDITION_GROUPS: { light: Light; title: string; hint: string; grades: number[] }[] = [
  { light: "red", title: "TG3", hint: "Må utbedres", grades: [3] },
  { light: "yellow", title: "TG2", hint: "Bør følges opp", grades: [2] },
  { light: "green", title: "TG0–1", hint: "I orden", grades: [0, 1] },
];

const FINDING_GROUPS: {
  light: Light;
  title: string;
  severity: AnalysisResult["findings"][number]["severity"];
}[] = [
  { light: "red", title: "Alvorlig", severity: "alvorlig" },
  { light: "yellow", title: "Vær oppmerksom", severity: "obs" },
  { light: "green", title: "Taler for kjøpet", severity: "bra" },
];

const RENTAL: Record<AnalysisResult["rental"]["status"], { label: string; light: Light | null }> = {
  tillatt: { label: "Tillatt", light: "green" },
  krever_samtykke: { label: "Krever samtykke fra styret", light: "yellow" },
  begrenset: { label: "Begrenset", light: "yellow" },
  ukjent: { label: "Står ikke i salgsoppgaven", light: null },
};

type ConditionItem = AnalysisResult["condition"][number];

/**
 * Rapporter laget før tilstandsgradene fikk sin egen liste, har dem som
 * funn med «TG3: …» i tittelen. Vi leser dem ut derfra, så gamle rapporter
 * vises på samme måte som nye.
 */
function splitCondition(analysis: AnalysisResult): {
  condition: ConditionItem[];
  findings: AnalysisResult["findings"];
} {
  if (analysis.condition && analysis.condition.length > 0) {
    return { condition: analysis.condition, findings: analysis.findings };
  }
  const byPart = new Map<string, ConditionItem>();
  const findings: AnalysisResult["findings"] = [];
  for (const finding of analysis.findings) {
    const match = finding.title.match(/TG\s?([0-3])/i);
    if (!match) {
      findings.push(finding);
      continue;
    }
    const part = finding.title.replace(/TG\s?[0-3]\s*[:–-]?\s*/i, "").trim() || finding.title;
    const item: ConditionItem = {
      part: part.charAt(0).toUpperCase() + part.slice(1),
      grade: Number(match[1]),
      note: finding.detail,
      page: finding.page,
      costLow: finding.costLow,
      costHigh: finding.costHigh,
    };
    const key = partKey(item.part);
    const existing = byPart.get(key);
    if (!existing || item.grade > existing.grade) byPart.set(key, item);
  }
  return { condition: [...byPart.values()], findings };
}

function Dot({ light, className = "" }: { light: Light; className?: string }) {
  return (
    <span aria-hidden className={`inline-block size-2.5 shrink-0 rounded-full ${LIGHT[light].dot} ${className}`} />
  );
}

function Page({ page }: { page: number | null }) {
  if (!page) return null;
  return (
    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">s. {page}</span>
  );
}

/**
 * Rapporten. KI-en har hentet ut tallene og funnene; alt som er regnet
 * her, kommer fra kalkulatormotoren, og kan justeres i kalkulatoren under.
 */
export function ReportView({
  analysis,
  filename,
  inputOverride,
  sample = false,
}: {
  analysis: AnalysisResult;
  filename: string;
  /** Bare for eksempelrapporten, som bruker forhåndsvalget fra forsiden. */
  inputOverride?: CalcInput;
  sample?: boolean;
}) {
  const report = buildReport(analysis);
  const { property, numbers, rental } = analysis;
  const { condition, findings } = splitCondition(analysis);
  const title = [property.address, property.city].filter(Boolean).join(", ");

  if (!report) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="display text-3xl">{title || "Salgsoppgaven"}</h1>
        <p className="mt-4 text-muted-foreground">
          Vi fant ingen prisantydning i salgsoppgaven, så regnestykket kan ikke
          settes opp automatisk.
        </p>
        <p className="mt-6 leading-relaxed">{analysis.summary}</p>
      </div>
    );
  }

  const input = inputOverride ?? report.input;
  const result = calculate(input);
  const cashflow = result.monthlyCashflowAfterTax;
  const equityPct = Math.round((input.equity / input.purchasePrice) * 100);

  const figures = [
    { label: "Brutto yield", value: result.grossYieldPct ? formatPct(result.grossYieldPct, 2) : null },
    { label: "Går i null ved leie", value: result.breakEvenRent ? kr(result.breakEvenRent) : null },
    { label: "Tåler rente opp til", value: result.breakEvenRatePct ? formatPct(result.breakEvenRatePct) : null },
    {
      label: "Går i null ved kjøpesum",
      value: report.breakEvenPrice && !inputOverride ? kr(report.breakEvenPrice) : null,
    },
  ].filter((row): row is { label: string; value: string } => row.value !== null);

  const rows = [
    { label: "Prisantydning", amount: numbers.askingPrice },
    { label: "Andel fellesgjeld", amount: numbers.sharedDebt },
    { label: "Omkostninger", amount: numbers.transactionCosts },
    { label: "Felleskostnader per måned", amount: numbers.hoaFeesMonthly },
    { label: "Kommunale avgifter per år", amount: numbers.municipalFeesYearly },
    { label: "Eiendomsskatt per år", amount: numbers.propertyTaxYearly },
    { label: "Dagens månedsleie", amount: numbers.currentMonthlyRent },
  ].filter((row) => row.amount.value !== null);

  const conditionGroups = CONDITION_GROUPS.map((group) => ({
    ...group,
    items: condition.filter((item) => group.grades.includes(Math.round(item.grade))),
  }));
  const priced = condition.filter((item) => item.grade >= 2 && item.costLow && item.costHigh);
  const costLow = priced.reduce((sum, item) => sum + (item.costLow ?? 0), 0);
  const costHigh = priced.reduce((sum, item) => sum + (item.costHigh ?? 0), 0);
  const rentalInfo = RENTAL[rental.status];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <p className="text-[13px] text-muted-foreground">
        KI-analyse · {sample ? "eksempelrapport" : filename}
      </p>
      <h1 className="display mt-2 text-[clamp(2rem,5vw,3.5rem)]">
        {title || "Salgsoppgaven"}
      </h1>

      {/* Oversikten: tre svar på ett blikk. */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <section className="surface-dark rounded-3xl p-6">
          <h2 className="text-[13px] text-muted-foreground">
            Kontantstrøm per måned, etter skatt
          </h2>
          <p
            className={`display mt-2 text-[clamp(2.5rem,5vw,3.5rem)] tabular-nums ${
              cashflow < 0 ? "text-[#ff8a66]" : "text-[#7ee2a8]"
            }`}
          >
            {signedKr(cashflow)}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {equityPct} % egenkapital · {formatPct(input.interestRate)} rente ·{" "}
            {kr(input.monthlyRent)} i leie
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-2">
            {figures.map((row) => (
              <div key={row.label} className="rounded-xl bg-white/[0.07] px-3 py-2.5">
                <dt className="text-[11px] text-muted-foreground">{row.label}</dt>
                <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-[13px] text-muted-foreground">Tilstand</h2>
          {condition.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Vi fant ingen tilstandsgrader i salgsoppgaven.
            </p>
          ) : (
            <>
              <ul className="mt-3 space-y-2">
                {conditionGroups.map((group) => (
                  <li
                    key={group.title}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${LIGHT[group.light].panel}`}
                  >
                    <span className={`display w-7 text-center text-2xl tabular-nums ${LIGHT[group.light].text}`}>
                      {group.items.length}
                    </span>
                    <Dot light={group.light} />
                    <span className="text-sm font-medium">{group.title}</span>
                    <span className="text-[13px] text-muted-foreground">{group.hint}</span>
                  </li>
                ))}
              </ul>
              {costHigh > 0 ? (
                <p className="mt-4 text-sm">
                  <span className="text-muted-foreground">Oppgitt utbedring: </span>
                  <span className="font-medium tabular-nums">
                    {kr(costLow)}–{kr(costHigh)}
                  </span>
                </p>
              ) : null}
            </>
          )}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-[13px] text-muted-foreground">Utleie</h2>
          <p className="mt-3 flex items-center gap-2.5 text-lg font-medium tracking-[-0.01em]">
            {rentalInfo.light ? <Dot light={rentalInfo.light} /> : null}
            {rentalInfo.label}
            <Page page={rental.page} />
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            {rental.note}
          </p>
          <div className="mt-4 border-t border-border pt-4">
            <p className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                {report.rent.source === "listing" ? "Dagens leie" : "Leieanslag"}
              </span>
              <span className="font-medium tabular-nums">{kr(input.monthlyRent)}</span>
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {report.rent.note}
            </p>
          </div>
        </section>
      </div>

      <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
        {analysis.summary}
      </p>

      {condition.length > 0 ? (
        <section className="mt-14">
          <h2 className="display text-[clamp(1.5rem,3vw,2rem)]">Tilstandsrapporten</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {conditionGroups.map((group) => (
              <div
                key={group.title}
                className={`rounded-3xl border p-5 ${LIGHT[group.light].panel}`}
              >
                <h3 className="flex items-center gap-2.5">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${LIGHT[group.light].badge}`}>
                    {group.title}
                  </span>
                  <span className="text-sm font-medium">{group.hint}</span>
                  <span className="ml-auto text-sm tabular-nums text-muted-foreground">
                    {group.items.length}
                  </span>
                </h3>
                {group.items.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">Ingen.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-foreground/10">
                    {group.items.map((item) => (
                      <li key={item.part} className="py-3">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[15px] font-medium">{item.part}</span>
                          <Page page={item.page} />
                        </div>
                        {item.note ? (
                          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                            {item.note}
                          </p>
                        ) : null}
                        {item.costLow && item.costHigh ? (
                          <p className="mt-1.5 text-[13px] font-medium tabular-nums">
                            {kr(item.costLow)}–{kr(item.costHigh)}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {findings.length > 0 ? (
        <section className="mt-14">
          <h2 className="display text-[clamp(1.5rem,3vw,2rem)]">Andre forhold</h2>
          <div className="mt-6 space-y-8">
            {FINDING_GROUPS.map((group) => {
              const items = findings.filter((finding) => finding.severity === group.severity);
              if (items.length === 0) return null;
              return (
                <div key={group.title}>
                  <h3 className="flex items-center gap-2.5 text-sm font-medium">
                    <Dot light={group.light} />
                    {group.title}
                    <span className="tabular-nums text-muted-foreground">{items.length}</span>
                  </h3>
                  <ul className="mt-3 grid gap-3 md:grid-cols-2">
                    {items.map((finding) => (
                      <li
                        key={finding.title}
                        className={`rounded-2xl border p-4 ${LIGHT[group.light].panel}`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <h4 className="text-[15px] font-medium">{finding.title}</h4>
                          <Page page={finding.page} />
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                          {finding.detail}
                        </p>
                        {finding.costLow && finding.costHigh ? (
                          <p className="mt-1.5 text-[13px] font-medium tabular-nums">
                            {kr(finding.costLow)}–{kr(finding.costHigh)}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="display text-[clamp(1.5rem,3vw,2rem)]">Tallene fra salgsoppgaven</h2>
        <dl className="mt-6 grid gap-x-10 rounded-3xl border border-border bg-card px-6 py-2 text-sm sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline gap-4 border-b border-border py-3 last:border-0">
              <dt className="flex-1 text-muted-foreground">{row.label}</dt>
              <dd className="font-medium tabular-nums">{kr(row.amount.value ?? 0)}</dd>
              <dd className="w-10 text-right">
                <Page page={row.amount.page} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <h2 className="display mt-14 text-[clamp(1.5rem,3vw,2rem)]">
        Juster forutsetningene
      </h2>
      <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">
        Tallene fra salgsoppgaven er lagt inn. Endre egenkapital, rente og leie
        til det som gjelder for deg.
      </p>
      <div className="mt-8">
        <Calculator initialInput={input} />
      </div>

      <p className="mt-12 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
        Analysen er laget av en KI-modell og kan inneholde feil. Kontroller
        tallene mot salgsoppgaven før du byr. Dette er et estimat, ikke
        finansiell rådgivning.
      </p>
    </div>
  );
}
