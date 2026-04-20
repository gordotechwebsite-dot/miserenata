import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";
import {
  DEFAULT_PACKAGES,
  type GenreId,
  type PackageData,
} from "./lib/constants";
import { parseRoute, type Route } from "./lib/routes";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { Genres } from "./components/Genres";
import { Gallery } from "./components/Gallery";
import { Testimonials } from "./components/Testimonials";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import { WhatsAppFab } from "./components/WhatsAppFab";
import { BottomBanner } from "./components/BottomBanner";
import { AdminPanel } from "./components/AdminPanel";
import { GenrePage } from "./components/GenrePage";

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
    fallbackUrl:
      row.fallback_url ||
      local?.fallbackUrl ||
      "https://placehold.co/400x300/1a1a2e/d4af37?text=Miserenata",
    localImage: local?.localImage || "/images/mariachi-hero.jpg",
    genre,
  };
}

function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(typeof window !== "undefined" ? window.location.hash : "")
  );
  const [packages, setPackages] = useState<PackageData[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

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
          setPackages((data as PackageRow[]).map(mapRow));
        } else {
          setPackages(DEFAULT_PACKAGES);
        }
      } catch {
        if (mounted) setPackages(DEFAULT_PACKAGES);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (route.kind === "admin") {
    return (
      <AdminPanel
        onExit={() => {
          window.location.hash = "";
          setRoute({ kind: "home" });
        }}
      />
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
        preload="metadata"
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
                window.location.hash = "";
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
          <TrustStrip />
          <Genres />
          <Gallery />
          <Testimonials />
          <Contact />
        </>
      )}
      <WhatsAppFab />
      <BottomBanner />
    </div>
  );
}

export default App;
