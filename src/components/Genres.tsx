import { useEffect, useState } from "react";
import { DEFAULT_GENRES, type GenreData, type GenreId } from "../lib/constants";
import { getSiteSetting } from "../lib/supabase";
import { genrePath, navigate } from "../lib/routes";
import { placeholderSvg } from "../lib/placeholder";
import { readCache, writeCache } from "../lib/cache";
import { Reveal } from "./Reveal";

type GenreOverride = Partial<Pick<GenreData, "name" | "image">>;

async function loadOverrides(): Promise<Record<GenreId, GenreOverride>> {
  const ids: GenreId[] = ["mariachi", "nortena", "banda"];
  const entries = await Promise.all(
    ids.map(async (id) => {
      const [name, image] = await Promise.all([
        getSiteSetting(`genre_${id}_name`),
        getSiteSetting(`genre_${id}_image`),
      ]);
      const override: GenreOverride = {};
      if (name && name.trim()) override.name = name.trim();
      if (image && image.trim()) override.image = image.trim();
      return [id, override] as const;
    })
  );
  return Object.fromEntries(entries) as Record<GenreId, GenreOverride>;
}

function applyOverrides(
  ov: Record<GenreId, GenreOverride>
): GenreData[] {
  return DEFAULT_GENRES.map((g) => ({
    ...g,
    name: ov[g.id]?.name || g.name,
    image: ov[g.id]?.image || g.image,
  }));
}

export function Genres() {
  const [genres, setGenres] = useState<GenreData[]>(
    () => readCache<GenreData[]>("genres") ?? DEFAULT_GENRES
  );

  useEffect(() => {
    let mounted = true;
    loadOverrides().then((ov) => {
      if (!mounted) return;
      const next = applyOverrides(ov);
      setGenres(next);
      writeCache("genres", next);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const goTo = (id: GenreId) => {
    navigate(genrePath(id));
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  return (
    <section
      id="generos"
      className="relative py-16 sm:py-24 bg-stone-950 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10 sm:mb-14">
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-3 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
            Elige tu estilo
          </h2>
          <p className="text-stone-400 text-base sm:text-lg max-w-2xl mx-auto">
            Cada género tiene su propia propuesta y paquetes.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((g, idx) => (
            <Reveal key={g.id} delay={idx * 120} className="h-full">
            <button
              onClick={() => goTo(g.id)}
              className="group relative rounded-3xl overflow-hidden bg-stone-900 w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-400 block"
              aria-label={`Ver paquetes de ${g.name}`}
            >
              <img
                src={g.image}
                alt={g.name}
                className="block w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderSvg(
                    g.name,
                    800,
                    1000
                  );
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div
                className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 flex ${
                  g.id === "nortena" ? "justify-end text-right" : ""
                }`}
              >
                <div className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {g.name}
                </div>
              </div>
            </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
