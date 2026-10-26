import { useEffect, useState } from "react";
import {
  DEFAULT_EXTRAS,
  type ExtraItem,
  type GenreId,
  type PackageData,
} from "../lib/constants";
import { getSiteSetting, WHATSAPP_LINK } from "../lib/supabase";
import { trackWhatsAppClick } from "../lib/analytics";
import { genrePath, navigate } from "../lib/routes";
import {
  cop,
  DEFAULT_HOURLY_RATE,
  PRECIOS,
  preciosFaqs,
} from "../lib/precios";

function go(path: string) {
  navigate(path);
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

function parseRate(v: string | null, fallback: number) {
  const n = Number((v || "").replace(/[^\d]/g, ""));
  return n > 0 ? n : fallback;
}

export function PreciosPage({ packages }: { packages: PackageData[] }) {
  const [hourly, setHourly] = useState(DEFAULT_HOURLY_RATE);
  const [extras, setExtras] = useState<ExtraItem[]>(DEFAULT_EXTRAS);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getSiteSetting("genre_nortena_hourly_rate"),
      getSiteSetting("genre_banda_hourly_rate"),
      getSiteSetting("extras_list"),
    ]).then(([n, b, x]) => {
      if (!mounted) return;
      setHourly({
        nortena: parseRate(n, DEFAULT_HOURLY_RATE.nortena),
        banda: parseRate(b, DEFAULT_HOURLY_RATE.banda),
      });
      try {
        const list = JSON.parse(x || "");
        if (Array.isArray(list) && list.length) setExtras(list);
      } catch {
        /* keep defaults */
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const mariachi = packages
    .filter((p) => p.genre === "mariachi")
    .sort((a, b) => a.priceCop - b.priceCop);
  const faqs = preciosFaqs(mariachi[0]?.priceCop, hourly);
  const waHref = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    "Hola Musicaenvivo.co, quiero cotizar una serenata en Bogotá."
  )}`;

  const hourlyRows: { id: GenreId; label: string; rate: number }[] = [
    { id: "nortena", label: "Grupo norteño", rate: hourly.nortena },
    { id: "banda", label: "Banda en vivo", rate: hourly.banda },
  ];

  return (
    <main className="bg-stone-950 text-stone-200 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-black text-4xl sm:text-6xl text-stone-50 tracking-tight leading-[1.05] mb-8">
          {PRECIOS.h1}
        </h1>
        <p className="text-stone-300 text-lg leading-relaxed mb-12">
          {PRECIOS.intro}
        </p>

        <section>
          <h2 className="font-display font-bold text-2xl text-stone-100 mb-4">
            Serenatas con mariachi
          </h2>
          <div className="border-t border-stone-800">
            {mariachi.map((p) => (
              <button
                key={p.name}
                onClick={() => go(genrePath("mariachi"))}
                className="group w-full text-left grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-5 border-b border-stone-800"
              >
                <span className="font-semibold text-stone-100 group-hover:text-amber-300">
                  {p.name}
                </span>
                <span className="font-display font-bold text-amber-200 text-lg text-right">
                  {cop(p.priceCop)}
                </span>
                <span className="col-span-2 text-sm text-stone-400">
                  {p.durationMinutes} min · {p.songsCount} canciones ·{" "}
                  {p.musiciansCount} músicos
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display font-bold text-2xl text-stone-100 mb-4">
            Norteña y banda por hora
          </h2>
          <div className="border-t border-stone-800">
            {hourlyRows.map((r) => (
              <button
                key={r.id}
                onClick={() => go(genrePath(r.id))}
                className="group w-full text-left grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-5 border-b border-stone-800"
              >
                <span className="font-semibold text-stone-100 group-hover:text-amber-300">
                  {r.label}
                </span>
                <span className="font-display font-bold text-amber-200 text-lg text-right">
                  {cop(r.rate)} / hora
                </span>
                <span className="col-span-2 text-sm text-stone-400">
                  Sonido amplificado incluido · desde 1 hora
                </span>
              </button>
            ))}
          </div>
        </section>

        {extras.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display font-bold text-2xl text-stone-100 mb-4">
              Adicionales
            </h2>
            <ul className="border-t border-stone-800">
              {extras.map((x) => (
                <li
                  key={x.id}
                  className="flex justify-between gap-6 py-3 border-b border-stone-800 text-stone-300"
                >
                  <span>{x.name}</span>
                  <span className="text-stone-200">${x.price}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-8 text-stone-400 leading-relaxed">{PRECIOS.recargo}</p>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsAppClick}
          className="inline-block mt-8 border border-amber-400/70 text-amber-200 hover:bg-amber-400 hover:text-stone-950 px-6 py-3 font-semibold transition-colors"
        >
          Cotizar por WhatsApp
        </a>

        <section className="mt-14">
          <h2 className="font-display font-bold text-2xl text-stone-100 mb-6">
            Preguntas sobre precios
          </h2>
          {faqs.map((f) => (
            <div key={f.q} className="py-5 border-t border-stone-800">
              <h3 className="font-semibold text-amber-200 mb-2">{f.q}</h3>
              <p className="text-stone-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
