export const SITE_NAME = "Utleie-kalkulator";
// Fallback til produksjonsdomenet, ikke localhost: canonical/sitemap må aldri
// peke på localhost selv om env-variabelen skulle mangle i et miljø.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://utleie-kalkulator.no";
export const CONTACT_EMAIL = "casper@nagsoftware.no";
export const PRICE_NOK = "9,90";
export const PRICE_ORE = 990;
