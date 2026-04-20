import { ChevronDown } from "lucide-react";

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex flex-col items-center justify-start overflow-hidden pt-24 pb-16 hero-grain"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/images/mariachi-hero.jpg"
          alt="Mariachi en vivo en Boyacá"
          className="hidden sm:block w-full h-full object-cover scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/1920x1080/1a1a2e/d4af37?text=Miserenata.co";
          }}
        />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/80 to-stone-950" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-stone-950/70 via-transparent to-stone-950/70" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="hero-title-cycle font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] mb-6 sm:mb-8 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]">
          El arte de sorprender
          <br />
          en cada nota.
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-2xl mx-auto">
          <button
            onClick={() => scrollTo("reservar")}
            className="flex-1 border border-stone-700 hover:border-amber-500/60 bg-stone-900/50 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-6 py-5 rounded-2xl font-bold text-lg sm:text-xl tracking-wide transition-all"
          >
            Reserva una serenata
          </button>
          <button
            onClick={() => scrollTo("para-quien")}
            className="flex-1 border border-stone-700 hover:border-amber-500/60 bg-stone-900/50 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-6 py-5 rounded-2xl font-bold text-lg sm:text-xl tracking-wide transition-all"
          >
            Artistas para eventos
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-7 h-7 text-amber-400/60" />
      </div>
    </section>
  );
}
