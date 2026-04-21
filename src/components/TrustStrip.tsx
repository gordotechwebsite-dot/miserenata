import { ShieldCheck, Clock, MapPin, CreditCard, Award, Heart } from "lucide-react";
import { Reveal } from "./Reveal";

const BADGES = [
  { icon: Award, label: "+500 serenatas realizadas" },
  { icon: ShieldCheck, label: "Músicos profesionales verificados" },
  { icon: Clock, label: "Puntualidad garantizada" },
  { icon: MapPin, label: "Cobertura en toda Boyacá" },
  { icon: CreditCard, label: "Pagos seguros" },
  { icon: Heart, label: "5.0 ★ en reseñas" },
];

export function TrustStrip() {
  return (
    <section className="relative border-y border-stone-900 bg-stone-950/80 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {BADGES.map(({ icon: Icon, label }, idx) => (
            <Reveal
              key={label}
              delay={idx * 80}
              className="flex items-center gap-3 text-stone-300"
            >
              <Icon className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium leading-tight">
                {label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
