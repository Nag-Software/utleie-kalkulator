import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getConfig } from "@/lib/config";

let cached: SupabaseClient | null = null;

/** Service role-klient — kun server. Returnerer null når DB ikke er konfigurert. */
export function getAdminClient(): SupabaseClient | null {
  const { supabaseUrl, supabaseServiceRoleKey } = getConfig();
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  cached ??= createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
