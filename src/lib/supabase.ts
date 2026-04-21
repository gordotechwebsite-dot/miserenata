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
  (import.meta.env.VITE_ADMIN_EMAIL as string) ||
  "promotionsmiserenata@gmail.com";

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

export type PaymentMethod = "nequi" | "efectivo" | "bancolombia";
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type ReservationInsert = {
  name: string;
  phone: string;
  city: string;
  address: string;
  message: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  genre: string | null;
  package_id: string | null;
  package_name: string;
  package_price_cop: number;
  extras: { id: string; name: string; price: string }[];
  extras_total_cop: number;
  total_cop: number;
  payment_method: PaymentMethod;
};

export type ReservationRow = ReservationInsert & {
  id: string;
  created_at: string;
  status: ReservationStatus;
};

export type BookedSlot = { date: string; time: string; genre: string | null };

export async function insertReservation(
  input: ReservationInsert
): Promise<{ error: string | null; id: string | null }> {
  const { data, error } = await supabase
    .from("reservations")
    .insert(input)
    .select("id")
    .maybeSingle();
  if (error) return { error: error.message, id: null };
  return { error: null, id: (data as { id: string } | null)?.id ?? null };
}

export async function fetchBookedSlots(
  genre: string | null
): Promise<BookedSlot[]> {
  const query = supabase.from("booked_slots").select("date, time, genre");
  const { data, error } = await (genre
    ? query.or(`genre.eq.${genre},genre.is.null`)
    : query);
  if (error || !data) return [];
  return data as BookedSlot[];
}
