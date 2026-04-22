import { useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck, Clock } from "lucide-react";
import {
  DEFAULT_GENRES,
  formatCop,
  type GenreData,
  type GenreHourlyConfig,
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

const DEFAULT_HOURLY_RATE: Partial<Record<GenreId, number>> = {
  nortena: 600000,
  banda: 800000,
};

export function GenrePage({ id, packages, loading }: Props) {
  const base = DEFAULT_GENRES.find((g) => g.id === id)!;
  const [genre, setGenre] = useState<GenreData>(base);
  const [hourly, setHourly] = useState<GenreHourlyConfig | null>(null);
  const [selected, setSelected] = useState<PackageData | null>(null);
  const [prefillDate, setPrefillDate] = useState<string>("");
  const [prefillTime, setPrefillTime] = useState<string>("");
  const [prefillPrice, setPrefillPrice] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getSiteSetting(`genre_${id}_name`),
      getSiteSetting(`genre_${id}_image`),
      getSiteSetting(`genre_${id}_hourly_rate`),
      getSiteSetting(`genre_${id}_hourly_image`),
      getSiteSetting(`genre_${id}_hourly_description`),
    ]).then(([name, image, hRate, hImage, hDesc]) => {
      if (!mounted) return;
      setGenre({
        ...base,
        name: name?.trim() || base.name,
        image: image?.trim() || base.image,
      });
      const parsed = Number((hRate || "").replace(/[^\d]/g, "")) || 0;
      const fallback = DEFAULT_HOURLY_RATE[id] ?? 0;
      const rate = parsed > 0 ? parsed : fallback;
      if (rate > 0) {
        setHourly({
          rate,
          image: hImage?.trim() || undefined,
          description: hDesc?.trim() || undefined,
        });
      } else {
        setHourly(null);
      }
    });
    return () => {
      mounted = false;
    };
  }, [id, base]);

  const filtered = packages.filter((p) => p.genre === id);
  const hasPackages = !hourly && filtered.length > 0;
  const isHourly = !!hourly;
  const effectiveHourly: GenreHourlyConfig | null =
    isHourly && hourly
      ? {
          ...hourly,
          rate: prefillPrice > 0 ? prefillPrice : hourly.rate,
        }
      : null;

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

  const scrollToPaquetes = () =>
    document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });

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
                onClick={scrollToPaquetes}
                className="border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition-all"
              >
                Ver paquetes
              </button>
            )}
            {isHourly && (
              <button
                onClick={scrollToPaquetes}
                className="border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 backdrop-blur-sm text-stone-100 hover:text-amber-300 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition-all"
              >
                Ver tarifa
              </button>
            )}
          </div>
        </div>
      </section>

      <GenreGallery id={id} genreName={genre.name} />

      <Availability
        genreId={id}
        variant="embedded"
        onSlotSelect={(d, time, _label, price) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          setPrefillDate(`${y}-${m}-${day}`);
          setPrefillTime(time);
          setPrefillPrice(price > 0 ? price : 0);
          setTimeout(() => {
            const reservar = document.getElementById("reservar");
            const servicios = document.getElementById("servicios");
            const target =
              selected || isHourly
                ? reservar || servicios
                : servicios || reservar;
            target?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
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
            genreId={id}
          />
        </>
      )}

      {isHourly && effectiveHourly && (
        <>
          <section
            id="servicios"
            className="py-16 sm:py-24 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950"
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-stone-900/80 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                {effectiveHourly.image && (
                  <div className="aspect-[16/9] bg-stone-800 overflow-hidden">
                    <img
                      src={effectiveHourly.image}
                      alt={genre.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 sm:p-10">
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 mb-4">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300 text-xs font-medium">
                      Precio por hora
                    </span>
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">
                    {genre.name}
                  </h2>
                  {effectiveHourly.description && (
                    <p className="text-stone-300 text-base sm:text-lg mb-6 whitespace-pre-line">
                      {effectiveHourly.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-amber-400 font-display font-black text-4xl sm:text-5xl">
                      ${formatCop(effectiveHourly.rate)}
                    </span>
                    <span className="text-stone-400 text-lg">/ hora</span>
                  </div>
                  <button
                    onClick={scrollToReservar}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 px-6 py-3 rounded-2xl font-bold text-lg shadow-lg shadow-amber-500/30 transition-all"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          </section>
          <ReservationForm
            packages={[]}
            selected={selected}
            onSelect={setSelected}
            initialDate={prefillDate}
            initialTime={prefillTime}
            genreId={id}
            hourly={effectiveHourly}
          />
        </>
      )}
    </>
  );
}
