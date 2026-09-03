import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getConfig } from "@/lib/config";

/**
 * Innloggingen ligger i en HMAC-signert informasjonskapsel, ikke i en
 * server-side sesjonstabell. Den varer i ~13 måneder, så brukeren slipper å
 * logge inn med Vipps hver gang han kommer tilbake.
 *
 * Kapselen bærer bare *hvem* brukeren er. Antall klipp leses alltid fra
 * databasen — ellers kunne en gammel kapsel gitt flere klipp enn brukeren
 * faktisk har igjen.
 */
const COOKIE_NAME = "uk_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

export interface Session {
  /** Vår bruker-ID (`public.users.id`). */
  userId: string;
  /** Vipps' pseudonyme bruker-ID. */
  vippsSub: string;
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
    ) as Partial<Session>;
    // Kapsler fra den gamle Stripe-baserte modellen mangler disse feltene og
    // skal behandles som utlogget.
    if (!parsed?.userId || !parsed.vippsSub) return null;
    return {
      userId: parsed.userId,
      vippsSub: parsed.vippsSub,
      name: parsed.name ?? null,
    };
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
