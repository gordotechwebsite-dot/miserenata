import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import type { GenreId } from "../lib/constants";
import { getMunicipio, HUB, LOCALIDADES, MUNICIPIOS } from "../lib/municipios";
import { genrePath, navigate } from "../lib/routes";
import { WHATSAPP_LINK } from "../lib/supabase";
import { trackWhatsAppClick } from "../lib/analytics";

const GENRES: { id: GenreId; label: string }[] = [
  { id: "mariachi", label: "Mariachi" },
  { id: "nortena", label: "Norteña" },
  { id: "banda", label: "Banda en vivo" },
];

function go(path: string) {
  navigate(path);
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

export function MunicipioPage({ slug }: { slug: string }) {
  if (slug === HUB.slug) return <LocalidadesHub />;
  return <ZonaPage slug={slug} />;
}

function LocalidadesHub() {
  return (
    <main className="bg-stone-950 text-stone-200 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-black text-4xl sm:text-6xl text-stone-50 tracking-tight leading-[1.05] mb-8">
          {HUB.h1}
        </h1>
        <p className="text-stone-300 text-lg leading-relaxed mb-10">{HUB.intro}</p>
        <ul className="grid sm:grid-cols-2 border-t border-stone-800">
          {LOCALIDADES.map((z) => (
            <li key={z.slug} className="border-b border-stone-800">
              <a
                href={`/${z.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(`/${z.slug}`);
                }}
                className="block py-4 pr-4 group"
              >
                <span className="font-display font-bold text-stone-100 group-hover:text-amber-300">
                  Mariachis en {z.name}
                </span>
                <span className="block text-sm text-stone-500">
                  {z.barrios?.slice(0, 3).join(" · ")}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <ZonasLinks />
      </div>
    </main>
  );
}

function ZonaPage({ slug }: { slug: string }) {
  const m = getMunicipio(slug);

  useEffect(() => {
    if (!m) return;
    try {
      window.sessionStorage.setItem("municipio", m.name);
    } catch {
      /* ignore */
    }
  }, [m]);

  if (!m) return null;

  const waHref = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    `Hola Musicaenvivo.co, quiero cotizar música en vivo en ${m.name}.`
  )}`;

  return (
    <main className="bg-stone-950 text-stone-200 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => go("/")}
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-300 text-sm font-semibold mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <p className="uppercase tracking-[0.4em] text-amber-200 text-xs font-light mb-4">
          {m.kind === "localidad" ? `${m.name} · Bogotá` : m.name}
        </p>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-stone-50 tracking-tight leading-[1.05] mb-8">
          {m.h1}
        </h1>
        {m.intro.map((p) => (
          <p key={p} className="text-stone-300 text-lg leading-relaxed mb-5">
            {p}
          </p>
        ))}

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsAppClick}
          className="inline-block mt-4 border border-amber-400/70 text-amber-200 hover:bg-amber-400 hover:text-stone-950 px-6 py-3 font-semibold transition-colors"
        >
          Cotizar en {m.name} por WhatsApp
        </a>

        <section className="mt-16 border-t border-stone-800">
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => go(genrePath(g.id))}
              className="group w-full text-left grid sm:grid-cols-[14rem_1fr] gap-2 sm:gap-8 py-6 border-b border-stone-800"
            >
              <h2 className="font-display font-bold text-xl text-stone-100 group-hover:text-amber-300 transition-colors">
                {g.label} en {m.name}
              </h2>
              <p className="text-stone-400 leading-relaxed">
                {m.services[g.id]}{" "}
                <span className="text-sky-300">Ver paquetes</span>
              </p>
            </button>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="font-display font-bold text-2xl text-stone-100 mb-3">
            Ocasiones
          </h2>
          <p className="text-stone-300 leading-relaxed">{m.occasions}</p>
        </section>

        <section className="mt-14">
          <h2 className="font-display font-bold text-2xl text-stone-100 mb-6">
            Preguntas frecuentes
          </h2>
          {m.faqs.map((f) => (
            <div key={f.q} className="py-5 border-t border-stone-800">
              <h3 className="font-semibold text-amber-200 mb-2">{f.q}</h3>
              <p className="text-stone-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        <ZonasLinks exclude={m.slug} />
      </div>
    </main>
  );
}

type ZonaLink = { slug: string; name: string; label?: string };

function ZonasLinks({ exclude }: { exclude?: string }) {
  const links: ZonaLink[] = [
    ...MUNICIPIOS.map((m) => ({ slug: m.slug, name: m.name })),
    { slug: HUB.slug, name: "Localidades de Bogotá" },
    { slug: "precios", name: "Precios" },
  ];
  return (
    <details className="group mt-14 border-t border-stone-800 pt-5 text-sm">
      <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden uppercase tracking-[0.3em] text-stone-400 text-xs">
        Zonas de cobertura
        <span className="text-stone-500 text-base leading-none transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {links
          .filter((z) => z.slug !== exclude)
          .map((z) => (
            <a
              key={z.slug}
              href={`/${z.slug}`}
              onClick={(e) => {
                e.preventDefault();
                go(`/${z.slug}`);
              }}
              className="text-stone-300 hover:text-amber-300"
            >
              {z.name}
            </a>
          ))}
      </nav>
    </details>
  );
}

export function ZonasStrip() {
  return (
    <div className="bg-stone-950 flow-root">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ZonasLinks />
      </div>
    </div>
  );
}
