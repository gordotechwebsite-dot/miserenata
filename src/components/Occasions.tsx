import {
  Heart,
  Cake,
  Gem,
  GraduationCap,
  Briefcase,
  Flower2,
  Sparkles,
  Baby,
} from "lucide-react";
import { WHATSAPP_LINK } from "../lib/supabase";

const OCCASIONS = [
  { icon: Heart, label: "Aniversarios" },
  { icon: Cake, label: "Cumpleaños" },
  { icon: Gem, label: "Propuestas" },
  { icon: Flower2, label: "Bodas" },
  { icon: Sparkles, label: "Quinceaños" },
  { icon: GraduationCap, label: "Grados" },
  { icon: Briefcase, label: "Corporativo" },
  { icon: Baby, label: "Baby Showers" },
];

export function Occasions() {
  const openWa = () =>
    window.open(
      `${WHATSAPP_LINK}?text=${encodeURIComponent(
        "Hola Musicaenvivo.co, quiero cotizar para una ocasión especial."
      )}`,
      "_blank"
    );

  return (
    <section
      id="ocasiones"
      className="relative py-20 sm:py-24 bg-gradient-to-b from-stone-950 via-stone-900/30 to-stone-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
              Ocasiones
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-4 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight leading-[1.15]">
            Música que acompaña tus momentos
          </h2>
          <p className="text-stone-400 text-base sm:text-lg">
            Cualquier motivo es razón para sorprender con una experiencia en vivo.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {OCCASIONS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="group rounded-2xl bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/40 p-5 sm:p-6 flex flex-col items-center gap-3 transition-all hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-stone-200 text-sm sm:text-base font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={openWa}
            className="inline-flex items-center gap-2 border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-amber-100 bg-amber-500/5 hover:bg-amber-500/10 rounded-2xl px-6 py-3 font-semibold text-sm transition-all"
          >
            ¿Tu ocasión no está acá? Escríbenos
          </button>
        </div>
      </div>
    </section>
  );
}
