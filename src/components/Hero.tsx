import { ChevronDown } from "lucide-react";
import { genrePath, navigate } from "../lib/routes";
import { IS_BOGOTA } from "../lib/region";

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const goMariachi = () => {
    navigate(genrePath("mariachi"));
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex flex-col items-center justify-start overflow-hidden pt-24 pb-16 hero-grain"
    >
      <div className="absolute inset-0 z-0">
        <video
          className="hidden sm:block w-full h-full object-cover scale-105"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-desktop-poster.jpg"
          aria-hidden="true"
        >
          <source src="/video/hero-desktop.webm" type="video/webm" />
          <source src="/video/hero-desktop.mp4" type="video/mp4" />
        </video>
        <div className="hidden sm:block absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-stone-950 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="hero-title-cycle mb-8 sm:mb-10">
        <h1 className="font-display font-black text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
          Música
          <br />
          en vivo
        </h1>
        {IS_BOGOTA && (
          <p className="mt-5 sm:mt-7 flex items-center justify-center gap-4 sm:gap-6 font-sans font-light uppercase text-amber-200 text-xl sm:text-2xl md:text-3xl tracking-[0.45em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <span aria-hidden="true" className="h-px w-10 sm:w-16 bg-amber-300/70" />
            <span className="-mr-[0.45em]">Bogotá</span>
            <span aria-hidden="true" className="h-px w-10 sm:w-16 bg-amber-300/70" />
          </p>
        )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-2xl mx-auto">
          <button
            onClick={goMariachi}
            className="flex-1 border border-stone-700 hover:border-amber-500/60 bg-stone-900/50 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-6 py-5 rounded-2xl font-bold text-lg sm:text-xl tracking-wide transition-all"
          >
            Reserva una serenata
          </button>
          <button
            onClick={() => scrollTo("generos")}
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
