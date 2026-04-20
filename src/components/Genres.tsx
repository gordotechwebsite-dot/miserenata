import { Music2, Guitar, Drum } from "lucide-react";
import { WHATSAPP_LINK } from "../lib/supabase";

const GENRES = [
  {
    id: "mariachi",
    name: "Mariachi",
    icon: Music2,
    tagline: "El clásico que nunca falla",
    description:
      "Trompetas, violines y voces en vivo para declaraciones, aniversarios y despedidas. La tradición en su máxima expresión.",
    tags: ["Rancheras", "Boleros", "Cumbia"],
    color: "from-amber-500/20 to-red-500/10",
    border: "border-amber-500/30",
    accent: "text-amber-300",
  },
  {
    id: "nortena",
    name: "Norteña",
    icon: Guitar,
    tagline: "Acordeón con sabor",
    description:
      "Acordeón, bajo sexto y percusión para fiestas con energía, cumpleaños, despechos y celebraciones con amigos.",
    tags: ["Corridos", "Cumbia norteña", "Polka"],
    color: "from-yellow-500/20 to-orange-500/10",
    border: "border-yellow-500/30",
    accent: "text-yellow-300",
  },
  {
    id: "banda",
    name: "Banda",
    icon: Drum,
    tagline: "Sonido potente, fiesta grande",
    description:
      "Metales y percusión en formato completo para eventos grandes, bodas y fiestas donde la música tiene que sentirse.",
    tags: ["Banda sinaloense", "Romántico", "Fiesta"],
    color: "from-amber-500/20 to-purple-500/10",
    border: "border-violet-500/30",
    accent: "text-violet-300",
  },
];

export function Genres() {
  const openWa = (genre: string) =>
    window.open(
      `${WHATSAPP_LINK}?text=${encodeURIComponent(
        `Hola Miserenata, me interesa contratar una ${genre}. ¿Me pueden contar más?`
      )}`,
      "_blank"
    );

  return (
    <section
      id="generos"
      className="relative py-16 sm:py-24 bg-stone-950 overflow-hidden"
    >
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Music2 className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
              Géneros
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-4 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
            Elige tu estilo
          </h2>
          <p className="text-stone-400 text-base sm:text-lg max-w-2xl mx-auto">
            Tenemos el grupo ideal para cada momento. Tres géneros, una sola
            calidad: profesional y en vivo.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-7 md:grid-cols-3">
          {GENRES.map(
            ({
              id,
              name,
              icon: Icon,
              tagline,
              description,
              tags,
              color,
              border,
              accent,
            }) => (
              <button
                key={id}
                onClick={() => openWa(name)}
                className={`group text-left relative rounded-3xl border ${border} bg-gradient-to-br ${color} backdrop-blur-sm p-6 sm:p-7 hover:-translate-y-1 hover:border-amber-500/60 transition-all`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${accent}`} />
                  </div>
                  <div>
                    <div className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                      {name}
                    </div>
                    <div className={`text-xs ${accent}`}>{tagline}</div>
                  </div>
                </div>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-5">
                  {description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-stone-950/60 border border-stone-800 rounded-full px-2.5 py-1 text-stone-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div
                  className={`text-sm font-semibold ${accent} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}
                >
                  Cotizar {name} →
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
