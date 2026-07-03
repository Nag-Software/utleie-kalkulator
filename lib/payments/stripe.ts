import "server-only";
import Stripe from "stripe";
import { getConfig } from "@/lib/config";

let cached: Stripe | null = null;

/** Stripe-klient — null når nøkkelen ikke er satt ennå. */
export function getStripe(): Stripe | null {
  const { stripeSecretKey } = getConfig();
  if (!stripeSecretKey) return null;
  cached ??= new Stripe(stripeSecretKey);
  return cached;
}
