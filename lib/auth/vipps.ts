import "server-only";
import { getConfig, vippsHost } from "@/lib/config";
import { vippsSystemHeaders } from "@/lib/vipps/token";

/**
 * Vipps Login (OIDC authorization code flow).
 *
 * Endepunktene er hentet fra Vipps' discovery-dokument
 * (`/access-management-1.0/access/.well-known/openid-configuration`), ikke
 * gjettet. Vi ber kun om `openid name`: telefonnummer og e-post trengs ikke
 * for å eie et klippekort, og da skal vi heller ikke hente dem.
 *
 * NB: Login må aktiveres for salgsenheten i Vipps-portalen. Er den ikke
 * aktivert, svarer autorisasjonsendepunktet «Client not found».
 */
const SCOPES = "openid name";

export function vippsAuthorizeUrl(options: {
  state: string;
  redirectUri: string;
}): string | null {
  const { clientId } = getConfig().vipps;
  if (!clientId) return null;

  const url = new URL(
    `${vippsHost()}/access-management-1.0/access/oauth2/auth`,
  );
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("state", options.state);
  url.searchParams.set("redirect_uri", options.redirectUri);
  return url.toString();
}

export interface VippsIdentity {
  /** Vipps' pseudonyme, stabile bruker-ID. Nøkkelen vi lagrer på. */
  sub: string;
  name: string | null;
}

export async function exchangeVippsCode(options: {
  code: string;
  redirectUri: string;
}): Promise<VippsIdentity | null> {
  const { clientId, clientSecret, subscriptionKey } = getConfig().vipps;
  if (!clientId || !clientSecret) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenResponse = await fetch(
    `${vippsHost()}/access-management-1.0/access/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
        ...(subscriptionKey
          ? { "Ocp-Apim-Subscription-Key": subscriptionKey }
          : {}),
        ...vippsSystemHeaders(),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: options.code,
        redirect_uri: options.redirectUri,
      }),
      cache: "no-store",
    },
  );

  if (!tokenResponse.ok) {
    console.error(
      "Vipps token-utveksling feilet",
      tokenResponse.status,
      (await tokenResponse.text()).slice(0, 300),
    );
    return null;
  }

  const token = (await tokenResponse.json()) as { access_token?: string };
  if (!token.access_token) return null;

  const userResponse = await fetch(
    `${vippsHost()}/vipps-userinfo-api/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        ...(subscriptionKey
          ? { "Ocp-Apim-Subscription-Key": subscriptionKey }
          : {}),
      },
      cache: "no-store",
    },
  );
  if (!userResponse.ok) {
    console.error("Vipps userinfo feilet", userResponse.status);
    return null;
  }

  const user = (await userResponse.json()) as {
    sub?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
  };
  if (!user.sub) return null;

  const name =
    user.name?.trim() ||
    [user.given_name, user.family_name].filter(Boolean).join(" ").trim() ||
    null;
  return { sub: user.sub, name };
}
