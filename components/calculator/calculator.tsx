"use client";

import { Loader2, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { calculate } from "@/lib/calc/engine";
import { type CalcInput, DEFAULT_INPUT } from "@/lib/calc/schema";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { InputPanel } from "./input-panel";
import { getVerdict, ResultsPanel } from "./results-panel";
import { decodeInputFromParams, encodeInputToParams, hasAnyCalcParam } from "./url-state";

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
  /** les/skriv inputs i URL-query (gratis kalkulator på forsiden) */
  urlSync?: boolean;
  /** vis Del- og Lagre-knapper (gratis-modus) */
  shareActions?: boolean;
  /** KI-vurdering (betalte beregninger) */
  aiPanel?: React.ReactNode;
  /** kalles debounced når brukeren endrer inputs (lagrede beregninger) */
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
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const hydratedFromUrl = useRef(false);

  // Les delte verdier fra URL etter mount (siden forblir statisk generert)
  useEffect(() => {
    if (!urlSync || hydratedFromUrl.current) return;
    hydratedFromUrl.current = true;
    const params = new URLSearchParams(window.location.search);
    if (hasAnyCalcParam(params)) {
      dispatch({ type: "replace", input: decodeInputFromParams(params) });
    }
  }, [urlSync]);

  // Skriv ikke-default-verdier tilbake til URL (debounced, uten RSC-refetch)
  useEffect(() => {
    if (!urlSync || !hydratedFromUrl.current) return;
    const timeout = setTimeout(() => {
      const params = encodeInputToParams(input);
      const query = params.toString();
      const url = query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;
      window.history.replaceState(null, "", url);
    }, 300);
    return () => clearTimeout(timeout);
  }, [input, urlSync]);

  // Meld fra om endringer (debounced) — brukes til PATCH på lagrede beregninger
  const onInputChangeRef = useRef(onInputChange);
  onInputChangeRef.current = onInputChange;
  const isFirstChange = useRef(true);
  useEffect(() => {
    if (!onInputChangeRef.current) return;
    if (isFirstChange.current) {
      isFirstChange.current = false;
      return;
    }
    const timeout = setTimeout(() => onInputChangeRef.current?.(input), 800);
    return () => clearTimeout(timeout);
  }, [input]);

  async function copyShareLink() {
    const params = encodeInputToParams(input);
    const query = params.toString();
    const url = `${window.location.origin}/${query ? `?${query}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lenke kopiert – alle tallene dine ligger i lenken.");
    } catch {
      toast.error("Kunne ikke kopiere lenken.");
    }
  }

  async function saveCalculation() {
    setSaving(true);
    try {
      const response = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: input }),
      });
      if (response.status === 503) {
        toast.info("Lagring er ikke tilgjengelig ennå – bruk Del-knappen i stedet.");
        return;
      }
      if (response.status === 429) {
        toast.error("For mange lagringer på kort tid. Prøv igjen senere.");
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      const { id } = (await response.json()) as { id: string };
      toast.success("Beregningen er lagret.");
      router.push(`/beregning/${id}`);
    } catch {
      toast.error("Noe gikk galt ved lagring. Prøv igjen.");
    } finally {
      setSaving(false);
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
                variant="outline"
                size="sm"
                onClick={saveCalculation}
                disabled={saving}
                className="flex-1"
              >
                {saving ? <Loader2 data-slot="icon" className="animate-spin" /> : null}
                Lagre
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
