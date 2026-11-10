export const SITE_NAME = "Utleie-kalkulator";
// Fallback til produksjonsdomenet, ikke localhost: canonical/sitemap må aldri
// peke på localhost selv om env-variabelen skulle mangle i et miljø.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://utleie-kalkulator.no";
export const CONTACT_EMAIL = "casper@nagsoftware.no";

/**
 * KI-analyse av salgsoppgaver. Må stemme med radene i `public.products`:
 * pris og antall leses derfra ved kjøp, verdiene her er det vi viser og
 * beløpet vi ber Vipps om.
 */
export const KI_PRODUCTS = {
  "ki-analyse-1": { analyses: 1, priceNok: 49, priceOre: 4900, label: "Én analyse" },
  "ki-analyse-5": { analyses: 5, priceNok: 149, priceOre: 14900, label: "Fem analyser" },
} as const;
export type KiProductId = keyof typeof KI_PRODUCTS;
export const KI_GYLDIGHET_MANEDER = 12;
/** Supabase Storage-bøtta og grensen på opplastingen (50 MB). */
export const KI_BUCKET = "salgsoppgaver";
export const KI_MAX_BYTES = 50 * 1024 * 1024;
/**
 * Større filer enn KI_MAX_BYTES komprimeres i nettleseren før opplasting.
 * Målet er satt under delingsgrensen i lib/ai/analyze.ts (40 MB), så en
 * komprimert fil leses i ett KI-kall. Over KI_RAW_MAX_BYTES prøver vi ikke.
 */
export const KI_COMPRESS_TARGET_BYTES = 38 * 1024 * 1024;
export const KI_RAW_MAX_BYTES = 300 * 1024 * 1024;

/**
 * Selskapsidentifikasjon. Kravene til betalingsleverandører (bl.a. Vipps
 * MobilePay) er at navn, organisasjonsnummer, adresse, telefon og e-post skal
 * være godt synlig på nettstedet. Alt samles her så footer, kontaktside,
 * vilkår, personvern og JSON-LD aldri kan komme i utakt.
 *
 * Kilde for navn, organisasjonsform og adresse: Enhetsregisteret.
 */
export const COMPANY = {
  /** Registrert foretaksnavn i Enhetsregisteret */
  legalName: "Nag Software",
  organizationNumber: "936593127",
  /** Formatert for visning: «Org.nr. 936 593 127» */
  organizationNumberFormatted: "936 593 127",
  legalForm: "Enkeltpersonforetak",
  street: "Sydhøyveien 1",
  postalCode: "3084",
  city: "Holmestrand",
  country: "Norge",
  countryCode: "NO",
  /** E.164 – brukes i tel:-lenker og JSON-LD */
  phone: "+4748338033",
  /** Leservennlig gruppering av samme nummer */
  phoneFormatted: "+47 483 38 033",
  email: CONTACT_EMAIL,
  /** Ikke registrert i Merverdiavgiftsregisteret per 26. august 2026 */
  vatRegistered: false,
  brregUrl:
    "https://virksomhet.brreg.no/nb/oppslag/enheter/936593127",
} as const;

/** «Sydhøyveien 1, 3084 Holmestrand» */
export const COMPANY_ADDRESS_LINE = `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}`;
