import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getConfig } from "@/lib/config";

const COOKIE_NAME = "uk_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

export interface Session {
  /** Stripe-kunden som eier klippekortet. */
  customerId?: string;
  /** Vipps Login sin pseudonyme bruker-ID. */
  vippsSub?: string;
  name?: string | null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encode(session: Session, secret: string): string {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString(
    "base64url",
  );
  return `${payload}.${sign(payload, secret)}`;
}

function decode(value: string, secret: string): Session | null {
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;

  const payload = value.slice(0, separator);
  const signature = Buffer.from(value.slice(separator + 1));
  const expected = Buffer.from(sign(payload, secret));
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(signature, expected)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Session;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function readSession(): Promise<Session | null> {
  const secret = getConfig().sessionSecret;
  if (!secret) return null;
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  return value ? decode(value, secret) : null;
}

export async function writeSession(session: Session): Promise<void> {
  const secret = getConfig().sessionSecret;
  if (!secret) throw new Error("SESSION_SECRET mangler");

  (await cookies()).set(COOKIE_NAME, encode(session, secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
