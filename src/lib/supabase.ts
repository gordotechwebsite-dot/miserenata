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

export const PHONE_NUMBER =
  (import.meta.env.VITE_PHONE_NUMBER as string) || "+573138969608";

export const PHONE_DISPLAY =
  (import.meta.env.VITE_PHONE_DISPLAY as string) || "+57 313 896 9608";

const waDigits = PHONE_NUMBER.replace(/\D/g, "");

export const WHATSAPP_LINK =
  (import.meta.env.VITE_WHATSAPP_LINK as string) ||
  `https://wa.me/${waDigits}`;
