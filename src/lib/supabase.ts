import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local.",
  );
}

/**
 * Read-only client. Every table is public-read under RLS and nothing here
 * writes, so the anon key is all the site needs.
 */
export const supabase = createClient<Database>(url, anonKey, {
  auth: { persistSession: false },
});
