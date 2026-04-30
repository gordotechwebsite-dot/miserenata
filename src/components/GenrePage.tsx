import { useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import {
  DEFAULT_GENRES,
  type GenreData,
  type GenreHourlyConfig,
  type GenreId,
  type PackageData,
} from "../lib/constants";
import { getSiteSetting } from "../lib/supabase";
import { readCache, writeCache } from "../lib/cache";
import { navigate } from "../lib/routes";
import { placeholderSvg } from "../lib/placeholder";
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

type SeoBlock = {
  heading: string;
  intro: string;
  bullets: { title: string; body: string }[];
};

const SEO_CONTENT: Record<GenreId, SeoBlock> = {
  mariachi: {
    heading: "Mariachi profesional en Boyacá",
    intro:
      "Llevamos mariachis con vestuario charro completo (trajes de gala, sombreros, botas) y formación tradicional — trompetas, violines, vihuela y guitarrón — a tus serenatas, cumpleaños, aniversarios, declaraciones, despedidas y eventos corporativos en Duitama, Paipa, Sogamoso y municipios cercanos.",
    bullets: [
      {
        title: "Repertorio",
        body: "Más de 200 canciones del cancionero clásico mexicano — Las Mañanitas, El Rey, Cielito Lindo, Bésame Mucho, Volver Volver, Si nos dejan, La Bamba — y arreglos especiales por pedido.",
      },
      {
        title: "Cobertura y reservas",
        body: "Duitama, Paipa, Sogamoso, Tunja, Nobsa y municipios cercanos de Boyacá. Reservá con al menos 24 horas de anticipación; para bodas y eventos grandes, 2–4 semanas. Pago: Nequi, Daviplata, Bancolombia, efectivo o tarjeta — 50% asegura la fecha.",
      },
      {
        title: "Sonido y producción",
        body: "Cada presentación incluye instrumentos acústicos profesionales. Para eventos grandes podemos agregar sonido amplificado, luces y video.",
      },
    ],
  },
  nortena: {
    heading: "Grupos norteños en vivo en Boyacá",
    intro:
      "Música norteña en vivo con la formación tradicional: acordeón, bajo sexto, bajo eléctrico y batería. Perfecto para parrandas, cumpleaños, fiestas privadas y celebraciones que necesitan ese sabor del norte en Duitama, Paipa, Sogamoso y Boyacá.",
    bullets: [
      {
        title: "Repertorio",
        body: "Corridos, cumbias norteñas, baladas románticas y los clásicos que prendan la fiesta. Si querés un repertorio específico, avisanos al reservar y lo preparamos.",
      },
      {
        title: "Cobro por hora",
        body: "Cotizamos por hora con un mínimo de presentación. El precio que ves es el precio que pagás — sin recargos sorpresa, con sonido amplificado incluido.",
      },
      {
        title: "Cobertura",
        body: "Duitama, Paipa, Sogamoso, Tunja, Nobsa y municipios cercanos de Boyacá. Para localidades más lejanas se cotiza recargo por desplazamiento.",
      },
    ],
  },
  banda: {
    heading: "Banda en vivo en Boyacá",
    intro:
      "Banda con sonido completo: metales (trompetas, trombones, saxos), percusión y voz. Diseñada para eventos grandes — bodas, matrimonios, grados, fiestas corporativas y celebraciones masivas — donde necesitás energía alta y un sonido que llene cualquier espacio.",
    bullets: [
      {
        title: "Repertorio",
        body: "Música tropical, vallenatos, cumbias, baladas, clásicos populares y crossover. Coordinamos un setlist a medida con vos antes del evento.",
      },
      {
        title: "Sonido y luces incluidos",
        body: "El precio por hora incluye sonido profesional y luces. Coordinamos con el organizador (sound check, escenario, cronograma) para que el evento corra sin sorpresas.",
      },
      {
        title: "Cobertura",
        body: "Duitama, Paipa, Sogamoso, Tunja, Nobsa y municipios cercanos de Boyacá. Para bodas y eventos grandes recomendamos reservar con 2–4 semanas de anticipación.",
      },
    ],
  },
};

export function GenrePage({ id, packages, loading }: Props) {
  const base = DEFAULT_GENRES.find((g) => g.id === id)!;
  const [genre, setGenre] = useState<GenreData>(
    () => readCache<GenreData>(`genre_${id}`) ?? base
  );
  const [hourly, setHourly] = useState<GenreHourlyConfig | null>(
    () => readCache<GenreHourlyConfig | null>(`hourly_${id}`) ?? null
  );
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
      const nextGenre: GenreData = {
        ...base,
        name: name?.trim() || base.name,
        image: image?.trim() || base.image,
      };
      setGenre(nextGenre);
      writeCache(`genre_${id}`, nextGenre);
      const parsed = Number((hRate || "").replace(/[^\d]/g, "")) || 0;
      const fallback = DEFAULT_HOURLY_RATE[id] ?? 0;
      const rate = parsed > 0 ? parsed : fallback;
      const nextHourly: GenreHourlyConfig | null =
        rate > 0
          ? {
              rate,
              image: hImage?.trim() || undefined,
              description: hDesc?.trim() || undefined,
            }
          : null;
      setHourly(nextHourly);
      writeCache(`hourly_${id}`, nextHourly);
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
    navigate("/");
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
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderSvg(
              genre.name,
              1600,
              900
            );
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
        <ReservationForm
          packages={[]}
          selected={selected}
          onSelect={setSelected}
          initialDate={prefillDate}
          initialTime={prefillTime}
          genreId={id}
          hourly={effectiveHourly}
        />
      )}

      <GenreSeoSection id={id} />
    </>
  );
}

function GenreSeoSection({ id }: { id: GenreId }) {
  const seo = SEO_CONTENT[id];
  if (!seo) return null;
  return (
    <section
      id="info"
      className="bg-stone-950 border-t border-stone-900 py-16 sm:py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-stone-100 mb-6">
          {seo.heading}
        </h2>
        <p className="text-stone-300 text-lg leading-relaxed mb-10">
          {seo.intro}
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {seo.bullets.map((b) => (
            <div
              key={b.title}
              className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5"
            >
              <h3 className="font-bold text-amber-300 text-base mb-2">
                {b.title}
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
