import "server-only";

/**
 * Lazy env-lesing med feature-gating: appen skal boote og fungere uten
 * nøkler. Verdier som er tomme eller starter med "PLACEHOLDER" behandles
 * som fraværende.
 *
 * Ingen database: Stripe Customer-metadata er lageret for klippekort.
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
  sessionSecret?: string;
  siteUrl: string;
  /** dev-only: tving FINN-feilkode for å teste refusjonsstien */
  finnForceError?: string;
  /** dev-only: hopp over Stripe for FINN-henting (localhost) */
  devBypassPayments: boolean;
  vipps: {
    clientId?: string;
    clientSecret?: string;
    environment: "test" | "production";
  };
  features: {
    /** Kjøp og bruk av klippekort. */
    payments: boolean;
    login: boolean;
  };
}

export function getConfig(): AppConfig {
  const stripeSecretKey = readEnv("STRIPE_SECRET_KEY");
  const devBypassPayments = process.env.NODE_ENV !== "production";
  const sessionSecret =
    readEnv("SESSION_SECRET") ??
    (devBypassPayments ? "dev-only-insecure-session-secret" : undefined);
  const vippsClientId = readEnv("VIPPS_LOGIN_CLIENT_ID");
  const vippsClientSecret = readEnv("VIPPS_LOGIN_CLIENT_SECRET");

  return {
    stripeSecretKey,
    sessionSecret,
    siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
    finnForceError:
      process.env.NODE_ENV === "production" ? undefined : readEnv("FINN_FORCE_ERROR"),
    devBypassPayments,
    vipps: {
      clientId: vippsClientId,
      clientSecret: vippsClientSecret,
      environment:
        readEnv("VIPPS_ENVIRONMENT")?.toLowerCase() === "production"
          ? "production"
          : "test",
    },
    features: {
      payments:
        devBypassPayments || Boolean(stripeSecretKey && sessionSecret),
      login: Boolean(vippsClientId && vippsClientSecret && sessionSecret),
    },
  };
}
