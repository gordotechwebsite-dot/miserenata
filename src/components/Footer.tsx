import { Music4 } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-stone-950 border-t border-stone-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
            <Music4 className="w-4 h-4 text-stone-950" />
          </div>
          <span className="text-white font-bold">Miserenata.co</span>
        </div>
        <p className="text-stone-500 text-sm text-center">
          © {year} Miserenata.co. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
