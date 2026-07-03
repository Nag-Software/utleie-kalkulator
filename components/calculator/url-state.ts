import {
  type CalcInput,
  DEFAULT_INPUT,
  parseInputLenient,
} from "@/lib/calc/schema";

/**
 * Deling uten database: inputs koder inn i URL-query med fulle feltnavn,
 * kun for verdier som avviker fra default. Ukjente/ugyldige verdier
 * ignoreres ved dekoding (parseInputLenient).
 */

export function encodeInputToParams(input: CalcInput): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of Object.keys(DEFAULT_INPUT) as (keyof CalcInput)[]) {
    const value = input[key];
    if (value === DEFAULT_INPUT[key]) continue;
    if (value === null) {
      params.set(key, "auto");
    } else if (typeof value === "boolean") {
      params.set(key, value ? "1" : "0");
    } else {
      params.set(key, String(value));
    }
  }
  return params;
}

export function decodeInputFromParams(params: URLSearchParams): CalcInput {
  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(DEFAULT_INPUT) as (keyof CalcInput)[]) {
    const value = params.get(key);
    if (value === null) continue;
    const defaultValue = DEFAULT_INPUT[key];
    if (key === "transactionCosts") {
      raw[key] = value === "auto" ? null : Number(value);
    } else if (typeof defaultValue === "boolean") {
      raw[key] = value === "1" || value === "true";
    } else if (typeof defaultValue === "number" || defaultValue === null) {
      raw[key] = Number(value);
    } else {
      raw[key] = value;
    }
  }
  return parseInputLenient(raw);
}

export function hasAnyCalcParam(params: URLSearchParams): boolean {
  return (Object.keys(DEFAULT_INPUT) as (keyof CalcInput)[]).some((key) =>
    params.has(key),
  );
}
