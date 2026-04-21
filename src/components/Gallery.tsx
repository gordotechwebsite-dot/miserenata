import { useEffect, useState, useCallback } from "react";
import { Camera, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
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
  const [openIdx, setOpenIdx] = useState<number | null>(null);

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

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(
    () =>
      setOpenIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (openIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openIdx, close, prev, next]);

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12 sm:mb-16">
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

        {loading ? (
          <div className="text-stone-400 text-center py-12">
            Cargando galería...
          </div>
        ) : items.length === 0 ? (
          <div className="text-stone-400 text-center bg-stone-900/40 border border-stone-800 rounded-2xl py-12">
            Aún no hay fotos. Pronto compartiremos momentos increíbles.
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-5 [column-fill:_balance]">
            {items.map((item, idx) => (
              <button
                key={item.name}
                onClick={() => setOpenIdx(idx)}
                className="group relative mb-4 sm:mb-5 block w-full overflow-hidden rounded-2xl border border-stone-800 hover:border-amber-500/50 transition-all break-inside-avoid"
              >
                <img
                  src={item.url}
                  alt={`Galería ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                  <div className="flex items-center gap-2 text-amber-200 text-sm">
                    <ZoomIn className="w-4 h-4" />
                    Ver en grande
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {openIdx !== null && items[openIdx] && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-stone-900/80 border border-stone-700 hover:border-amber-500 text-stone-100 flex items-center justify-center transition-all z-10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/80 border border-stone-700 hover:border-amber-500 text-stone-100 flex items-center justify-center transition-all z-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/80 border border-stone-700 hover:border-amber-500 text-stone-100 flex items-center justify-center transition-all z-10"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={items[openIdx].url}
            alt={`Galería ${openIdx + 1}`}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-400 text-xs sm:text-sm bg-stone-900/70 px-3 py-1.5 rounded-full">
            {openIdx + 1} / {items.length}
          </div>
        </div>
      )}
    </section>
  );
}
