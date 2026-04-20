import { useState } from "react";
import { Calendar, Clock, MapPin, Phone, User, MessageSquare, Gift, Send, CheckCircle2 } from "lucide-react";
import { CITIES, EXTRAS, TIME_SLOTS, formatCop, type PackageData } from "../lib/constants";
import { WHATSAPP_LINK } from "../lib/supabase";

type Props = {
  packages: PackageData[];
  selected: PackageData | null;
  onSelect: (pkg: PackageData) => void;
};

export function ReservationForm({ packages, selected, onSelect }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const toggleExtra = (id: string) =>
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );

  const resetForm = () => {
    setName("");
    setPhone("");
    setCity("");
    setDate("");
    setTime("");
    setAddress("");
    setMessage("");
    setExtras([]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;

    const extrasText =
      extras.length > 0
        ? extras
            .map((id) => {
              const extra = EXTRAS.find((x) => x.id === id);
              return extra ? `${extra.name} ($${extra.price})` : "";
            })
            .filter(Boolean)
            .join(", ")
        : "Ninguno";

    const messageText =
      `🎺 *Nueva Reserva de Serenata*%0A%0A` +
      `👤 *Nombre:* ${name}%0A` +
      `📱 *Teléfono:* ${phone}%0A` +
      `🎶 *Paquete:* ${selected.name}%0A` +
      `🎁 *Adicionales:* ${extrasText}%0A` +
      `📍 *Ciudad:* ${city}%0A` +
      `📅 *Fecha:* ${date}%0A` +
      `🕐 *Hora:* ${time}%0A` +
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
        <div className="text-center mb-10 sm:mb-14">
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
            Completa el formulario y te contactaremos por WhatsApp para
            confirmar todos los detalles.
          </p>
        </div>

        <div className="bg-stone-900/80 backdrop-blur border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {submitted && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/40 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <div className="text-sm text-green-200">
                ¡Listo! Te redirigimos a WhatsApp para confirmar tu reserva.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-amber-300 mb-3">
                <Send className="w-4 h-4" />
                Paquete Seleccionado *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {packages.map((pkg) => {
                  const active = selected?.name === pkg.name;
                  return (
                    <button
                      type="button"
                      key={pkg.id || pkg.name}
                      onClick={() => onSelect(pkg)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        active
                          ? "border-amber-500 bg-amber-500/10"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                  <User className="w-4 h-4 text-amber-400" />
                  Nombre Completo *
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                >
                  <option value="">Selecciona la ciudad</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Dirección de la Serenata *
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Fecha de la Serenata *
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Hora de la Serenata *
                </label>
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                >
                  <option value="">Selecciona la hora</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-amber-300 mb-3">
                <Gift className="w-4 h-4" />
                Detalles Adicionales (Opcional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EXTRAS.map((extra) => {
                  const active = extras.includes(extra.id);
                  return (
                    <button
                      type="button"
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                        active
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-stone-700 bg-stone-800/60 hover:border-amber-500/50"
                      }`}
                    >
                      <div className="text-2xl">{extra.icon}</div>
                      <div className="text-white text-xs font-semibold text-center">
                        {extra.name}
                      </div>
                      <div className="text-amber-400 text-xs">
                        ${extra.price}
                      </div>
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

            <button
              type="submit"
              disabled={!selected}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 py-4 rounded-xl font-extrabold text-base sm:text-lg shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar Reserva por WhatsApp
            </button>
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
