import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";
import {
  DEFAULT_PACKAGES,
  type GenreId,
  type PackageData,
} from "./lib/constants";
import { navigate, parseRoute, routePath, type Route } from "./lib/routes";
import { trackPageView } from "./lib/analytics";
import { readCache, writeCache } from "./lib/cache";
import { placeholderSvg } from "./lib/placeholder";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Genres } from "./components/Genres";
import { Gallery } from "./components/Gallery";
import { Testimonials } from "./components/Testimonials";
import { Faq } from "./components/Faq";
import { WhatsAppFab } from "./components/WhatsAppFab";
import { BottomBanner } from "./components/BottomBanner";
import { GenrePage } from "./components/GenrePage";

const AdminPanel = lazy(() =>
  import("./components/AdminPanel").then((m) => ({ default: m.AdminPanel }))
);

type PackageRow = {
  id: string;
  name: string;
  price_cop: number;
  duration_minutes: number;
  songs_count: number;
  musicians_count: number;
  description: string;
  features: string[] | null;
  popular: boolean;
  sort_order: number;
  image_path: string | null;
  image_url: string | null;
  video_path: string | null;
  video_url: string | null;
  video_poster_path: string | null;
  video_poster_url: string | null;
  fallback_url: string | null;
  genre: string | null;
};

const DEFAULT_BY_NAME: Record<string, PackageData> = Object.fromEntries(
  DEFAULT_PACKAGES.map((p) => [p.name, p])
);

const GENRE_IDS = new Set<GenreId>(["mariachi", "nortena", "banda"]);

function mapRow(row: PackageRow): PackageData {
  const local = DEFAULT_BY_NAME[row.name];
  const raw = (row.genre || "").trim();
  const genre: GenreId | null = GENRE_IDS.has(raw as GenreId)
    ? (raw as GenreId)
    : local?.genre ?? null;
  return {
    id: row.id,
    name: row.name,
    priceCop: row.price_cop,
    durationMinutes: row.duration_minutes,
    songsCount: row.songs_count,
    musiciansCount: row.musicians_count,
    description: row.description,
    features: row.features || [],
    popular: row.popular,
    sortOrder: row.sort_order,
    imagePath: row.image_path,
    imageUrl: row.image_url,
    videoPath: row.video_path,
    videoUrl: row.video_url,
    videoPosterPath: row.video_poster_path,
    videoPosterUrl: row.video_poster_url,
    fallbackUrl:
      row.fallback_url ||
      local?.fallbackUrl ||
      placeholderSvg("Musicaenvivo", 400, 300),
    localImage: local?.localImage || "/images/mariachi-hero.jpg",
    genre,
  };
}

function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(
      typeof window !== "undefined"
        ? window.location.pathname + window.location.hash
        : ""
    )
  );
  const [packages, setPackages] = useState<PackageData[]>(
    () => readCache<PackageData[]>("packages") ?? DEFAULT_PACKAGES
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onChange = () =>
      setRoute(
        parseRoute(window.location.pathname + window.location.hash)
      );
    window.addEventListener("popstate", onChange);
    window.addEventListener("hashchange", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("hashchange", onChange);
    };
  }, []);

  useEffect(() => {
    const path = routePath(route);
    trackPageView(path);
    const landingTitles: Record<string, string> = {
      "/serenatas":
        "Serenatas en Duitama, Paipa y Boyacá · Sorprende con Musicaenvivo.co",
      "/eventos-corporativos":
        "Eventos corporativos con música en vivo en Boyacá | Musicaenvivo.co",
      "/bodas":
        "Música en vivo para bodas en Boyacá · Mariachi y banda | Musicaenvivo.co",
      "/cumpleanos":
        "Música en vivo para cumpleaños en Boyacá | Musicaenvivo.co",
    };
    const titles: Record<Route["kind"], string> = {
      home: "Musicaenvivo.co — Mariachis, serenatas y artistas en vivo en Boyacá",
      genre:
        route.kind === "genre"
          ? `${
              route.id === "mariachi"
                ? "Mariachis"
                : route.id === "nortena"
                ? "Norteña"
                : "Banda"
            } en Boyacá | Musicaenvivo.co`
          : "",
      faq: "Preguntas frecuentes | Musicaenvivo.co",
      admin: "Admin | Musicaenvivo.co",
      landing:
        route.kind === "landing" ? landingTitles[route.path] ?? "" : "",
    };
    const title = titles[route.kind];
    if (title) document.title = title;
    const canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = `https://musicaenvivo.co${path}`;
    }
  }, [route]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .order("sort_order", { ascending: true });
        if (!mounted) return;
        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped = (data as PackageRow[]).map(mapRow);
          setPackages(mapped);
          writeCache("packages", mapped);
        }
      } catch {
        /* keep cached or default packages */
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (route.kind === "admin") {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-stone-950 text-stone-300 flex items-center justify-center">
            Cargando admin...
          </div>
        }
      >
        <AdminPanel
          onExit={() => {
            navigate("/");
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen text-white sm:bg-stone-950">
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10 sm:hidden"
        src="/video/hero-mobile.mp4"
        poster="/video/hero-mobile-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <Navbar />
      {route.kind === "genre" ? (
        <GenrePage id={route.id} packages={packages} loading={loading} />
      ) : route.kind === "faq" ? (
        <div className="pt-24">
          <Faq />
          <div className="text-center pb-16">
            <button
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
              }}
              className="inline-flex items-center gap-2 border border-stone-700 hover:border-amber-500/60 bg-stone-900/60 text-stone-100 hover:text-amber-300 px-5 py-3 rounded-2xl font-bold transition-all"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      ) : (
        <>
          <Hero />
          <Genres />
          <Gallery />
          <Testimonials />
        </>
      )}
      <WhatsAppFab />
      <BottomBanner />
    </div>
  );
}

export default App;
