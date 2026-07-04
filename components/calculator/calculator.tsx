"use client";

import { RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { calculate } from "@/lib/calc/engine";
import { type CalcInput, DEFAULT_INPUT } from "@/lib/calc/schema";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { InputPanel } from "./input-panel";
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

export interface CalculatorProps {
  initialInput?: CalcInput;
  /** les/skriv inputs i URL-query; andre query-params (f.eks. session_id) bevares */
  urlSync?: boolean;
  /** vis Del-knapp over inputene */
  shareActions?: boolean;
  /** KI-vurdering (betalte beregninger) */
  aiPanel?: React.ReactNode;
  /** kalles debounced når brukeren endrer inputs */
  onInputChange?: (input: CalcInput) => void;
}

export function Calculator({
  initialInput,
  urlSync = false,
  shareActions = false,
  aiPanel,
  onInputChange,
}: CalculatorProps) {
  const [input, dispatch] = useReducer(reducer, initialInput ?? DEFAULT_INPUT);
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
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        query ? `${window.location.pathname}?${query}` : window.location.pathname,
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [input, urlSync]);

  // Meld fra om endringer (debounced)
  const onInputChangeRef = useRef(onInputChange);
  onInputChangeRef.current = onInputChange;
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
      <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start">
        <div className="rounded-xl border bg-card px-4 py-2">
          {shareActions ? (
            <div className="flex gap-2 border-b py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyShareLink}
                className="flex-1"
              >
                <Share2 data-slot="icon" />
                Del beregning
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  dispatch({ type: "replace", input: { ...DEFAULT_INPUT } });
                  toast.success("Kalkulatoren er nullstilt.");
                }}
              >
                <RotateCcw data-slot="icon" />
                Nullstill
              </Button>
            </div>
          ) : null}
          <InputPanel
            input={input}
            result={result}
            onChange={(field, value) => dispatch({ type: "set", field, value })}
          />
        </div>

        <div className="pb-16 lg:sticky lg:top-6 lg:pb-0">
          <ResultsPanel input={input} result={result} aiPanel={aiPanel} />
        </div>
      </div>

      {/* Sticky oppsummering på mobil */}
      <a
        href="#resultater"
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t px-4 py-3 backdrop-blur lg:hidden",
          verdict === "positive" && "border-positive/40 bg-positive/15",
          verdict === "warning" && "border-warning bg-warning/20",
          verdict === "negative" && "border-destructive/40 bg-destructive/10",
        )}
      >
        <span className="text-sm font-medium">Kontantstrøm/mnd</span>
        <span className="font-mono text-base font-bold tabular-nums">
          {result.monthlyCashflowAfterTax < 0 ? "−" : "+"}
          {formatNumber(Math.abs(Math.round(result.monthlyCashflowAfterTax)))} kr
        </span>
      </a>
    </div>
  );
}
