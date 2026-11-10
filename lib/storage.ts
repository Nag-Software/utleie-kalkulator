import "server-only";
import { getConfig } from "@/lib/config";
import { KI_BUCKET } from "@/lib/site";

/**
 * Supabase Storage for salgsoppgavene. Filene er for store til å gå
 * gjennom våre egne funksjoner (Vercel stopper på 4,5 MB), så nettleseren
 * laster opp direkte til en signert URL, og serveren henter filen derfra.
 * Bøtta er privat; alt herfra bruker den hemmelige nøkkelen.
 */
function storageBase(): { base: string; key: string } {
  const { database } = getConfig();
  if (!database.url || !database.secretKey) {
    throw new Error("SUPABASE_URL eller SUPABASE_SECRET_KEY mangler");
  }
  return {
    base: `${database.url.replace(/\/+$/, "")}/storage/v1`,
    key: database.secretKey,
  };
}

function headers(key: string): Record<string, string> {
  return { apikey: key, Authorization: `Bearer ${key}` };
}

/** Signert URL nettleseren kan PUT-e én fil til. Gyldig i to timer. */
export async function createSignedUploadUrl(path: string): Promise<string> {
  const { base, key } = storageBase();
  const response = await fetch(
    `${base}/object/upload/sign/${KI_BUCKET}/${path}`,
    { method: "POST", headers: headers(key), cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`signert opplasting feilet: ${response.status} ${(await response.text()).slice(0, 200)}`);
  }
  const { url } = (await response.json()) as { url?: string };
  if (!url) throw new Error("signert opplasting ga ingen URL");
  return `${base}${url}`;
}

export async function downloadObject(path: string): Promise<Buffer> {
  const { base, key } = storageBase();
  const response = await fetch(`${base}/object/${KI_BUCKET}/${path}`, {
    headers: headers(key),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`fant ikke filen i lagringen: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/** Sletter filen. Feil her skal aldri velte en ferdig analyse. */
export async function deleteObject(path: string): Promise<void> {
  const { base, key } = storageBase();
  await fetch(`${base}/object/${KI_BUCKET}/${path}`, {
    method: "DELETE",
    headers: headers(key),
    cache: "no-store",
  });
}
