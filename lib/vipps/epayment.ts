import "server-only";
import { getConfig, vippsHost } from "@/lib/config";
import {
  getVippsAccessToken,
  VippsError,
  vippsSystemHeaders,
} from "@/lib/vipps/token";

/**
 * Vipps ePayment API v1.
 *
 * Flyten er `WEB_REDIRECT`: vi oppretter betalingen, sender brukeren til
 * `redirectUrl`, og Vipps sender ham tilbake til `returnUrl` når han har
 * godkjent i appen. Retur-URL-en er et hint, ikke et løfte — brukeren kan
 * lukke fanen — så statusen leses alltid fra Vipps med `getPayment`, aldri
 * fra det retur-kallet påstår.
 */

/** Betalingens tilstand hos Vipps. */
export type VippsPaymentState =
  | "CREATED"
  | "ABORTED"
  | "EXPIRED"
  | "AUTHORIZED"
  | "TERMINATED";

export interface VippsPayment {
  reference: string;
  state: VippsPaymentState;
  /** Beløp i øre slik Vipps har registrert det. */
  amountOre: number;
  authorizedOre: number;
  capturedOre: number;
  /** Vipps' pseudonyme bruker-ID, kun med profildeling aktivert. */
  profileSub: string | null;
}

interface VippsAmount {
  currency?: string;
  value?: number;
}

async function vippsFetch(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown; idempotencyKey?: string },
): Promise<unknown> {
  const { vipps } = getConfig();
  if (!vipps.subscriptionKey || !vipps.merchantSerialNumber) {
    throw new VippsError("Vipps-abonnementsnøkkel eller MSN mangler");
  }

  const token = await getVippsAccessToken();
  const response = await fetch(`${vippsHost()}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": vipps.subscriptionKey,
      "Merchant-Serial-Number": vipps.merchantSerialNumber,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.idempotencyKey
        ? { "Idempotency-Key": init.idempotencyKey }
        : {}),
      ...vippsSystemHeaders(),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    // Vipps svarer med RFC 7807-problemer; `detail` er det nyttige feltet.
    let detail = text.slice(0, 500);
    try {
      const problem = JSON.parse(text) as {
        detail?: string;
        extraDetails?: { name?: string; reason?: string }[];
      };
      detail =
        [
          problem.detail,
          ...(problem.extraDetails ?? []).map(
            (extra) => `${extra.name}: ${extra.reason}`,
          ),
        ]
          .filter(Boolean)
          .join(" — ") || detail;
    } catch {
      // Ikke JSON — behold råteksten.
    }
    throw new VippsError(
      `${init.method} ${path} svarte ${response.status}: ${detail}`,
      response.status,
    );
  }

  return text ? JSON.parse(text) : {};
}

/**
 * Oppretter en betaling og returnerer URL-en brukeren skal sendes til.
 * `reference` er vår egen referanse og gjør kallet trygt å gjenta.
 */
export async function createVippsPayment(options: {
  reference: string;
  amountOre: number;
  description: string;
  returnUrl: string;
}): Promise<{ redirectUrl: string }> {
  const body = await vippsFetch("/epayment/v1/payments", {
    method: "POST",
    idempotencyKey: options.reference,
    body: {
      amount: { currency: "NOK", value: options.amountOre },
      paymentMethod: { type: "WALLET" },
      userFlow: "WEB_REDIRECT",
      returnUrl: options.returnUrl,
      reference: options.reference,
      // Vipps viser maks 100 tegn til brukeren i appen.
      paymentDescription: options.description.slice(0, 100),
    },
  });

  const { redirectUrl } = body as { redirectUrl?: string };
  if (!redirectUrl) throw new VippsError("redirectUrl mangler i svaret");
  return { redirectUrl };
}

export async function getVippsPayment(
  reference: string,
): Promise<VippsPayment> {
  const body = (await vippsFetch(
    `/epayment/v1/payments/${encodeURIComponent(reference)}`,
    { method: "GET" },
  )) as {
    reference?: string;
    state?: VippsPaymentState;
    amount?: VippsAmount;
    aggregate?: {
      authorizedAmount?: VippsAmount;
      capturedAmount?: VippsAmount;
    };
    profile?: { sub?: string };
  };

  return {
    reference: body.reference ?? reference,
    state: body.state ?? "CREATED",
    amountOre: body.amount?.value ?? 0,
    authorizedOre: body.aggregate?.authorizedAmount?.value ?? 0,
    capturedOre: body.aggregate?.capturedAmount?.value ?? 0,
    profileSub: body.profile?.sub ?? null,
  };
}

/**
 * Trekker det reserverte beløpet. Idempotency-nøkkelen er bundet til
 * referanse + beløp, så et gjentatt kall aldri trekker dobbelt.
 *
 * Nøkkelen må være under 50 tegn: `cap-` + 35 tegns referanse + beløp gir
 * 44–46. Prefiksene her er derfor korte med vilje.
 */
export async function captureVippsPayment(
  reference: string,
  amountOre: number,
): Promise<void> {
  await vippsFetch(
    `/epayment/v1/payments/${encodeURIComponent(reference)}/capture`,
    {
      method: "POST",
      idempotencyKey: `cap-${reference}-${amountOre}`.slice(0, 50),
      body: { modificationAmount: { currency: "NOK", value: amountOre } },
    },
  );
}

/** Avbryter en betaling som ikke er godkjent — frigjør reservasjonen. */
export async function cancelVippsPayment(reference: string): Promise<void> {
  await vippsFetch(
    `/epayment/v1/payments/${encodeURIComponent(reference)}/cancel`,
    { method: "POST", idempotencyKey: `can-${reference}`.slice(0, 50) },
  );
}
