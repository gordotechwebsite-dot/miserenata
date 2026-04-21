import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "generos", label: "Géneros" },
  { id: "galeria", label: "Galería" },
  { id: "faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === "faq") {
      window.location.hash = "faq";
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      setOpen(false);
      return;
    }
    if (window.location.hash && window.location.hash !== "#") {
      window.location.hash = "";
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-stone-950/90 backdrop-blur-lg border-b border-stone-800/80 py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          onClick={() => scrollTo("inicio")}
          onDoubleClick={() => {
            window.location.hash = "admin";
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          }}
          className="group select-none"
          title="Doble clic para acceso admin"
        >
          <span className="font-display text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent tracking-tight">
            Musicaenvivo<span className="text-amber-400">.</span>co
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="px-3 py-2 text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("reservar")}
            className="ml-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/30"
          >
            Reservar
          </button>
        </div>

        <button
          className="md:hidden text-stone-200 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-stone-950/95 backdrop-blur-lg border-t border-stone-800 mt-3 px-4 py-4 space-y-1">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left px-3 py-2 text-stone-300 hover:text-amber-400 hover:bg-stone-900/60 rounded-lg"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("reservar")}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 px-5 py-3 rounded-xl font-bold"
          >
            Reservar ahora
          </button>
        </div>
      )}
    </nav>
  );
}
