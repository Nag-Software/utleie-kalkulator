import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import {
  loadByCustomerId,
  statusOf,
} from "@/lib/payments/klippekort";

export async function GET() {
  const config = getConfig();
  const session = await readSession();
  const card = session?.customerId
    ? await loadByCustomerId(session.customerId)
    : null;
  const status = statusOf(card);

  return NextResponse.json(
    {
      paymentsEnabled: config.features.payments,
      loginEnabled: config.features.login,
      loggedIn: Boolean(session?.vippsSub),
      name: session?.name ?? null,
      klippekort: {
        remaining: status.remaining,
        total: status.total,
        used: status.used,
        expiredClips: status.expiredClips,
        expiresAt: status.expiresAt,
        expired: status.expired,
        unlocked: status.unlocked,
      },
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
