import { useRef, useState } from "react";
import { Clock, Music, Users, Star } from "lucide-react";
import { type PackageData, formatCop } from "../lib/constants";
import { ImageWithFallback } from "./ImageWithFallback";
import { supabase } from "../lib/supabase";

type Props = {
  packages: PackageData[];
  loading: boolean;
  onSelect: (pkg: PackageData) => void;
  selectedName?: string;
};

function resolveImage(pkg: PackageData): string {
  if (pkg.imagePath) {
    const { data } = supabase.storage
      .from("package-images")
      .getPublicUrl(pkg.imagePath);
    return data.publicUrl;
  }
  if (pkg.imageUrl) return pkg.imageUrl;
  return pkg.localImage || "/images/mariachi-hero.jpg";
}

function resolveVideo(pkg: PackageData): string | null {
  if (pkg.videoUrl) return pkg.videoUrl;
  return null;
}

function resolveThumbnail(pkg: PackageData): string {
  if (pkg.videoUrl && pkg.videoPosterUrl) return pkg.videoPosterUrl;
  return resolveImage(pkg);
}

export function Packages({ packages, loading, onSelect, selectedName }: Props) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const playPackageVideo = (pkg: PackageData) => {
    const video = resolveVideo(pkg);
    if (!video) return;
    const key = pkg.id || pkg.name;
    setPlayingId(key);
    Object.entries(videoRefs.current).forEach(([k, el]) => {
      if (el && k !== key) {
        el.pause();
        el.currentTime = 0;
      }
    });
    requestAnimationFrame(() => {
      const el = videoRefs.current[key];
      if (!el) return;
      el.currentTime = 0;
      el.muted = false;
      const p = el.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          el.muted = true;
          el.play().catch(() => {});
        });
      }
    });
  };

  return (
    <section
      id="servicios"
      className="py-16 sm:py-24 bg-stone-950 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900/60 to-stone-950 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-4 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-tight">
            Elige tu paquete perfecto
          </h2>
          <p className="text-stone-400 text-base sm:text-lg max-w-2xl mx-auto">
            Músicos profesionales con traje típico de gala y repertorio
            personalizado.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-stone-400 py-12">
            Cargando paquetes...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg) => {
              const isSelected = selectedName === pkg.name;
              const key = pkg.id || pkg.name;
              const videoSrc = resolveVideo(pkg);
              const isPlaying = playingId === key && !!videoSrc;
              return (
                <div
                  key={key}
                  className={`relative bg-stone-900/80 backdrop-blur border rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    pkg.popular
                      ? "border-amber-500/60 shadow-2xl shadow-amber-500/20"
                      : "border-stone-800 hover:border-amber-500/40"
                  } ${isSelected ? "ring-2 ring-amber-500" : ""}`}
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-stone-950" />
                      MÁS POPULAR
                    </div>
                  )}
                  <div
                    className={`relative h-48 overflow-hidden bg-stone-900 ${
                      videoSrc ? "cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      if (videoSrc) playPackageVideo(pkg);
                    }}
                    role={videoSrc ? "button" : undefined}
                    tabIndex={videoSrc ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (!videoSrc) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        playPackageVideo(pkg);
                      }
                    }}
                  >
                    <ImageWithFallback
                      src={resolveThumbnail(pkg)}
                      fallback={pkg.fallbackUrl}
                      alt={pkg.name}
                      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${
                        isPlaying ? "opacity-0" : "opacity-100"
                      }`}
                    />
                    {videoSrc && (
                      <video
                        ref={(el) => {
                          videoRefs.current[key] = el;
                        }}
                        src={videoSrc}
                        poster={pkg.videoPosterUrl || undefined}
                        playsInline
                        preload="metadata"
                        onEnded={() => {
                          setPlayingId((p) => (p === key ? null : p));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        controls={isPlaying}
                        className={`absolute inset-0 w-full h-full object-cover ${
                          isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      />
                    )}
                    {!isPlaying && (
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent pointer-events-none" />
                    )}
                    {!isPlaying && videoSrc && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-stone-950/60 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                          <div
                            className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white ml-1"
                            aria-hidden
                          />
                        </div>
                      </div>
                    )}
                    {!isPlaying && pkg.genre === "mariachi" && (
                      <h3 className="absolute bottom-3 left-4 sm:left-5 right-4 font-display font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] pointer-events-none">
                        {pkg.name}
                      </h3>
                    )}
                  </div>
                  <div className="p-6 sm:p-8">
                    {pkg.genre !== "mariachi" && (
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                        {pkg.name}
                      </h3>
                    )}
                    <p className="text-stone-400 text-sm mb-6 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                        ${formatCop(pkg.priceCop)}
                      </span>
                      <span className="text-stone-500 text-sm">COP</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                      <div className="bg-stone-800/60 rounded-xl p-2">
                        <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <div className="text-white text-xs font-bold">
                          {pkg.durationMinutes} min
                        </div>
                      </div>
                      <div className="bg-stone-800/60 rounded-xl p-2">
                        <Music className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <div className="text-white text-xs font-bold">
                          {pkg.songsCount} canciones
                        </div>
                      </div>
                      <div className="bg-stone-800/60 rounded-xl p-2">
                        <Users className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <div className="text-white text-xs font-bold">
                          {pkg.musiciansCount} músicos
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(pkg);
                      }}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        pkg.popular
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 shadow-lg shadow-amber-500/30"
                          : "bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 hover:border-amber-500/50"
                      }`}
                    >
                      {isSelected ? "Seleccionado" : "Elegir este paquete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
