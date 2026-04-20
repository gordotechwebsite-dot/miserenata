import { Star, Sparkles, ChevronDown, Music4, PartyPopper, Crown } from "lucide-react";
import { useCounter } from "../hooks/useCounter";
import { WHATSAPP_LINK } from "../lib/supabase";

function Stats() {
  const serenatas = useCounter(500, 900, 0);
  const years = useCounter(10, 900, 0);
  const rating = useCounter(5, 900, 1);

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto">
      <div className="text-center">
        <div
          ref={serenatas.ref}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400"
        >
          {Math.round(serenatas.value)}+
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1 uppercase tracking-wider">
          Eventos Realizados
        </div>
      </div>
      <div className="text-center">
        <div
          ref={years.ref}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400"
        >
          {Math.round(years.value)}+
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1 uppercase tracking-wider">
          Años en Escena
        </div>
      </div>
      <div className="text-center">
        <div
          ref={rating.ref}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400"
        >
          {rating.value.toFixed(1)}
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1 uppercase tracking-wider">
          Calificación ★
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const openVipQuote = () => {
    const msg = encodeURIComponent(
      "Hola Miserenata, me interesa una Experiencia VIP / evento a la medida. ¿Me pueden cotizar?"
    );
    window.open(`${WHATSAPP_LINK}?text=${msg}`, "_blank");
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16 hero-grain"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-amber-300 text-xs sm:text-sm font-medium tracking-wide uppercase">
            N°1 en Serenatas y Artistas en Vivo · Boyacá
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] mb-5 sm:mb-7 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]">
          El arte de sorprender
          <br />
          en cada nota.
        </h1>

        <p className="text-base sm:text-xl md:text-2xl text-white sm:text-stone-300 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light text-shadow-hero sm:[text-shadow:none]">
          Serenatas, mariachis y artistas en vivo de la más alta categoría en
          <span className="text-amber-400 font-semibold"> Duitama</span>,
          <span className="text-amber-400 font-semibold"> Paipa</span> y
          <span className="text-amber-400 font-semibold"> Sogamoso</span>.
          <br className="hidden sm:block" /> Convertimos tus momentos en
          recuerdos inolvidables.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-3xl mx-auto">
          <button
            onClick={() => scrollTo("reservar")}
            className="group flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-2xl shadow-amber-500/40 hover:scale-[1.03] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Reserva una serenata
          </button>
          <button
            onClick={() => scrollTo("para-quien")}
            className="group flex-1 border border-stone-700 hover:border-amber-500/60 bg-stone-900/50 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-6 py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
          >
            <PartyPopper className="w-4 h-4" />
            Artistas para eventos
          </button>
          <button
            onClick={openVipQuote}
            className="group flex-1 border border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 hover:from-amber-500/20 hover:to-yellow-500/10 text-amber-200 hover:text-amber-100 px-6 py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Experiencia VIP
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-stone-200 sm:text-stone-400 text-shadow-hero sm:[text-shadow:none]">
          <span className="inline-flex items-center gap-2">
            <Music4 className="w-4 h-4 text-amber-400" /> Mariachis y tríos
          </span>
          <span className="hidden sm:inline text-stone-700">·</span>
          <span>Sonido y luces profesionales</span>
          <span className="hidden sm:inline text-stone-700">·</span>
          <span>Reserva con WhatsApp en minutos</span>
        </div>

        <Stats />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-7 h-7 text-amber-400/60" />
      </div>
    </section>
  );
}
