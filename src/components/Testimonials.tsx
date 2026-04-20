import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../lib/constants";

export function Testimonials() {
  return (
    <section id="testimonios" className="py-16 sm:py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 text-sm font-medium">
              Lo que dicen nuestros clientes
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-4 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
            Historias que nos emocionan
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="relative bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 hover:border-amber-500/40 transition-all"
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-amber-500/10" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-base text-stone-200 leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="border-t border-stone-800 pt-4">
                <div className="text-white font-bold">{t.name}</div>
                <div className="text-amber-400 text-sm">{t.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
