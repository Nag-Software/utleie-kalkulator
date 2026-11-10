import "server-only";

/**
 * Lazy env-lesing med feature-gating: appen skal boote og fungere uten
 * nøkler. Verdier som er tomme eller starter med "PLACEHOLDER" behandles
 * som fraværende.
 *
 * Plattformen er Vipps-only: Vipps ePayment tar betalingen, Vipps Login
 * identifiserer brukeren, og Postgres (Supabase) lagrer kjøp og analyser.
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

function readFlag(name: string): boolean {
  const value = readEnv(name)?.toLowerCase();
  return value === "1" || value === "true";
}

export interface AppConfig {
  siteUrl: string;
  sessionSecret?: string;
  /**
   * dev-only opt-in (`DEV_FAKE_PAYMENTS=1`): krediter kjøpet uten å
   * snakke med Vipps. Aldri på av seg selv — ellers ville lokal utvikling
   * sett ut som at betalingen virker mens produksjon mangler nøkler.
   */
  devFakePayments: boolean;
  database: {
    url?: string;
    secretKey?: string;
  };
  vipps: {
    clientId?: string;
    clientSecret?: string;
    subscriptionKey?: string;
    /** Merchant Serial Number (MSN) for salgsenheten. */
    merchantSerialNumber?: string;
    environment: "test" | "production";
  };
  /** OpenAI, for KI-analyse av salgsoppgaver. `model` overstyrer standarden. */
  openai: { apiKey?: string; model?: string };
  features: {
    /** KI-analyse: krever OpenAI-nøkkel og database (med lagringsbøtte). */
    ai: boolean;
    /** Kjøp med Vipps. */
    payments: boolean;
    /** Innlogging med Vipps. */
    login: boolean;
  };
}

export function getConfig(): AppConfig {
  const isDev = process.env.NODE_ENV !== "production";
  const devFakePayments = isDev && readFlag("DEV_FAKE_PAYMENTS");

  const sessionSecret =
    readEnv("SESSION_SECRET") ??
    (isDev ? "dev-only-insecure-session-secret" : undefined);

  const databaseUrl = readEnv("SUPABASE_URL");
  const databaseSecretKey = readEnv("SUPABASE_SECRET_KEY");
  const hasDatabase = Boolean(databaseUrl && databaseSecretKey);

  const clientId = readEnv("VIPPS_CLIENT_ID");
  const clientSecret = readEnv("VIPPS_CLIENT_SECRET");
  const subscriptionKey = readEnv("VIPPS_SUBSCRIPTION_KEY");
  const merchantSerialNumber = readEnv("VIPPS_MSN");

  // Innlogging trenger OIDC-nøklene; betaling trenger i tillegg
  // abonnementsnøkkelen og MSN. Begge trenger et sted å lagre brukeren.
  const hasVippsClient = Boolean(clientId && clientSecret && sessionSecret);
  const login = hasVippsClient && hasDatabase;
  const payments =
    hasDatabase &&
    (devFakePayments ||
      (hasVippsClient && Boolean(subscriptionKey && merchantSerialNumber)));

  return {
    siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
    sessionSecret,
    devFakePayments,
    database: { url: databaseUrl, secretKey: databaseSecretKey },
    vipps: {
      clientId,
      clientSecret,
      subscriptionKey,
      merchantSerialNumber,
      environment:
        readEnv("VIPPS_ENVIRONMENT")?.toLowerCase() === "production"
          ? "production"
          : "test",
    },
    openai: { apiKey: readEnv("OPENAI_API_KEY"), model: readEnv("OPENAI_MODEL") },
    features: {
      ai: hasDatabase && Boolean(readEnv("OPENAI_API_KEY")),
      payments,
      login,
    },
  };
}

/** `https://apitest.vipps.no` i test, `https://api.vipps.no` i produksjon. */
export function vippsHost(): string {
  return getConfig().vipps.environment === "production"
    ? "https://api.vipps.no"
    : "https://apitest.vipps.no";
}
