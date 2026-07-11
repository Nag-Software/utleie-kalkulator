"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CalcResult } from "@/lib/calc/engine";
import type { CalcInput } from "@/lib/calc/schema";
import { formatNOK, formatPct } from "@/lib/format";
import { MoneyField, NumberSliderField, SegmentedField } from "./fields";

export interface InputPanelProps {
  input: CalcInput;
  result: CalcResult;
  onChange: <K extends keyof CalcInput>(field: K, value: CalcInput[K]) => void;
}

const EQUITY_PRESETS = [10, 15, 25, 40];

export function InputPanel({ input, result, onChange }: InputPanelProps) {
  const equityPct =
    result.totalProjectCost > 0
      ? (input.equity / result.totalProjectCost) * 100
      : 0;

  return (
    <Accordion
      type="multiple"
      defaultValue={["kjop", "finansiering", "leie"]}
      className="w-full"
    >
      <AccordionItem value="kjop">
        <AccordionTrigger className="py-3.5 text-sm font-semibold hover:no-underline">Kjøp</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-1">
          <MoneyField
            label="Kjøpesum / prisantydning"
            value={input.purchasePrice}
            onChange={(v) => onChange("purchasePrice", v)}
            sliderMax={12_000_000}
            sliderStep={50_000}
          />
          <SegmentedField
            label="Eieform"
            value={input.ownershipType}
            onChange={(v) => onChange("ownershipType", v)}
            options={[
              { value: "selveier", label: "Selveier" },
              { value: "andel", label: "Andel/borettslag" },
            ]}
            hint={
              input.ownershipType === "selveier"
                ? "Selveier: 2,5 % dokumentavgift beregnes automatisk."
                : "Andel: ingen dokumentavgift. Husk fellesgjeld og felleskostnader."
            }
          />
          <MoneyField
            label="Omkostninger"
            value={input.transactionCosts ?? result.resolvedTransactionCosts}
            onChange={(v) => onChange("transactionCosts", v)}
            hint={
              input.transactionCosts === null
                ? "Beregnet automatisk fra eieform. Skriv for å overstyre."
                : undefined
            }
            action={
              input.transactionCosts !== null ? (
                <button
                  type="button"
                  onClick={() => onChange("transactionCosts", null)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Tilbakestill til auto
                </button>
              ) : (
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                  auto
                </span>
              )
            }
          />
          {input.ownershipType === "andel" || input.sharedDebt > 0 ? (
            <MoneyField
              label="Fellesgjeld"
              value={input.sharedDebt}
              onChange={(v) => onChange("sharedDebt", v)}
              sliderMax={3_000_000}
              sliderStep={10_000}
              hint="Betjenes gjennom felleskostnadene – legges ikke på lånet ditt."
            />
          ) : null}
          <MoneyField
            label="Oppussing før utleie"
            value={input.renovationCost}
            onChange={(v) => onChange("renovationCost", v)}
            sliderMax={1_000_000}
            sliderStep={10_000}
          />
          <MoneyField
            label="Andre kjøpskostnader"
            value={input.otherPurchaseCosts}
            onChange={(v) => onChange("otherPurchaseCosts", v)}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="finansiering">
        <AccordionTrigger className="py-3.5 text-sm font-semibold hover:no-underline">
          Finansiering
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-1">
          <MoneyField
            label="Egenkapital"
            value={input.equity}
            onChange={(v) => onChange("equity", v)}
            sliderMax={Math.max(result.totalProjectCost, 1_000_000)}
            sliderStep={25_000}
            hint={`${formatPct(equityPct, 1)} av totalprosjektet (${formatNOK(result.totalProjectCost)}). Lån: ${formatNOK(result.loanAmount)}.`}
          />
          <div className="flex flex-wrap gap-1.5">
            {EQUITY_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() =>
                  onChange(
                    "equity",
                    Math.round((result.totalProjectCost * pct) / 100 / 1000) * 1000,
                  )
                }
                className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {pct} %
              </button>
            ))}
          </div>
          <NumberSliderField
            label="Nominell rente"
            value={input.interestRate}
            onChange={(v) => onChange("interestRate", v)}
            max={12}
            step={0.05}
            suffix="%"
            decimals={2}
          />
          <NumberSliderField
            label="Løpetid"
            value={input.loanTermYears}
            onChange={(v) => onChange("loanTermYears", Math.round(v))}
            min={1}
            max={40}
            step={1}
            suffix="år"
            decimals={0}
          />
          <NumberSliderField
            label="Avdragsfrihet"
            value={input.interestOnlyYears}
            onChange={(v) => onChange("interestOnlyYears", Math.round(v))}
            max={Math.min(input.loanTermYears, 20)}
            step={1}
            suffix="år"
            decimals={0}
          />
          <SegmentedField
            label="Lånetype"
            value={input.loanType}
            onChange={(v) => onChange("loanType", v)}
            options={[
              { value: "annuitet", label: "Annuitetslån" },
              { value: "serie", label: "Serielån" },
            ]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="leie">
        <AccordionTrigger className="py-3.5 text-sm font-semibold hover:no-underline">
          Leieinntekter
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-1">
          <MoneyField
            label="Månedsleie"
            value={input.monthlyRent}
            onChange={(v) => onChange("monthlyRent", v)}
            sliderMax={40_000}
            sliderStep={250}
            hint="Sjekk lignende utleieboliger i området for et realistisk nivå."
          />
          <NumberSliderField
            label="Ledighet"
            value={input.vacancyRate}
            onChange={(v) => onChange("vacancyRate", v)}
            max={30}
            step={0.5}
            suffix="%"
            hint="Andel av året uten leietaker (bytte, oppussing, tomgang)."
          />
          <NumberSliderField
            label="Årlig leiejustering"
            value={input.rentGrowth}
            onChange={(v) => onChange("rentGrowth", v)}
            min={-2}
            max={8}
            suffix="%"
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="drift">
        <AccordionTrigger className="py-3.5 text-sm font-semibold hover:no-underline">
          Driftskostnader
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-1">
          <MoneyField
            label="Felleskostnader per måned"
            value={input.hoaFeesMonthly}
            onChange={(v) => onChange("hoaFeesMonthly", v)}
            sliderMax={15_000}
            sliderStep={100}
          />
          <MoneyField
            label="Kommunale avgifter per år"
            value={input.municipalFeesYearly}
            onChange={(v) => onChange("municipalFeesYearly", v)}
            hint="Ofte inkludert i felleskostnadene i borettslag/sameie."
          />
          <MoneyField
            label="Eiendomsskatt per år"
            value={input.propertyTaxYearly}
            onChange={(v) => onChange("propertyTaxYearly", v)}
          />
          <MoneyField
            label="Forsikring per år"
            value={input.insuranceYearly}
            onChange={(v) => onChange("insuranceYearly", v)}
          />
          <NumberSliderField
            label="Vedlikehold (% av leie)"
            value={input.maintenancePctOfRent}
            onChange={(v) => onChange("maintenancePctOfRent", v)}
            max={30}
            step={0.5}
            suffix="%"
          />
          <NumberSliderField
            label="Forvaltning/utleiemegler (% av leie)"
            value={input.managementPctOfRent}
            onChange={(v) => onChange("managementPctOfRent", v)}
            max={30}
            step={0.5}
            suffix="%"
          />
          <MoneyField
            label="Strøm/internett dekket av utleier, per år"
            value={input.utilitiesYearly}
            onChange={(v) => onChange("utilitiesYearly", v)}
          />
          <MoneyField
            label="Regnskap/annen bistand per år"
            value={input.accountingYearly}
            onChange={(v) => onChange("accountingYearly", v)}
          />
          <MoneyField
            label="Andre kostnader per år"
            value={input.otherOpexYearly}
            onChange={(v) => onChange("otherOpexYearly", v)}
          />
          <NumberSliderField
            label="Årlig kostnadsvekst"
            value={input.opexGrowth}
            onChange={(v) => onChange("opexGrowth", v)}
            min={-2}
            max={8}
            suffix="%"
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="skatt">
        <AccordionTrigger className="py-3.5 text-sm font-semibold hover:no-underline">
          Skatt
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-1">
          <NumberSliderField
            label="Skattesats på netto leieinntekt"
            value={input.taxRate}
            onChange={(v) => onChange("taxRate", v)}
            max={50}
            step={0.5}
            suffix="%"
            hint="22 % for skattepliktig utleie (2026). Sett 0 ved skattefri utleie i egen bolig."
          />
          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="interest-deduction" className="text-[13px]">
                Rentefradrag
              </Label>
              <p className="text-xs text-muted-foreground">
                Trekk gjeldsrenter fra i skatteberegningen.
              </p>
            </div>
            <Switch
              id="interest-deduction"
              checked={input.interestDeduction}
              onCheckedChange={(v) => onChange("interestDeduction", v)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="marked" className="border-b-0">
        <AccordionTrigger className="py-3.5 text-sm font-semibold hover:no-underline">
          Marked og prognose
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-1">
          <NumberSliderField
            label="Årlig verdistigning"
            value={input.valueGrowth}
            onChange={(v) => onChange("valueGrowth", v)}
            min={-2}
            max={10}
            suffix="%"
            hint="Historisk snitt i Norge er 3–5 % nominelt, men varierer mye."
          />
          <NumberSliderField
            label="Horisont"
            value={input.horizonYears}
            onChange={(v) => onChange("horizonYears", Math.round(v))}
            min={1}
            max={30}
            step={1}
            suffix="år"
            decimals={0}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
