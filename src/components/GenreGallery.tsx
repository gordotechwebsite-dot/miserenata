import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { GenreId } from "../lib/constants";

const BUCKET = "gallery";

type Item = {
  name: string;
  url: string;
};

type Props = {
  id: GenreId;
  genreName: string;
};

export function GenreGallery({ id, genreName }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.storage.from(BUCKET).list(id, {
        limit: 200,
        sortBy: { column: "created_at", order: "desc" },
      });
      if (!mounted) return;
      if (error || !data) {
        setItems([]);
        setLoading(false);
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
          url: supabase.storage.from(BUCKET).getPublicUrl(`${id}/${f.name}`)
            .data.publicUrl,
        }));
      setItems(files);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-stone-500 text-center text-sm">
          Cargando galería...
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const loop = [...items, ...items];

  return (
    <section className="py-12 sm:py-16 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-3">
          <Camera className="w-4 h-4 text-amber-400" />
          <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
            Galería {genreName}
          </span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
          Momentos {genreName}
        </h2>
      </div>

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
              className="flex-shrink-0 w-[78vw] sm:w-[360px] lg:w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border border-stone-800 bg-stone-900"
            >
              <img
                src={item.url}
                alt={`${genreName} ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
