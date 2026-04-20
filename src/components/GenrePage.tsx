import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import {
  DEFAULT_GENRES,
  type GenreData,
  type GenreId,
  type PackageData,
} from "../lib/constants";
import { WHATSAPP_LINK, getSiteSetting } from "../lib/supabase";
import { Packages } from "./Packages";
import { ReservationForm } from "./ReservationForm";
import { HowItWorks } from "./HowItWorks";

type Props = {
  id: GenreId;
  packages: PackageData[];
  loading: boolean;
};

export function GenrePage({ id, packages, loading }: Props) {
  const base = DEFAULT_GENRES.find((g) => g.id === id)!;
  const [genre, setGenre] = useState<GenreData>(base);
  const [selected, setSelected] = useState<PackageData | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getSiteSetting(`genre_${id}_name`),
      getSiteSetting(`genre_${id}_image`),
    ]).then(([name, image]) => {
      if (!mounted) return;
      setGenre({
        ...base,
        name: name?.trim() || base.name,
        image: image?.trim() || base.image,
      });
    });
    return () => {
      mounted = false;
    };
  }, [id, base]);

  const filtered = packages.filter((p) => p.genre === id);
  const hasPackages = filtered.length > 0;

  const waHref = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    `Hola Miserenata, me interesa contratar una ${genre.name}. ¿Me pueden contar más?`
  )}`;

  const goHome = () => {
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const scrollToReservar = () =>
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <section className="relative min-h-[60vh] sm:min-h-[75vh] flex items-end overflow-hidden">
        <img
          src={genre.image}
          alt={genre.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/1600x900/1a1a2e/d4af37?text=" +
              encodeURIComponent(genre.name);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pb-20">
          <button
            onClick={goHome}
            className="inline-flex items-center gap-2 text-stone-200 hover:text-amber-300 text-sm font-semibold mb-6 bg-stone-950/60 border border-stone-800 px-3 py-2 rounded-xl backdrop-blur"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            {genre.name}
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            {hasPackages && (
              <button
                onClick={scrollToReservar}
                className="border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition-all"
              >
                Reservar {genre.name}
              </button>
            )}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {hasPackages ? (
        <>
          <Packages
            packages={filtered}
            loading={loading}
            onSelect={(pkg) => {
              setSelected(pkg);
              scrollToReservar();
            }}
            selectedName={selected?.name}
          />
          <ReservationForm
            packages={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        </>
      ) : (
        <section id="reservar" className="py-16 sm:py-24 bg-stone-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display font-black text-3xl sm:text-4xl bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent mb-4">
              Cotiza tu {genre.name} a la medida
            </h2>
            <p className="text-stone-300 text-base sm:text-lg mb-8">
              Cada evento tiene su propia música. Cuéntanos qué necesitas y te
              armamos una propuesta {genre.name.toLowerCase()} personalizada.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 px-6 py-4 rounded-2xl font-extrabold text-lg shadow-lg shadow-amber-500/30 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Escribir por WhatsApp
            </a>
          </div>
        </section>
      )}

      <HowItWorks />
    </>
  );
}
