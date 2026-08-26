import "server-only";

/**
 * Lazy env-lesing med feature-gating: appen skal boote og fungere uten
 * nøkler (Stripe kommer senere). Verdier som er tomme eller starter
 * med "PLACEHOLDER" behandles som fraværende.
 *
 * Ingen database: Stripe er eneste sannhetskilde for betalte beregninger.
 */
function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed.toUpperCase().startsWith("PLACEHOLDER")) {
    return undefined;
  }
  return trimmed;
}

export interface AppConfig {
  stripeSecretKey?: string;
  siteUrl: string;
  /** dev-only: tving FINN-feilkode for å teste refusjonsstien */
  finnForceError?: string;
  /** dev-only: hopp over Stripe for FINN-henting (localhost) */
  devBypassPayments: boolean;
  features: {
    /** betalte FINN-beregninger */
    payments: boolean;
  };
}

export function getConfig(): AppConfig {
  const stripeSecretKey = readEnv("STRIPE_SECRET_KEY");
  const devBypassPayments = process.env.NODE_ENV !== "production";

  return {
    stripeSecretKey,
    siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
    finnForceError:
      process.env.NODE_ENV === "production" ? undefined : readEnv("FINN_FORCE_ERROR"),
    devBypassPayments,
    features: {
      payments: Boolean(stripeSecretKey) || devBypassPayments,
    },
  };
}
