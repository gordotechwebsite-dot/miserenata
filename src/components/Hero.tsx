import { Star, Sparkles, ChevronDown } from "lucide-react";
import { useCounter } from "../hooks/useCounter";

function Stats() {
  const serenatas = useCounter(500, 900, 0);
  const years = useCounter(10, 900, 0);
  const rating = useCounter(5, 900, 1);

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto">
      <div className="text-center">
        <div
          ref={serenatas.ref}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400"
        >
          {Math.round(serenatas.value)}+
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1">
          Serenatas Realizadas
        </div>
      </div>
      <div className="text-center">
        <div
          ref={years.ref}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400"
        >
          {Math.round(years.value)}+
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1">
          Años de Experiencia
        </div>
      </div>
      <div className="text-center">
        <div
          ref={rating.ref}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400"
        >
          {rating.value.toFixed(1)}
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1">
          Calificación Promedio
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const scrollToReserve = () =>
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
  const scrollToServices = () =>
    document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/images/mariachi-hero.jpg"
          alt="Mariachi en vivo"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/1920x1080/1a1a2e/d4af37?text=Miserenata.co";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/80 to-stone-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-amber-300 text-sm font-medium">
            N°1 en Serenatas en Boyacá
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6">
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
            Serenatas y Mariachis
          </span>
          <br />
          <span className="text-white">en vivo</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Sorprende a quien más quieres con la mejor música de mariachi en
          <span className="text-amber-400 font-semibold"> Duitama</span>,
          <span className="text-amber-400 font-semibold"> Paipa</span> y
          <span className="text-amber-400 font-semibold"> Sogamoso</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToReserve}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 px-8 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-2xl shadow-amber-500/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Reserva tu Serenata
          </button>
          <button
            onClick={scrollToServices}
            className="border border-stone-700 hover:border-amber-500/60 text-stone-200 hover:text-amber-400 px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all"
          >
            Ver Paquetes
          </button>
        </div>

        <Stats />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-amber-400/60" />
      </div>
    </section>
  );
}
