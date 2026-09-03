import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { vippsAuthorizeUrl } from "@/lib/auth/vipps";
import { getConfig } from "@/lib/config";

const STATE_COOKIE = "uk_vipps_state";

function safeReturnTo(value: string | null): string {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/klippekort";
  return value;
}

export async function GET(request: Request) {
  const config = getConfig();
  if (!config.features.login) {
    return NextResponse.redirect(
      new URL("/klippekort?login=utilgjengelig", config.siteUrl),
    );
  }

  const returnTo = safeReturnTo(
    new URL(request.url).searchParams.get("returnTo"),
  );
  const state = randomBytes(24).toString("base64url");
  const redirectUri = `${config.siteUrl}/api/auth/vipps/callback`;
  const authorizeUrl = vippsAuthorizeUrl({ state, redirectUri });
  if (!authorizeUrl) {
    return NextResponse.redirect(
      new URL("/klippekort?login=utilgjengelig", config.siteUrl),
    );
  }

  (await cookies()).set(
    STATE_COOKIE,
    Buffer.from(JSON.stringify({ state, returnTo })).toString("base64url"),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600,
    },
  );
  return NextResponse.redirect(authorizeUrl);
}
