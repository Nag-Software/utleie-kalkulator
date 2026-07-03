const FINNKODE_PATTERN = /^\d{8,10}$/;
const ALLOWED_HOSTS = new Set(["finn.no", "www.finn.no", "m.finn.no"]);

/**
 * SSRF-vakt: vi henter aldri en bruker-oppgitt URL. Input (URL eller rå
 * finnkode) reduseres til en validert finnkode, og kanonisk FINN-URL
 * bygges server-side.
 */
export function extractFinnkode(input: string): string | null {
  const trimmed = input.trim();
  if (FINNKODE_PATTERN.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (!ALLOWED_HOSTS.has(url.hostname.toLowerCase())) return null;

  const fromQuery = url.searchParams.get("finnkode");
  if (fromQuery && FINNKODE_PATTERN.test(fromQuery)) return fromQuery;

  const fromPath = url.pathname.match(/\/(\d{8,10})(?:\/|$)/);
  if (fromPath) return fromPath[1];

  return null;
}

export function buildFinnUrl(finnkode: string): string {
  return `https://www.finn.no/realestate/homes/ad.html?finnkode=${finnkode}`;
}
