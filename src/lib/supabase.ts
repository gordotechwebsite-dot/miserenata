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

export const DEFAULT_BANNER_TEXT =
  "Reserva serenatas desde $300.000 en Duitama, Paipa y Sogamoso";

export async function getSiteSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { value: string | null }).value;
}

export async function setSiteSetting(
  key: string,
  value: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  return { error: error?.message || null };
}
