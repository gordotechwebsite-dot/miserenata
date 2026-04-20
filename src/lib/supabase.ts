import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL as string) || "miseranataco@gmail.com";

export const WHATSAPP_LINK =
  (import.meta.env.VITE_WHATSAPP_LINK as string) || "https://wa.link/wrc5mf";
