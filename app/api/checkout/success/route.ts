import { NextResponse } from "next/server";
import { readSession, writeSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { grantKlipp } from "@/lib/payments/klippekort";
import { getStripe } from "@/lib/payments/stripe";
import { unlockFinn } from "@/lib/payments/unlock";
import { KLIPP_PRIS_ORE } from "@/lib/site";

const CHECKOUT_PATTERN = /^cs_[a-zA-Z0-9_]+$/;

function redirect(path: string) {
  return NextResponse.redirect(new URL(path, getConfig().siteUrl));
}

export async function GET(request: Request) {
  const stripe = getStripe();
  if (!stripe) return redirect("/klippekort?kjop=feilet");

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId || !CHECKOUT_PATTERN.test(sessionId)) {
    return redirect("/klippekort?kjop=feilet");
  }

  try {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    const customerId =
      typeof checkout.customer === "string"
        ? checkout.customer
        : checkout.customer?.id;

    if (
      checkout.payment_status !== "paid" ||
      checkout.metadata?.kind !== "klippekort" ||
      checkout.currency !== "nok" ||
      checkout.amount_total !== KLIPP_PRIS_ORE ||
      !customerId
    ) {
      return redirect("/klippekort?kjop=feilet");
    }

    await grantKlipp(customerId, sessionId);
    const appSession = await readSession();
    await writeSession({ ...appSession, customerId });

    const finnkode = checkout.metadata?.finnkode;
    if (finnkode && /^\d{8,10}$/.test(finnkode)) {
      const unlocked = await unlockFinn(customerId, finnkode);
      if (unlocked.ok) return redirect(unlocked.calculationUrl);
      return redirect(`/klippekort?kjop=ok&import=${unlocked.reason}`);
    }

    return redirect("/klippekort?kjop=ok");
  } catch (error) {
    console.error("klippekort: innløsning feilet", error);
    return redirect("/klippekort?kjop=feilet");
  }
}
