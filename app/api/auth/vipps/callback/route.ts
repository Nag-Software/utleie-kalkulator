import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSession, writeSession } from "@/lib/auth/session";
import { exchangeVippsCode } from "@/lib/auth/vipps";
import { getConfig } from "@/lib/config";
import { linkCustomerToVipps } from "@/lib/payments/klippekort";

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

function failedRedirect() {
  return NextResponse.redirect(
    new URL("/klippekort?login=feilet", getConfig().siteUrl),
  );
}

export async function GET(request: Request) {
  const config = getConfig();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedValue = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (!code || !state || !storedValue || url.searchParams.has("error")) {
    return failedRedirect();
  }

  let stored: { state?: string; returnTo?: string };
  try {
    stored = JSON.parse(
      Buffer.from(storedValue, "base64url").toString("utf8"),
    ) as { state?: string; returnTo?: string };
  } catch {
    return failedRedirect();
  }
  if (stored.state !== state) return failedRedirect();

  const user = await exchangeVippsCode({
    code,
    redirectUri: `${config.siteUrl}/api/auth/vipps/callback`,
  });
  if (!user) return failedRedirect();

  const session = await readSession();
  const customerId = await linkCustomerToVipps({
    customerId: session?.customerId,
    vippsSub: user.sub,
    name: user.name,
  });
  await writeSession({
    customerId,
    vippsSub: user.sub,
    name: user.name,
  });

  return NextResponse.redirect(
    new URL(safeReturnTo(stored.returnTo), config.siteUrl),
  );
}
