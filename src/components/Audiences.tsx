import { Heart, PartyPopper, Crown, ArrowRight } from "lucide-react";
import { WHATSAPP_LINK } from "../lib/supabase";

type Audience = {
  id: string;
  icon: typeof Heart;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  waMessage: string;
  accent: "rose" | "amber" | "violet";
};

const AUDIENCES: Audience[] = [
  {
    id: "sorpresa",
    icon: Heart,
    eyebrow: "Sorprende a quien amas",
    title: "Serenatas & sorpresas",
    description:
      "El detalle que nadie olvida. Música en vivo en la puerta de su casa, su cumpleaños o el momento de la propuesta.",
    bullets: [
      "Mariachi, trío o serenatero solista",
      "Canciones a pedido",
      "Flores, vino y chocolates como extras",
    ],
    cta: "Planear mi sorpresa",
    waMessage:
      "Hola Miserenata, quiero dar una sorpresa con una serenata. ¿Me asesoran?",
    accent: "rose",
  },
  {
    id: "eventos",
    icon: PartyPopper,
    eyebrow: "Artistas en vivo",
    title: "Eventos & celebraciones",
    description:
      "Cumpleaños, bodas, quinceaños, grados, eventos corporativos. Elegimos contigo el show perfecto.",
    bullets: [
      "Mariachi completo, DJ + acústico, bandas",
      "Sonido, luces y animación profesional",
      "Coordinación minuto a minuto del show",
    ],
    cta: "Cotizar mi evento",
    waMessage:
      "Hola Miserenata, estoy organizando un evento y quiero cotizar artistas en vivo.",
    accent: "amber",
  },
  {
    id: "vip",
    icon: Crown,
    eyebrow: "Experiencias a la medida",
    title: "Alta categoría · VIP",
    description:
      "Producciones premium para quien busca lo mejor: decoración, escenografía, fotógrafo y show personalizado.",
    bullets: [
      "Producción 360° (sonido, video, luces)",
      "Shows exclusivos y músicos de primer nivel",
      "Cobertura fotográfica y video 4K",
    ],
    cta: "Diseñar experiencia VIP",
    waMessage:
      "Hola Miserenata, busco una Experiencia VIP a la medida. ¿Me pueden cotizar?",
    accent: "violet",
  },
];

const ACCENTS: Record<
  Audience["accent"],
  { ring: string; icon: string; glow: string; badge: string; btn: string }
> = {
  rose: {
    ring: "group-hover:border-rose-400/50",
    icon: "from-rose-400 to-pink-500",
    glow: "group-hover:shadow-rose-500/20",
    badge: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    btn: "text-rose-200 hover:text-rose-100 border-rose-500/40 hover:border-rose-400",
  },
  amber: {
    ring: "group-hover:border-amber-400/60",
    icon: "from-amber-400 to-yellow-500",
    glow: "group-hover:shadow-amber-500/20",
    badge: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    btn: "text-amber-200 hover:text-amber-100 border-amber-500/50 hover:border-amber-400",
  },
  violet: {
    ring: "group-hover:border-violet-400/50",
    icon: "from-violet-400 to-fuchsia-500",
    glow: "group-hover:shadow-violet-500/20",
    badge: "text-violet-300 bg-violet-500/10 border-violet-500/30",
    btn: "text-violet-200 hover:text-violet-100 border-violet-500/40 hover:border-violet-400",
  },
};

export function Audiences() {
  const openWa = (msg: string) =>
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`, "_blank");

  return (
    <section id="para-quien" className="relative py-20 sm:py-28 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
              ¿Para quién es Miserenata?
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">
            Tres formas de <span className="italic text-amber-300">sorprender</span>
          </h2>
          <p className="text-stone-400 text-base sm:text-lg">
            Un solo aliado para cualquier ocasión que merezca música en vivo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-7">
          {AUDIENCES.map(({ id, icon: Icon, eyebrow, title, description, bullets, cta, waMessage, accent }) => {
            const a = ACCENTS[accent];
            return (
              <div
                key={id}
                className={`group relative rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-900/40 border border-stone-800 ${a.ring} shadow-xl ${a.glow} p-7 sm:p-8 flex flex-col transition-all hover:-translate-y-1`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.icon} flex items-center justify-center shadow-lg mb-5`}
                >
                  <Icon className="w-7 h-7 text-stone-950" />
                </div>

                <span
                  className={`inline-flex self-start text-[11px] font-semibold tracking-widest uppercase border rounded-full px-2.5 py-1 mb-3 ${a.badge}`}
                >
                  {eyebrow}
                </span>

                <h3 className="font-display text-2xl sm:text-3xl text-white font-bold mb-3">
                  {title}
                </h3>
                <p className="text-stone-400 text-sm sm:text-base leading-relaxed mb-5">
                  {description}
                </p>

                <ul className="space-y-2 mb-8 text-sm text-stone-300">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openWa(waMessage)}
                  className={`mt-auto inline-flex items-center justify-center gap-2 border rounded-2xl px-5 py-3 font-semibold text-sm transition-all ${a.btn}`}
                >
                  {cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
