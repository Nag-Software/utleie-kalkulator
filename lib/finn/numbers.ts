/**
 * Tallparsing for FINN-verdier: "4 550 668 kr", "66 m² (BRA-i)",
 * "6 811 kr/mnd" (med NBSP/smalt mellomrom som tusenskille).
 */
export function parseFinnNumber(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const collapsed = raw.replace(/[\s  ]/g, "");
  const match = collapsed.match(/\d+/);
  if (!match) return null;
  const value = Number.parseInt(match[0], 10);
  return Number.isNaN(value) ? null : value;
}
