import { redirect } from "next/navigation";
import { DEFAULT_INPUT } from "@/lib/calc/schema";

/**
 * Tidligere landingsside for FINN-import. Beregningen ligger i URL-en, så
 * gamle lenker sendes til kalkulatoren på forsiden med tallene i behold.
 */
export default async function BeregningPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const params = new URLSearchParams();
  for (const key of Object.keys(DEFAULT_INPUT)) {
    const value = query[key];
    if (typeof value === "string") params.set(key, value);
  }
  const suffix = params.toString();
  redirect(suffix ? `/?${suffix}#kalkulator` : "/#kalkulator");
}
