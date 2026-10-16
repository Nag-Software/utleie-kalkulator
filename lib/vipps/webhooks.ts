import "server-only";
import { getConfig } from "@/lib/config";
import { vippsFetch } from "@/lib/vipps/epayment";

/**
 * Registrering av Vipps-webhooken (Webhooks API v1).
 *
 * Webhooken er det som fullfører et kjøp når kunden godkjenner i appen men
 * aldri kommer tilbake til nettleseren. Registreringen er knyttet til
 * salgsenheten (MSN) og miljøet, og gjøres av den daglige avstemmingen —
 * den finnes da alltid i riktig miljø uten et manuelt steg, og blir
 * gjenopprettet hvis noen sletter den.
 *
 * Vi verifiserer ikke HMAC-signaturen på innkommende kall, og trenger derfor
 * ikke ta vare på hemmeligheten Vipps returnerer. Innholdet i et
 * webhook-kall brukes bare som et hint om hvilken referanse som skal
 * sjekkes; statusen leses alltid fra Vipps. Et forfalsket kall kan altså
 * ikke gjøre mer enn retur-URL-en allerede tillater: be oss slå opp et kjøp.
 */
export const WEBHOOK_EVENTS = [
  "epayments.payment.authorized.v1",
  "epayments.payment.aborted.v1",
  "epayments.payment.expired.v1",
  "epayments.payment.terminated.v1",
] as const;

export function webhookUrl(): string {
  return `${getConfig().siteUrl}/api/vipps/webhook`;
}

interface RegisteredWebhook {
  id: string;
  url: string;
  events: string[];
}

/**
 * Sørger for at webhooken er registrert. Returnerer `created` hvis den
 * måtte opprettes, ellers `exists`. Trygg å kalle så ofte man vil.
 */
export async function ensureWebhookRegistered(): Promise<"created" | "exists"> {
  const url = webhookUrl();
  if (!url.startsWith("https://")) {
    // Vipps godtar bare https — lokalt finnes det ingenting å registrere.
    throw new Error(`webhook-URL-en må være https: ${url}`);
  }

  const { webhooks = [] } = (await vippsFetch("/webhooks/v1/webhooks", {
    method: "GET",
  })) as { webhooks?: RegisteredWebhook[] };

  const existing = webhooks.find((webhook) => webhook.url === url);
  if (
    existing &&
    WEBHOOK_EVENTS.every((event) => existing.events.includes(event))
  ) {
    return "exists";
  }

  // Finnes den med feil hendelser, erstattes den heller enn å få to.
  if (existing) {
    await vippsFetch(`/webhooks/v1/webhooks/${encodeURIComponent(existing.id)}`, {
      method: "DELETE",
    });
  }

  await vippsFetch("/webhooks/v1/webhooks", {
    method: "POST",
    body: { url, events: WEBHOOK_EVENTS },
  });
  return "created";
}
