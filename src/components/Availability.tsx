import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  WHATSAPP_LINK,
  fetchBookedSlots,
  getSiteSetting,
} from "../lib/supabase";
import { DEFAULT_GENRES, formatCop, type GenreId } from "../lib/constants";

const DEFAULT_HOURLY_PRICE: Partial<Record<GenreId, number>> = {
  nortena: 600000,
  banda: 800000,
};

type Props = {
  genreId?: GenreId | null;
  variant?: "page" | "embedded";
  onSlotSelect?: (
    date: Date,
    time: string,
    label: string,
    price: number
  ) => void;
};

export const UNAVAILABLE_SLOTS_KEY = "unavailable_slots";

export function unavailableKey(genreId: GenreId | null | undefined): string {
  return genreId ? `unavailable_slots_${genreId}` : UNAVAILABLE_SLOTS_KEY;
}

export const GENRE_IDS_FOR_SLOTS: GenreId[] = [
  "mariachi",
  "nortena",
  "banda",
];

export const SLOTS: { label: string; time: string }[] = [
  { label: "12:00 PM", time: "12:00" },
  { label: "4:00 PM", time: "16:00" },
  { label: "8:00 PM", time: "20:00" },
  { label: "10:00 PM", time: "22:00" },
];

const DAYS_ES = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function buildMonthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const firstWeekday = (first.getDay() + 6) % 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function formatDateEs(d: Date) {
  return `${DAYS_ES[(d.getDay() + 6) % 7]} ${d.getDate()} de ${
    MONTHS_ES[d.getMonth()]
  }`;
}

export function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function slotKey(d: Date, time: string) {
  return `${dateKey(d)}|${time}`;
}

export function parseUnavailable(value: string | null): Set<string> {
  if (!value) return new Set();
  try {
    const arr = JSON.parse(value);
    if (Array.isArray(arr))
      return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    // ignore
  }
  return new Set();
}

export { MONTHS_ES, DAYS_ES };

export function Availability({
  genreId,
  variant = "page",
  onSlotSelect,
}: Props) {
  const embedded = variant === "embedded";
  const today = startOfDay(new Date());
  const [view, setView] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  const [selected, setSelected] = useState<Date | null>(today);
  const [slotTime, setSlotTime] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [hourlyPrice, setHourlyPrice] = useState<number | null>(null);
  const [slotPrices, setSlotPrices] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const slotsRef = useRef<HTMLDivElement | null>(null);

  const scrollToSlotsOnMobile = () => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    setTimeout(() => {
      slotsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const genre = genreId
    ? DEFAULT_GENRES.find((g) => g.id === genreId) || null
    : null;

  useEffect(() => {
    let mounted = true;
    if (genreId && DEFAULT_HOURLY_PRICE[genreId] !== undefined) {
      getSiteSetting(`genre_${genreId}_hourly_rate`).then((raw) => {
        if (!mounted) return;
        const n = Number((raw || "").replace(/[^\d]/g, "")) || 0;
        setHourlyPrice(n > 0 ? n : DEFAULT_HOURLY_PRICE[genreId] || 0);
      });
      getSiteSetting(`slot_prices_${genreId}`).then((raw) => {
        if (!mounted) return;
        const map: Record<string, number> = {};
        try {
          const obj = raw ? JSON.parse(raw) : {};
          if (obj && typeof obj === "object") {
            for (const [k, v] of Object.entries(obj)) {
              const n = Number(v);
              if (n > 0) map[k] = n;
            }
          }
        } catch {
          // ignore
        }
        setSlotPrices(map);
      });
    } else {
      setHourlyPrice(null);
      setSlotPrices({});
    }
    // Normalize a time string (label "12:00 PM" or 24h "12:00") to the canonical
    // SLOTS.time (24h) so booked_slots from legacy rows still match.
    const toCanonicalTime = (t: string): string => {
      const hit = SLOTS.find((s) => s.time === t || s.label === t);
      return hit ? hit.time : t;
    };
    (async () => {
      if (genreId) {
        const [perGenre, legacy, booked] = await Promise.all([
          getSiteSetting(unavailableKey(genreId)),
          getSiteSetting(UNAVAILABLE_SLOTS_KEY),
          fetchBookedSlots(genreId),
        ]);
        if (!mounted) return;
        const set = new Set<string>();
        parseUnavailable(perGenre).forEach((s) => set.add(s));
        parseUnavailable(legacy).forEach((s) => set.add(s));
        booked.forEach((b) => set.add(`${b.date}|${toCanonicalTime(b.time)}`));
        setUnavailable(set);
      } else {
        const [settings, booked] = await Promise.all([
          Promise.all([
            getSiteSetting(UNAVAILABLE_SLOTS_KEY),
            ...GENRE_IDS_FOR_SLOTS.map((g) => getSiteSetting(unavailableKey(g))),
          ]),
          fetchBookedSlots(null),
        ]);
        if (!mounted) return;
        const set = new Set<string>();
        settings.forEach((v) =>
          parseUnavailable(v).forEach((s) => set.add(s))
        );
        booked.forEach((b) => set.add(`${b.date}|${toCanonicalTime(b.time)}`));
        setUnavailable(set);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [genreId]);

  const cells = useMemo(
    () => buildMonthDays(view.year, view.month),
    [view.year, view.month]
  );

  const prevMonth = () =>
    setView((v) => {
      const d = new Date(v.year, v.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  const nextMonth = () =>
    setView((v) => {
      const d = new Date(v.year, v.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const canGoPrev = (() => {
    const d = new Date(view.year, view.month, 1);
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return d > currentMonthStart;
  })();

  const goHome = () => {
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const isPast = (d: Date) => d < today;
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const selectedSlot =
    selected && slotTime ? SLOTS.find((s) => s.time === slotTime) || null : null;

  const selectSlot = (d: Date, time: string) => {
    setSelected(d);
    setSlotTime(time);
    setSubmitted(false);
    if (embedded && onSlotSelect) {
      const label = SLOTS.find((s) => s.time === time)?.label || time;
      const price = slotPrices[slotKey(d, time)] ?? hourlyPrice ?? 0;
      onSlotSelect(d, time, label, price);
      return;
    }
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const buildWaMessage = (d: Date, slotLabel: string) => {
    const pretty = formatDateEs(d);
    const genrePart = genre ? ` de ${genre.name}` : "";
    const header = `Hola Musicaenvivo.co, quiero reservar una serenata${genrePart} para el ${pretty} a las ${slotLabel}.`;
    const details: string[] = [];
    if (name.trim()) details.push(`Nombre: ${name.trim()}`);
    if (phone.trim()) details.push(`Teléfono: ${phone.trim()}`);
    if (notes.trim()) details.push(`Notas: ${notes.trim()}`);
    return details.length > 0 ? `${header}\n${details.join("\n")}` : header;
  };

  const handleSubmitWeb = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected || !selectedSlot) return;
    const msg = buildWaMessage(selected, selectedSlot.label);
    window.open(
      `${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSubmitted(true);
  };

  return (
    <section
      id="disponibilidad"
      className={
        embedded
          ? "py-16 sm:py-20 bg-stone-950"
          : "pt-24 pb-24 sm:pb-28 min-h-screen bg-stone-950"
      }
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {!embedded && (
          <button
            onClick={goHome}
            className="inline-flex items-center gap-2 text-stone-200 hover:text-amber-300 text-sm font-semibold mb-6 bg-stone-900/70 border border-stone-800 px-3 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>
        )}

        <div className="flex items-center gap-3 mb-3">
          <CalendarDays className="w-6 h-6 text-amber-400" />
          <h2
            className={`font-display font-black bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight ${
              embedded ? "text-3xl sm:text-4xl" : "text-3xl sm:text-5xl"
            }`}
          >
            {embedded ? "Reserva tu fecha" : "Disponibilidad"}
          </h2>
        </div>
        <p className="text-stone-400 text-base sm:text-lg mb-8 max-w-2xl">
          {genre
            ? `Elige la fecha y la hora que te funcione para tu ${genre.name}. Los cupos tachados ya están tomados.`
            : `Elige la fecha y la hora que te funcione. Los cupos tachados ya están tomados.`}
        </p>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                disabled={!canGoPrev}
                className="w-10 h-10 rounded-xl bg-stone-800/60 border border-stone-700 text-stone-200 hover:text-amber-300 disabled:opacity-40 flex items-center justify-center"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="font-display font-bold text-white text-lg sm:text-xl capitalize">
                {MONTHS_ES[view.month]} {view.year}
              </div>
              <button
                onClick={nextMonth}
                className="w-10 h-10 rounded-xl bg-stone-800/60 border border-stone-700 text-stone-200 hover:text-amber-300 flex items-center justify-center"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {DAYS_ES.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-stone-500 uppercase tracking-wider py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {cells.map((d, i) => {
                if (!d) return <div key={i} />;
                const past = isPast(d);
                const sel = selected && isSameDay(selected, d);
                const isToday = isSameDay(d, today);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (past) return;
                      setSelected(d);
                      setSlotTime(null);
                      setSubmitted(false);
                      scrollToSlotsOnMobile();
                    }}
                    disabled={past}
                    className={`aspect-square rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center transition-all border ${
                      past
                        ? "text-stone-600 border-transparent cursor-not-allowed"
                        : sel
                        ? "bg-gradient-to-br from-amber-500 to-yellow-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20"
                        : isToday
                        ? "text-amber-200 border-amber-500/40 bg-stone-900/70 hover:bg-stone-800"
                        : "text-stone-200 border-stone-800 bg-stone-900/40 hover:bg-stone-800 hover:border-amber-500/40"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={slotsRef}
            className="bg-stone-900/60 border border-stone-800 rounded-3xl p-5 sm:p-6 scroll-mt-24"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <div className="font-display font-bold text-white text-lg">
                {selected ? formatDateEs(selected) : "Selecciona una fecha"}
              </div>
            </div>
            <p className="text-stone-400 text-sm mb-4">
              {selected
                ? "Elige un horario disponible."
                : "Los horarios aparecen al elegir un día."}
            </p>
            <div className="grid gap-2.5">
              {SLOTS.map((s) => {
                if (!selected) {
                  return (
                    <div
                      key={s.time}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-600 font-semibold"
                    >
                      {s.label}
                    </div>
                  );
                }
                const key = slotKey(selected, s.time);
                const taken = unavailable.has(key);
                const active = slotTime === s.time && !taken;
                const priceForSlot = slotPrices[key] ?? hourlyPrice ?? 0;
                return (
                  <button
                    key={s.time}
                    onClick={() => !taken && selectSlot(selected, s.time)}
                    disabled={taken}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-left ${
                      taken
                        ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-100 cursor-not-allowed"
                        : active
                        ? "bg-amber-500/15 border-amber-500/60 text-amber-200"
                        : "bg-stone-800/60 border-stone-700 hover:border-amber-500/60 hover:bg-stone-800 text-stone-100"
                    }`}
                  >
                    <span
                      className={`font-semibold ${
                        taken ? "line-through opacity-80" : ""
                      }`}
                    >
                      {s.label}
                    </span>
                    <span
                      className={`text-xs font-extrabold uppercase tracking-wider px-2 py-1 rounded-full ${
                        taken
                          ? "bg-emerald-500 text-stone-950"
                          : active
                          ? "text-amber-200"
                          : "text-amber-300"
                      }`}
                    >
                      {taken
                        ? "Reservado"
                        : active
                        ? "Seleccionado"
                        : priceForSlot > 0
                        ? `${formatCop(priceForSlot)}/hora`
                        : "Disponible"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {!embedded && selected && selectedSlot && (
          <div
            ref={formRef}
            className="mt-8 bg-stone-900/70 border border-stone-800 rounded-3xl p-5 sm:p-8"
          >
            <div className="font-display font-black text-xl sm:text-2xl text-white mb-1">
              Reserva {genre ? `tu ${genre.name}` : "tu serenata"}
            </div>
            <div className="text-amber-300 font-semibold mb-4 text-sm sm:text-base">
              {formatDateEs(selected)} — {selectedSlot.label}
            </div>

            {submitted && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-sm text-emerald-200">
                  Te redirigimos a WhatsApp para confirmar la reserva.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitWeb} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-stone-400 mb-1 block">
                    Nombre completo *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-400 mb-1 block">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 300 123 4567"
                    className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-400 mb-1 block">
                  Notas (dirección, canción especial, etc.)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cuéntanos algún detalle importante"
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 px-5 py-3 rounded-2xl font-extrabold text-base shadow-lg shadow-amber-500/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Reservar este horario
                </button>
                <a
                  href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                    buildWaMessage(selected, selectedSlot.label)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 text-stone-100 hover:text-amber-300 px-5 py-3 rounded-2xl font-bold text-base transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Escribir por WhatsApp
                </a>
              </div>
              <p className="text-stone-500 text-xs">
                Al reservar se abre WhatsApp con tus datos prellenados para
                confirmar el cupo con nuestro equipo.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
