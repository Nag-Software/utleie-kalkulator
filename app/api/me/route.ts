import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { EMPTY_STATUS, loadStatus } from "@/lib/db/klippekort";

/** Klippekortet og innloggingsstatus for den som spør. */
export async function GET() {
  const config = getConfig();
  const session = await readSession();

  let status = EMPTY_STATUS;
  if (session) {
    try {
      status = await loadStatus(session.userId);
    } catch (error) {
      // Databasen nede skal ikke velte forsiden — brukeren ser «0 klipp» og
      // et forsøk på innløsning gir en tydelig feil.
      console.error("me: kunne ikke lese klippekortet", error);
    }
  }

  return NextResponse.json(
    {
      paymentsEnabled: config.features.payments,
      loginEnabled: config.features.login,
      loggedIn: Boolean(session),
      name: session?.name ?? null,
      klippekort: status,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
