const nokFormatter = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

/** 1234567 → "1 234 567 kr" (NBSP-tusenskille via nb-NO) */
export function formatNOK(value: number): string {
  return `${nokFormatter.format(Math.round(value))} kr`;
}

/** 1234567 → "1 234 567" uten valutasuffiks */
export function formatNumber(value: number): string {
  return nokFormatter.format(Math.round(value));
}

/** 5.5 → "5,5 %" */
export function formatPct(value: number, decimals = 1): string {
  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} %`;
}

/** 4500000 → "4,5 mill." (for akser og kompakte visninger) */
export function formatCompact(value: number): string {
  return value.toLocaleString("nb-NO", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

/** "4 500 000 kr" → 4500000. Tomt/ugyldig → 0. */
export function parseNOK(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits === "") return 0;
  const parsed = Number.parseInt(digits, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** "5,5" / "5.5" → 5.5. Tomt/ugyldig → 0. */
export function parseDecimal(raw: string): number {
  const normalized = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}
