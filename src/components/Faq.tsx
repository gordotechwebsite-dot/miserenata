import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "¿Con cuánto tiempo debo reservar?",
    a: "Recomendamos al menos 48 horas de anticipación. Para bodas y eventos grandes, lo ideal es 2 a 4 semanas. Si es urgente, escríbenos por WhatsApp y vemos disponibilidad.",
  },
  {
    q: "¿Cuál es la zona de cobertura?",
    a: "Operamos en Duitama, Paipa y Sogamoso de forma estándar. Para municipios cercanos de Boyacá se cotiza un recargo por desplazamiento.",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Recibimos transferencia (Nequi, Daviplata, Bancolombia), efectivo y pagos con tarjeta. Se confirma la reserva con un abono del 50%.",
  },
  {
    q: "¿Puedo pedir canciones específicas?",
    a: "¡Claro! Nuestro repertorio incluye más de 300 canciones (mariachi, bolero, balada, ranchera, moderna). Si quieres una canción especial fuera del repertorio, la preparamos con aviso previo.",
  },
  {
    q: "¿Qué pasa si necesito reprogramar?",
    a: "Puedes reprogramar hasta 24 horas antes sin costo adicional, sujeto a disponibilidad. Cancelaciones dentro de 24h tienen un costo administrativo.",
  },
  {
    q: "¿Cuánto dura una serenata o show?",
    a: "Los paquetes estándar van de 20 a 45 minutos. Para eventos podemos ofrecer sets de 1, 2 o 3 horas, con intermedios si se requiere.",
  },
  {
    q: "¿Incluye sonido y luces?",
    a: "Los paquetes de serenata incluyen instrumentos acústicos. Para eventos y Experiencias VIP incluimos sonido profesional, luces y en algunos casos video.",
  },
  {
    q: "¿Atienden eventos corporativos y bodas?",
    a: "Sí. Diseñamos propuestas a la medida para empresas, bodas y celebraciones grandes. Contáctanos para una cotización personalizada.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-24 bg-stone-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
              Preguntas Frecuentes
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">
            Lo que tal vez <span className="italic text-amber-300">te preguntas</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "border-amber-500/40 bg-stone-900"
                    : "border-stone-800 bg-stone-900/50 hover:border-stone-700"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                >
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                      isOpen
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                        : "border-stone-700 text-stone-400"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-stone-300 text-sm sm:text-base leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
