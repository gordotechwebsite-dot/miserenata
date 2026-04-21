import { useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import {
  DEFAULT_GENRES,
  type GenreData,
  type GenreId,
  type PackageData,
} from "../lib/constants";
import { getSiteSetting } from "../lib/supabase";
import { Packages } from "./Packages";
import { ReservationForm } from "./ReservationForm";
import { Availability } from "./Availability";
import { GenreGallery } from "./GenreGallery";

type Props = {
  id: GenreId;
  packages: PackageData[];
  loading: boolean;
};

export function GenrePage({ id, packages, loading }: Props) {
  const base = DEFAULT_GENRES.find((g) => g.id === id)!;
  const [genre, setGenre] = useState<GenreData>(base);
  const [selected, setSelected] = useState<PackageData | null>(null);
  const [prefillDate, setPrefillDate] = useState<string>("");
  const [prefillTime, setPrefillTime] = useState<string>("");

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

  const goHome = () => {
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const scrollToDisponibilidad = () =>
    document
      .getElementById("disponibilidad")
      ?.scrollIntoView({ behavior: "smooth" });

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
            <button
              onClick={scrollToDisponibilidad}
              className="inline-flex items-center gap-2 border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              Ver Disponibilidad
            </button>
            {hasPackages && (
              <button
                onClick={scrollToReservar}
                className="border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition-all"
              >
                Ver paquetes
              </button>
            )}
          </div>
        </div>
      </section>

      <GenreGallery id={id} genreName={genre.name} />

      <Availability
        genreId={id}
        variant="embedded"
        onSlotSelect={(d, time) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          setPrefillDate(`${y}-${m}-${day}`);
          setPrefillTime(time);
        }}
      />

      {hasPackages && (
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
            initialDate={prefillDate}
            initialTime={prefillTime}
          />
        </>
      )}
    </>
  );
}
