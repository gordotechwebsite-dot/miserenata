import { useEffect, useState } from "react";
import { getSiteSetting, supabase } from "../lib/supabase";
import {
  DEFAULT_GALLERY_SUBTITLE,
  DEFAULT_GALLERY_TITLE,
} from "../lib/constants";
import { useDragMarquee } from "../lib/useDragMarquee";
import { readCache, writeCache } from "../lib/cache";
import { Reveal } from "./Reveal";

const BUCKET = "gallery";

type GalleryItem = {
  name: string;
  url: string;
};

export function Gallery() {
  const cached = readCache<GalleryItem[]>("gallery_items");
  const [items, setItems] = useState<GalleryItem[]>(cached ?? []);
  const [loading, setLoading] = useState(!cached || cached.length === 0);
  const [title, setTitle] = useState(
    () => readCache<string>("gallery_title") ?? DEFAULT_GALLERY_TITLE
  );
  const [subtitle, setSubtitle] = useState(
    () => readCache<string>("gallery_subtitle") ?? DEFAULT_GALLERY_SUBTITLE
  );

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getSiteSetting("gallery_title"),
      getSiteSetting("gallery_subtitle"),
    ]).then(([t, s]) => {
      if (!mounted) return;
      if (t && t.trim()) {
        const tr = t.trim();
        setTitle(tr);
        writeCache("gallery_title", tr);
      }
      if (s && s.trim()) {
        const sr = s.trim();
        setSubtitle(sr);
        writeCache("gallery_subtitle", sr);
      }
    });
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
        writeCache("gallery_items", files);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const loop = [...items, ...items];
  const { containerRef, trackRef } = useDragMarquee(90);

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <Reveal className="text-center">
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-4 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
            {title}
          </h2>
          <p className="text-stone-400 text-base sm:text-lg max-w-2xl mx-auto">
            {subtitle}
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
                className="flex-shrink-0 w-[56vw] sm:w-[260px] lg:w-[300px] aspect-[3/4] rounded-3xl overflow-hidden border border-stone-800 bg-stone-900"
              >
                <img
                  src={item.url}
                  alt={`Galería ${(idx % items.length) + 1}`}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
