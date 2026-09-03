import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeSession } from "@/lib/auth/session";
import { exchangeVippsCode } from "@/lib/auth/vipps";
import { getConfig } from "@/lib/config";
import { upsertVippsUser } from "@/lib/db/klippekort";

const STATE_COOKIE = "uk_vipps_state";

function safeReturnTo(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/klippekort";
  }
  return value;
}

function failed(reason: string) {
  return NextResponse.redirect(
    new URL(`/klippekort?login=${reason}`, getConfig().siteUrl),
  );
}

export async function GET(request: Request) {
  const config = getConfig();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Engangskapselen brukes opp uansett utfall, så et avbrutt forsøk ikke
  // etterlater en gyldig state å gjenbruke.
  const cookieStore = await cookies();
  const storedValue = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (url.searchParams.has("error")) {
    console.error(
      "Vipps login avvist",
      url.searchParams.get("error"),
      url.searchParams.get("error_description"),
    );
    return failed("avbrutt");
  }
  if (!code || !state || !storedValue) return failed("feilet");

  let stored: { state?: string; returnTo?: string };
  try {
    stored = JSON.parse(
      Buffer.from(storedValue, "base64url").toString("utf8"),
    ) as { state?: string; returnTo?: string };
  } catch {
    return failed("feilet");
  }
  // CSRF-vakt: koden må tilhøre den forespørselen vi selv startet.
  if (!stored.state || stored.state !== state) return failed("feilet");

  const identity = await exchangeVippsCode({
    code,
    redirectUri: `${config.siteUrl}/api/auth/vipps/callback`,
  });
  if (!identity) return failed("feilet");

  try {
    const userId = await upsertVippsUser({
      vippsSub: identity.sub,
      name: identity.name,
      source: "login",
    });
    await writeSession({
      userId,
      vippsSub: identity.sub,
      name: identity.name,
    });
  } catch (error) {
    console.error("login: kunne ikke lagre brukeren", error);
    return failed("feilet");
  }

  return NextResponse.redirect(
    new URL(safeReturnTo(stored.returnTo), config.siteUrl),
  );
}
