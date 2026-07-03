import "server-only";

/**
 * Lazy env-lesing med feature-gating: appen skal boote og fungere
 * uten nøkler (Stripe/OpenAI/Supabase kommer senere). Verdier som er
 * tomme eller starter med "PLACEHOLDER" behandles som fraværende.
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
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  openaiApiKey?: string;
  openaiModel: string;
  siteUrl: string;
  rateLimitSalt: string;
  cronSecret?: string;
  /** dev-only: tving FINN-feilkode for å teste refusjonsstien */
  finnForceError?: string;
  features: {
    /** lagring/deling av beregninger */
    db: boolean;
    /** betalte FINN-beregninger (krever også db) */
    payments: boolean;
    /** KI-vurdering */
    ai: boolean;
  };
}

export function getConfig(): AppConfig {
  const supabaseUrl = readEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  const stripeSecretKey = readEnv("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");
  const openaiApiKey = readEnv("OPENAI_API_KEY");
  const db = Boolean(supabaseUrl && supabaseServiceRoleKey);

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    stripeSecretKey,
    stripeWebhookSecret,
    openaiApiKey,
    openaiModel: readEnv("OPENAI_MODEL") ?? "gpt-5-mini",
    siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
    rateLimitSalt: readEnv("RATE_LIMIT_SALT") ?? "dev-salt-not-for-prod",
    cronSecret: readEnv("CRON_SECRET"),
    finnForceError:
      process.env.NODE_ENV === "production" ? undefined : readEnv("FINN_FORCE_ERROR"),
    features: {
      db,
      payments: Boolean(db && stripeSecretKey),
      ai: Boolean(openaiApiKey),
    },
  };
}
