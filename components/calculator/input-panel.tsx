"use client";

import { useState } from "react";
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
import type { EstimatedCalcField } from "@/lib/research/enrich";
import { cn } from "@/lib/utils";
import {
  MoneyField,
  NumberSliderField,
  QuickChips,
  SegmentedField,
} from "./fields";

export interface InputPanelProps {
  input: CalcInput;
  result: CalcResult;
  onChange: <K extends keyof CalcInput>(field: K, value: CalcInput[K]) => void;
  estimatedFields?: ReadonlySet<EstimatedCalcField>;
}

const EQUITY_CHIPS = [10, 15, 25, 40].map((pct) => ({
  label: `${pct} %`,
  value: pct,
}));

/**
 * Forutsetninger i to nivåer: «Enkel» viser de seks tallene som faktisk
 * flytter svaret, «Detaljert» åpner alt. Standardverdiene som brukes i
 * enkel modus står oppsummert nederst, så ingenting skjules i det stille.
 */
export function InputPanel({
  input,
  result,
  onChange,
  estimatedFields,
}: InputPanelProps) {
  const [detailed, setDetailed] = useState(false);
  const estimated = (field: EstimatedCalcField) =>
    estimatedFields?.has(field) ?? false;

  const equityPct =
    result.totalProjectCost > 0
      ? (input.equity / result.totalProjectCost) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-[-0.02em]">
          Forutsetninger
        </h2>
        <div
          role="radiogroup"
          aria-label="Detaljnivå"
          className="grid grid-cols-2 gap-1 rounded-full border border-border bg-secondary p-1"
        >
          {[
            { value: false, label: "Enkel" },
            { value: true, label: "Detaljert" },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={detailed === option.value}
              onClick={() => setDetailed(option.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                detailed === option.value
                  ? "bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kjernetallene – alltid synlige */}
      <div className="space-y-5">
        <MoneyField
          label="Kjøpesum"
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
            { value: "andel", label: "Andel" },
          ]}
          hint={
            input.ownershipType === "selveier"
              ? `2,5 % dokumentavgift regnes automatisk (${formatNOK(result.resolvedTransactionCosts)} i omkostninger).`
              : "Ingen dokumentavgift. Husk fellesgjeld og felleskostnader."
          }
        />
        <div className="space-y-2.5">
          <MoneyField
            label="Egenkapital"
            value={input.equity}
            onChange={(v) => onChange("equity", v)}
            sliderMax={Math.max(result.totalProjectCost, 1_000_000)}
            sliderStep={25_000}
            hint={`${formatPct(equityPct, 1)} av totalprosjektet på ${formatNOK(result.totalProjectCost)}. Lån: ${formatNOK(result.loanAmount)}.`}
          />
          <QuickChips
            options={EQUITY_CHIPS}
            onSelect={(pct) =>
              onChange(
                "equity",
                Math.round((result.totalProjectCost * pct) / 100 / 1000) * 1000,
              )
            }
          />
        </div>
        <NumberSliderField
          label="Rente på lånet"
          value={input.interestRate}
          onChange={(v) => onChange("interestRate", v)}
          max={12}
          step={0.05}
          suffix="%"
          decimals={2}
        />
        <MoneyField
          label="Månedsleie"
          value={input.monthlyRent}
          onChange={(v) => onChange("monthlyRent", v)}
          sliderMax={40_000}
          sliderStep={250}
          estimated={estimated("monthlyRent")}
          hint={
            estimated("monthlyRent")
              ? "Fylt inn som anslag fra beliggenhet og størrelse. Juster mot aktive utleieannonser."
              : "Sjekk lignende utleieboliger i området for et realistisk nivå."
          }
        />
        <MoneyField
          label="Felleskostnader per måned"
          value={input.hoaFeesMonthly}
          onChange={(v) => onChange("hoaFeesMonthly", v)}
          sliderMax={15_000}
          sliderStep={100}
        />
      </div>

      {detailed ? (
        <Accordion
          type="multiple"
          defaultValue={["kjop"]}
          className="w-full border-t border-border"
        >
          <AccordionItem value="kjop">
            <AccordionTrigger className="py-4 text-[13px] font-semibold hover:no-underline">
              Kjøp og omkostninger
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
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
                      className="text-xs font-medium text-cta hover:underline"
                    >
                      Tilbakestill
                    </button>
                  ) : (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      auto
                    </span>
                  )
                }
              />
              <MoneyField
                label="Fellesgjeld"
                value={input.sharedDebt}
                onChange={(v) => onChange("sharedDebt", v)}
                sliderMax={3_000_000}
                sliderStep={10_000}
                hint="Betjenes gjennom felleskostnadene – legges ikke på lånet ditt."
              />
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
            <AccordionTrigger className="py-4 text-[13px] font-semibold hover:no-underline">
              Lån
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
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
            <AccordionTrigger className="py-4 text-[13px] font-semibold hover:no-underline">
              Leieinntekter
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
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
            <AccordionTrigger className="py-4 text-[13px] font-semibold hover:no-underline">
              Driftskostnader
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
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
                estimated={estimated("propertyTaxYearly")}
              />
              <MoneyField
                label="Forsikring per år"
                value={input.insuranceYearly}
                onChange={(v) => onChange("insuranceYearly", v)}
                estimated={estimated("insuranceYearly")}
              />
              <NumberSliderField
                label="Vedlikehold (% av leie)"
                value={input.maintenancePctOfRent}
                onChange={(v) => onChange("maintenancePctOfRent", v)}
                max={30}
                step={0.5}
                suffix="%"
                estimated={estimated("maintenancePctOfRent")}
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
            <AccordionTrigger className="py-4 text-[13px] font-semibold hover:no-underline">
              Skatt
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <NumberSliderField
                label="Skattesats på netto leieinntekt"
                value={input.taxRate}
                onChange={(v) => onChange("taxRate", v)}
                max={50}
                step={0.5}
                suffix="%"
                hint="22 % for skattepliktig utleie (2026). Sett 0 ved skattefri utleie i egen bolig."
              />
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3.5">
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
            <AccordionTrigger className="py-4 text-[13px] font-semibold hover:no-underline">
              Verdistigning og horisont
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
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
      ) : (
        <div className="rounded-xl border border-border bg-secondary/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
          Vi regner med {input.loanTermYears} års{" "}
          {input.loanType === "annuitet" ? "annuitetslån" : "serielån"},{" "}
          {formatPct(input.vacancyRate, 1)} ledighet,{" "}
          {formatPct(input.maintenancePctOfRent, 1)} til vedlikehold,{" "}
          {formatPct(input.taxRate, 0)} skatt og{" "}
          {formatPct(input.valueGrowth, 1)} verdistigning i året.{" "}
          <button
            type="button"
            onClick={() => setDetailed(true)}
            className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-2 hover:text-cta"
          >
            Endre forutsetningene
          </button>
        </div>
      )}
    </div>
  );
}
