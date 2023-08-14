import { SupabaseClientOptions, createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API ?? "";

const options: SupabaseClientOptions<"public"> = {
  auth: {
    persistSession: false,
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, options);
