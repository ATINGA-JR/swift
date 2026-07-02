import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "are set in Vercel → Settings → Environment Variables.",
  );
}

// Client-side Supabase client. Uses the anon key, so it's safe to ship to the
// browser — RLS policies (see supabase/migrations/0001_init_schema.sql) are
// what actually restrict access, not this key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
