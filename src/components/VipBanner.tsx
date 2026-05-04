import { Crown, Camera, Volume2, Lightbulb, Users, Check } from "lucide-react";
import { WHATSAPP_LINK } from "../lib/supabase";
import { trackWhatsAppClick } from "../lib/analytics";

const VIP_FEATURES = [
  { icon: Volume2, label: "Sonido e iluminación de concierto" },
  { icon: Users, label: "Músicos de primer nivel" },
  { icon: Camera, label: "Cobertura fotográfica y video 4K" },
  { icon: Lightbulb, label: "Escenografía y decoración temática" },
];

const VIP_INCLUDES = [
  "Consultoría creativa con productor artístico",
  "Repertorio personalizado a tu historia",
  "Coordinación minuto a minuto del show",
  "Opciones de streaming para invitados remotos",
];

export function VipBanner() {
  const openWa = () => {
    trackWhatsAppClick();
    window.open(
      `${WHATSAPP_LINK}?text=${encodeURIComponent(
        "Hola Musicaenvivo.co, quiero cotizar una Experiencia VIP a la medida."
      )}`,
      "_blank"
    );
  };

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950" />
        <div className="absolute -top-40 -right-20 w-[480px] h-[480px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[480px] h-[480px] bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-stone-900/90 via-stone-900/70 to-stone-900/90 backdrop-blur-sm shadow-2xl p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-xs font-semibold tracking-wider uppercase">
                Experiencia VIP
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl leading-[1.1] mb-5 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
              Cuando lo común
              <br />
              no es suficiente.
            </h2>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-7">
              Diseñamos producciones a la medida para quienes buscan lo mejor:
              bodas de ensueño, proposiciones de película, eventos de marca y
              fiestas inolvidables. Sin paquetes cerrados — tú sueñas, nosotros
              producimos.
            </p>

            <ul className="space-y-3 mb-8">
              {VIP_INCLUDES.map((inc) => (
                <li key={inc} className="flex items-start gap-3 text-stone-200">
                  <span className="mt-1 h-5 w-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-amber-300" />
                  </span>
                  <span className="text-sm sm:text-base">{inc}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={openWa}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 px-7 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-amber-500/30 hover:scale-[1.02] transition-all"
            >
              <Crown className="w-5 h-5" />
              Cotizar Experiencia VIP
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {VIP_FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-2xl bg-stone-950/50 border border-stone-800 hover:border-amber-500/40 p-5 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-amber-300" />
                </div>
                <div className="text-white font-semibold text-sm sm:text-base">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
