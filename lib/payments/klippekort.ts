import "server-only";
import { z } from "zod";
import { getConfig } from "@/lib/config";
import { chunkValue, readChunked } from "@/lib/payments/metadata";
import {
  emptyKort,
  grantKlipp as grantKlippCore,
  type KlippekortState,
  statusOf,
} from "@/lib/payments/klippekort-core";
import { getStripe } from "@/lib/payments/stripe";

const META_PREFIX = "kk";
const VIPPS_SUB_KEY = "vipps_sub";

const stateSchema = z.object({
  grants: z.array(
    z.object({
      id: z.string().min(1),
      clips: z.number().int().positive(),
      remaining: z.number().int().nonnegative(),
      purchasedAt: z.iso.datetime(),
      expiresAt: z.iso.datetime(),
    }),
  ),
  unlocked: z.array(z.string().regex(/^\d{8,10}$/)),
});

const devCards = new Map<string, KlippekortState>();
const devVippsCustomers = new Map<string, string>();

function isDevStore(): boolean {
  return getConfig().devBypassPayments && !getStripe();
}

function parseState(metadata: Record<string, string>): KlippekortState {
  const parsed = stateSchema.safeParse(
    readChunked<unknown>(metadata, META_PREFIX),
  );
  return parsed.success ? parsed.data : emptyKort();
}

export async function loadByCustomerId(
  customerId: string,
): Promise<KlippekortState> {
  if (isDevStore()) return devCards.get(customerId) ?? emptyKort();

  const stripe = getStripe();
  if (!stripe) return emptyKort();
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.deleted ? emptyKort() : parseState(customer.metadata);
  } catch (error) {
    console.error("klippekort: kunne ikke lese kunde", error);
    return emptyKort();
  }
}

export async function saveKort(
  customerId: string,
  kort: KlippekortState,
): Promise<void> {
  if (isDevStore()) {
    devCards.set(customerId, kort);
    return;
  }

  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe er ikke konfigurert");
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) throw new Error("Stripe-kunden er slettet");
  await stripe.customers.update(customerId, {
    metadata: chunkValue(META_PREFIX, kort, customer.metadata),
  });
}

/** Innløser et kjøp idempotent på betalingsreferansen. */
export async function grantKlipp(
  customerId: string,
  paymentId: string,
): Promise<KlippekortState> {
  const current = await loadByCustomerId(customerId);
  const next = grantKlippCore(current, paymentId);
  if (next !== current) await saveKort(customerId, next);
  return next;
}

function mergeCards(
  first: KlippekortState,
  second: KlippekortState,
): KlippekortState {
  const grants = new Map(first.grants.map((grant) => [grant.id, grant]));
  for (const grant of second.grants) {
    if (!grants.has(grant.id)) grants.set(grant.id, grant);
  }
  return {
    grants: [...grants.values()],
    unlocked: [...new Set([...first.unlocked, ...second.unlocked])],
  };
}

async function findByVippsSub(vippsSub: string): Promise<string | null> {
  if (isDevStore()) return devVippsCustomers.get(vippsSub) ?? null;
  const stripe = getStripe();
  if (!stripe) return null;

  const safeSub = vippsSub.replace(/[\\"]/g, "");
  const result = await stripe.customers.search({
    query: `metadata["${VIPPS_SUB_KEY}"]:"${safeSub}"`,
    limit: 1,
  });
  return result.data[0]?.id ?? null;
}

/** Finner eller oppretter kunden som eier et anonymt klippekort. */
export async function getOrCreateCustomer(options: {
  customerId?: string | null;
  name?: string | null;
}): Promise<string> {
  if (isDevStore()) {
    if (options.customerId) return options.customerId;
    return `cus_dev_${crypto.randomUUID().replaceAll("-", "")}`;
  }

  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe er ikke konfigurert");
  if (options.customerId) {
    try {
      const existing = await stripe.customers.retrieve(options.customerId);
      if (!existing.deleted) return existing.id;
    } catch {
      // Ugyldig eller slettet kunde: opprett en ny.
    }
  }

  const customer = await stripe.customers.create({
    name: options.name ?? undefined,
  });
  return customer.id;
}

/**
 * Knytter et lokalt klippekort til Vipps-brukeren. Hvis brukeren allerede har
 * et kort på en annen enhet, slås kortene sammen på den eksisterende kunden.
 */
export async function linkCustomerToVipps(options: {
  customerId?: string | null;
  vippsSub: string;
  name?: string | null;
}): Promise<string> {
  const matchedCustomerId = await findByVippsSub(options.vippsSub);

  if (isDevStore()) {
    const target =
      matchedCustomerId ??
      options.customerId ??
      `cus_dev_${crypto.randomUUID().replaceAll("-", "")}`;
    if (
      matchedCustomerId &&
      options.customerId &&
      matchedCustomerId !== options.customerId
    ) {
      const merged = mergeCards(
        await loadByCustomerId(matchedCustomerId),
        await loadByCustomerId(options.customerId),
      );
      await saveKort(matchedCustomerId, merged);
      await saveKort(options.customerId, emptyKort());
    }
    devVippsCustomers.set(options.vippsSub, target);
    return target;
  }

  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe er ikke konfigurert");

  if (matchedCustomerId) {
    if (options.customerId && matchedCustomerId !== options.customerId) {
      await saveKort(
        matchedCustomerId,
        mergeCards(
          await loadByCustomerId(matchedCustomerId),
          await loadByCustomerId(options.customerId),
        ),
      );
      await saveKort(options.customerId, emptyKort());
    }
    return matchedCustomerId;
  }

  const customerId = await getOrCreateCustomer(options);
  await stripe.customers.update(customerId, {
    name: options.name ?? undefined,
    metadata: { [VIPPS_SUB_KEY]: options.vippsSub },
  });
  return customerId;
}

export { statusOf };
