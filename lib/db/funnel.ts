import "server-only";
import { rpc } from "@/lib/db/client";

/**
 * Trakten før kjøpet: FINN-forhåndsvisninger og innlogginger på vei mot et
 * kjøp. Påbegynte og fullførte kjøp leses av `purchases`, så de logges ikke
 * her.
 *
 * Målingen skal aldri koste brukeren noe: feil svelges, og kallet gjøres i
 * `after()` så det ikke forsinker svaret.
 */
export type FunnelEvent = "finn_preview" | "finn_preview_failed" | "login_start";

export async function logFunnelEvent(
  event: FunnelEvent,
  options: { finnkode?: string | null; loggedIn?: boolean | null } = {},
): Promise<void> {
  try {
    await rpc<null>("log_funnel_event", {
      p_event: event,
      p_finnkode: options.finnkode ?? null,
      p_logged_in: options.loggedIn ?? null,
    });
  } catch (error) {
    console.warn("funnel event not logged", event, error);
  }
}
