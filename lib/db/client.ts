import "server-only";
import { getConfig } from "@/lib/config";

/**
 * Tynn klient mot Supabase sitt REST-lag. Vi kaller bare databasefunksjoner
 * (`/rest/v1/rpc/...`), aldri tabellene direkte: invariantene for klippekort
 * — ett klipp per FINN-kode, idempotent kreditering — ligger i SQL og skal
 * ikke kunne omgås herfra.
 *
 * Nøkkelen er den hemmelige (service_role). Alle tabellene har RLS på uten
 * policyer, så den publiserbare nøkkelen kommer ikke til noe av dette, og
 * ingenting av dette skal noen gang kalles fra nettleseren.
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export async function rpc<T>(
  fn: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const { database } = getConfig();
  if (!database.url || !database.secretKey) {
    throw new DatabaseError("SUPABASE_URL eller SUPABASE_SECRET_KEY mangler");
  }

  const response = await fetch(
    `${database.url.replace(/\/+$/, "")}/rest/v1/rpc/${fn}`,
    {
      method: "POST",
      headers: {
        apikey: database.secretKey,
        Authorization: `Bearer ${database.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    },
  );

  const text = await response.text();
  if (!response.ok) {
    let detail = text.slice(0, 500);
    try {
      const problem = JSON.parse(text) as {
        message?: string;
        hint?: string;
      };
      detail = [problem.message, problem.hint].filter(Boolean).join(" — ") || detail;
    } catch {
      // Ikke JSON — behold råteksten.
    }
    throw new DatabaseError(`${fn} feilet: ${detail}`, response.status);
  }

  return (text ? JSON.parse(text) : null) as T;
}
