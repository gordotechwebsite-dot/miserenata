import { Music, Calendar, Heart } from "lucide-react";

const STEPS = [
  {
    icon: Music,
    title: "Elige tu Paquete",
    description:
      "Selecciona el paquete de serenata que más se ajuste a tu ocasión y presupuesto.",
  },
  {
    icon: Calendar,
    title: "Reserva tu Horario",
    description:
      "Escoge la fecha, hora y ciudad. Nosotros nos encargamos de coordinar todo.",
  },
  {
    icon: Heart,
    title: "Disfruta la Serenata",
    description:
      "Nuestro grupo llegará puntual y listo para crear un momento inolvidable.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 sm:py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-4 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
            Reservar es así de simple
          </h2>
          <p className="text-stone-400 text-base sm:text-lg max-w-xl mx-auto">
            3 pasos y listo. Nosotros nos encargamos del resto.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-stone-900/60 border border-stone-800 rounded-3xl p-8 text-center hover:border-amber-500/40 transition-all"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-stone-950 font-extrabold text-lg shadow-lg shadow-amber-500/30">
                  {idx + 1}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 mt-2">
                  <Icon className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
