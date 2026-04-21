import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Phone,
  User,
  MessageSquare,
  Gift,
  Send,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Package as PackageIcon,
  Sparkles,
  Wallet,
} from "lucide-react";
import {
  CITIES,
  DEFAULT_EXTRAS,
  type ExtraItem,
  formatCop,
  type PackageData,
  type GenreId,
} from "../lib/constants";
import { SLOTS } from "./Availability";
import {
  getSiteSetting,
  insertReservation,
  supabase,
  WHATSAPP_LINK,
  type PaymentMethod,
} from "../lib/supabase";

type Props = {
  packages: PackageData[];
  selected: PackageData | null;
  onSelect: (pkg: PackageData) => void;
  initialDate?: string;
  initialTime?: string;
  genreId?: GenreId | null;
};

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  detail: string;
  emoji: string;
}[] = [
  { id: "nequi", label: "Nequi", detail: "Transferencia al número", emoji: "📱" },
  { id: "bancolombia", label: "Bancolombia", detail: "Transferencia bancaria", emoji: "🏦" },
  { id: "efectivo", label: "Efectivo", detail: "Paga al llegar", emoji: "💵" },
];

const STEPS = [
  { id: 1, title: "Paquete" },
  { id: 2, title: "Adicionales" },
  { id: 3, title: "Datos" },
  { id: 4, title: "Confirmar" },
];

export function ReservationForm({
  packages,
  selected,
  onSelect,
  initialDate,
  initialTime,
  genreId,
}: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [cityOther, setCityOther] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [extrasList, setExtrasList] = useState<ExtraItem[]>(DEFAULT_EXTRAS);

  useEffect(() => {
    if (initialDate) setDate(initialDate);
  }, [initialDate]);
  useEffect(() => {
    if (initialTime) setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const raw = await getSiteSetting("extras_list");
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as ExtraItem[];
          if (mounted && Array.isArray(parsed) && parsed.length > 0) {
            setExtrasList(
              parsed.map((x) => ({
                id: String(x.id || ""),
                name: String(x.name || ""),
                price: String(x.price || ""),
                icon: String(x.icon || "✨"),
                imageUrl: x.imageUrl ? String(x.imageUrl) : undefined,
              }))
            );
            return;
          }
        } catch {
          // fall through to legacy
        }
      }
      // Legacy fallback: per-id image keys
      const keys = DEFAULT_EXTRAS.map((e) => `extra_image_${e.id}`);
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", keys);
      if (!mounted) return;
      const imgMap: Record<string, string> = {};
      if (data) {
        for (const row of data as { key: string; value: string }[]) {
          const id = row.key.replace(/^extra_image_/, "");
          if (row.value) imgMap[id] = row.value;
        }
      }
      setExtrasList(
        DEFAULT_EXTRAS.map((x) => ({ ...x, imageUrl: imgMap[x.id] }))
      );
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleExtra = (id: string) =>
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );

  const resetForm = () => {
    setName("");
    setPhone("");
    setCity("");
    setCityOther(false);
    setDate("");
    setTime("");
    setAddress("");
    setMessage("");
    setExtras([]);
    setPaymentMethod("");
    setTermsAccepted(false);
    setStep(1);
  };

  const canNext = (() => {
    if (step === 1) return !!selected;
    if (step === 2) return true;
    if (step === 3)
      return (
        name.trim() !== "" &&
        phone.trim() !== "" &&
        city.trim() !== "" &&
        address.trim() !== "" &&
        date !== "" &&
        time !== ""
      );
    return true;
  })();

  const canSubmit = !!selected && !!paymentMethod && termsAccepted && !submitting;

  const goNext = () => {
    if (!canNext) return;
    setStep((s) => Math.min(4, s + 1));
  };
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  const extrasTotal = extras.reduce((acc, id) => {
    const extra = extrasList.find((x) => x.id === id);
    if (!extra) return acc;
    return acc + Number(String(extra.price).replace(/\./g, ""));
  }, 0);
  const packagePrice = selected?.priceCop ?? 0;
  const grandTotal = packagePrice + extrasTotal;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 4) {
      goNext();
      return;
    }
    if (!selected) return;
    if (!termsAccepted) return;
    if (!paymentMethod) return;

    const selectedExtras = extras
      .map((id) => extrasList.find((x) => x.id === id))
      .filter((x): x is ExtraItem => !!x)
      .map((x) => ({ id: x.id, name: x.name, price: String(x.price) }));

    const extrasText =
      selectedExtras.length > 0
        ? selectedExtras.map((x) => `${x.name} ($${x.price})`).join(", ")
        : "Ninguno";

    const paymentLabel =
      PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label ??
      paymentMethod;

    const timeLabel =
      SLOTS.find((s) => s.time === time || s.label === time)?.label ?? time;

    setSubmitting(true);
    setSubmitError(null);
    const { error } = await insertReservation({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      message: message.trim() || null,
      date,
      time,
      genre: genreId ?? null,
      package_id: selected.id ?? null,
      package_name: selected.name,
      package_price_cop: selected.priceCop,
      extras: selectedExtras,
      extras_total_cop: extrasTotal,
      total_cop: grandTotal,
      payment_method: paymentMethod,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(
        "No pudimos guardar la reserva automáticamente, pero igual te abrimos WhatsApp para confirmarla con el equipo."
      );
    }

    const messageText =
      `🎺 *Nueva Reserva de Serenata*%0A%0A` +
      `👤 *Nombre:* ${name}%0A` +
      `📱 *Teléfono:* ${phone}%0A` +
      `🎶 *Paquete:* ${selected.name} ($${formatCop(selected.priceCop)} COP)%0A` +
      `🎁 *Adicionales:* ${extrasText}%0A` +
      `💳 *Forma de pago:* ${paymentLabel}%0A` +
      `💰 *Total estimado:* $${formatCop(grandTotal)} COP%0A` +
      `📍 *Ciudad:* ${city}%0A` +
      `📅 *Fecha:* ${date}%0A` +
      `🕐 *Hora:* ${timeLabel}%0A` +
      `🏠 *Dirección:* ${address}%0A` +
      `💬 *Mensaje:* ${message || "Sin mensaje adicional"}`;

    window.open(`${WHATSAPP_LINK}?text=${messageText}`, "_blank");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      resetForm();
    }, 4000);
  };

  return (
    <section
      id="reservar"
      className="py-16 sm:py-24 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">
              Reserva Fácil y Rápido
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
              Reserva tu Serenata
            </span>
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Completa los pasos y te contactaremos por WhatsApp para confirmar
            todos los detalles.
          </p>
        </div>

        <ol className="flex items-center justify-between gap-1 sm:gap-2 mb-6 sm:mb-8 max-w-2xl mx-auto">
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <li key={s.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all ${
                      active
                        ? "bg-gradient-to-br from-amber-500 to-yellow-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/30"
                        : done
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/60"
                        : "bg-stone-900 text-stone-500 border-stone-700"
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  <div
                    className={`text-[10px] sm:text-xs font-semibold text-center ${
                      active
                        ? "text-amber-300"
                        : done
                        ? "text-stone-300"
                        : "text-stone-500"
                    }`}
                  >
                    {s.title}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 sm:mx-2 -translate-y-2 ${
                      done ? "bg-amber-500/60" : "bg-stone-800"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="bg-stone-900/80 backdrop-blur border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {submitted && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/40 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <div className="text-sm text-green-200">
                ¡Listo! Tu reserva quedó guardada y te abrimos WhatsApp para
                confirmarla con el equipo.
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded-xl text-sm text-red-200">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div key={step} className="animate-fade-up space-y-6">
              {step === 1 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-amber-300 mb-3">
                    <PackageIcon className="w-4 h-4" />
                    Elige el paquete perfecto *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {packages.map((pkg) => {
                      const active = selected?.name === pkg.name;
                      return (
                        <button
                          type="button"
                          key={pkg.id || pkg.name}
                          onClick={() => onSelect(pkg)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            active
                              ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20"
                              : "border-stone-700 bg-stone-800/60 hover:border-amber-500/50"
                          }`}
                        >
                          <div className="text-white text-sm font-bold">
                            {pkg.name}
                          </div>
                          <div className="text-xs text-amber-400 mt-1">
                            ${formatCop(pkg.priceCop)} COP
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-amber-300 mb-3">
                      <Sparkles className="w-4 h-4" />
                      ¿Tal vez quisieras incluir esto?
                    </label>
                    <p className="text-stone-400 text-xs mb-4">
                      Selecciona los extras que quieres incluir. Puedes elegir
                      varios o ninguno.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {extrasList.map((extra) => {
                        const active = extras.includes(extra.id);
                        const img = extra.imageUrl;
                        return (
                          <button
                            type="button"
                            key={extra.id}
                            onClick={() => toggleExtra(extra.id)}
                            className={`group relative flex flex-col items-stretch rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                              active
                                ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20"
                                : "border-stone-700 bg-stone-800/60 hover:border-amber-500/50"
                            }`}
                          >
                            <div className="aspect-square w-full bg-stone-900 flex items-center justify-center overflow-hidden p-2">
                              {img ? (
                                <img
                                  src={img}
                                  alt={extra.name}
                                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="text-5xl">{extra.icon}</div>
                              )}
                            </div>
                            <div className="p-2.5">
                              <div className="text-white text-xs font-semibold text-center">
                                {extra.name}
                              </div>
                              <div className="text-amber-400 text-xs text-center mt-0.5">
                                ${extra.price}
                              </div>
                            </div>
                            {active && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      Mensaje adicional
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="¿Alguna canción especial? ¿Instrucciones de dirección? ¡Cuéntanos!"
                      className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                        <User className="w-4 h-4 text-amber-400" />
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                        <Phone className="w-4 h-4 text-amber-400" />
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: 300 123 4567"
                        className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        Ciudad *
                      </label>
                      <select
                        required
                        value={cityOther ? "__other__" : city}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "__other__") {
                            setCityOther(true);
                            setCity("");
                          } else {
                            setCityOther(false);
                            setCity(v);
                          }
                        }}
                        className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      >
                        <option value="">Selecciona la ciudad</option>
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="__other__">Otro</option>
                      </select>
                      {cityOther && (
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Escribe la ciudad"
                          className="mt-2 w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        Dirección de la serenata *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Dirección completa donde será la serenata"
                        className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {date && time ? (
                    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-amber-300/80 font-semibold">
                          Fecha y hora seleccionadas
                        </div>
                        <div className="text-white font-bold text-sm truncate">
                          {date} · {time}
                        </div>
                      </div>
                      <a
                        href="#disponibilidad"
                        className="text-amber-300 hover:text-amber-200 text-xs font-semibold whitespace-nowrap underline"
                      >
                        Cambiar
                      </a>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm">
                          Elige fecha y hora
                        </div>
                        <div className="text-xs text-stone-400">
                          Selecciona un horario disponible en el calendario de
                          arriba para continuar.
                        </div>
                      </div>
                      <a
                        href="#disponibilidad"
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
                      >
                        Ir al calendario
                      </a>
                    </div>
                  )}
                </>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Resumen de tu reserva
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-amber-300 mb-3">
                      <Wallet className="w-4 h-4" />
                      ¿Cómo prefieres pagar? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PAYMENT_OPTIONS.map((opt) => {
                        const active = paymentMethod === opt.id;
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${
                              active
                                ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20"
                                : "border-stone-700 bg-stone-800/60 hover:border-amber-500/50"
                            }`}
                          >
                            <div className="text-2xl mb-1">{opt.emoji}</div>
                            <div className="text-white text-sm font-bold">
                              {opt.label}
                            </div>
                            <div className="text-xs text-stone-400 mt-0.5">
                              {opt.detail}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-stone-500 mt-2">
                      La forma de pago se confirma por WhatsApp con el equipo.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-800 bg-stone-900/80 overflow-hidden">
                    <div className="px-4 py-3 bg-stone-800/60 border-b border-stone-800 flex items-center justify-between">
                      <div className="text-white font-bold">
                        {selected?.name || "Paquete"}
                      </div>
                      <div className="text-amber-400 font-extrabold">
                        ${formatCop(packagePrice)}
                      </div>
                    </div>

                    <dl className="divide-y divide-stone-800 text-sm">
                      <SummaryRow label="Nombre" value={name} />
                      <SummaryRow label="Teléfono" value={phone} />
                      <SummaryRow label="Ciudad" value={city} />
                      <SummaryRow label="Dirección" value={address} />
                      <SummaryRow label="Fecha" value={date} />
                      <SummaryRow label="Hora" value={time} />
                      <div className="px-4 py-3">
                        <div className="text-stone-400 font-semibold mb-2">
                          Adicionales
                        </div>
                        {extras.length === 0 ? (
                          <div className="text-stone-500 text-sm">Ninguno</div>
                        ) : (
                          <ul className="space-y-1.5">
                            {extras.map((id) => {
                              const ex = extrasList.find((x) => x.id === id);
                              if (!ex) return null;
                              return (
                                <li
                                  key={id}
                                  className="flex items-center justify-between gap-3 text-sm"
                                >
                                  <span className="text-white">
                                    {ex.icon} {ex.name}
                                  </span>
                                  <span className="text-amber-400">
                                    ${ex.price}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                      {paymentMethod && (
                        <SummaryRow
                          label="Forma de pago"
                          value={
                            PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)
                              ?.label ?? paymentMethod
                          }
                        />
                      )}
                      {message && (
                        <SummaryRow label="Mensaje" value={message} />
                      )}
                    </dl>

                    <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-t border-amber-500/30 flex items-center justify-between">
                      <div className="text-white font-semibold text-sm">
                        Total estimado
                      </div>
                      <div className="text-amber-300 font-extrabold text-lg">
                        ${formatCop(grandTotal)} COP
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-4 rounded-2xl border border-stone-800 bg-stone-900/60 cursor-pointer hover:border-amber-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-5 h-5 accent-amber-500 flex-shrink-0"
                    />
                    <span className="text-sm text-stone-300 leading-relaxed">
                      Al confirmar aceptas los{" "}
                      <span className="text-amber-300 font-semibold">
                        términos y condiciones de uso
                      </span>{" "}
                      de Musicaenvivo.co. Esta reserva se coordina vía WhatsApp
                      y queda sujeta a disponibilidad confirmada por nuestro
                      equipo.
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={step === 1}
                className="inline-flex items-center gap-2 border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 text-stone-100 hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 px-5 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/30 transition-all"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 px-5 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Guardando..." : "Confirmar y enviar"}
                </button>
              )}
            </div>

            <p className="text-stone-500 text-xs text-center">
              Al enviar, serás redirigido a WhatsApp para confirmar tu reserva
              directamente con nuestro equipo.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-2.5">
      <dt className="text-stone-400 font-semibold">{label}</dt>
      <dd className="text-white text-right break-words max-w-[70%]">
        {value || "—"}
      </dd>
    </div>
  );
}
