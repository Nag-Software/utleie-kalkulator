import "server-only";
import { getConfig } from "@/lib/config";

function vippsHost(): string {
  return getConfig().vipps.environment === "production"
    ? "https://api.vipps.no"
    : "https://apitest.vipps.no";
}

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
  url.searchParams.set("scope", "openid name");
  url.searchParams.set("state", options.state);
  url.searchParams.set("redirect_uri", options.redirectUri);
  return url.toString();
}

export async function exchangeVippsCode(options: {
  code: string;
  redirectUri: string;
}): Promise<{ sub: string; name: string | null } | null> {
  const { clientId, clientSecret } = getConfig().vipps;
  if (!clientId || !clientSecret) return null;

  const tokenResponse = await fetch(
    `${vippsHost()}/access-management-1.0/access/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
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
    console.error("Vipps token exchange failed", tokenResponse.status);
    return null;
  }

  const token = (await tokenResponse.json()) as { access_token?: string };
  if (!token.access_token) return null;
  const userResponse = await fetch(
    `${vippsHost()}/vipps-userinfo-api/userinfo`,
    {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    },
  );
  if (!userResponse.ok) {
    console.error("Vipps userinfo failed", userResponse.status);
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
