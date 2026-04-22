import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import {
  DEFAULT_TESTIMONIALS,
  DEFAULT_TESTIMONIALS_TITLE,
  type TestimonialItem,
} from "../lib/constants";
import { getSiteSetting } from "../lib/supabase";
import { Reveal } from "./Reveal";

export function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [title, setTitle] = useState(DEFAULT_TESTIMONIALS_TITLE);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getSiteSetting("testimonials_list"),
      getSiteSetting("testimonials_title"),
    ]).then(([raw, t]) => {
      if (!mounted) return;
      if (t && t.trim()) setTitle(t.trim());
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed
              .filter(
                (r) =>
                  r &&
                  typeof r === "object" &&
                  typeof r.name === "string" &&
                  typeof r.text === "string"
              )
              .map(
                (r, i) =>
                  ({
                    id: String(r.id || `t-${i}`),
                    name: String(r.name || ""),
                    city: String(r.city || ""),
                    text: String(r.text || ""),
                    rating: Math.max(1, Math.min(5, Number(r.rating) || 5)),
                  }) as TestimonialItem
              );
            if (valid.length > 0) setItems(valid);
          }
        } catch {
          // keep defaults
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const loop = [...items, ...items];

  return (
    <section id="testimonios" className="py-16 sm:py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 text-sm font-medium">
              Lo que dicen nuestros clientes
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-3 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
            {title}
          </h2>
        </Reveal>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-20 sm:w-28 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgb(12 10 9) 0%, rgba(12,10,9,0) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-20 sm:w-28 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgb(12 10 9) 0%, rgba(12,10,9,0) 100%)",
          }}
        />
        <div className="inline-flex animate-testimonials-marquee gap-5 sm:gap-6 px-4 sm:px-6 lg:px-8 will-change-transform">
          {loop.map((t, idx) => (
            <article
              key={`${t.id}-${idx}`}
              className="relative bg-stone-900/70 border border-stone-800 rounded-3xl p-6 sm:p-7 w-[86vw] sm:w-[440px] flex-shrink-0 flex flex-col"
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-amber-500/10" />
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-base text-stone-200 leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div className="mt-auto border-t border-stone-800 pt-3">
                <div className="text-white font-bold">{t.name}</div>
                <div className="text-amber-400 text-sm">{t.city}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
