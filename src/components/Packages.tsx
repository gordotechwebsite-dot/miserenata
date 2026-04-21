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

export function Packages({ packages, loading, onSelect, selectedName }: Props) {
  return (
    <section
      id="servicios"
      className="py-16 sm:py-24 bg-stone-950 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900/60 to-stone-950 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Music className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">
              Nuestros Paquetes
            </span>
          </div>
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
              return (
                <div
                  key={pkg.id || pkg.name}
                  className={`relative bg-stone-900/80 backdrop-blur border rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
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
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={resolveImage(pkg)}
                      fallback={pkg.fallbackUrl}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                      {pkg.name}
                    </h3>
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
                      onClick={() => onSelect(pkg)}
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
