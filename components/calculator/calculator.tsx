"use client";

import { RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { calculate } from "@/lib/calc/engine";
import { type CalcInput, DEFAULT_INPUT } from "@/lib/calc/schema";
import { formatNumber } from "@/lib/format";
import type { EstimatedCalcField } from "@/lib/research/enrich";
import { cn } from "@/lib/utils";
import { InputPanel } from "./input-panel";
import { EXAMPLE_PRESETS } from "./presets";
import { getVerdict, ResultsPanel } from "./results-panel";
import {
  decodeInputFromParams,
  encodeInputToParams,
  hasAnyCalcParam,
} from "./url-state";

type Action =
  | { type: "set"; field: keyof CalcInput; value: CalcInput[keyof CalcInput] }
  | { type: "replace"; input: CalcInput };

function reducer(state: CalcInput, action: Action): CalcInput {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "replace":
      return action.input;
  }
}

const ESTIMATED_FIELDS: EstimatedCalcField[] = [
  "monthlyRent",
  "propertyTaxYearly",
  "insuranceYearly",
  "maintenancePctOfRent",
];

function isEstimatedField(field: keyof CalcInput): field is EstimatedCalcField {
  return ESTIMATED_FIELDS.includes(field as EstimatedCalcField);
}

export interface CalculatorProps {
  initialInput?: CalcInput;
  /** les/skriv inputs i URL-query; andre query-params (f.eks. session_id) bevares */
  urlSync?: boolean;
  /** vis Del-knapp over inputene */
  shareActions?: boolean;
  /** vis eksempel-scenarioer som fyller kalkulatoren med ett klikk */
  examplePresets?: boolean;
  /** kalles debounced når brukeren endrer inputs */
  onInputChange?: (input: CalcInput) => void;
  /** felt som ble auto-fylt fra FINN/anslag; merket til brukeren endrer dem */
  estimatedFields?: EstimatedCalcField[];
  /**
   * Vises øverst i høyre kolonne, over resultatene. Brukes til bildene fra
   * FINN-annonsen, slik at venstre kolonne er forutsetningene alene.
   */
  gallery?: React.ReactNode;
}

export function Calculator({
  initialInput,
  urlSync = false,
  shareActions = false,
  examplePresets = false,
  onInputChange,
  estimatedFields: initialEstimated = [],
  gallery,
}: CalculatorProps) {
  const [input, dispatch] = useReducer(reducer, initialInput ?? DEFAULT_INPUT);
  const [estimated, setEstimated] = useState(
    () => new Set<EstimatedCalcField>(initialEstimated),
  );
  const result = useMemo(() => calculate(input), [input]);
  const initialRef = useRef(input);
  const hydrated = useRef(false);

  // Uten server-gitt initialInput: les delte verdier fra URL etter mount
  // (siden forblir statisk generert). Med initialInput har serveren
  // allerede flettet inn URL-verdiene.
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (!urlSync || initialInput) return;
    const params = new URLSearchParams(window.location.search);
    if (hasAnyCalcParam(params)) {
      dispatch({ type: "replace", input: decodeInputFromParams(params) });
    }
  }, [urlSync, initialInput]);

  // Skriv inputs til URL (debounced) etter første brukerendring.
  // Fremmede params (session_id m.m.) bevares.
  useEffect(() => {
    if (!urlSync || input === initialRef.current) return;
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      for (const key of Object.keys(DEFAULT_INPUT)) params.delete(key);
      for (const [key, value] of encodeInputToParams(input)) {
        params.set(key, value);
      }
      if (estimated.size > 0) {
        params.set("est", [...estimated].join(","));
      } else {
        params.delete("est");
      }
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        query ? `${window.location.pathname}?${query}` : window.location.pathname,
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [input, urlSync, estimated]);

  // Meld fra om endringer (debounced)
  const onInputChangeRef = useRef(onInputChange);
  useEffect(() => {
    onInputChangeRef.current = onInputChange;
  }, [onInputChange]);
  useEffect(() => {
    if (!onInputChangeRef.current || input === initialRef.current) return;
    const timeout = setTimeout(() => onInputChangeRef.current?.(input), 800);
    return () => clearTimeout(timeout);
  }, [input]);

  async function copyShareLink() {
    const params = new URLSearchParams(window.location.search);
    for (const key of Object.keys(DEFAULT_INPUT)) params.delete(key);
    for (const [key, value] of encodeInputToParams(input)) params.set(key, value);
    const query = params.toString();
    const url = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lenke kopiert – alle tallene dine ligger i lenken.");
    } catch {
      toast.error("Kunne ikke kopiere lenken.");
    }
  }

  const verdict = getVerdict(result.monthlyCashflowAfterTax);

  return (
    <div className="relative">
      {examplePresets || shareActions ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {examplePresets ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-muted-foreground">
                Prøv et eksempel:
              </span>
              {EXAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-cta hover:text-cta"
                  onClick={() => {
                    dispatch({ type: "replace", input: { ...preset.input } });
                    toast.success(
                      `Eksempel lastet: ${preset.label}. Juster tallene fritt.`,
                    );
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {shareActions ? (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={copyShareLink}>
                <Share2 data-slot="icon" />
                Del
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Nullstill kalkulatoren"
                title="Nullstill"
                onClick={() => {
                  dispatch({ type: "replace", input: { ...DEFAULT_INPUT } });
                  toast.success("Kalkulatoren er nullstilt.");
                }}
              >
                <RotateCcw />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <InputPanel
            input={input}
            result={result}
            estimatedFields={estimated}
            onChange={(field, value) => {
              dispatch({ type: "set", field, value });
              if (isEstimatedField(field)) {
                setEstimated((prev) => {
                  if (!prev.has(field)) return prev;
                  const next = new Set(prev);
                  next.delete(field);
                  return next;
                });
              }
            }}
          />
        </div>

        <div className="pb-24 lg:sticky lg:top-20 lg:pb-0">
          {gallery ? <div className="mb-5">{gallery}</div> : null}
          <ResultsPanel input={input} result={result} />
        </div>
      </div>

      {/* Sticky oppsummering på mobil */}
      <a
        href="#resultater"
        className="surface-dark fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-3 rounded-full border border-white/10 px-5 py-3.5 shadow-lg shadow-black/20 lg:hidden"
      >
        <span className="flex items-center gap-2.5 text-sm">
          <span
            aria-hidden
            className={cn(
              "size-2 shrink-0 rounded-full",
              verdict === "positive" && "bg-positive",
              verdict === "warning" && "bg-warning",
              verdict === "negative" && "bg-destructive",
            )}
          />
          Kontantstrøm/mnd
        </span>
        <span
          className={cn(
            "text-base font-semibold tabular-nums",
            verdict === "positive" && "text-positive",
            verdict === "warning" && "text-warning",
            verdict === "negative" && "text-destructive",
          )}
        >
          {result.monthlyCashflowAfterTax < 0 ? "−" : "+"}
          {formatNumber(Math.abs(Math.round(result.monthlyCashflowAfterTax)))} kr
        </span>
      </a>
    </div>
  );
}
