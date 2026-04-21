import { useEffect, useState } from "react";
import { DEFAULT_GENRES, type GenreData, type GenreId } from "../lib/constants";
import { getSiteSetting } from "../lib/supabase";
import { genreHash } from "../lib/routes";
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

export function Genres() {
  const [genres, setGenres] = useState<GenreData[]>(DEFAULT_GENRES);

  useEffect(() => {
    let mounted = true;
    loadOverrides().then((ov) => {
      if (!mounted) return;
      setGenres(
        DEFAULT_GENRES.map((g) => ({
          ...g,
          name: ov[g.id]?.name || g.name,
          image: ov[g.id]?.image || g.image,
        }))
      );
    });
    return () => {
      mounted = false;
    };
  }, []);

  const goTo = (id: GenreId) => {
    window.location.hash = genreHash(id);
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
              className="group relative rounded-3xl overflow-hidden bg-stone-900 aspect-[4/5] w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={`Ver paquetes de ${g.name}`}
            >
              <img
                src={g.image}
                alt={g.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/800x1000/1a1a2e/d4af37?text=" +
                    encodeURIComponent(g.name);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
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
