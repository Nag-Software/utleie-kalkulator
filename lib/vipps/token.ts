import "server-only";
import { getConfig, vippsHost } from "@/lib/config";

/**
 * Vipps' access-token-endepunkt. Tokenet er gyldig i 1 time i test og 24
 * timer i produksjon, så vi holder det i minnet og fornyer det litt før
 * utløp. Cachen er per serverinstans — å hente et nytt token er billig, og
 * Vipps tolererer at flere instanser henter hvert sitt.
 */
let cached: { token: string; expiresAtMs: number } | null = null;

/** Fornyer tokenet 2 minutter før Vipps sier det utløper. */
const RENEW_MARGIN_MS = 120_000;

/** Identifiserer integrasjonen i Vipps' logger — hjelper ved support. */
export function vippsSystemHeaders(): Record<string, string> {
  return {
    "Vipps-System-Name": "utleie-kalkulator",
    "Vipps-System-Version": "1.0",
    "Vipps-System-Plugin-Name": "utleie-kalkulator-next",
    "Vipps-System-Plugin-Version": "1.0",
  };
}

export class VippsError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "VippsError";
  }
}

export async function getVippsAccessToken(): Promise<string> {
  const { vipps } = getConfig();
  if (!vipps.clientId || !vipps.clientSecret || !vipps.subscriptionKey) {
    throw new VippsError("Vipps-nøkler mangler");
  }

  if (cached && cached.expiresAtMs > Date.now()) return cached.token;

  const response = await fetch(`${vippsHost()}/accesstoken/get`, {
    method: "POST",
    headers: {
      client_id: vipps.clientId,
      client_secret: vipps.clientSecret,
      "Ocp-Apim-Subscription-Key": vipps.subscriptionKey,
      ...(vipps.merchantSerialNumber
        ? { "Merchant-Serial-Number": vipps.merchantSerialNumber }
        : {}),
      ...vippsSystemHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new VippsError(
      `accesstoken/get svarte ${response.status}`,
      response.status,
    );
  }

  const body = (await response.json()) as {
    access_token?: string;
    expires_in?: string | number;
  };
  if (!body.access_token) throw new VippsError("access_token mangler i svaret");

  const expiresInSeconds = Number(body.expires_in ?? 3600);
  const lifetimeMs = Number.isFinite(expiresInSeconds)
    ? expiresInSeconds * 1000
    : 3_600_000;

  cached = {
    token: body.access_token,
    expiresAtMs: Date.now() + Math.max(0, lifetimeMs - RENEW_MARGIN_MS),
  };
  return cached.token;
}

/** Kun for tester: glem tokenet som ligger i minnet. */
export function resetVippsTokenCache(): void {
  cached = null;
}
