import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { GenreId } from "../lib/constants";
import { useDragMarquee } from "../lib/useDragMarquee";

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

  const { containerRef, trackRef } = useDragMarquee(90);

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
        <h2 className="font-display font-black text-3xl sm:text-5xl bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
          Momentos {genreName}
        </h2>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden select-none"
        style={{ touchAction: "pan-y" }}
      >
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
        <div
          ref={trackRef}
          className="inline-flex gap-4 sm:gap-5 px-4 sm:px-6 lg:px-8 will-change-transform cursor-grab active:cursor-grabbing"
        >
          {loop.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="flex-shrink-0 w-[78vw] sm:w-[360px] lg:w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border border-stone-800 bg-stone-900"
            >
              <img
                src={item.url}
                alt={`${genreName} ${idx + 1}`}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
