import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Reveal } from "./Reveal";

const BUCKET = "gallery";

type GalleryItem = {
  name: string;
  url: string;
};

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list("", {
          limit: 200,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error || !data) {
        if (mounted) setLoading(false);
        return;
      }

      const files = data
        .filter(
          (f) =>
            f.name &&
            !f.name.startsWith(".") &&
            /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f.name)
        )
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data
            .publicUrl,
        }));

      if (mounted) {
        setItems(files);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const loop = [...items, ...items];

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <Reveal className="text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
              Galería
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-4 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
            Momentos que hemos creado
          </h2>
          <p className="text-stone-400 text-base sm:text-lg max-w-2xl mx-auto">
            Una mirada a serenatas, eventos y experiencias que dejaron huella.
          </p>
        </Reveal>
      </div>

      {loading ? (
        <div className="text-stone-400 text-center py-12">
          Cargando galería...
        </div>
      ) : items.length === 0 ? (
        <div className="max-w-3xl mx-auto px-4 text-stone-400 text-center bg-stone-900/40 border border-stone-800 rounded-2xl py-12">
          Aún no hay fotos. Pronto compartiremos momentos increíbles.
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-16 sm:w-24 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgb(12 10 9) 0%, rgba(12,10,9,0) 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-16 sm:w-24 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgb(12 10 9) 0%, rgba(12,10,9,0) 100%)",
            }}
          />
          <div className="inline-flex animate-marquee gap-4 sm:gap-5 px-4 sm:px-6 lg:px-8 will-change-transform">
            {loop.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="flex-shrink-0 w-[72vw] sm:w-[340px] lg:w-[400px] aspect-[4/3] rounded-3xl overflow-hidden border border-stone-800 bg-stone-900"
              >
                <img
                  src={item.url}
                  alt={`Galería ${(idx % items.length) + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
