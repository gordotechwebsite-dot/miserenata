import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";
import { DEFAULT_PACKAGES, type PackageData } from "./lib/constants";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { Audiences } from "./components/Audiences";
import { Packages } from "./components/Packages";
import { VipBanner } from "./components/VipBanner";
import { Occasions } from "./components/Occasions";
import { ReservationForm } from "./components/ReservationForm";
import { HowItWorks } from "./components/HowItWorks";
import { Gallery } from "./components/Gallery";
import { Testimonials } from "./components/Testimonials";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { WhatsAppFab } from "./components/WhatsAppFab";
import { AdminPanel } from "./components/AdminPanel";

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
};

const DEFAULT_BY_NAME: Record<string, PackageData> = Object.fromEntries(
  DEFAULT_PACKAGES.map((p) => [p.name, p])
);

function mapRow(row: PackageRow): PackageData {
  const local = DEFAULT_BY_NAME[row.name];
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
  };
}

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    typeof window !== "undefined" && window.location.hash === "#admin"
  );
  const [packages, setPackages] = useState<PackageData[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PackageData | null>(null);

  useEffect(() => {
    const onHash = () => setIsAdminRoute(window.location.hash === "#admin");
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

  const handleSelect = (pkg: PackageData) => {
    setSelected(pkg);
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isAdminRoute) {
    return (
      <AdminPanel
        onExit={() => {
          window.location.hash = "";
          setIsAdminRoute(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <Navbar />
      <Hero />
      <TrustStrip />
      <Audiences />
      <Packages
        packages={packages}
        loading={loading}
        onSelect={handleSelect}
        selectedName={selected?.name}
      />
      <VipBanner />
      <Occasions />
      <ReservationForm
        packages={packages}
        selected={selected}
        onSelect={setSelected}
      />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

export default App;
